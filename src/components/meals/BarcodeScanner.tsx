import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ScanBarcode, Keyboard } from 'lucide-react';
import { toast } from 'sonner';
import type { AnalyzedFoodItem } from '@/lib/types';

interface BarcodeScannerProps {
  onResult: (item: AnalyzedFoodItem) => void;
  onCancel: () => void;
}

interface OpenFoodFactsProduct {
  product_name?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    proteins_100g?: number;
    fat_100g?: number;
    carbohydrates_100g?: number;
  };
  serving_quantity?: number;
  serving_size?: string;
  quantity?: string;
}

async function lookupBarcode(code: string): Promise<AnalyzedFoodItem | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;

    const p: OpenFoodFactsProduct = data.product;
    const n = p.nutriments || {};
    const name = p.product_name || code;
    const cal100 = n['energy-kcal_100g'] || 0;
    const prot100 = n.proteins_100g || 0;
    const fat100 = n.fat_100g || 0;
    const carb100 = n.carbohydrates_100g || 0;

    // Default to 100g portion
    const qty = 100;

    return {
      food_name: name,
      quantity: qty,
      unit: 'g',
      calories: Math.round(cal100),
      protein_g: Math.round(prot100 * 10) / 10,
      fat_g: Math.round(fat100 * 10) / 10,
      carbs_g: Math.round(carb100 * 10) / 10,
      confidence_score: 0.95,
    };
  } catch {
    return null;
  }
}

export default function BarcodeScanner({ onResult, onCancel }: BarcodeScannerProps) {
  const { t } = useTranslation();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManual, setShowManual] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const processedRef = useRef(false);

  const handleCode = async (code: string) => {
    if (processedRef.current) return;
    processedRef.current = true;
    setLoading(true);
    setScanning(false);

    // Stop scanner
    try {
      await scannerRef.current?.stop();
    } catch {}

    const item = await lookupBarcode(code);
    if (item) {
      toast.success(`${item.food_name} ${t('meals.barcodeFound')}`);
      onResult(item);
    } else {
      toast.error(t('meals.barcodeNotFound'));
      processedRef.current = false;
      setLoading(false);
      setScanning(true);
    }
  };

  useEffect(() => {
    if (!scanning || showManual) return;

    const scannerId = 'barcode-scanner-region';
    let html5Qrcode: Html5Qrcode | null = null;

    const startScanner = async () => {
      try {
        html5Qrcode = new Html5Qrcode(scannerId);
        scannerRef.current = html5Qrcode;

        await html5Qrcode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 280, height: 150 },
            aspectRatio: 1.5,
          },
          (decodedText) => {
            handleCode(decodedText);
          },
          () => {} // ignore scan failures
        );
      } catch (err) {
        console.error('Barcode scanner error:', err);
        toast.error(t('meals.barcodeCameraError'));
        setShowManual(true);
        setScanning(false);
      }
    };

    // Small delay to ensure DOM element exists
    const timer = setTimeout(startScanner, 100);

    return () => {
      clearTimeout(timer);
      if (html5Qrcode) {
        html5Qrcode.stop().catch(() => {});
        html5Qrcode.clear();
      }
    };
  }, [scanning, showManual]);

  const handleManualSubmit = () => {
    const code = manualCode.trim();
    if (code.length >= 8) {
      handleCode(code);
    }
  };

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
              onClick={() => {
                scannerRef.current?.stop().catch(() => {});
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
              <Button
                variant="ghost"
                onClick={() => {
                  setShowManual(false);
                  setScanning(true);
                  processedRef.current = false;
                }}
                className="w-full"
              >
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
