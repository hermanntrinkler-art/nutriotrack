import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import type { AnalyzedFoodItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { hapticFeedback } from '@/lib/haptics';
import { saveAsRecipe } from './SavedRecipesScreen';
import { supabase } from '@/integrations/supabase/client';
import FoodSearchScreen from './FoodSearchScreen';
import BarcodeScanner from './BarcodeScanner';

const EMOJI_OPTIONS = ['🥛', '🥣', '🍲', '🥗', '🍳', '🥤', '🍜', '🥘', '🍱', '🧆', '🥙', '🌮'];

interface CreateRecipeScreenProps {
  onClose: () => void;
  onCreated: () => void;
  /** If provided, we're editing an existing recipe */
  editRecipe?: {
    id: string;
    name: string;
    emoji: string;
    meal_type: string;
  };
}

export default function CreateRecipeScreen({ onClose, onCreated, editRecipe }: CreateRecipeScreenProps) {
  const { user } = useAuth();
  const { language } = useTranslation();
  const [name, setName] = useState(editRecipe?.name || '');
  const [emoji, setEmoji] = useState(editRecipe?.emoji || '🍽️');
  const [saving, setSaving] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [items, setItems] = useState<AnalyzedFoodItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(!!editRecipe);

  // Load existing items when editing
  useEffect(() => {
    if (!editRecipe) return;
    supabase
      .from('saved_recipe_items')
      .select('*')
      .eq('recipe_id', editRecipe.id)
      .then(({ data }) => {
        if (data) {
          setItems(data.map((item: any) => ({
            food_name: item.food_name,
            quantity: Number(item.quantity),
            unit: item.unit,
            calories: Number(item.calories),
            protein_g: Number(item.protein_g),
            fat_g: Number(item.fat_g),
            carbs_g: Number(item.carbs_g),
            confidence_score: 1,
          })));
        }
        setLoadingItems(false);
      });
  }, [editRecipe]);

  const handleSaveFromSearch = (searchItems: AnalyzedFoodItem[]) => {
    setItems(prev => [...prev, ...searchItems]);
    setShowSearch(false);
  };

  const handleSaveRecipe = async () => {
    if (!user || !name.trim() || items.length === 0) return;
    setSaving(true);

    if (editRecipe) {
      // Update existing recipe
      const totalCalories = items.reduce((s, i) => s + Number(i.calories), 0);
      const totalProtein = items.reduce((s, i) => s + Number(i.protein_g), 0);
      const totalFat = items.reduce((s, i) => s + Number(i.fat_g), 0);
      const totalCarbs = items.reduce((s, i) => s + Number(i.carbs_g), 0);

      const { error: updateError } = await supabase
        .from('saved_recipes')
        .update({
          name: name.trim(),
          emoji,
          total_calories: totalCalories,
          total_protein_g: totalProtein,
          total_fat_g: totalFat,
          total_carbs_g: totalCarbs,
        } as any)
        .eq('id', editRecipe.id);

      if (updateError) {
        setSaving(false);
        toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving recipe');
        return;
      }

      // Delete old items & insert new ones
      await supabase.from('saved_recipe_items').delete().eq('recipe_id', editRecipe.id);
      const recipeItems = items.map(item => ({
        recipe_id: editRecipe.id,
        food_name: item.food_name,
        quantity: item.quantity,
        unit: item.unit,
        calories: item.calories,
        protein_g: item.protein_g,
        fat_g: item.fat_g,
        carbs_g: item.carbs_g,
      }));
      await supabase.from('saved_recipe_items').insert(recipeItems as any);

      setSaving(false);
      hapticFeedback('success');
      toast.success(language === 'de' ? 'Rezept aktualisiert!' : 'Recipe updated!');
      onCreated();
    } else {
      // Create new recipe
      const ok = await saveAsRecipe({
        userId: user.id,
        name: name.trim(),
        emoji,
        mealType: 'snack',
        items,
      });
      setSaving(false);
      if (ok) {
        hapticFeedback('success');
        toast.success(language === 'de' ? 'Rezept gespeichert!' : 'Recipe saved!');
        onCreated();
      } else {
        toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving recipe');
      }
    }
  };

  if (showBarcode) {
    return (
      <BarcodeScanner
        onResult={(item) => {
          setItems(prev => [...prev, item]);
          setShowBarcode(false);
        }}
        onCancel={() => setShowBarcode(false)}
      />
    );
  }

  if (showSearch) {
    return (
      <FoodSearchScreen
        onCancel={() => setShowSearch(false)}
        onSave={handleSaveFromSearch}
        saving={false}
        initialItems={[]}
        singleAddMode
        onBarcodeScan={() => {
          setShowSearch(false);
          setShowBarcode(true);
        }}
      />
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-lg">
            {editRecipe
              ? (language === 'de' ? 'Rezept bearbeiten' : 'Edit Recipe')
              : (language === 'de' ? 'Neues Rezept' : 'New Recipe')}
          </h2>
        </div>
      </div>

      {/* Name & Emoji */}
      <div className="space-y-3">
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={language === 'de' ? 'z.B. Mandelmilch, Protein-Bowl...' : 'e.g. Almond Milk, Protein Bowl...'}
          className="h-12 rounded-2xl text-base bg-card border-border"
          autoFocus
        />
        <div className="flex gap-1.5 flex-wrap">
          {EMOJI_OPTIONS.map(e => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                emoji === e
                  ? 'bg-primary/15 border-2 border-primary scale-110'
                  : 'bg-card border border-border hover:border-primary/30'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Added items list */}
      {loadingItems ? (
        <div className="text-center py-6 text-muted-foreground text-sm">
          {language === 'de' ? 'Lade Zutaten...' : 'Loading ingredients...'}
        </div>
      ) : items.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide px-1">
            {language === 'de' ? 'Zutaten' : 'Ingredients'} ({items.length})
          </p>
          {items.map((item, i) => (
            <div
              key={`${item.food_name}-${i}`}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-card border border-border"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{item.food_name}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(item.quantity)} {item.unit} · {Math.round(item.calories)} kcal
                </p>
              </div>
              <button
                onClick={() => setItems(prev => prev.filter((_, idx) => idx !== i))}
                className="text-xs text-destructive font-medium px-2 py-1 rounded-lg hover:bg-destructive/10 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2 px-1 pt-1 text-xs text-muted-foreground">
            <span>Σ {Math.round(items.reduce((s, i) => s + i.calories, 0))} kcal</span>
            <span>·</span>
            <span className="text-protein">{Math.round(items.reduce((s, i) => s + i.protein_g, 0))}P</span>
            <span className="text-fat">{Math.round(items.reduce((s, i) => s + i.fat_g, 0))}F</span>
            <span className="text-carbs">{Math.round(items.reduce((s, i) => s + i.carbs_g, 0))}C</span>
          </div>
        </div>
      )}

      {/* Add ingredient button */}
      <Button
        variant="outline"
        className="w-full h-12 rounded-2xl border-dashed border-2 text-muted-foreground hover:text-foreground hover:border-primary/40"
        onClick={() => setShowSearch(true)}
      >
        + {language === 'de' ? 'Zutat hinzufügen' : 'Add ingredient'}
      </Button>

      {/* Save button */}
      {items.length > 0 && name.trim() && (
        <Button
          className="w-full h-12 rounded-2xl text-base font-bold"
          onClick={handleSaveRecipe}
          disabled={saving}
        >
          {saving
            ? (language === 'de' ? 'Speichern...' : 'Saving...')
            : editRecipe
              ? (language === 'de' ? `${emoji} Rezept aktualisieren` : `${emoji} Update Recipe`)
              : (language === 'de' ? `${emoji} Rezept speichern` : `${emoji} Save Recipe`)}
        </Button>
      )}
    </div>
  );
}
