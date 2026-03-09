import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useTranslation } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ScanBarcode, Keyboard, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { AnalyzedFoodItem } from '@/lib/types';
import { searchFoods, type FoodEntry } from '@/lib/food-database';

interface BarcodeScannerProps {
  onResult: (item: AnalyzedFoodItem) => void;
  onCancel: () => void;
}

interface OFFResult {
  item: AnalyzedFoodItem | null;
  productName?: string;
  hasNutrition: boolean;
}

async function lookupOpenFoodFacts(code: string): Promise<OFFResult> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`);
    if (!res.ok) return { item: null, hasNutrition: false };
    const data = await res.json();
    
    // Some products don't have a status field, check for product object directly
    const p = data.product;
    if (!p) return { item: null, hasNutrition: false };

    const n = p.nutriments || {};
    const calories100 = Math.round(n['energy-kcal_100g'] || 0);
    const protein100 = Math.round((n.proteins_100g || 0) * 10) / 10;
    const fat100 = Math.round((n.fat_100g || 0) * 10) / 10;
    const carbs100 = Math.round((n.carbohydrates_100g || 0) * 10) / 10;
    const productName = p.product_name || p.product_name_de || p.product_name_en || '';
    const hasNutrition = calories100 > 0 || protein100 > 0 || fat100 > 0 || carbs100 > 0;

    if (!hasNutrition) {
      return { item: null, productName: productName || undefined, hasNutrition: false };
    }

    // Detect per-piece products using serving_size from OFF
    // e.g. serving_size = "1.4 g" or "14g (1 piece)" → piece weight
    const servingSize = p.serving_size || '';
    const servingMatch = servingSize.match(/^([\d.,]+)\s*g/i);
    const servingGrams = servingMatch ? parseFloat(servingMatch[1].replace(',', '.')) : 0;
    const servingQuantity = Number(p.serving_quantity) || 0;

    // If a single serving is very small (< 15g), treat as piece product
    const isPieceProduct = servingGrams > 0 && servingGrams < 15;

    if (isPieceProduct) {
      // Scale nutrition from per-100g to per-piece
      const factor = servingGrams / 100;
      return {
        item: {
          food_name: productName || code,
          quantity: 1,
          unit: 'Stück',
          calories: Math.round(calories100 * factor),
          protein_g: Math.round(protein100 * factor * 10) / 10,
          fat_g: Math.round(fat100 * factor * 10) / 10,
          carbs_g: Math.round(carbs100 * factor * 10) / 10,
          confidence_score: 0.95,
        },
        hasNutrition: true,
      };
    }

    return {
      item: {
        food_name: productName || code,
        quantity: 100,
        unit: 'g',
        calories: calories100,
        protein_g: protein100,
        fat_g: fat100,
        carbs_g: carbs100,
        confidence_score: 0.95,
      },
      hasNutrition: true,
    };
  } catch {
    return { item: null, hasNutrition: false };
  }
}

// Auto-detect piece products: if stored quantity is very small in grams, treat as 1 piece
function autoPieceDetect(item: AnalyzedFoodItem): AnalyzedFoodItem {
  if (item.unit === 'g' && item.quantity > 0 && item.quantity < 15) {
    // This is likely a per-piece value stored in grams — convert to 1 Stück
    return { ...item, quantity: 1, unit: 'Stück' };
  }
  return item;
}

async function lookupCustomProduct(code: string, userId: string): Promise<AnalyzedFoodItem | null> {
  const { data } = await supabase
    .from('custom_products')
    .select('*')
    .eq('user_id', userId)
    .eq('barcode', code)
    .maybeSingle();

  if (!data) return null;

  return autoPieceDetect({
    food_name: (data as any).food_name,
    quantity: Number((data as any).default_quantity) || 100,
    unit: (data as any).default_unit || 'g',
    calories: Number((data as any).calories) || 0,
    protein_g: Number((data as any).protein_g) || 0,
    fat_g: Number((data as any).fat_g) || 0,
    carbs_g: Number((data as any).carbs_g) || 0,
    confidence_score: 1,
  });
}

interface CommunityResult {
  item: AnalyzedFoodItem;
  contributorName: string;
  contributorEmoji: string;
}

async function lookupCommunityProduct(code: string): Promise<CommunityResult | null> {
  const { data } = await supabase
    .from('community_products')
    .select('food_name, quantity, unit, calories, protein_g, fat_g, carbs_g, contributor_display_name, contributor_avatar_emoji')
    .eq('barcode', code)
    .eq('is_hidden', false)
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  return {
    item: autoPieceDetect({
      food_name: data.food_name,
      quantity: Number(data.quantity) || 100,
      unit: data.unit || 'g',
      calories: Number(data.calories) || 0,
      protein_g: Number(data.protein_g) || 0,
      fat_g: Number(data.fat_g) || 0,
      carbs_g: Number(data.carbs_g) || 0,
      confidence_score: 1,
    }),
    contributorName: data.contributor_display_name,
    contributorEmoji: data.contributor_avatar_emoji || '😊',
  };
}

export default function BarcodeScanner({ onResult, onCancel }: BarcodeScannerProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [notFound, setNotFound] = useState<string | null>(null);
  const [savingCustom, setSavingCustom] = useState(false);
  const [customForm, setCustomForm] = useState({
    food_name: '',
    calories: '',
    protein_g: '',
    fat_g: '',
    carbs_g: '',
    quantity: '100',
    unit: 'g',
  });
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const processedRef = useRef(false);
  const [foodSuggestions, setFoodSuggestions] = useState<FoodEntry[]>([]);

  const handleFoodNameChange = (value: string) => {
    setCustomForm(f => ({ ...f, food_name: value }));
    const lang = (document.documentElement.lang === 'en' ? 'en' : 'de') as 'de' | 'en';
    setFoodSuggestions(searchFoods(value, lang));
  };

  const selectFoodSuggestion = (entry: FoodEntry) => {
    const lang = (document.documentElement.lang === 'en' ? 'en' : 'de') as 'de' | 'en';
    setCustomForm({
      food_name: lang === 'de' ? entry.name : entry.name_en,
      calories: String(entry.calories),
      protein_g: String(entry.protein_g),
      fat_g: String(entry.fat_g),
      carbs_g: String(entry.carbs_g),
      quantity: String(entry.quantity),
      unit: entry.unit,
    });
    setFoodSuggestions([]);
  };

  const handleCode = async (code: string) => {
    if (processedRef.current) return;
    processedRef.current = true;
    setLoading(true);
    setNotFound(null);

    // Stop scanner FIRST, before any state changes that trigger effect cleanup
    try { 
      const s = scannerRef.current;
      if (s) {
        try {
          const state = s.getState();
          if (state === 2 || state === 3) await s.stop();
        } catch {}
        try { s.clear(); } catch {}
        scannerRef.current = null;
      }
    } catch {}

    // Now safe to change scanning state
    setScanning(false);

    // 1. Check personal DB first
    if (user) {
      try {
        const custom = await lookupCustomProduct(code, user.id);
        if (custom) {
          toast.success(`${custom.food_name} ${t('meals.barcodeFound')}`);
          onResult(custom);
          return;
        }
      } catch {}
    }

    // 2. Check community products DB
    try {
      const community = await lookupCommunityProduct(code);
      if (community) {
        toast.success(`${community.item.food_name} ${t('meals.barcodeFound')}`, {
          description: `${community.contributorEmoji} ${community.contributorName}`,
        });
        onResult(community.item);
        return;
      }
    } catch {}

    // 3. Check Open Food Facts
    try {
      const offResult = await lookupOpenFoodFacts(code);
      if (offResult.item) {
        toast.success(`${offResult.item.food_name} ${t('meals.barcodeFound')}`);
        onResult(offResult.item);
        return;
      }

      // 4. Not found or no nutrition → offer manual creation
      if (offResult.productName) {
        setCustomForm(f => ({ ...f, food_name: offResult.productName! }));
      }
    } catch {}

    setNotFound(code);
    setLoading(false);
  };

  const handleSaveCustomProduct = async () => {
    if (!user || !notFound || !customForm.food_name.trim()) return;
    setSavingCustom(true);

    const qty = Number(customForm.quantity) || 100;
    const cal = Number(customForm.calories) || 0;
    const prot = Number(customForm.protein_g) || 0;
    const fat = Number(customForm.fat_g) || 0;
    const carbs = Number(customForm.carbs_g) || 0;
    const foodName = customForm.food_name.trim();
    const unit = customForm.unit || 'g';

    // Save to personal DB
    const { error } = await supabase.from('custom_products').insert({
      user_id: user.id,
      barcode: notFound,
      food_name: foodName,
      calories: cal,
      protein_g: prot,
      fat_g: fat,
      carbs_g: carbs,
      default_quantity: qty,
      default_unit: unit,
    } as any);

    if (error) {
      setSavingCustom(false);
      toast.error(t('common.error'));
      return;
    }

    // Also save to community DB so other users can find it
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, avatar_emoji')
      .eq('user_id', user.id)
      .maybeSingle();

    const displayName = profile?.display_name || profile?.avatar_emoji || 'Anonym';
    const avatarEmoji = profile?.avatar_emoji || '😊';

    await supabase.from('community_products').insert({
      contributor_id: user.id,
      contributor_display_name: displayName,
      contributor_avatar_emoji: avatarEmoji,
      barcode: notFound,
      food_name: foodName,
      calories: cal,
      protein_g: prot,
      fat_g: fat,
      carbs_g: carbs,
      quantity: qty,
      unit,
    });

    setSavingCustom(false);
    toast.success(t('meals.customProductSaved'));
    onResult({
      food_name: foodName,
      quantity: qty,
      unit,
      calories: cal,
      protein_g: prot,
      fat_g: fat,
      carbs_g: carbs,
      confidence_score: 1,
    });
  };

  useEffect(() => {
    if (!scanning || showManual || notFound) return;

    const scannerId = 'barcode-scanner-region';
    let html5Qrcode: Html5Qrcode | null = null;
    let mounted = true;

    const startScanner = async () => {
      const el = document.getElementById(scannerId);
      if (!el || !mounted) return;

      try {
        html5Qrcode = new Html5Qrcode(scannerId);
        scannerRef.current = html5Qrcode;

        await html5Qrcode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 280, height: 150 }, aspectRatio: 1.5 },
          (decodedText) => handleCode(decodedText),
          () => {}
        );
      } catch (err) {
        console.error('Barcode scanner error:', err);
        if (mounted) {
          toast.error(t('meals.barcodeCameraError'));
          setShowManual(true);
          setScanning(false);
        }
      }
    };

    const timer = setTimeout(startScanner, 300);
    return () => {
      mounted = false;
      clearTimeout(timer);
      // Defensive cleanup — scanner may already be stopped/cleared by handleCode
      if (html5Qrcode) {
        try {
          const state = html5Qrcode.getState();
          if (state === 2 || state === 3) {
            html5Qrcode.stop().catch(() => {});
          }
        } catch {}
        try { html5Qrcode.clear(); } catch {}
      }
      if (scannerRef.current === html5Qrcode) {
        scannerRef.current = null;
      }
    };
  }, [scanning, showManual, notFound]);

  const handleManualSubmit = () => {
    const code = manualCode.trim();
    if (code.length >= 8) handleCode(code);
  };

  const resetScan = () => {
    setNotFound(null);
    setShowManual(false);
    setScanning(true);
    processedRef.current = false;
    setCustomForm({ food_name: '', calories: '', protein_g: '', fat_g: '', carbs_g: '', quantity: '100', unit: 'g' });
  };

  // --- Not found: show create form ---
  if (notFound) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <ScanBarcode className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">{t('meals.barcodeNotFoundTitle')}</h2>
        </div>

        <div className="nutri-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Barcode</p>
          <p className="font-mono text-sm font-medium">{notFound}</p>
        </div>

        <p className="text-sm text-muted-foreground">{t('meals.customProductHint')}</p>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label>{t('meals.foodName')}</Label>
            <Input
              value={customForm.food_name}
              onChange={(e) => handleFoodNameChange(e.target.value)}
              onFocus={() => {
                const lang = (document.documentElement.lang === 'en' ? 'en' : 'de') as 'de' | 'en';
                setFoodSuggestions(searchFoods(customForm.food_name, lang));
              }}
              placeholder="z.B. Prosecco, Hafermilch"
              autoComplete="off"
            />
            {foodSuggestions.length > 0 && (
              <div className="bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {foodSuggestions.map((entry, i) => {
                  const lang = (document.documentElement.lang === 'en' ? 'en' : 'de') as 'de' | 'en';
                  const displayName = lang === 'de' ? entry.name : entry.name_en;
                  return (
                    <button
                      key={i}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent/50 transition-colors flex justify-between items-center"
                      onClick={() => selectFoodSuggestion(entry)}
                    >
                      <span className="font-medium">{displayName}</span>
                      <span className="text-xs text-muted-foreground">{entry.calories} kcal / {entry.quantity}{entry.unit}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {foodSuggestions.length === 0 && !customForm.food_name.trim() && (
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">Schnellauswahl:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(() => {
                    const lang = (document.documentElement.lang === 'en' ? 'en' : 'de') as 'de' | 'en';
                    const quickItems = ['Prosecco', 'Bier (Pils)', 'Weißwein', 'Rotwein', 'Aperol Spritz', 'Radler'];
                    return quickItems.map((name) => {
                      const entry = searchFoods(name, lang).find(e => e.name === name);
                      if (!entry) return null;
                      const displayName = lang === 'de' ? entry.name : entry.name_en;
                      return (
                        <button
                          key={name}
                          type="button"
                          className="px-2.5 py-1 text-xs rounded-full border border-border bg-muted hover:bg-accent/50 transition-colors"
                          onClick={() => selectFoodSuggestion(entry)}
                        >
                          {displayName}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t('meals.quantity')}</Label>
              <Input
                type="number"
                inputMode="decimal"
                value={customForm.quantity}
                onChange={(e) => setCustomForm(f => ({ ...f, quantity: e.target.value }))}
              />
            </div>
            <div>
              <Label>{t('meals.unit')}</Label>
              <Input
                value={customForm.unit}
                onChange={(e) => setCustomForm(f => ({ ...f, unit: e.target.value }))}
                placeholder="g / ml / Stück"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground font-medium mt-2">{t('meals.nutritionPer100')}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t('dashboard.kcal')}</Label>
              <Input
                type="number"
                inputMode="decimal"
                value={customForm.calories}
                onChange={(e) => setCustomForm(f => ({ ...f, calories: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label>{t('dashboard.protein')} (g)</Label>
              <Input
                type="number"
                inputMode="decimal"
                value={customForm.protein_g}
                onChange={(e) => setCustomForm(f => ({ ...f, protein_g: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label>{t('dashboard.fat')} (g)</Label>
              <Input
                type="number"
                inputMode="decimal"
                value={customForm.fat_g}
                onChange={(e) => setCustomForm(f => ({ ...f, fat_g: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label>{t('dashboard.carbs')} (g)</Label>
              <Input
                type="number"
                inputMode="decimal"
                value={customForm.carbs_g}
                onChange={(e) => setCustomForm(f => ({ ...f, carbs_g: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={resetScan} className="flex-1">
            {t('meals.barcodeScanAgain')}
          </Button>
          <Button
            onClick={handleSaveCustomProduct}
            disabled={!customForm.food_name.trim() || savingCustom}
            className="flex-1"
          >
            {savingCustom ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {t('meals.saveProduct')}
          </Button>
        </div>

        <Button variant="ghost" onClick={onCancel} className="w-full">
          {t('meals.cancel')}
        </Button>
      </div>
    );
  }

  // --- Normal scan view ---
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <ScanBarcode className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">{t('meals.scanBarcode')}</h2>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-3 py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t('meals.barcodeSearching')}</p>
        </div>
      )}

      {!loading && !showManual && (
        <div className="space-y-3">
          <div
            id="barcode-scanner-region"
            ref={containerRef}
            className="w-full rounded-2xl overflow-hidden border border-border bg-muted"
            style={{ minHeight: 250 }}
          />
          <p className="text-xs text-muted-foreground text-center">
            {t('meals.barcodeScanHint')}
          </p>
        </div>
      )}

      {!loading && (
        <>
          {!showManual ? (
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const s = scannerRef.current;
                  if (s) {
                    const state = s.getState();
                    if (state === 2 || state === 3) await s.stop();
                  }
                } catch {}
                setScanning(false);
                setShowManual(true);
              }}
              className="w-full"
            >
              <Keyboard className="h-4 w-4 mr-2" />
              {t('meals.barcodeManualEntry')}
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{t('meals.barcodeEnterCode')}</p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="4006381333931"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
                  className="flex-1"
                />
                <Button onClick={handleManualSubmit} disabled={manualCode.trim().length < 8}>
                  {t('meals.barcodeSearch')}
                </Button>
              </div>
              <Button variant="ghost" onClick={resetScan} className="w-full">
                {t('meals.barcodeScanAgain')}
              </Button>
            </div>
          )}

          <Button variant="ghost" onClick={onCancel} className="w-full">
            {t('meals.cancel')}
          </Button>
        </>
      )}
    </div>
  );
}
