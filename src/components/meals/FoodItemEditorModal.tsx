import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/lib/i18n';
import type { AnalyzedFoodItem } from '@/lib/types';
import { searchFoods, type FoodEntry } from '@/lib/food-database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search } from 'lucide-react';

interface FoodItemEditorModalProps {
  item: AnalyzedFoodItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (item: AnalyzedFoodItem) => void;
}

export default function FoodItemEditorModal({ item, open, onClose, onSave }: FoodItemEditorModalProps) {
  const { t, language } = useTranslation();
  const [form, setForm] = useState<AnalyzedFoodItem>({
    food_name: '', quantity: 100, unit: 'g', calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, confidence_score: 1,
  });
  const [suggestions, setSuggestions] = useState<FoodEntry[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item) setForm({ ...item });
  }, [item]);

  const update = (field: keyof AnalyzedFoodItem, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'food_name' && typeof value === 'string') {
      const results = searchFoods(value, language as 'de' | 'en');
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }
  };

  const selectSuggestion = (food: FoodEntry) => {
    const name = language === 'de' ? food.name : food.name_en;
    setForm({
      food_name: name,
      quantity: food.quantity,
      unit: food.unit,
      calories: food.calories,
      protein_g: food.protein_g,
      fat_g: food.fat_g,
      carbs_g: food.carbs_g,
      confidence_score: 1,
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSave = () => {
    onSave({ ...form, confidence_score: 1 });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{t('meals.editFood')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Food name with autocomplete */}
          <div className="space-y-1.5 relative">
            <Label className="text-xs font-medium">{t('meals.foodName')}</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={form.food_name}
                onChange={e => update('food_name', e.target.value)}
                onFocus={() => {
                  if (form.food_name) {
                    const results = searchFoods(form.food_name, language as 'de' | 'en');
                    setSuggestions(results);
                    setShowSuggestions(results.length > 0);
                  }
                }}
                onBlur={() => {
                  // Delay to allow click on suggestion
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                className="pl-9"
                placeholder={language === 'de' ? 'z.B. Kaffee, Reis, Hähnchen...' : 'e.g. Coffee, Rice, Chicken...'}
                autoFocus
              />
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
              >
                {suggestions.map((food, i) => {
                  const name = language === 'de' ? food.name : food.name_en;
                  return (
                    <button
                      key={i}
                      type="button"
                      className="w-full text-left px-3 py-2.5 hover:bg-accent transition-colors border-b border-border last:border-b-0"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectSuggestion(food);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{name}</span>
                        <span className="text-xs text-muted-foreground">{food.calories} kcal</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {food.quantity} {food.unit} · P:{food.protein_g}g F:{food.fat_g}g C:{food.carbs_g}g
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
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
