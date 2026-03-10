import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import type { AnalyzedFoodItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Trash2, Flame, Loader2, ChefHat, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hapticFeedback } from '@/lib/haptics';
import { toast } from 'sonner';
import CreateRecipeScreen from './CreateRecipeScreen';

interface SavedRecipe {
  id: string;
  name: string;
  emoji: string;
  meal_type: string;
  total_calories: number;
  total_protein_g: number;
  total_fat_g: number;
  total_carbs_g: number;
  use_count: number;
  items?: RecipeItem[];
}

interface RecipeItem {
  id: string;
  food_name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
}

interface SavedRecipesScreenProps {
  onSelect: (items: AnalyzedFoodItem[], mealType: string) => void;
  onCancel: () => void;
  hideHeader?: boolean;
}

export default function SavedRecipesScreen({ onSelect, onCancel, hideHeader }: SavedRecipesScreenProps) {
  const { user } = useAuth();
  const { language } = useTranslation();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadRecipes = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('saved_recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('use_count', { ascending: false });
    setRecipes((data || []) as any);
    setLoading(false);
  };

  useEffect(() => { loadRecipes(); }, [user]);

  const handleSelect = async (recipe: SavedRecipe) => {
    if (!user) return;
    hapticFeedback('success');

    // Load recipe items
    const { data: itemsData } = await supabase
      .from('saved_recipe_items')
      .select('*')
      .eq('recipe_id', recipe.id);

    if (!itemsData || itemsData.length === 0) {
      toast.error(language === 'de' ? 'Rezept ist leer' : 'Recipe is empty');
      return;
    }

    // Increment use count
    await supabase
      .from('saved_recipes')
      .update({ use_count: recipe.use_count + 1 } as any)
      .eq('id', recipe.id);

    const analyzedItems: AnalyzedFoodItem[] = (itemsData as any[]).map(item => ({
      food_name: item.food_name,
      quantity: Number(item.quantity),
      unit: item.unit,
      calories: Number(item.calories),
      protein_g: Number(item.protein_g),
      fat_g: Number(item.fat_g),
      carbs_g: Number(item.carbs_g),
      confidence_score: 1,
    }));

    onSelect(analyzedItems, recipe.meal_type);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await supabase.from('saved_recipes').delete().eq('id', id);
    setRecipes(prev => prev.filter(r => r.id !== id));
    hapticFeedback('light');
    toast.success(language === 'de' ? 'Rezept gelöscht' : 'Recipe deleted');
    setDeletingId(null);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {!hideHeader && (
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="p-1.5 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg">
              {language === 'de' ? 'Meine Favoriten' : 'My Favorites'}
            </h2>
          </div>
          <span className="text-xs text-muted-foreground font-medium">{recipes.length}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
            <ChefHat className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            {language === 'de' ? 'Noch keine Favoriten gespeichert' : 'No saved favorites yet'}
          </p>
          <p className="text-xs text-muted-foreground max-w-[250px] mx-auto">
            {language === 'de'
              ? 'Speichere eine Mahlzeit als Favorit, um sie schnell erneut zu tracken.'
              : 'Save a meal as a favorite to quickly re-track it.'}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {recipes.map((recipe, i) => (
            <motion.div
              key={recipe.id}
              className="nutri-card flex items-center gap-3 hover:border-primary/30 transition-all cursor-pointer active:scale-[0.98]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              onClick={() => handleSelect(recipe)}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center text-lg">
                {recipe.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{recipe.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Flame className="h-3 w-3 text-energy" />
                    {Math.round(recipe.total_calories)} kcal
                  </span>
                  <span>·</span>
                  <span className="text-protein">{Math.round(recipe.total_protein_g)}P</span>
                  <span className="text-fat">{Math.round(recipe.total_fat_g)}F</span>
                  <span className="text-carbs">{Math.round(recipe.total_carbs_g)}C</span>
                </div>
                {recipe.use_count > 0 && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {language === 'de' ? `${recipe.use_count}× verwendet` : `Used ${recipe.use_count}×`}
                  </p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(recipe.id);
                }}
                disabled={deletingId === recipe.id}
                className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
              >
                {deletingId === recipe.id ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                )}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}

// --- Save as Recipe utility ---
export async function saveAsRecipe({
  userId,
  name,
  emoji,
  mealType,
  items,
}: {
  userId: string;
  name: string;
  emoji: string;
  mealType: string;
  items: AnalyzedFoodItem[];
}): Promise<boolean> {
  const totalCalories = items.reduce((s, i) => s + Number(i.calories), 0);
  const totalProtein = items.reduce((s, i) => s + Number(i.protein_g), 0);
  const totalFat = items.reduce((s, i) => s + Number(i.fat_g), 0);
  const totalCarbs = items.reduce((s, i) => s + Number(i.carbs_g), 0);

  const { data: recipe, error } = await supabase
    .from('saved_recipes')
    .insert({
      user_id: userId,
      name,
      emoji,
      meal_type: mealType,
      total_calories: totalCalories,
      total_protein_g: totalProtein,
      total_fat_g: totalFat,
      total_carbs_g: totalCarbs,
    } as any)
    .select()
    .single();

  if (error || !recipe) return false;

  const recipeItems = items.map(item => ({
    recipe_id: (recipe as any).id,
    food_name: item.food_name,
    quantity: item.quantity,
    unit: item.unit,
    calories: item.calories,
    protein_g: item.protein_g,
    fat_g: item.fat_g,
    carbs_g: item.carbs_g,
  }));

  const { error: itemsError } = await supabase
    .from('saved_recipe_items')
    .insert(recipeItems as any);

  return !itemsError;
}
