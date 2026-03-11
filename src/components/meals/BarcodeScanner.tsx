import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useTranslation } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ScanBarcode, Keyboard, Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { AnalyzedFoodItem } from '@/lib/types';
import { searchFoods, type FoodEntry } from '@/lib/food-database';
import {
  lookupBarcode,
  offProductToAnalyzedItem,
  type OFFProduct,
  type OFFLookupResult,
} from '@/lib/openfoodfacts-service';

interface BarcodeScannerProps {
  onResult: (item: AnalyzedFoodItem) => void;
  onCancel: () => void;
}

// ─── DB lookups (custom + community) ──────────────────────────────────────────

function autoPieceDetect(item: AnalyzedFoodItem): AnalyzedFoodItem {
  if (item.unit === 'g' && item.quantity > 0 && item.quantity < 15) {
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
    barcode: code,
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

// ─── Result item type ─────────────────────────────────────────────────────────

interface BarcodeResultItem {
  item: AnalyzedFoodItem;
  source: string;
  label: string;
  imageUrl?: string | null;
  brand?: string;
  servingInfo?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BarcodeScanner({ onResult, onCancel }: BarcodeScannerProps) {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [notFound, setNotFound] = useState<string | null>(null);
  const [savingCustom, setSavingCustom] = useState(false);
  const [barcodeResults, setBarcodeResults] = useState<BarcodeResultItem[]>([]);
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
  const lastCandidateRef = useRef<string | null>(null);
  const processedRef = useRef(false);
  const [foodSuggestions, setFoodSuggestions] = useState<FoodEntry[]>([]);

  const handleFoodNameChange = (value: string) => {
    setCustomForm(f => ({ ...f, food_name: value }));
    setFoodSuggestions(searchFoods(value, language as 'de' | 'en'));
  };

  const selectFoodSuggestion = (entry: FoodEntry) => {
    const lang = language as 'de' | 'en';
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

  // ─── Main barcode handler ──────────────────────────────────────────────────

  const handleCode = async (code: string) => {
    if (processedRef.current) return;
    processedRef.current = true;
    setLoading(true);
    setNotFound(null);
    setBarcodeResults([]);

    // Stop scanner
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
    setScanning(false);

    const results: BarcodeResultItem[] = [];

    // 1. Check personal DB
    if (user) {
      try {
        const custom = await lookupCustomProduct(code, user.id);
        if (custom) {
          results.push({ item: custom, source: 'custom', label: '⭐ Mein Produkt' });
        }
      } catch {}
    }

    // 2. Check community products DB
    try {
      const community = await lookupCommunityProduct(code);
      if (community) {
        results.push({
          item: { ...community.item, barcode: code },
          source: 'community',
          label: `👥 ${community.contributorEmoji} ${community.contributorName}`,
        });
      }
    } catch {}

    // 3. Check Open Food Facts (new robust service)
    try {
      const offResult: OFFLookupResult = await lookupBarcode(code, { lang: language });

      if (offResult.product) {
        // Exact barcode match with nutrition data
        const item = offProductToAnalyzedItem(offResult.product);
        results.push({
          item,
          source: 'off',
          label: '🌐 Open Food Facts',
          imageUrl: offResult.product.imageUrl,
          brand: offResult.product.brand,
          servingInfo: offResult.product.calculatedWeightG
            ? `${offResult.product.calculatedWeightG}g pro Stück`
            : offResult.product.quantity || undefined,
        });
      } else if (offResult.alternatives.length > 0) {
        // No exact match, but search found alternatives
        for (const alt of offResult.alternatives.slice(0, 5)) {
          const item = offProductToAnalyzedItem(alt);
          results.push({
            item,
            source: 'off-search',
            label: `🔍 ${alt.brand || 'Open Food Facts'}`,
            imageUrl: alt.imageUrl,
            brand: alt.brand,
            servingInfo: alt.calculatedWeightG
              ? `${alt.calculatedWeightG}g pro Stück`
              : alt.quantity || undefined,
          });
        }
      }

      // If no results at all, set partial name for custom form
      if (results.length === 0 && offResult.partialName) {
        setCustomForm(f => ({ ...f, food_name: offResult.partialName! }));
      }
    } catch (err) {
      console.warn('OFF lookup failed:', err);
    }

    if (results.length === 0) {
      setNotFound(code);
      setLoading(false);
      return;
    }

    // If only 1 result with good nutrition, auto-select
    if (results.length === 1 && results[0].item.calories > 0) {
      toast.success(`${results[0].item.food_name} ${t('meals.barcodeFound')}`);
      onResult(results[0].item);
      return;
    }

    // Multiple results or single result without nutrition → show selection
    setBarcodeResults(results);
    setLoading(false);
  };

  // ─── Save custom product ──────────────────────────────────────────────────

  const handleSaveCustomProduct = async () => {
    if (!user || !notFound || !customForm.food_name.trim()) return;
    setSavingCustom(true);

    const qty = Number(customForm.quantity) || 100;
    const cal = Math.max(0, Number(customForm.calories) || 0);
    const prot = Math.max(0, Number(customForm.protein_g) || 0);
    const fat = Math.max(0, Number(customForm.fat_g) || 0);
    const carbs = Math.max(0, Number(customForm.carbs_g) || 0);
    const foodName = customForm.food_name.trim();
    const unit = customForm.unit || 'g';

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

    // Share to community
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
      barcode: notFound,
    });
  };

  // ─── Scanner effect ────────────────────────────────────────────────────────

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
          { fps: 5, qrbox: { width: 280, height: 150 }, aspectRatio: 1.5 },
          (decodedText) => {
            if (!/^\d{8}$|^\d{12,13}$/.test(decodedText)) return;
            if (lastCandidateRef.current === decodedText) {
              handleCode(decodedText);
            } else {
              lastCandidateRef.current = decodedText;
            }
          },
          () => {},
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
      if (html5Qrcode) {
        try {
          const state = html5Qrcode.getState();
          if (state === 2 || state === 3) html5Qrcode.stop().catch(() => {});
        } catch {}
        try { html5Qrcode.clear(); } catch {}
      }
      if (scannerRef.current === html5Qrcode) scannerRef.current = null;
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
    setBarcodeResults([]);
    processedRef.current = false;
    setCustomForm({ food_name: '', calories: '', protein_g: '', fat_g: '', carbs_g: '', quantity: '100', unit: 'g' });
  };

  // ─── Multiple results: show selection ──────────────────────────────────────

  if (barcodeResults.length > 0) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <ScanBarcode className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">
            {language === 'de' ? 'Produkt wählen' : 'Choose product'}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {language === 'de'
            ? 'Mehrere Einträge gefunden — wähle den passenden:'
            : 'Multiple entries found — choose the right one:'}
        </p>

        <div className="space-y-2">
          {barcodeResults.map((result, i) => (
            <button
              key={i}
              onClick={() => {
                toast.success(`${result.item.food_name} ${t('meals.barcodeFound')}`);
                onResult(result.item);
              }}
              className="w-full text-left rounded-xl border border-border bg-card p-3 hover:bg-accent/50 active:scale-[0.98] transition-all"
            >
              <div className="flex gap-3">
                {/* Product image */}
                {result.imageUrl ? (
                  <img
                    src={result.imageUrl}
                    alt={result.item.food_name}
                    className="w-14 h-14 rounded-lg object-cover bg-muted shrink-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-medium text-sm truncate">{result.item.food_name}</span>
                  </div>
                  {result.brand && (
                    <span className="text-xs text-muted-foreground block">{result.brand}</span>
                  )}
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {result.label}
                    </span>
                    {result.servingInfo && (
                      <span className="text-[10px] text-muted-foreground">· {result.servingInfo}</span>
                    )}
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                    <span className="font-semibold text-foreground">{Math.round(result.item.calories)} kcal</span>
                    <span>P {Math.round(result.item.protein_g * 10) / 10}g</span>
                    <span>F {Math.round(result.item.fat_g * 10) / 10}g</span>
                    <span>K {Math.round(result.item.carbs_g * 10) / 10}g</span>
                    <span>/ {result.item.quantity}{result.item.unit}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={resetScan} className="flex-1">
            {t('meals.barcodeScanAgain')}
          </Button>
          <Button variant="ghost" onClick={onCancel} className="flex-1">
            {t('meals.cancel')}
          </Button>
        </div>
      </div>
    );
  }

  // ─── Not found: show create form ───────────────────────────────────────────

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
                setFoodSuggestions(searchFoods(customForm.food_name, language as 'de' | 'en'));
              }}
              placeholder="z.B. Prosecco, Hafermilch"
              autoComplete="off"
            />
            {foodSuggestions.length > 0 && (
              <div className="bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {foodSuggestions.map((entry, i) => {
                  const lang = language as 'de' | 'en';
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
                    const lang = language as 'de' | 'en';
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

  // ─── Normal scan view ──────────────────────────────────────────────────────

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
