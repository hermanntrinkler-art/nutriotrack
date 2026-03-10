import { useState, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
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
import { Plus, Minus, Users, Globe, Flame } from 'lucide-react';
import { hapticFeedback } from '@/lib/haptics';

interface FoodDetailDrawerProps {
  food: FoodEntry | null;
  open: boolean;
  onClose: () => void;
  onAdd: (item: AnalyzedFoodItem) => void;
  onShowCommunityForm?: () => void;
}

/** Common portion presets based on unit */
function getPortionPresets(food: FoodEntry, language: string): { label: string; qty: number; unit: string }[] {
  const presets: { label: string; qty: number; unit: string }[] = [];

  if (food.unit === 'Scheibe' || food.unit === 'Stück' || food.unit === 'piece') {
    // For items already in "Scheibe"/piece, show the original + 100g equivalent
    presets.push({
      label: `1 ${food.unit} (${food.quantity}${food.unit === 'Scheibe' ? '' : ''})`,
      qty: food.quantity,
      unit: food.unit,
    });
    if (food.quantity !== 2) {
      presets.push({
        label: `2 ${food.unit}`,
        qty: 2,
        unit: food.unit,
      });
    }
  } else {
    // gram/ml based
    presets.push({
      label: '100 g',
      qty: 100,
      unit: 'g',
    });
    if (food.quantity !== 100) {
      presets.push({
        label: `${food.quantity} ${food.unit}`,
        qty: food.quantity,
        unit: food.unit,
      });
    }
    presets.push({
      label: '200 g',
      qty: 200,
      unit: 'g',
    });
  }

  return presets;
}

function scaleNutrition(food: FoodEntry, qty: number, unit: string) {
  // Calculate based on the food's reference quantity
  const refQty = food.quantity || 100;
  const factor = qty / refQty;
  return {
    calories: Math.round(food.calories * factor),
    protein_g: Math.round(food.protein_g * factor * 10) / 10,
    fat_g: Math.round(food.fat_g * factor * 10) / 10,
    carbs_g: Math.round(food.carbs_g * factor * 10) / 10,
  };
}

export default function FoodDetailDrawer({ food, open, onClose, onAdd, onShowCommunityForm }: FoodDetailDrawerProps) {
  const { language } = useTranslation();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState<number>(food?.quantity || 100);
  const [unit, setUnit] = useState<string>(food?.unit || 'g');

  // Reset when food changes
  const foodKey = food ? `${food.name}-${food.unit}` : '';
  const [prevKey, setPrevKey] = useState(foodKey);
  if (foodKey !== prevKey) {
    setPrevKey(foodKey);
    if (food) {
      setQuantity(food.quantity);
      setUnit(food.unit);
    }
  }

  const scaled = useMemo(() => {
    if (!food) return { calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0 };
    return scaleNutrition(food, quantity, unit);
  }, [food, quantity, unit]);

  // Per 100g reference values
  const per100 = useMemo(() => {
    if (!food) return { calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0 };
    const refQty = food.quantity || 100;
    const factor = 100 / refQty;
    return {
      calories: Math.round(food.calories * factor),
      protein_g: Math.round(food.protein_g * factor * 10) / 10,
      fat_g: Math.round(food.fat_g * factor * 10) / 10,
      carbs_g: Math.round(food.carbs_g * factor * 10) / 10,
    };
  }, [food]);

  const presets = useMemo(() => {
    if (!food) return [];
    return getPortionPresets(food, language);
  }, [food, language]);

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

  const handlePreset = (preset: { qty: number; unit: string }) => {
    setQuantity(preset.qty);
    setUnit(preset.unit);
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
    ? `👥 ${(food as any).communityContributor || 'Community'}`
    : isOnline
      ? 'OpenFoodFacts'
      : isCustom
        ? (language === 'de' ? 'Eigenes Produkt' : 'Custom Product')
        : (language === 'de' ? 'Datenbank' : 'Database');

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-left text-lg">{name}</DrawerTitle>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {isCommunity && <Users className="h-3 w-3 text-primary" />}
            {isOnline && <Globe className="h-3 w-3" />}
            <span>{source}</span>
            {(food as any).communityBrand && (
              <span>· {(food as any).communityBrand}</span>
            )}
          </div>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-5">
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

          {/* Quantity selector */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleStep(-1)}
                className="w-10 h-10 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors active:scale-95"
              >
                <Minus className="h-4 w-4 text-foreground" />
              </button>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                  className="h-11 text-center text-lg font-bold rounded-xl"
                  min={0}
                />
                <span className="text-sm font-medium text-muted-foreground min-w-[40px]">{unit}</span>
              </div>
              <button
                onClick={() => handleStep(1)}
                className="w-10 h-10 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors active:scale-95"
              >
                <Plus className="h-4 w-4 text-foreground" />
              </button>
            </div>
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
                      onClick={() => handlePreset(preset)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-accent/30 transition-all active:scale-[0.98]"
                    >
                      <div>
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

          {/* Per 100g reference - only show for gram/ml based items */}
          {!isPiece && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                {language === 'de' ? 'Nährwerte pro 100 g' : 'Nutrition per 100 g'}
              </p>
              <div className="rounded-xl border border-border overflow-hidden">
                {[
                  { label: language === 'de' ? 'Brennwert' : 'Calories', value: `${per100.calories} kcal` },
                  { label: language === 'de' ? 'Fett' : 'Fat', value: `${per100.fat_g} g` },
                  { label: language === 'de' ? 'Kohlenhydrate' : 'Carbs', value: `${per100.carbs_g} g` },
                  { label: 'Protein', value: `${per100.protein_g} g` },
                ].map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-sm ${
                      i < 3 ? 'border-b border-border' : ''
                    }`}
                  >
                    <span className="text-foreground font-medium">{row.label}</span>
                    <span className="font-bold tabular-nums text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
