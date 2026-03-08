import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import type { AnalyzedFoodItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface FoodItemEditorModalProps {
  item: AnalyzedFoodItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (item: AnalyzedFoodItem) => void;
}

export default function FoodItemEditorModal({ item, open, onClose, onSave }: FoodItemEditorModalProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<AnalyzedFoodItem>({
    food_name: '', quantity: 100, unit: 'g', calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, confidence_score: 1,
  });

  useEffect(() => {
    if (item) setForm({ ...item });
  }, [item]);

  const update = (field: keyof AnalyzedFoodItem, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({ ...form, confidence_score: 1 }); // User-edited = full confidence
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{t('meals.editFood')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">{t('meals.foodName')}</Label>
            <Input value={form.food_name} onChange={e => update('food_name', e.target.value)} autoFocus />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{t('meals.quantity')}</Label>
              <Input type="number" step="any" value={form.quantity} onChange={e => update('quantity', Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{t('meals.unit')}</Label>
              <Input value={form.unit} onChange={e => update('unit', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{t('dashboard.calories')} (kcal)</Label>
              <Input type="number" value={form.calories} onChange={e => update('calories', Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{t('dashboard.protein')} (g)</Label>
              <Input type="number" value={form.protein_g} onChange={e => update('protein_g', Number(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{t('dashboard.fat')} (g)</Label>
              <Input type="number" value={form.fat_g} onChange={e => update('fat_g', Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{t('dashboard.carbs')} (g)</Label>
              <Input type="number" value={form.carbs_g} onChange={e => update('carbs_g', Number(e.target.value))} />
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">{t('common.cancel')}</Button>
          <Button onClick={handleSave} className="flex-1" disabled={!form.food_name}>{t('common.save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
