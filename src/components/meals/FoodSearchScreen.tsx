import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { searchFoods, foodDatabase, type FoodEntry } from '@/lib/food-database';
import { searchOpenFoodFacts } from '@/lib/openfoodfacts-search';
import type { AnalyzedFoodItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Minus, Globe, Loader2, X, ArrowLeft, ChevronRight, Flame, Star, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hapticFeedback } from '@/lib/haptics';
import { saveAsRecipe } from '@/components/meals/SavedRecipesScreen';
import { toast } from 'sonner';
import CommunityProductForm from '@/components/CommunityProductForm';

interface FoodSearchScreenProps {
  onDone: (items: AnalyzedFoodItem[]) => void;
  onCancel: () => void;
}

interface SavedFavorite {
  id: string;
  name: string;
  emoji: string;
  meal_type: string;
  total_calories: number;
  total_protein_g: number;
  total_fat_g: number;
  total_carbs_g: number;
  use_count: number;
}

const CATEGORIES = [
  { key: 'all', emoji: '🔍' },
  { key: 'drinks', emoji: '☕' },
  { key: 'bread', emoji: '🍞' },
  { key: 'protein', emoji: '🥩' },
  { key: 'dairy', emoji: '🧀' },
  { key: 'fruit', emoji: '🍎' },
  { key: 'snacks', emoji: '🍫' },
] as const;

const CATEGORY_LABELS_DE: Record<string, string> = {
  all: 'Alle', drinks: 'Getränke', bread: 'Brot', protein: 'Protein',
  dairy: 'Milch', fruit: 'Obst', snacks: 'Snacks',
};
const CATEGORY_LABELS_EN: Record<string, string> = {
  all: 'All', drinks: 'Drinks', bread: 'Bread', protein: 'Protein',
  dairy: 'Dairy', fruit: 'Fruit', snacks: 'Snacks',
};

const CATEGORY_MAP: Record<string, string[]> = {
  drinks: ['drinks'],
  bread: ['bread', 'toppings'],
  protein: ['meat', 'fish'],
  dairy: ['dairy', 'brands'],
  fruit: ['fruit', 'vegetables'],
  snacks: ['snacks', 'sweets', 'brands'],
};

export default function FoodSearchScreen({ onDone, onCancel }: FoodSearchScreenProps) {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodEntry[]>([]);
  const [onlineResults, setOnlineResults] = useState<FoodEntry[]>([]);
  const [searchingOnline, setSearchingOnline] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItems, setSelectedItems] = useState<AnalyzedFoodItem[]>([]);
  const [customProducts, setCustomProducts] = useState<FoodEntry[]>([]);
  const [communityProducts, setCommunityProducts] = useState<FoodEntry[]>([]);
  const [favorites, setFavorites] = useState<SavedFavorite[]>([]);
  const [savingFav, setSavingFav] = useState(false);
  const [showSaveFavInput, setShowSaveFavInput] = useState(false);
  const [favName, setFavName] = useState('');
  const [showCommunityForm, setShowCommunityForm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const onlineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onlineController = useRef<AbortController | null>(null);
  const onlineRequestId = useRef(0);

  const labels = language === 'de' ? CATEGORY_LABELS_DE : CATEGORY_LABELS_EN;

  const loadCommunityProducts = useCallback(async () => {
    const { data } = await supabase
      .from('community_products')
      .select('food_name, quantity, unit, calories, protein_g, fat_g, carbs_g, contributor_display_name, contributor_avatar_emoji, brand, store')
      .eq('is_hidden', false)
      .order('verified_count', { ascending: false })
      .limit(200);
    if (data) {
      setCommunityProducts((data as any[]).map(e => ({
        name: e.food_name,
        name_en: e.food_name,
        quantity: Number(e.quantity) || 100,
        unit: e.unit || 'g',
        calories: Number(e.calories) || 0,
        protein_g: Number(e.protein_g) || 0,
        fat_g: Number(e.fat_g) || 0,
        carbs_g: Number(e.carbs_g) || 0,
        category: 'community',
        communityContributor: `${e.contributor_avatar_emoji || '😊'} ${e.contributor_display_name}`,
        communityBrand: e.brand,
        communityStore: e.store,
      })));
    }
  }, []);

  // Load custom products + favorites + community
  useEffect(() => {
    if (!user) return;
    supabase
      .from('custom_products')
      .select('food_name, default_quantity, default_unit, calories, protein_g, fat_g, carbs_g')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (!data) return;
        setCustomProducts(data.map(e => ({
          name: e.food_name, name_en: e.food_name,
          quantity: Number(e.default_quantity) || 100, unit: e.default_unit || 'g',
          calories: Number(e.calories) || 0, protein_g: Number(e.protein_g) || 0,
          fat_g: Number(e.fat_g) || 0, carbs_g: Number(e.carbs_g) || 0,
          category: 'custom',
        })));
      });
    supabase
      .from('saved_recipes')
      .select('id, name, emoji, meal_type, total_calories, total_protein_g, total_fat_g, total_carbs_g, use_count')
      .eq('user_id', user.id)
      .order('use_count', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setFavorites((data || []) as SavedFavorite[]);
      });
    loadCommunityProducts();
  }, [user, loadCommunityProducts]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (onlineTimer.current) clearTimeout(onlineTimer.current);
      onlineController.current?.abort();
    };
  }, []);

  const performSearch = useCallback((q: string, category: string, online: FoodEntry[] = []) => {
    const trimmed = q.trim();
    if (!trimmed && category === 'all') {
      setResults([]);
      return;
    }

    let dbResults = trimmed ? searchFoods(trimmed, language as 'de' | 'en') : [];

    if (!trimmed && category !== 'all') {
      const cats = CATEGORY_MAP[category] || [];
      dbResults = foodDatabase
        .filter(e => cats.some(c => e.category.toLowerCase().includes(c)))
        .slice(0, 20);
    }

    if (trimmed && category !== 'all') {
      const cats = CATEGORY_MAP[category] || [];
      dbResults = dbResults.filter(e => cats.some(c => e.category.toLowerCase().includes(c)));
    }

    const norm = trimmed.toLowerCase();
    const customMatches = norm
      ? customProducts.filter(e => e.name.toLowerCase().includes(norm) || e.name_en.toLowerCase().includes(norm))
      : [];

    // Community products search
    const communityMatches = norm
      ? communityProducts.filter(e => e.name.toLowerCase().includes(norm) || (e as any).communityBrand?.toLowerCase().includes(norm))
      : [];

    const merged = [...customMatches, ...dbResults, ...communityMatches, ...online];
    const seen = new Set<string>();
    const deduped = merged.filter(e => {
      const key = `${e.name.toLowerCase()}|${e.unit}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 25);

    setResults(deduped);
  }, [language, customProducts, communityProducts]);

  const triggerOnlineSearch = useCallback((q: string) => {
    if (onlineTimer.current) clearTimeout(onlineTimer.current);
    onlineController.current?.abort();

    if (q.trim().length < 3) {
      setOnlineResults([]);
      setSearchingOnline(false);
      return;
    }

    setSearchingOnline(true);
    const id = ++onlineRequestId.current;

    onlineTimer.current = setTimeout(async () => {
      const ctrl = new AbortController();
      onlineController.current = ctrl;
      try {
        const res = await searchOpenFoodFacts(q.trim(), language as 'de' | 'en', { signal: ctrl.signal });
        if (id !== onlineRequestId.current) return;
        setOnlineResults(res);
        performSearch(q, selectedCategory, res);
      } finally {
        if (id === onlineRequestId.current) {
          setSearchingOnline(false);
          onlineController.current = null;
        }
      }
    }, 400);
  }, [language, performSearch, selectedCategory]);

  useEffect(() => {
    performSearch(query, selectedCategory, onlineResults);
    if (query.trim().length >= 3) {
      triggerOnlineSearch(query);
    }
  }, [query, selectedCategory]);

  const addItem = (food: FoodEntry) => {
    hapticFeedback('light');
    const name = language === 'de' ? food.name : food.name_en;
    setSelectedItems(prev => [...prev, {
      food_name: name,
      quantity: food.quantity,
      unit: food.unit,
      calories: food.calories,
      protein_g: food.protein_g,
      fat_g: food.fat_g,
      carbs_g: food.carbs_g,
      confidence_score: 1,
    }]);
  };

  const removeItem = (index: number) => {
    hapticFeedback('light');
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelectFavorite = async (fav: SavedFavorite) => {
    hapticFeedback('success');
    const { data: itemsData } = await supabase
      .from('saved_recipe_items')
      .select('*')
      .eq('recipe_id', fav.id);
    if (!itemsData || itemsData.length === 0) {
      toast.error(language === 'de' ? 'Favorit ist leer' : 'Favorite is empty');
      return;
    }
    // Increment use count
    await supabase.from('saved_recipes').update({ use_count: (fav.use_count || 0) + 1 } as any).eq('id', fav.id);
    
    const newItems: AnalyzedFoodItem[] = (itemsData as any[]).map(item => ({
      food_name: item.food_name,
      quantity: Number(item.quantity),
      unit: item.unit,
      calories: Number(item.calories),
      protein_g: Number(item.protein_g),
      fat_g: Number(item.fat_g),
      carbs_g: Number(item.carbs_g),
      confidence_score: 1,
    }));
    setSelectedItems(prev => [...prev, ...newItems]);
  };

  const handleSaveAsFavorite = async () => {
    if (!user || selectedItems.length === 0) return;
    setSavingFav(true);
    const name = favName.trim() || selectedItems.map(i => i.food_name).filter(Boolean).slice(0, 3).join(', ') || 'Favorit';
    const success = await saveAsRecipe({
      userId: user.id,
      name,
      emoji: '⭐',
      mealType: 'snack',
      items: selectedItems,
    });
    setSavingFav(false);
    setShowSaveFavInput(false);
    setFavName('');
    if (success) {
      hapticFeedback('success');
      toast.success(language === 'de' ? 'Als Favorit gespeichert! ⭐' : 'Saved as favorite! ⭐');
      // Reload favorites
      const { data } = await supabase
        .from('saved_recipes')
        .select('id, name, emoji, meal_type, total_calories, total_protein_g, total_fat_g, total_carbs_g, use_count')
        .eq('user_id', user.id)
        .order('use_count', { ascending: false })
        .limit(50);
      setFavorites((data || []) as SavedFavorite[]);
    } else {
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Failed to save');
    }
  };

  // Filter favorites by search query
  const filteredFavorites = query.trim()
    ? favorites.filter(f => f.name.toLowerCase().includes(query.trim().toLowerCase()))
    : favorites;

  const totalCal = selectedItems.reduce((s, i) => s + i.calories, 0);
  const totalP = selectedItems.reduce((s, i) => s + i.protein_g, 0);
  const totalF = selectedItems.reduce((s, i) => s + i.fat_g, 0);
  const totalC = selectedItems.reduce((s, i) => s + i.carbs_g, 0);

  const showFavorites = filteredFavorites.length > 0 && selectedCategory === 'all';

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="p-1.5 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <h2 className="font-bold text-lg flex-1">
          {language === 'de' ? 'Lebensmittel suchen' : 'Search Food'}
        </h2>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={language === 'de' ? 'z.B. Haferflocken, Cappuccino, Reis...' : 'e.g. Oats, Cappuccino, Rice...'}
          className="pl-10 h-12 rounded-2xl text-base bg-card border-border"
          autoFocus
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat.key
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card border-border text-foreground hover:border-primary/30'
            }`}
          >
            <span>{cat.emoji}</span>
            {labels[cat.key]}
          </motion.button>
        ))}
      </div>

      {/* Favorites section */}
      {showFavorites && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 px-1">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              {language === 'de' ? 'Favoriten' : 'Favorites'}
            </span>
          </div>
          <div className="space-y-1.5">
            {filteredFavorites.slice(0, query.trim() ? 10 : 3).map((fav) => (
              <motion.button
                key={fav.id}
                type="button"
                onClick={() => handleSelectFavorite(fav)}
                className="w-full text-left px-3.5 py-3 rounded-xl bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/10 transition-all flex items-center gap-3 active:scale-[0.98]"
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg">{fav.emoji}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate block">{fav.name}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <span className="text-protein">{Math.round(fav.total_protein_g)}P</span>{' '}
                    <span className="text-fat">{Math.round(fav.total_fat_g)}F</span>{' '}
                    <span className="text-carbs">{Math.round(fav.total_carbs_g)}C</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Flame className="h-3 w-3 text-energy" />
                  <span className="text-sm font-bold tabular-nums text-foreground">{Math.round(fav.total_calories)}</span>
                  <span className="text-[10px] text-muted-foreground">kcal</span>
                  <div className="w-7 h-7 rounded-full bg-amber-500/15 flex items-center justify-center ml-1">
                    <Plus className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-1.5 max-h-[40vh] overflow-y-auto rounded-2xl">
        {results.length === 0 && !searchingOnline && query.trim().length > 0 && filteredFavorites.length === 0 && (
          <div className="text-center py-6 space-y-3">
            <p className="text-muted-foreground text-sm">
              {language === 'de' ? 'Keine Ergebnisse gefunden' : 'No results found'}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl"
              onClick={() => setShowCommunityForm(true)}
            >
              <Users className="h-3.5 w-3.5 mr-1.5" />
              {language === 'de' ? 'Zur Community hinzufügen' : 'Add to Community'}
            </Button>
          </div>
        )}

        {results.length === 0 && !query.trim() && selectedCategory === 'all' && favorites.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            {language === 'de' ? 'Tippe einen Namen ein oder wähle eine Kategorie' : 'Type a name or select a category'}
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {results.map((food, i) => {
            const name = language === 'de' ? food.name : food.name_en;
            const isOnline = food.category === 'openfoodfacts';
            const isCustom = food.category === 'custom';
            const isCommunity = food.category === 'community';

            return (
              <motion.button
                key={`${name}-${food.unit}-${i}`}
                type="button"
                onClick={() => addItem(food)}
                className="w-full text-left px-3.5 py-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-accent/30 transition-all flex items-center gap-3 active:scale-[0.98]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.2) }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {isOnline && <Globe className="h-3 w-3 text-muted-foreground shrink-0" />}
                    {isCustom && <span className="text-[10px] bg-primary/10 text-primary px-1 rounded shrink-0">★</span>}
                    <span className="text-sm font-semibold text-foreground truncate">{name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {food.quantity} {food.unit} · P:{food.protein_g}g F:{food.fat_g}g C:{food.carbs_g}g
                    {food.matchedAlias && (
                      <span className="ml-1 italic text-primary/60">
                        ({language === 'de' ? `auch: ${food.matchedAlias}` : `aka: ${food.matchedAlias}`})
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold tabular-nums text-foreground">{food.calories}</span>
                  <span className="text-[10px] text-muted-foreground">kcal</span>
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="h-3.5 w-3.5 text-primary" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {searchingOnline && (
          <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {language === 'de' ? 'Suche online...' : 'Searching online...'}
          </div>
        )}
      </div>

      {/* Selected items basket */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div
            className="nutri-card-highlight space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {language === 'de' ? `${selectedItems.length} ausgewählt` : `${selectedItems.length} selected`}
              </h3>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-0.5"><Flame className="h-3 w-3 text-energy" />{Math.round(totalCal)}</span>
                <span className="text-protein">{Math.round(totalP)}P</span>
                <span className="text-fat">{Math.round(totalF)}F</span>
                <span className="text-carbs">{Math.round(totalC)}C</span>
              </div>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {selectedItems.map((item, i) => (
                <motion.div
                  key={`sel-${i}`}
                  className="flex items-center justify-between py-1.5 px-1 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <span className="truncate flex-1 font-medium">{item.food_name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">{item.quantity} {item.unit}</span>
                    <button
                      onClick={() => removeItem(i)}
                      className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                    >
                      <Minus className="h-3 w-3 text-destructive" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Save as favorite inline */}
            {selectedItems.length >= 1 && user && (
              <AnimatePresence>
                {showSaveFavInput ? (
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
                    <Button
                      size="sm"
                      onClick={handleSaveAsFavorite}
                      disabled={savingFav}
                      className="rounded-xl h-9 px-3 bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      {savingFav ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Star className="h-3.5 w-3.5 fill-white" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setShowSaveFavInput(false); setFavName(''); }}
                      className="rounded-xl h-9 px-2"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setShowSaveFavInput(true)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all active:scale-[0.98]"
                  >
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    {language === 'de' ? 'Als Favorit speichern' : 'Save as Favorite'}
                  </motion.button>
                )}
              </AnimatePresence>
            )}

            <Button
              onClick={() => onDone(selectedItems)}
              className="w-full rounded-xl h-11 font-bold text-base"
            >
              {language === 'de' ? 'Weiter zur Überprüfung' : 'Continue to Review'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
