import { useState, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';
import type { AnalyzedFoodItem } from '@/lib/types';
import type { FoodEntry } from '@/lib/food-database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Minus, Users, Globe, ChevronDown, ChevronUp, Pencil, BookOpen, Link2, Star, Flag } from 'lucide-react';
import { hapticFeedback } from '@/lib/haptics';
import { estimateMicronutrients, MICRO_LABELS, DAILY_TARGETS } from '@/lib/micronutrients';

interface FoodDetailDrawerProps {
  food: FoodEntry | null;
  open: boolean;
  onClose: () => void;
  onAdd: (item: AnalyzedFoodItem) => void;
  onShowCommunityForm?: () => void;
}

/** Get available units for a food item */
function getAvailableUnits(food: FoodEntry): { value: string; label: string }[] {
  const units: { value: string; label: string }[] = [];
  units.push({ value: 'g', label: 'Gramm' });

  if (food.unit === 'Scheibe' || food.unit === 'Stück' || food.unit === 'piece') {
    units.push({ value: food.unit, label: food.unit });
  }
  if (food.unit === 'ml') {
    units.push({ value: 'ml', label: 'ml' });
  }
  return units;
}

/** Convert quantity to grams for calculation */
function toGrams(food: FoodEntry, qty: number, unit: string): number {
  if (unit === 'g' || unit === 'ml') return qty;
  // piece-based: use gram_per_piece or food's reference
  const gramPerPiece = food.gram_per_piece || (food.calories > 0 ? 100 : 100);
  return qty * gramPerPiece;
}

/** Get per-100g nutrition values */
function getPer100g(food: FoodEntry) {
  const isPiece = food.unit === 'Scheibe' || food.unit === 'Stück' || food.unit === 'piece';
  let factor: number;
  if (isPiece && food.gram_per_piece) {
    // 1 piece = gram_per_piece grams, food values are for 1 piece
    factor = 100 / food.gram_per_piece;
  } else {
    const refQty = food.quantity || 100;
    factor = 100 / refQty;
  }
  return {
    calories: Math.round(food.calories * factor),
    protein_g: Math.round(food.protein_g * factor * 10) / 10,
    fat_g: Math.round(food.fat_g * factor * 10) / 10,
    carbs_g: Math.round(food.carbs_g * factor * 10) / 10,
  };
}

/** Scale nutrition for given qty/unit */
function scaleNutrition(food: FoodEntry, qty: number, unit: string) {
  const per100 = getPer100g(food);
  const grams = toGrams(food, qty, unit);
  const factor = grams / 100;
  return {
    calories: Math.round(per100.calories * factor),
    protein_g: Math.round(per100.protein_g * factor * 10) / 10,
    fat_g: Math.round(per100.fat_g * factor * 10) / 10,
    carbs_g: Math.round(per100.carbs_g * factor * 10) / 10,
  };
}

/** Quick presets */
function getPortionPresets(food: FoodEntry): { label: string; qty: number; unit: string; gramLabel?: string }[] {
  const presets: { label: string; qty: number; unit: string; gramLabel?: string }[] = [];
  const isPiece = food.unit === 'Scheibe' || food.unit === 'Stück' || food.unit === 'piece';

  // Always offer 100g
  presets.push({ label: '100 g', qty: 100, unit: 'g' });

  if (isPiece && food.gram_per_piece) {
    presets.push({
      label: `${food.unit} (${food.gram_per_piece} g)`,
      qty: 1,
      unit: food.unit,
      gramLabel: `${food.gram_per_piece} g`,
    });
    if (food.gram_per_piece !== 30) {
      presets.push({
        label: `Stück (30 g)`,
        qty: 30,
        unit: 'g',
      });
    }
  } else if (!isPiece && food.quantity !== 100) {
    presets.push({
      label: `${food.quantity} ${food.unit}`,
      qty: food.quantity,
      unit: food.unit,
    });
  }

  return presets;
}

// Collapsible section component
function CollapsibleSection({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-accent/30 transition-colors"
      >
        <span className="text-sm font-bold text-foreground">{title}</span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="border-t border-border">{children}</div>}
    </div>
  );
}

function NutritionRow({ label, value, sub }: { label: string; value: string; sub?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-2 text-sm border-b border-border last:border-b-0 ${sub ? 'pl-8' : ''}`}>
      <span className={`${sub ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>{label}</span>
      <span className="font-bold tabular-nums text-foreground">{value}</span>
    </div>
  );
}

export default function FoodDetailDrawer({ food, open, onClose, onAdd, onShowCommunityForm }: FoodDetailDrawerProps) {
  const { language } = useTranslation();
  const [quantity, setQuantity] = useState<number>(food?.quantity || 100);
  const [unit, setUnit] = useState<string>(food?.unit === 'Scheibe' || food?.unit === 'Stück' || food?.unit === 'piece' ? food.unit : 'g');
  const [isFavorite, setIsFavorite] = useState(false);
  const [reported, setReported] = useState(false);

  // Reset when food changes
  const foodKey = food ? `${food.name}-${food.unit}` : '';
  const [prevKey, setPrevKey] = useState(foodKey);
  if (foodKey !== prevKey) {
    setPrevKey(foodKey);
    setIsFavorite(false);
    setReported(false);
    if (food) {
      const isPiece = food.unit === 'Scheibe' || food.unit === 'Stück' || food.unit === 'piece';
      if (isPiece) {
        setQuantity(food.quantity);
        setUnit(food.unit);
      } else {
        setQuantity(food.quantity);
        setUnit(food.unit === 'ml' ? 'ml' : 'g');
      }
    }
  }

  const scaled = useMemo(() => {
    if (!food) return { calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0 };
    return scaleNutrition(food, quantity, unit);
  }, [food, quantity, unit]);

  const per100 = useMemo(() => {
    if (!food) return { calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0 };
    return getPer100g(food);
  }, [food]);

  const presets = useMemo(() => {
    if (!food) return [];
    return getPortionPresets(food);
  }, [food]);

  // Micronutrient estimation
  const micros = useMemo(() => {
    if (!food) return null;
    const grams = toGrams(food, quantity, unit);
    return estimateMicronutrients(food.name, grams);
  }, [food, quantity, unit]);

  const microsPer100 = useMemo(() => {
    if (!food) return null;
    return estimateMicronutrients(food.name, 100);
  }, [food]);

  const availableUnits = useMemo(() => {
    if (!food) return [];
    return getAvailableUnits(food);
  }, [food]);

  const handleAdd = () => {
    if (!food) return;
    hapticFeedback('success');
    const name = language === 'de' ? food.name : food.name_en;
    onAdd({
      food_name: name,
      quantity,
      unit,
      calories: scaled.calories,
      protein_g: scaled.protein_g,
      fat_g: scaled.fat_g,
      carbs_g: scaled.carbs_g,
      confidence_score: 1,
    });
    onClose();
  };

  const handleUnitChange = (newUnit: string) => {
    if (!food) return;
    // Convert quantity when switching units
    const isPieceUnit = newUnit === 'Scheibe' || newUnit === 'Stück' || newUnit === 'piece';
    const wasPiece = unit === 'Scheibe' || unit === 'Stück' || unit === 'piece';
    const gpp = food.gram_per_piece || 100;

    if (isPieceUnit && !wasPiece) {
      // g → piece: divide
      setQuantity(Math.max(1, Math.round(quantity / gpp)));
    } else if (!isPieceUnit && wasPiece) {
      // piece → g: multiply
      setQuantity(quantity * gpp);
    }
    setUnit(newUnit);
  };

  const isPiece = unit === 'Stück' || unit === 'Scheibe' || unit === 'piece';
  const step = isPiece ? 1 : quantity <= 20 ? 1 : quantity <= 100 ? 5 : 10;

  const handleStep = (delta: number) => {
    const newQty = Math.max(isPiece ? 1 : step, Math.round((quantity + delta * step) * 10) / 10);
    setQuantity(newQty);
  };

  if (!food) return null;

  const isOnline = food.category === 'openfoodfacts';
  const isCommunity = food.category === 'community';
  const isCustom = food.category === 'custom';
  const name = language === 'de' ? food.name : food.name_en;
  const source = isCommunity
    ? `👥 ${food.communityContributor || 'Community'}`
    : isOnline
      ? 'OpenFoodFacts'
      : isCustom
        ? (language === 'de' ? 'Eigenes Produkt' : 'Custom Product')
        : (language === 'de' ? 'Datenbank' : 'Database');

  // Estimated sub-macros (approximate ratios)
  const saturatedFat = Math.round(scaled.fat_g * 0.35 * 10) / 10;
  const sugar = Math.round(scaled.carbs_g * 0.1 * 10) / 10;
  const fiber = Math.round(scaled.carbs_g * 0.15 * 10) / 10;

  const saturatedFat100 = Math.round(per100.fat_g * 0.35 * 10) / 10;
  const sugar100 = Math.round(per100.carbs_g * 0.1 * 10) / 10;
  const fiber100 = Math.round(per100.carbs_g * 0.15 * 10) / 10;

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <DrawerTitle className="text-left text-lg">{name}</DrawerTitle>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                {isCommunity && <Users className="h-3 w-3 text-primary" />}
                {isOnline && <Globe className="h-3 w-3" />}
                <span>{source}</span>
                {food.communityBrand && <span>· {food.communityBrand}</span>}
              </div>
            </div>
            <button
              onClick={() => { setIsFavorite(!isFavorite); hapticFeedback('light'); }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors shrink-0"
              aria-label={isFavorite ? 'Favorit entfernen' : 'Als Favorit speichern'}
            >
              <Star className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
            </button>
          </div>
          {/* Contributed by / Report */}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
            <span>
              {isCommunity
                ? `${language === 'de' ? 'Beigetragen von' : 'Contributed by'}: ${food.communityContributor || 'User'}`
                : `${language === 'de' ? 'Quelle' : 'Source'}: ${source}`}
            </span>
            <span>·</span>
            <button
              onClick={() => { setReported(true); hapticFeedback('light'); }}
              className={`flex items-center gap-0.5 ${reported ? 'text-destructive' : 'hover:text-destructive'} transition-colors`}
              disabled={reported}
            >
              <Flag className="h-3 w-3" />
              <span>{reported ? (language === 'de' ? 'Gemeldet' : 'Reported') : (language === 'de' ? 'Problem melden' : 'Report')}</span>
            </button>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Main macros - large display */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="py-3 rounded-xl bg-muted">
              <p className="text-xl font-black tabular-nums text-foreground">{scaled.calories}</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">kcal</p>
            </div>
            <div className="py-3 rounded-xl bg-muted">
              <p className="text-xl font-black tabular-nums text-fat">{scaled.fat_g}g</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                {language === 'de' ? 'Fett' : 'Fat'}
              </p>
            </div>
            <div className="py-3 rounded-xl bg-muted">
              <p className="text-xl font-black tabular-nums text-carbs">{scaled.carbs_g}g</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                {language === 'de' ? 'KH' : 'Carbs'}
              </p>
            </div>
            <div className="py-3 rounded-xl bg-muted">
              <p className="text-xl font-black tabular-nums text-protein">{scaled.protein_g}g</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Protein</p>
            </div>
          </div>

          {/* Quantity + Unit selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStep(-1)}
              className="w-10 h-10 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors active:scale-95 shrink-0"
            >
              <Minus className="h-4 w-4 text-foreground" />
            </button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
              className="h-11 text-center text-lg font-bold rounded-xl flex-1"
              min={0}
            />
            {availableUnits.length > 1 ? (
              <Select value={unit} onValueChange={handleUnitChange}>
                <SelectTrigger className="h-11 w-[120px] rounded-xl font-medium shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map((u) => (
                    <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-sm font-medium text-muted-foreground min-w-[50px] text-center shrink-0">{unit}</span>
            )}
            <button
              onClick={() => handleStep(1)}
              className="w-10 h-10 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors active:scale-95 shrink-0"
            >
              <Plus className="h-4 w-4 text-foreground" />
            </button>
          </div>

          {/* Add button */}
          <Button
            onClick={handleAdd}
            className="w-full h-12 rounded-xl font-bold text-base"
            disabled={quantity <= 0}
          >
            <Plus className="h-4 w-4 mr-1" />
            {language === 'de' ? 'Eintragen' : 'Add'}
          </Button>

          {/* Quick presets */}
          {presets.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                {language === 'de' ? 'Schneller Eintrag' : 'Quick Entry'}
              </p>
              <div className="space-y-1.5">
                {presets.map((preset, i) => {
                  const presetScaled = scaleNutrition(food, preset.qty, preset.unit);
                  return (
                    <button
                      key={i}
                      onClick={() => { setQuantity(preset.qty); setUnit(preset.unit); }}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-accent/30 transition-all active:scale-[0.98]"
                    >
                      <div className="text-left">
                        <span className="text-sm font-semibold text-foreground">{preset.label}</span>
                        <p className="text-[11px] text-muted-foreground">
                          {presetScaled.calories} kcal · {presetScaled.fat_g}g F · {presetScaled.carbs_g}g KH · {presetScaled.protein_g}g P
                        </p>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <Plus className="h-3.5 w-3.5 text-primary" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weitere Optionen */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              {language === 'de' ? 'Weitere Optionen' : 'More Options'}
            </p>
            <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
              {onShowCommunityForm && (
                <button
                  onClick={() => { onClose(); onShowCommunityForm(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-accent/30 transition-colors"
                >
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                  <span>{language === 'de' ? 'Produktdaten korrigieren' : 'Correct product data'}</span>
                </button>
              )}
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-accent/30 transition-colors">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{language === 'de' ? 'Zu eigenem Rezept hinzufügen' : 'Add to recipe'}</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-accent/30 transition-colors">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <span>{language === 'de' ? 'Shortcut erstellen' : 'Create shortcut'}</span>
              </button>
            </div>
          </div>

          {/* Makronährstoffe */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              {language === 'de' ? 'Makronährstoffe' : 'Macronutrients'}
            </p>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="text-[11px] text-muted-foreground flex justify-between px-4 py-1.5 bg-muted/50">
                <span>{language === 'de' ? 'Werte pro' : 'Values per'}</span>
                <span>100 g</span>
              </div>
              <NutritionRow label={language === 'de' ? 'Brennwert' : 'Calories'} value={`${per100.calories} kcal`} />
              <NutritionRow label={language === 'de' ? 'Fett' : 'Fat'} value={`${per100.fat_g} g`} />
              <NutritionRow label={language === 'de' ? 'Gesättigte Fettsäuren' : 'Saturated Fat'} value={`${saturatedFat100} g`} sub />
              <NutritionRow label={language === 'de' ? 'Kohlenhydrate' : 'Carbohydrates'} value={`${per100.carbs_g} g`} />
              <NutritionRow label={language === 'de' ? 'Zucker' : 'Sugar'} value={`${sugar100} g`} sub />
              <NutritionRow label={language === 'de' ? 'Ballaststoffe' : 'Fiber'} value={`${fiber100} g`} />
              <NutritionRow label="Protein" value={`${per100.protein_g} g`} />
            </div>
          </div>

          {/* Vitamine */}
          {microsPer100 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                {language === 'de' ? 'Vitamine' : 'Vitamins'}
              </p>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="text-[11px] text-muted-foreground flex justify-between px-4 py-1.5 bg-muted/50">
                  <span>{language === 'de' ? 'Werte pro' : 'Values per'}</span>
                  <span>100 g</span>
                </div>
                <NutritionRow label="Vitamin A" value={`${microsPer100.vitaminA_ug} µg`} />
                <NutritionRow label="Vitamin B1" value={`${microsPer100.vitaminB1_mg} mg`} />
                <NutritionRow label="Vitamin B2" value={`${microsPer100.vitaminB2_mg} mg`} />
                <NutritionRow label="Vitamin B6" value={`${microsPer100.vitaminB6_mg} mg`} />
                <NutritionRow label="Vitamin B12" value={`${microsPer100.vitaminB12_ug} µg`} />
                <NutritionRow label="Vitamin C" value={`${microsPer100.vitaminC_mg} mg`} />
                <NutritionRow label="Vitamin D" value={`${microsPer100.vitaminD_ug} µg`} />
                <NutritionRow label="Vitamin E" value={`${microsPer100.vitaminE_mg} mg`} />
                <NutritionRow label="Vitamin K" value={`${microsPer100.vitaminK_ug} µg`} />
                <NutritionRow label={language === 'de' ? 'Folsäure' : 'Folate'} value={`${microsPer100.folate_ug} µg`} />
              </div>
            </div>
          )}

          {/* Mineralstoffe */}
          {microsPer100 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                {language === 'de' ? 'Mineralstoffe' : 'Minerals'}
              </p>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="text-[11px] text-muted-foreground flex justify-between px-4 py-1.5 bg-muted/50">
                  <span>{language === 'de' ? 'Werte pro' : 'Values per'}</span>
                  <span>100 g</span>
                </div>
                <NutritionRow label={language === 'de' ? 'Eisen' : 'Iron'} value={`${microsPer100.iron_mg} mg`} />
                <NutritionRow label={language === 'de' ? 'Kalium' : 'Potassium'} value={`${microsPer100.potassium_mg} mg`} />
                <NutritionRow label={language === 'de' ? 'Kalzium' : 'Calcium'} value={`${microsPer100.calcium_mg} mg`} />
                <NutritionRow label="Magnesium" value={`${microsPer100.magnesium_mg} mg`} />
                <NutritionRow label={language === 'de' ? 'Natrium' : 'Sodium'} value={`${microsPer100.sodium_mg} mg`} />
                <NutritionRow label={language === 'de' ? 'Phosphor' : 'Phosphorus'} value={`${microsPer100.phosphorus_mg} mg`} />
                <NutritionRow label={language === 'de' ? 'Zink' : 'Zinc'} value={`${microsPer100.zinc_mg} mg`} />
              </div>
            </div>
          )}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
