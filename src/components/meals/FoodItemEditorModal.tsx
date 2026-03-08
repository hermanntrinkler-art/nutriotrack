import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { AnalyzedFoodItem } from '@/lib/types';
import { searchFoods, type FoodEntry } from '@/lib/food-database';
import { searchOpenFoodFacts } from '@/lib/openfoodfacts-search';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Globe, Loader2 } from 'lucide-react';

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
  'Stück': 0, // dynamic, looked up per food
};

// Average weight per piece in grams for common foods
const PIECE_WEIGHTS: Record<string, number> = {
  // Fruits
  erdbeere: 20, erdbeeren: 20, strawberry: 20, strawberries: 20,
  apfel: 180, apple: 180, äpfel: 180,
  banane: 120, banana: 120, bananen: 120,
  orange: 180, orangen: 180,
  mandarine: 80, mandarinen: 80, tangerine: 80, clementine: 80,
  birne: 180, pear: 180, birnen: 180,
  pfirsich: 150, peach: 150,
  pflaume: 50, plum: 50, pflaumen: 50,
  kiwi: 75, kiwis: 75,
  tomate: 120, tomaten: 120, tomato: 120, tomatoes: 120,
  kirsche: 8, kirschen: 8, cherry: 8, cherries: 8,
  traube: 5, trauben: 5, grape: 5, grapes: 5,
  feige: 50, fig: 50, feigen: 50,
  aprikose: 40, apricot: 40, aprikosen: 40,
  zitrone: 80, lemon: 80, limette: 60, lime: 60,
  mango: 300, mangos: 300,
  avocado: 200, avocados: 200,
  // Vegetables
  kartoffel: 150, kartoffeln: 150, potato: 150, potatoes: 150,
  karotte: 80, karotten: 80, möhre: 80, möhren: 80, carrot: 80,
  paprika: 160, pepper: 160, bell_pepper: 160,
  gurke: 400, cucumber: 400, salatgurke: 400,
  zucchini: 200,
  aubergine: 300, eggplant: 300,
  champignon: 20, mushroom: 20, pilz: 20, pilze: 20,
  zwiebel: 100, onion: 100, zwiebeln: 100,
  knoblauchzehe: 5, garlic_clove: 5,
  // Protein
  ei: 60, eier: 60, egg: 60, eggs: 60,
  hühnerbrust: 200, chicken_breast: 200,
  würstchen: 80, sausage: 80, wiener: 50,
  frikadelle: 80, meatball: 30,
  // Bakery
  brötchen: 60, semmel: 60, roll: 60,
  scheibe_brot: 40, slice_bread: 40,
  croissant: 60,
  brezel: 85, pretzel: 85,
  // Snacks
  keks: 10, cookie: 15,
  riegel: 40, bar: 40,
  praline: 12, bonbon: 5,
};

function getPieceWeight(foodName: string): number {
  const normalized = foodName.trim().toLowerCase();
  // Direct match
  if (PIECE_WEIGHTS[normalized]) return PIECE_WEIGHTS[normalized];
  // Partial match: check if any key is contained in the food name
  for (const [key, weight] of Object.entries(PIECE_WEIGHTS)) {
    if (normalized.includes(key) || key.includes(normalized)) return weight;
  }
  return 0; // unknown
}

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

function getGramsEquivalent(quantity: number, unit: string, foodName?: string): number {
  if (unit === 'Stück') {
    const pw = foodName ? getPieceWeight(foodName) : 0;
    return pw > 0 ? quantity * pw : quantity;
  }
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
  const [onlineResults, setOnlineResults] = useState<FoodEntry[]>([]);
  const [searchingOnline, setSearchingOnline] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [baseNutrition, setBaseNutrition] = useState<BaseNutrition | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const onlineSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeOnlineRequest = useRef<AbortController | null>(null);
  const onlineRequestId = useRef(0);

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

  useEffect(() => {
    return () => {
      if (onlineSearchTimer.current) clearTimeout(onlineSearchTimer.current);
      activeOnlineRequest.current?.abort();
    };
  }, []);

  const buildSuggestions = useCallback((query: string, online: FoodEntry[] = []) => {
    const normalized = query.trim().toLowerCase();
    const dbMatches = searchFoods(query, language as 'de' | 'en');

    const customMatches = normalized
      ? customProducts.filter((entry) =>
          entry.name.toLowerCase().includes(normalized) || entry.name_en.toLowerCase().includes(normalized),
        )
      : customProducts;

    const merged = [...customMatches, ...dbMatches, ...online];
    const seen = new Set<string>();

    return merged
      .filter((entry) => {
        const key = `${entry.name.toLowerCase()}|${entry.unit.toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 12);
  }, [customProducts, language]);

  const triggerOnlineSearch = useCallback((query: string) => {
    if (onlineSearchTimer.current) clearTimeout(onlineSearchTimer.current);
    activeOnlineRequest.current?.abort();

    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 3) {
      setOnlineResults([]);
      setSearchingOnline(false);
      return;
    }

    setSearchingOnline(true);
    const requestId = ++onlineRequestId.current;

    onlineSearchTimer.current = setTimeout(async () => {
      const controller = new AbortController();
      activeOnlineRequest.current = controller;

      try {
        const results = await searchOpenFoodFacts(normalizedQuery, language as 'de' | 'en', {
          signal: controller.signal,
        });

        if (requestId !== onlineRequestId.current) return;

        setOnlineResults(results);
        setSuggestions(buildSuggestions(normalizedQuery, results));
        setShowSuggestions(true);
      } finally {
        if (requestId === onlineRequestId.current) {
          setSearchingOnline(false);
          activeOnlineRequest.current = null;
        }
      }
    }, 300);
  }, [language, buildSuggestions]);

  const scaleByGrams = (base: BaseNutrition, gramsAmount: number) => {
    const baseGrams = getGramsEquivalent(base.baseQuantity, base.baseUnit, form.food_name);
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
      const grams = getGramsEquivalent(value, form.unit, form.food_name);
      const scaled = scaleByGrams(baseNutrition, grams);
      setForm(prev => ({ ...prev, quantity: value, ...scaled }));
      return;
    }

    setForm(prev => ({ ...prev, [field]: value }));

    if (field === 'food_name' && typeof value === 'string') {
      const results = buildSuggestions(value);
      setSuggestions(results);
      setShowSuggestions(value.trim().length > 0);
      triggerOnlineSearch(value);
    }
  };

  const handleUnitChange = (newUnit: string) => {
    if (!baseNutrition) {
      setForm(prev => ({ ...prev, unit: newUnit }));
      return;
    }

    const currentGrams = getGramsEquivalent(form.quantity, form.unit, form.food_name);
    let newQuantity: number;

    if (newUnit === 'Stück') {
      const pw = getPieceWeight(form.food_name);
      if (pw > 0) {
        newQuantity = Math.round((currentGrams / pw) * 10) / 10;
      } else {
        // Unknown piece weight – default to 1 piece, keep nutrition
        newQuantity = 1;
      }
    } else {
      const newFactor = UNIT_TO_GRAMS[newUnit];
      if (newFactor && newFactor > 0) {
        newQuantity = Math.round((currentGrams / newFactor) * 10) / 10;
      } else {
        newQuantity = form.quantity;
      }
    }

    const newGrams = getGramsEquivalent(newQuantity, newUnit, form.food_name);
    const scaled = scaleByGrams(baseNutrition, newGrams);
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
                  const results = buildSuggestions(form.food_name, onlineResults);
                  setSuggestions(results);
                  setShowSuggestions(results.length > 0 || form.food_name.trim().length >= 3);
                }}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                className="pl-9"
                placeholder={language === 'de' ? 'z.B. Kaffee, Reis, Hähnchen...' : 'e.g. Coffee, Rice, Chicken...'}
                autoFocus
              />
            </div>

            {showSuggestions && (suggestions.length > 0 || searchingOnline) && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto"
              >
                {suggestions.map((food, i) => {
                  const name = language === 'de' ? food.name : food.name_en;
                  const isOnline = food.category === 'openfoodfacts';
                  const isCustom = food.category === 'custom';
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
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-medium text-foreground truncate flex items-center gap-1.5">
                          {isOnline && <Globe className="h-3 w-3 text-muted-foreground shrink-0" />}
                          {isCustom && <span className="text-[10px] bg-primary/10 text-primary px-1 rounded shrink-0">★</span>}
                          {name}
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">{food.calories} kcal</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {food.quantity} {food.unit} · P:{food.protein_g}g F:{food.fat_g}g C:{food.carbs_g}g
                        {food.matchedAlias && (
                          <span className="ml-1 italic text-primary/70">
                            ({language === 'de' ? `auch: ${food.matchedAlias}` : `aka: ${food.matchedAlias}`})
                          </span>
                        )}
                      </p>
                    </button>
                  );
                })}
                {searchingOnline && (
                  <div className="px-3 py-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {language === 'de' ? 'Suche online...' : 'Searching online...'}
                  </div>
                )}
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
              {form.unit === 'Stück' && getPieceWeight(form.food_name) > 0
                ? (language === 'de'
                    ? `1 Stück ≈ ${getPieceWeight(form.food_name)}g · Nährwerte skalieren automatisch`
                    : `1 piece ≈ ${getPieceWeight(form.food_name)}g · Nutrition scales automatically`)
                : (language === 'de'
                    ? `Nährwerte skalieren automatisch (Basis: ${baseNutrition.baseQuantity} ${baseNutrition.baseUnit})`
                    : `Nutrition scales automatically (base: ${baseNutrition.baseQuantity} ${baseNutrition.baseUnit})`)}
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
