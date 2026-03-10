import { useState, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
import type { AnalyzedFoodItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Flame, Star, Loader2, X, Pencil, Trash2, Minus, Plus, Leaf } from 'lucide-react';
import { hapticFeedback } from '@/lib/haptics';
import { saveAsRecipe } from '@/components/meals/SavedRecipesScreen';
import { toast } from 'sonner';
import { estimateMicronutrients, MICRO_LABELS, type MicronutrientEstimate } from '@/lib/micronutrients';

interface BottomCartProps {
  items: AnalyzedFoodItem[];
  isAiResult: boolean;
  onRemoveItem: (index: number) => void;
  onReplaceItem: (index: number, newItem: AnalyzedFoodItem) => void;
  onEditItem: (index: number) => void;
  onSave: () => void;
  saving: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
}

function scaleItem(item: AnalyzedFoodItem, oldQty: number, newQty: number): AnalyzedFoodItem {
  if (oldQty <= 0) return { ...item, quantity: newQty };
  const factor = newQty / oldQty;
  return {
    ...item,
    quantity: newQty,
    calories: Math.round(item.calories * factor),
    protein_g: Math.round(item.protein_g * factor * 10) / 10,
    fat_g: Math.round(item.fat_g * factor * 10) / 10,
    carbs_g: Math.round(item.carbs_g * factor * 10) / 10,
  };
}

function CartItemWithMicros({ item, index, language, onEditItem, onRemoveItem, onReplaceItem, handleStep }: {
  item: AnalyzedFoodItem; index: number; language: string;
  onEditItem: (i: number) => void; onRemoveItem: (i: number) => void;
  onReplaceItem: (i: number, newItem: AnalyzedFoodItem) => void;
  handleStep: (i: number, delta: number) => void;
}) {
  const [showMicros, setShowMicros] = useState(false);

  const grams = useMemo(() => {
    const u = (item.unit || '').toLowerCase();
    if (u === 'g' || u === 'ml') return item.quantity;
    if (u === 'stück' || u === 'piece' || u === 'portion') return item.quantity * 100;
    if (u === 'scheibe' || u === 'slice') return item.quantity * 40;
    return item.quantity;
  }, [item.quantity, item.unit]);

  const micros = useMemo(() => estimateMicronutrients(item.food_name, grams), [item.food_name, grams]);

  const vitaminKeys: (keyof MicronutrientEstimate)[] = ['vitaminA_ug', 'vitaminB1_mg', 'vitaminB2_mg', 'vitaminB6_mg', 'vitaminB12_ug', 'vitaminC_mg', 'vitaminD_ug', 'vitaminE_mg', 'vitaminK_ug', 'folate_ug'];
  const mineralKeys: (keyof MicronutrientEstimate)[] = ['iron_mg', 'calcium_mg', 'magnesium_mg', 'zinc_mg', 'potassium_mg', 'sodium_mg', 'phosphorus_mg'];
  const lang = language === 'de' ? 'de' : 'en';

  return (
    <div className="rounded-xl bg-muted/50 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold truncate flex-1">{item.food_name || (language === 'de' ? 'Lebensmittel' : 'Food item')}</span>
        <div className="flex items-center gap-1 ml-2">
          <button onClick={() => onEditItem(index)} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <button onClick={() => onRemoveItem(index)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </button>
        </div>
      </div>
      {/* Quantity stepper */}
      <div className="flex items-center gap-2">
        <button onClick={() => handleStep(index, -1)} className="w-7 h-7 rounded-full bg-background hover:bg-accent flex items-center justify-center transition-colors active:scale-95">
          <Minus className="h-3.5 w-3.5 text-foreground" />
        </button>
        <span className="text-sm font-medium min-w-[60px] text-center">{item.quantity} {item.unit}</span>
        <button onClick={() => handleStep(index, 1)} className="w-7 h-7 rounded-full bg-background hover:bg-accent flex items-center justify-center transition-colors active:scale-95">
          <Plus className="h-3.5 w-3.5 text-foreground" />
        </button>
        <div className="flex-1" />
        <span className="text-xs font-bold tabular-nums">{Math.round(item.calories)} kcal</span>
      </div>
      {/* Macros */}
      <div className="flex gap-3 text-[11px]">
        <span className="text-protein font-semibold">P {Math.round(item.protein_g)}g</span>
        <span className="text-fat font-semibold">F {Math.round(item.fat_g)}g</span>
        <span className="text-carbs font-semibold">K {Math.round(item.carbs_g)}g</span>
      </div>
      {/* Micros toggle */}
      <button
        onClick={() => setShowMicros(!showMicros)}
        className="flex items-center gap-1.5 text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors pt-0.5"
      >
        <Leaf className="h-3 w-3" />
        {showMicros ? (language === 'de' ? 'Mikronährstoffe ausblenden' : 'Hide micronutrients') : (language === 'de' ? 'Vitamine & Mineralstoffe' : 'Vitamins & Minerals')}
        {showMicros ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      <AnimatePresence>
        {showMicros && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pt-1">
              <div className="rounded-lg bg-background/60 p-2 space-y-0.5">
                <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Vitamine</p>
                {vitaminKeys.map(k => (
                  <div key={k} className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">{MICRO_LABELS[k][lang]}</span>
                    <span className="font-medium">{micros[k]} {MICRO_LABELS[k].unit}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-background/60 p-2 space-y-0.5">
                <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Mineralstoffe</p>
                {mineralKeys.map(k => (
                  <div key={k} className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">{MICRO_LABELS[k][lang]}</span>
                    <span className="font-medium">{micros[k]} {MICRO_LABELS[k].unit}</span>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-muted-foreground italic">
                {language === 'de' ? '* Geschätzte Werte basierend auf Referenzdaten' : '* Estimated values based on reference data'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BottomCart({
  items,
  isAiResult,
  onRemoveItem,
  onReplaceItem,
  onEditItem,
  onSave,
  saving,
  expanded,
  onToggleExpanded,
}: BottomCartProps) {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const [showFavInput, setShowFavInput] = useState(false);
  const [favName, setFavName] = useState('');
  const [savingFav, setSavingFav] = useState(false);

  const totalCal = items.reduce((s, i) => s + i.calories, 0);
  const totalP = items.reduce((s, i) => s + i.protein_g, 0);
  const totalF = items.reduce((s, i) => s + i.fat_g, 0);
  const totalC = items.reduce((s, i) => s + i.carbs_g, 0);

  const handleSaveAsFavorite = async () => {
    if (!user || items.length === 0) return;
    setSavingFav(true);
    const name = favName.trim() || items.map(i => i.food_name).filter(Boolean).slice(0, 3).join(', ') || 'Favorit';
    const success = await saveAsRecipe({ userId: user.id, name, emoji: '⭐', mealType: 'snack', items });
    setSavingFav(false);
    setShowFavInput(false);
    setFavName('');
    if (success) {
      hapticFeedback('success');
      toast.success(language === 'de' ? 'Als Favorit gespeichert! ⭐' : 'Saved as favorite! ⭐');
    } else {
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Failed to save');
    }
  };

  const handleStep = (index: number, delta: number) => {
    const item = items[index];
    const isPiece = item.unit === 'Stück' || item.unit === 'piece';
    const step = isPiece ? 1 : item.quantity <= 20 ? 1 : item.quantity <= 100 ? 5 : 10;
    const oldQty = item.quantity;
    const newQty = Math.max(isPiece ? 1 : step, Math.round((oldQty + delta * step) * 10) / 10);
    onReplaceItem(index, scaleItem(item, oldQty, newQty));
  };

  if (items.length === 0) return null;

  return (
    <motion.div
      className="fixed bottom-16 left-0 right-0 z-40 px-3 pb-2"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden max-w-lg mx-auto">
        {/* Collapsed bar - always visible */}
        <button
          onClick={onToggleExpanded}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/30 transition-colors"
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-sm font-bold">
              {items.length} {language === 'de' ? (items.length === 1 ? 'Item' : 'Items') : (items.length === 1 ? 'item' : 'items')}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="flex items-center gap-1 text-sm font-semibold">
              <Flame className="h-3.5 w-3.5 text-energy" />
              {Math.round(totalCal)} kcal
            </span>
          </div>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3 max-h-[50vh] overflow-y-auto">
                {/* Items list */}
                <div className="space-y-2">
                  {items.map((item, i) => (
                    <CartItemWithMicros key={i} item={item} index={i} language={language} onEditItem={onEditItem} onRemoveItem={onRemoveItem} onReplaceItem={onReplaceItem} handleStep={handleStep} />
                  ))}
                </div>

                {/* Totals */}
                <div className="grid grid-cols-4 gap-2 text-center text-sm py-2 border-t border-border/50">
                  <div>
                    <p className="font-bold text-foreground">{Math.round(totalCal)}</p>
                    <p className="text-[10px] text-muted-foreground">kcal</p>
                  </div>
                  <div>
                    <p className="font-bold text-protein">{Math.round(totalP)}g</p>
                    <p className="text-[10px] text-muted-foreground">P</p>
                  </div>
                  <div>
                    <p className="font-bold text-fat">{Math.round(totalF)}g</p>
                    <p className="text-[10px] text-muted-foreground">F</p>
                  </div>
                  <div>
                    <p className="font-bold text-carbs">{Math.round(totalC)}g</p>
                    <p className="text-[10px] text-muted-foreground">K</p>
                  </div>
                </div>

                {/* Save as favorite */}
                {items.length > 0 && items.some(i => i.food_name) && user && (
                  <AnimatePresence>
                    {showFavInput ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-2"
                      >
                        <Input
                          value={favName}
                          onChange={e => setFavName(e.target.value)}
                          placeholder={language === 'de' ? 'Name z.B. Mein Kaffee' : 'Name e.g. My Coffee'}
                          className="h-9 rounded-xl text-sm flex-1"
                          autoFocus
                          onKeyDown={e => e.key === 'Enter' && handleSaveAsFavorite()}
                        />
                        <Button size="sm" onClick={handleSaveAsFavorite} disabled={savingFav}
                          className="rounded-xl h-9 px-3 bg-amber-500 hover:bg-amber-600 text-white">
                          {savingFav ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Star className="h-3.5 w-3.5 fill-white" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setShowFavInput(false); setFavName(''); }} className="rounded-xl h-9 px-2">
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setShowFavInput(true)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all active:scale-[0.98]"
                      >
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        {language === 'de' ? 'Als Favorit speichern' : 'Save as Favorite'}
                      </motion.button>
                    )}
                  </AnimatePresence>
                )}

                {/* Save button */}
                <Button
                  onClick={onSave}
                  disabled={saving || items.length === 0 || items.some(i => !i.food_name)}
                  className="w-full rounded-xl h-11 font-bold text-base"
                >
                  {saving ? (language === 'de' ? 'Speichert...' : 'Saving...') : (language === 'de' ? 'Mahlzeit speichern' : 'Save Meal')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
