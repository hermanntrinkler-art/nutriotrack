import { useTranslation } from '@/lib/i18n';
import type { AnalyzedFoodItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';
import FoodItemCard from './FoodItemCard';

interface EditableFoodItemsListProps {
  items: AnalyzedFoodItem[];
  isAiResult: boolean;
  onUpdateItem: (index: number, field: keyof AnalyzedFoodItem, value: string | number) => void;
  onRemoveItem: (index: number) => void;
  onAddItem: () => void;
  onEditItem: (index: number) => void;
}

export default function EditableFoodItemsList({
  items,
  isAiResult,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
  onEditItem,
}: EditableFoodItemsListProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      {/* AI disclaimer */}
      {isAiResult && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-warning/10 border border-warning/20">
          <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-warning-foreground">{t('meals.aiDisclaimer')}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t('meals.editHint')}</p>
          </div>
        </div>
      )}

      {/* Food items */}
      {items.map((item, i) => (
        <FoodItemCard
          key={i}
          item={item}
          index={i}
          isAiResult={isAiResult}
          onEdit={() => onEditItem(i)}
          onRemove={() => onRemoveItem(i)}
          onQuantityChange={(newItem) => {
            onUpdateItem(i, 'quantity', newItem.quantity);
            onUpdateItem(i, 'calories', newItem.calories);
            onUpdateItem(i, 'protein_g', newItem.protein_g);
            onUpdateItem(i, 'fat_g', newItem.fat_g);
            onUpdateItem(i, 'carbs_g', newItem.carbs_g);
          }}
        />
      ))}

      <Button variant="outline" onClick={onAddItem} className="w-full">
        <Plus className="h-4 w-4 mr-1" /> {t('meals.addItem')}
      </Button>
    </div>
  );
}
