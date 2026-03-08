import { useTranslation } from '@/lib/i18n';
import type { AnalyzedFoodItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Check, Loader2, ShieldCheck } from 'lucide-react';

interface SaveMealConfirmationProps {
  items: AnalyzedFoodItem[];
  mealTypeLabel: string;
  mealEmoji: string;
  imagePreview: string | null;
  saving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SaveMealConfirmation({
  items,
  mealTypeLabel,
  mealEmoji,
  imagePreview,
  saving,
  onConfirm,
  onCancel,
}: SaveMealConfirmationProps) {
  const { t } = useTranslation();

  const totalCal = items.reduce((s, i) => s + Number(i.calories), 0);
  const totalP = items.reduce((s, i) => s + Number(i.protein_g), 0);
  const totalF = items.reduce((s, i) => s + Number(i.fat_g), 0);
  const totalC = items.reduce((s, i) => s + Number(i.carbs_g), 0);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
          <ShieldCheck className="h-7 w-7 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">{t('meals.confirmTitle')}</h3>
        <p className="text-sm text-muted-foreground">{t('meals.confirmSubtitle')}</p>
      </div>

      {/* Meal info */}
      <div className="nutri-card">
        <div className="flex items-center gap-3 mb-3">
          {imagePreview && (
            <img src={imagePreview} alt="" className="w-12 h-12 rounded-xl object-cover" />
          )}
          <div>
            <p className="font-medium text-sm">{mealEmoji} {mealTypeLabel}</p>
            <p className="text-xs text-muted-foreground">{items.length} {t('meals.itemCount')}</p>
          </div>
        </div>

        {/* Items summary */}
        <div className="space-y-1.5 mb-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-foreground truncate flex-1">{item.food_name}</span>
              <span className="text-muted-foreground ml-2">{Math.round(item.calories)} kcal</span>
            </div>
          ))}
        </div>

        <div className="h-px bg-border" />

        {/* Totals */}
        <div className="grid grid-cols-4 gap-2 text-center mt-3">
          <div>
            <p className="text-sm font-bold">{Math.round(totalCal)}</p>
            <p className="text-[10px] text-muted-foreground">{t('dashboard.kcal')}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-protein">{Math.round(totalP)}g</p>
            <p className="text-[10px] text-muted-foreground">{t('dashboard.protein')}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-fat">{Math.round(totalF)}g</p>
            <p className="text-[10px] text-muted-foreground">{t('dashboard.fat')}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-carbs">{Math.round(totalC)}g</p>
            <p className="text-[10px] text-muted-foreground">{t('dashboard.carbs')}</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1" disabled={saving}>
          {t('meals.backToEdit')}
        </Button>
        <Button onClick={onConfirm} className="flex-1" disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Check className="h-4 w-4 mr-1" />
          )}
          {t('meals.confirmSave')}
        </Button>
      </div>
    </div>
  );
}
