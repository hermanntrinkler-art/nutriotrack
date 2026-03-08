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

interface BarcodeScannerProps {
  onResult: (item: AnalyzedFoodItem) => void;
  onCancel: () => void;
}

async function lookupOpenFoodFacts(code: string): Promise<AnalyzedFoodItem | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;

    const p = data.product;
    const n = p.nutriments || {};

    return {
      food_name: p.product_name || code,
      quantity: 100,
      unit: 'g',
      calories: Math.round(n['energy-kcal_100g'] || 0),
      protein_g: Math.round((n.proteins_100g || 0) * 10) / 10,
      fat_g: Math.round((n.fat_100g || 0) * 10) / 10,
      carbs_g: Math.round((n.carbohydrates_100g || 0) * 10) / 10,
      confidence_score: 0.95,
    };
  } catch {
    return null;
  }
}

async function lookupCustomProduct(code: string, userId: string): Promise<AnalyzedFoodItem | null> {
  const { data } = await supabase
    .from('custom_products')
    .select('*')
    .eq('user_id', userId)
    .eq('barcode', code)
    .maybeSingle();

  if (!data) return null;

  return {
    food_name: (data as any).food_name,
    quantity: Number((data as any).default_quantity) || 100,
    unit: (data as any).default_unit || 'g',
    calories: Number((data as any).calories) || 0,
    protein_g: Number((data as any).protein_g) || 0,
    fat_g: Number((data as any).fat_g) || 0,
    carbs_g: Number((data as any).carbs_g) || 0,
    confidence_score: 1,
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

  const handleCode = async (code: string) => {
    if (processedRef.current) return;
    processedRef.current = true;
    setLoading(true);
    setScanning(false);
    setNotFound(null);

    try { 
      const s = scannerRef.current;
      if (s) {
        const state = s.getState();
        if (state === 2 || state === 3) await s.stop();
      }
    } catch {}

    // 1. Check personal DB first
    if (user) {
      const custom = await lookupCustomProduct(code, user.id);
      if (custom) {
        toast.success(`${custom.food_name} ${t('meals.barcodeFound')}`);
        onResult(custom);
        return;
      }
    }

    // 2. Check Open Food Facts
    const item = await lookupOpenFoodFacts(code);
    if (item) {
      toast.success(`${item.food_name} ${t('meals.barcodeFound')}`);
      onResult(item);
      return;
    }

    // 3. Not found → offer manual creation
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

    const { error } = await supabase.from('custom_products').insert({
      user_id: user.id,
      barcode: notFound,
      food_name: customForm.food_name.trim(),
      calories: cal,
      protein_g: prot,
      fat_g: fat,
      carbs_g: carbs,
      default_quantity: qty,
      default_unit: customForm.unit || 'g',
    } as any);

    setSavingCustom(false);

    if (error) {
      toast.error(t('common.error'));
      return;
    }

    toast.success(t('meals.customProductSaved'));
    onResult({
      food_name: customForm.food_name.trim(),
      quantity: qty,
      unit: customForm.unit || 'g',
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
      // Wait for DOM element to be ready
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
      if (html5Qrcode) {
        try {
          const state = html5Qrcode.getState();
          if (state === 2 || state === 3) { // SCANNING or PAUSED
            html5Qrcode.stop().then(() => html5Qrcode?.clear()).catch(() => {});
          } else {
            html5Qrcode.clear();
          }
        } catch {
          // ignore
        }
      }
      scannerRef.current = null;
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
          <div>
            <Label>{t('meals.foodName')}</Label>
            <Input
              value={customForm.food_name}
              onChange={(e) => setCustomForm(f => ({ ...f, food_name: e.target.value }))}
              placeholder="z.B. Hafermilch"
            />
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
