import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { AnalyzedFoodItem } from '@/lib/types';
import { searchFoods, type FoodEntry } from '@/lib/food-database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface FoodItemEditorModalProps {
  item: AnalyzedFoodItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (item: AnalyzedFoodItem) => void;
}

interface BaseNutrition {
  baseQuantity: number;
  baseUnit: string;
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
}

// Gram equivalents for common units
const UNIT_TO_GRAMS: Record<string, number> = {
  g: 1,
  ml: 1,
  TL: 5,
  EL: 15,
  'Stück': 0,
};

const UNIT_OPTIONS_DE = [
  { value: 'g', label: 'g (Gramm)' },
  { value: 'ml', label: 'ml (Milliliter)' },
  { value: 'TL', label: 'TL (Teelöffel ≈ 5g)' },
  { value: 'EL', label: 'EL (Esslöffel ≈ 15g)' },
  { value: 'Stück', label: 'Stück' },
];

const UNIT_OPTIONS_EN = [
  { value: 'g', label: 'g (grams)' },
  { value: 'ml', label: 'ml (milliliters)' },
  { value: 'TL', label: 'tsp (teaspoon ≈ 5g)' },
  { value: 'EL', label: 'tbsp (tablespoon ≈ 15g)' },
  { value: 'Stück', label: 'piece' },
];

function getGramsEquivalent(quantity: number, unit: string): number {
  const factor = UNIT_TO_GRAMS[unit];
  if (factor === undefined || factor === 0) return quantity;
  return quantity * factor;
}

export default function FoodItemEditorModal({ item, open, onClose, onSave }: FoodItemEditorModalProps) {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const [form, setForm] = useState<AnalyzedFoodItem>({
    food_name: '', quantity: 100, unit: 'g', calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, confidence_score: 1,
  });
  const [customProducts, setCustomProducts] = useState<FoodEntry[]>([]);
  const [suggestions, setSuggestions] = useState<FoodEntry[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [baseNutrition, setBaseNutrition] = useState<BaseNutrition | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const unitOptions = language === 'de' ? UNIT_OPTIONS_DE : UNIT_OPTIONS_EN;

  useEffect(() => {
    if (item) {
      setForm({ ...item });
      setBaseNutrition(null);
    }
  }, [item]);

  useEffect(() => {
    const loadCustomProducts = async () => {
      if (!user || !open) {
        setCustomProducts([]);
        return;
      }

      const { data, error } = await supabase
        .from('custom_products')
        .select('food_name, default_quantity, default_unit, calories, protein_g, fat_g, carbs_g')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(100);

      if (error || !data) {
        setCustomProducts([]);
        return;
      }

      const mapped: FoodEntry[] = data.map((entry) => ({
        name: entry.food_name,
        name_en: entry.food_name,
        quantity: Number(entry.default_quantity) || 100,
        unit: entry.default_unit || 'g',
        calories: Number(entry.calories) || 0,
        protein_g: Number(entry.protein_g) || 0,
        fat_g: Number(entry.fat_g) || 0,
        carbs_g: Number(entry.carbs_g) || 0,
        category: 'custom',
      }));

      setCustomProducts(mapped);
    };

    void loadCustomProducts();
  }, [user, open]);

  const buildSuggestions = (query: string) => {
    const normalized = query.trim().toLowerCase();
    const dbMatches = searchFoods(query, language as 'de' | 'en');

    const customMatches = normalized
      ? customProducts.filter((entry) =>
          entry.name.toLowerCase().includes(normalized) || entry.name_en.toLowerCase().includes(normalized),
        )
      : customProducts;

    const merged = [...customMatches, ...dbMatches];
    const seen = new Set<string>();

    return merged
      .filter((entry) => {
        const key = `${entry.name.toLowerCase()}|${entry.unit.toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 8);
  };
  const scaleByGrams = (base: BaseNutrition, gramsAmount: number) => {
    const baseGrams = getGramsEquivalent(base.baseQuantity, base.baseUnit);
    if (baseGrams === 0) return { calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0 };
    const factor = gramsAmount / baseGrams;
    return {
      calories: Math.round(base.calories * factor),
      protein_g: Math.round(base.protein_g * factor * 10) / 10,
      fat_g: Math.round(base.fat_g * factor * 10) / 10,
      carbs_g: Math.round(base.carbs_g * factor * 10) / 10,
    };
  };

  const update = (field: keyof AnalyzedFoodItem, value: string | number) => {
    if (field === 'quantity' && baseNutrition && typeof value === 'number') {
      const grams = getGramsEquivalent(value, form.unit);
      const scaled = scaleByGrams(baseNutrition, grams);
      setForm(prev => ({ ...prev, quantity: value, ...scaled }));
      return;
    }

    setForm(prev => ({ ...prev, [field]: value }));

    if (field === 'food_name' && typeof value === 'string') {
      const results = searchFoods(value, language as 'de' | 'en');
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }
  };

  const handleUnitChange = (newUnit: string) => {
    if (!baseNutrition) {
      setForm(prev => ({ ...prev, unit: newUnit }));
      return;
    }

    // Keep the same gram-equivalent, recalculate quantity for new unit
    const currentGrams = getGramsEquivalent(form.quantity, form.unit);
    const newFactor = UNIT_TO_GRAMS[newUnit];
    let newQuantity: number;

    if (newFactor && newFactor > 0) {
      newQuantity = Math.round((currentGrams / newFactor) * 10) / 10;
    } else {
      newQuantity = form.quantity;
    }

    const scaled = scaleByGrams(baseNutrition, currentGrams);
    setForm(prev => ({ ...prev, unit: newUnit, quantity: newQuantity, ...scaled }));
  };

  const selectSuggestion = (food: FoodEntry) => {
    const name = language === 'de' ? food.name : food.name_en;
    const base: BaseNutrition = {
      baseQuantity: food.quantity,
      baseUnit: food.unit,
      calories: food.calories,
      protein_g: food.protein_g,
      fat_g: food.fat_g,
      carbs_g: food.carbs_g,
    };
    setBaseNutrition(base);
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
          <DialogDescription className="text-xs text-muted-foreground">
            {t('meals.editHint')}
          </DialogDescription>
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
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                className="pl-9"
                placeholder={language === 'de' ? 'z.B. Kaffee, Reis, Hähnchen...' : 'e.g. Coffee, Rice, Chicken...'}
                autoFocus
              />
            </div>

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
              <Select value={form.unit} onValueChange={handleUnitChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {baseNutrition && (
            <p className="text-[10px] text-muted-foreground italic">
              {language === 'de'
                ? `Nährwerte skalieren automatisch (Basis: ${baseNutrition.baseQuantity} ${baseNutrition.baseUnit})`
                : `Nutrition scales automatically (base: ${baseNutrition.baseQuantity} ${baseNutrition.baseUnit})`}
            </p>
          )}

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
