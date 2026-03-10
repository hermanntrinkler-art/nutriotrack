// Favoriten-Drawer FDDB-Style
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { searchFoods, foodDatabase, type FoodEntry } from '@/lib/food-database';
import { searchOpenFoodFacts } from '@/lib/openfoodfacts-search';
import type { AnalyzedFoodItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Search, Plus, Minus, Globe, Loader2, X, ArrowLeft, ChevronRight, Flame, Star, Users, ScanBarcode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hapticFeedback } from '@/lib/haptics';
import { toast } from 'sonner';
import CommunityProductForm from '@/components/CommunityProductForm';
import BottomCart from './BottomCart';
import FoodDetailDrawer from './FoodDetailDrawer';

interface FoodSearchScreenProps {
  onCancel: () => void;
  hideHeader?: boolean;
  onBarcodeScan?: () => void;
  // Direct save mode — no more review step
  onSave: (items: AnalyzedFoodItem[]) => void;
  saving: boolean;
  initialItems?: AnalyzedFoodItem[];
  isAiResult?: boolean;
  onEditItem?: (index: number, items: AnalyzedFoodItem[]) => void;
  /** When true, each added item immediately triggers onSave([item]) and closes */
  singleAddMode?: boolean;
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

export default function FoodSearchScreen({
  onCancel,
  hideHeader,
  onBarcodeScan,
  onSave,
  saving,
  initialItems,
  isAiResult,
  onEditItem,
  singleAddMode,
}: FoodSearchScreenProps) {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodEntry[]>([]);
  const [onlineResults, setOnlineResults] = useState<FoodEntry[]>([]);
  const [searchingOnline, setSearchingOnline] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItems, setSelectedItems] = useState<AnalyzedFoodItem[]>(initialItems || []);
  const [customProducts, setCustomProducts] = useState<FoodEntry[]>([]);
  const [communityProducts, setCommunityProducts] = useState<FoodEntry[]>([]);
  const [favorites, setFavorites] = useState<SavedFavorite[]>([]);
  const [showCommunityForm, setShowCommunityForm] = useState(false);
  const [cartExpanded, setCartExpanded] = useState((initialItems?.length || 0) > 0);
  const [detailFood, setDetailFood] = useState<FoodEntry | null>(null);
  const [portionFav, setPortionFav] = useState<SavedFavorite | null>(null);
  const [portionFavItems, setPortionFavItems] = useState<any[] | null>(null);
  const [portionAmount, setPortionAmount] = useState(0);
  const [portionOriginalTotal, setPortionOriginalTotal] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const onlineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onlineController = useRef<AbortController | null>(null);
  const onlineRequestId = useRef(0);

  const labels = language === 'de' ? CATEGORY_LABELS_DE : CATEGORY_LABELS_EN;

  // Sync initialItems when they change (e.g. AI results arriving)
  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setSelectedItems(initialItems);
      setCartExpanded(true);
    }
  }, [initialItems]);

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
        communityProductId: e.id,
      })));
    }
  }, []);

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
    const item: AnalyzedFoodItem = {
      food_name: name,
      quantity: food.quantity,
      unit: food.unit,
      calories: food.calories,
      protein_g: food.protein_g,
      fat_g: food.fat_g,
      carbs_g: food.carbs_g,
      confidence_score: 1,
    };
    // Auto-save immediately
    onSave([item]);
  };

  const removeItem = (index: number) => {
    hapticFeedback('light');
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const replaceItem = (index: number, newItem: AnalyzedFoodItem) => {
    setSelectedItems(prev => prev.map((item, i) => i === index ? { ...newItem, confidence_score: 1 } : item));
  };

  const handleSelectFavorite = async (fav: SavedFavorite) => {
    hapticFeedback('light');
    // Load items to compute total quantity
    const { data: itemsData } = await supabase
      .from('saved_recipe_items')
      .select('*')
      .eq('recipe_id', fav.id);
    if (!itemsData || itemsData.length === 0) {
      toast.error(language === 'de' ? 'Favorit ist leer' : 'Favorite is empty');
      return;
    }
    const totalQty = (itemsData as any[]).reduce((sum: number, item: any) => sum + (Number(item.quantity) || 0), 0);
    // Determine dominant unit
    const units = (itemsData as any[]).map((i: any) => i.unit || 'g');
    const hasMl = units.some((u: string) => u === 'ml');
    setPortionFavItems(itemsData);
    setPortionOriginalTotal(totalQty);
    setPortionAmount(100);
    setPortionFav({ ...fav, _unit: hasMl ? 'ml' : 'g' } as any);
  };

  const confirmFavoritePortion = async () => {
    if (!portionFav || !portionFavItems) return;
    const fav = portionFav;
    const itemsData = portionFavItems;
    setPortionFav(null);
    setPortionFavItems(null);
    hapticFeedback('success');

    await supabase.from('saved_recipes').update({ use_count: (fav.use_count || 0) + 1 } as any).eq('id', fav.id);
    
    const scale = portionOriginalTotal > 0 ? portionAmount / portionOriginalTotal : 1;
    const newItems: AnalyzedFoodItem[] = (itemsData as any[]).map(item => ({
      food_name: item.food_name,
      quantity: Math.round(Number(item.quantity) * scale * 10) / 10,
      unit: item.unit,
      calories: Math.round(Number(item.calories) * scale),
      protein_g: Math.round(Number(item.protein_g) * scale * 10) / 10,
      fat_g: Math.round(Number(item.fat_g) * scale * 10) / 10,
      carbs_g: Math.round(Number(item.carbs_g) * scale * 10) / 10,
      confidence_score: 1,
    }));
    // Auto-save immediately
    onSave(newItems);
  };

  const filteredFavorites = query.trim()
    ? favorites.filter(f => f.name.toLowerCase().includes(query.trim().toLowerCase()))
    : favorites;

  const showFavorites = filteredFavorites.length > 0 && selectedCategory === 'all';

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Header */}
      {!hideHeader && (
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="p-1.5 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <h2 className="font-bold text-lg flex-1">
            {language === 'de' ? 'Lebensmittel suchen' : 'Search Food'}
          </h2>
        </div>
      )}

      {/* Search input with barcode button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
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
        {onBarcodeScan && (
          <button
            onClick={onBarcodeScan}
            className="h-12 w-12 rounded-2xl border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors shrink-0"
            title={language === 'de' ? 'Barcode scannen' : 'Scan barcode'}
          >
            <ScanBarcode className="h-5 w-5 text-muted-foreground" />
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
      <div className={`space-y-1.5 overflow-y-auto rounded-2xl ${selectedItems.length > 0 ? 'max-h-[30vh]' : 'max-h-[40vh]'}`}>
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
                onClick={() => setDetailFood(food)}
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
                    {isCommunity && <Users className="h-3 w-3 text-primary shrink-0" />}
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
                  {isCommunity && (food as any).communityContributor && (
                    <p className="text-[10px] text-primary/70 mt-0.5">
                      👥 {(food as any).communityContributor}
                      {(food as any).communityStore && ` · ${(food as any).communityStore}`}
                    </p>
                  )}
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

      {/* Bottom Cart — hidden in singleAddMode */}
      <AnimatePresence>
        {selectedItems.length > 0 && !singleAddMode && (
          <BottomCart
            items={selectedItems}
            isAiResult={isAiResult || false}
            onRemoveItem={removeItem}
            onReplaceItem={replaceItem}
            onEditItem={(i) => onEditItem?.(i, selectedItems)}
            onSave={() => onSave(selectedItems)}
            saving={saving}
            expanded={cartExpanded}
            onToggleExpanded={() => setCartExpanded(prev => !prev)}
          />
        )}
      </AnimatePresence>

      {/* Food detail drawer */}
      <FoodDetailDrawer
        food={detailFood}
        open={detailFood !== null}
        onClose={() => setDetailFood(null)}
        onAdd={(item) => {
          hapticFeedback('light');
          onSave([item]);
        }}
        onShowCommunityForm={() => setShowCommunityForm(true)}
      />

      {/* Favorite portion picker — FDDB style */}
      <Drawer open={portionFav !== null} onOpenChange={v => { if (!v) { setPortionFav(null); setPortionFavItems(null); } }}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-left text-lg flex items-center gap-2">
              <span>{portionFav?.emoji || '⭐'}</span>
              <span className="truncate">{portionFav?.name}</span>
            </DrawerTitle>
          </DrawerHeader>
          {portionFav && (() => {
            const favUnit = (portionFav as any)._unit || 'g';
            const scale = portionOriginalTotal > 0 ? portionAmount / portionOriginalTotal : 1;
            const scaledCal = Math.round((portionFav.total_calories || 0) * scale);
            const scaledP = Math.round((portionFav.total_protein_g || 0) * scale * 10) / 10;
            const scaledF = Math.round((portionFav.total_fat_g || 0) * scale * 10) / 10;
            const scaledC = Math.round((portionFav.total_carbs_g || 0) * scale * 10) / 10;

            const step = portionAmount <= 20 ? 1 : portionAmount <= 100 ? 5 : 10;

            const presets: { label: string; qty: number }[] = [
              { label: `100 ${favUnit}`, qty: 100 },
              { label: `${language === 'de' ? 'Originalrezept' : 'Original recipe'} (${Math.round(portionOriginalTotal)} ${favUnit})`, qty: Math.round(portionOriginalTotal) },
            ];
            if (favUnit === 'ml') {
              presets.push({ label: `${language === 'de' ? 'Glas' : 'Glass'} (200 ml)`, qty: 200 });
              presets.push({ label: `${language === 'de' ? 'Portion' : 'Portion'} (250 ml)`, qty: 250 });
            } else {
              presets.push({ label: `${language === 'de' ? 'Portion' : 'Portion'} (150 g)`, qty: 150 });
              presets.push({ label: `${language === 'de' ? 'Große Portion' : 'Large portion'} (250 g)`, qty: 250 });
            }

            return (
              <div className="px-4 pb-6 space-y-4">
                {/* Macro grid */}
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="py-3 rounded-xl bg-muted">
                    <p className="text-xl font-black tabular-nums text-foreground">{scaledCal}</p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">kcal</p>
                  </div>
                  <div className="py-3 rounded-xl bg-muted">
                    <p className="text-xl font-black tabular-nums text-fat">{scaledF}g</p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{language === 'de' ? 'Fett' : 'Fat'}</p>
                  </div>
                  <div className="py-3 rounded-xl bg-muted">
                    <p className="text-xl font-black tabular-nums text-carbs">{scaledC}g</p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{language === 'de' ? 'KH' : 'Carbs'}</p>
                  </div>
                  <div className="py-3 rounded-xl bg-muted">
                    <p className="text-xl font-black tabular-nums text-protein">{scaledP}g</p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Protein</p>
                  </div>
                </div>

                {/* Quantity stepper */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPortionAmount(prev => Math.max(step, prev - step))}
                    className="w-10 h-10 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors active:scale-95 shrink-0"
                  >
                    <Minus className="h-4 w-4 text-foreground" />
                  </button>
                  <Input
                    type="number"
                    value={portionAmount}
                    onChange={e => setPortionAmount(Math.max(1, Number(e.target.value)))}
                    className="h-11 text-center text-lg font-bold rounded-xl flex-1"
                    min={1}
                    autoFocus
                  />
                  <span className="text-sm font-medium text-muted-foreground min-w-[30px] text-center shrink-0">{favUnit}</span>
                  <button
                    onClick={() => setPortionAmount(prev => prev + step)}
                    className="w-10 h-10 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors active:scale-95 shrink-0"
                  >
                    <Plus className="h-4 w-4 text-foreground" />
                  </button>
                </div>

                {/* Add button */}
                <Button onClick={confirmFavoritePortion} className="w-full h-12 rounded-xl font-bold text-base" disabled={portionAmount <= 0}>
                  <Plus className="h-4 w-4 mr-1" />
                  {language === 'de' ? 'Eintragen' : 'Add'}
                </Button>

                {/* Quick presets */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    {language === 'de' ? 'Schneller Eintrag' : 'Quick Entry'}
                  </p>
                  <div className="space-y-1.5">
                    {presets.map((preset, i) => {
                      const pScale = portionOriginalTotal > 0 ? preset.qty / portionOriginalTotal : 1;
                      const pCal = Math.round((portionFav.total_calories || 0) * pScale);
                      const pF = Math.round((portionFav.total_fat_g || 0) * pScale * 10) / 10;
                      const pC = Math.round((portionFav.total_carbs_g || 0) * pScale * 10) / 10;
                      const pP = Math.round((portionFav.total_protein_g || 0) * pScale * 10) / 10;
                      return (
                        <button
                          key={i}
                          onClick={() => setPortionAmount(preset.qty)}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-accent/30 transition-all active:scale-[0.98]"
                        >
                          <div className="text-left">
                            <span className="text-sm font-semibold text-foreground">{preset.label}</span>
                            <p className="text-[11px] text-muted-foreground">
                              {pCal} kcal · {pF}g F · {pC}g KH · {pP}g P
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
              </div>
            );
          })()}
        </DrawerContent>
      </Drawer>

      {/* Community product form */}
      {showCommunityForm && (
        <CommunityProductForm
          onClose={() => setShowCommunityForm(false)}
          onSaved={() => {
            setShowCommunityForm(false);
            loadCommunityProducts();
          }}
          prefillName={query.trim()}
        />
      )}
    </div>
  );
}
