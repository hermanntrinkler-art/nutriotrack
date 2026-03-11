import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import type { AnalyzedFoodItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Loader2, Users, Check } from 'lucide-react';
import { toast } from 'sonner';
import EditableFoodItemsList from '@/components/meals/EditableFoodItemsList';
import FoodItemEditorModal from '@/components/meals/FoodItemEditorModal';

export default function EditMealPage() {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mealType, setMealType] = useState('');
  const [items, setItems] = useState<AnalyzedFoodItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [sharedIndices, setSharedIndices] = useState<Set<number>>(new Set());
  const [sharingIndex, setSharingIndex] = useState<number | null>(null);

  const mealEmojis: Record<string, string> = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };

  useEffect(() => {
    if (!id || !user) return;
    loadMeal();
  }, [id, user]);

  const loadMeal = async () => {
    if (!id) return;
    const { data: meal } = await supabase.from('meal_entries').select('*').eq('id', id).single();
    if (!meal) { navigate('/dashboard'); return; }
    setMealType((meal as any).meal_type);

    const { data: foodItems } = await supabase.from('meal_food_items').select('*').eq('meal_entry_id', id);
    const mappedItems = (foodItems || []).map((fi: any) => ({
      food_name: fi.food_name,
      quantity: Number(fi.quantity) || 0,
      unit: fi.unit || 'g',
      calories: Number(fi.calories) || 0,
      protein_g: Number(fi.protein_g) || 0,
      fat_g: Number(fi.fat_g) || 0,
      carbs_g: Number(fi.carbs_g) || 0,
      confidence_score: Number(fi.confidence_score) || 1,
      vitamin_a_ug: Number(fi.vitamin_a_ug) || 0,
      vitamin_b1_mg: Number(fi.vitamin_b1_mg) || 0,
      vitamin_b2_mg: Number(fi.vitamin_b2_mg) || 0,
      vitamin_b6_mg: Number(fi.vitamin_b6_mg) || 0,
      vitamin_b12_ug: Number(fi.vitamin_b12_ug) || 0,
      vitamin_c_mg: Number(fi.vitamin_c_mg) || 0,
      vitamin_d_ug: Number(fi.vitamin_d_ug) || 0,
      vitamin_e_mg: Number(fi.vitamin_e_mg) || 0,
      vitamin_k_ug: Number(fi.vitamin_k_ug) || 0,
      folate_ug: Number(fi.folate_ug) || 0,
      iron_mg: Number(fi.iron_mg) || 0,
      potassium_mg: Number(fi.potassium_mg) || 0,
      calcium_mg: Number(fi.calcium_mg) || 0,
      magnesium_mg: Number(fi.magnesium_mg) || 0,
      sodium_mg: Number(fi.sodium_mg) || 0,
      phosphorus_mg: Number(fi.phosphorus_mg) || 0,
      zinc_mg: Number(fi.zinc_mg) || 0,
      barcode: fi.barcode || undefined,
    }));

    // Recover missing barcodes from custom_products for old meals
    if (user) {
      for (const item of mappedItems) {
        if (!item.barcode && item.food_name) {
          const { data: cp } = await supabase
            .from('custom_products')
            .select('barcode')
            .eq('user_id', user.id)
            .eq('food_name', item.food_name)
            .limit(1)
            .maybeSingle();
          if (cp?.barcode) {
            item.barcode = cp.barcode;
          }
        }
      }
    }

    setItems(mappedItems);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!id || !user || items.length === 0) return;
    setSaving(true);

    const totalCalories = items.reduce((s, i) => s + Number(i.calories), 0);
    const totalProtein = items.reduce((s, i) => s + Number(i.protein_g), 0);
    const totalFat = items.reduce((s, i) => s + Number(i.fat_g), 0);
    const totalCarbs = items.reduce((s, i) => s + Number(i.carbs_g), 0);

    // Update meal entry totals
    await supabase.from('meal_entries').update({
      total_calories: totalCalories,
      total_protein_g: totalProtein,
      total_fat_g: totalFat,
      total_carbs_g: totalCarbs,
    } as any).eq('id', id);

    // Delete old food items and insert new ones
    await supabase.from('meal_food_items').delete().eq('meal_entry_id', id);
    const foodItems = items.map(item => ({
      meal_entry_id: id,
      food_name: item.food_name,
      quantity: item.quantity,
      unit: item.unit,
      calories: item.calories,
      protein_g: item.protein_g,
      fat_g: item.fat_g,
      carbs_g: item.carbs_g,
      confidence_score: item.confidence_score,
      was_user_edited: true,
      vitamin_a_ug: item.vitamin_a_ug || 0,
      vitamin_b1_mg: item.vitamin_b1_mg || 0,
      vitamin_b2_mg: item.vitamin_b2_mg || 0,
      vitamin_b6_mg: item.vitamin_b6_mg || 0,
      vitamin_b12_ug: item.vitamin_b12_ug || 0,
      vitamin_c_mg: item.vitamin_c_mg || 0,
      vitamin_d_ug: item.vitamin_d_ug || 0,
      vitamin_e_mg: item.vitamin_e_mg || 0,
      vitamin_k_ug: item.vitamin_k_ug || 0,
      folate_ug: item.folate_ug || 0,
      iron_mg: item.iron_mg || 0,
      potassium_mg: item.potassium_mg || 0,
      calcium_mg: item.calcium_mg || 0,
      magnesium_mg: item.magnesium_mg || 0,
      sodium_mg: item.sodium_mg || 0,
      phosphorus_mg: item.phosphorus_mg || 0,
      zinc_mg: item.zinc_mg || 0,
      barcode: item.barcode || null,
    }));
    await supabase.from('meal_food_items').insert(foodItems as any);

    toast.success(t('meals.saved'));
    setSaving(false);
    navigate('/dashboard');
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    await supabase.from('meal_food_items').delete().eq('meal_entry_id', id);
    await supabase.from('meal_entries').delete().eq('id', id);
    toast.success(t('common.delete'));
    setDeleting(false);
    navigate('/dashboard');
  };

  const handleShareToCommunity = async (index: number) => {
    if (!user || !profile) return;
    const item = items[index];
    if (!item.food_name) return;
    setSharingIndex(index);

    // 1. Update/insert community product
    const { error } = await supabase.from('community_products').insert({
      contributor_id: user.id,
      contributor_display_name: profile.display_name || profile.name || 'Anonym',
      contributor_avatar_emoji: profile.avatar_emoji || '😊',
      food_name: item.food_name,
      quantity: item.quantity,
      unit: item.unit,
      calories: item.calories,
      protein_g: item.protein_g,
      fat_g: item.fat_g,
      carbs_g: item.carbs_g,
      barcode: item.barcode || null,
      vitamin_a_ug: item.vitamin_a_ug || 0,
      vitamin_b1_mg: item.vitamin_b1_mg || 0,
      vitamin_b2_mg: item.vitamin_b2_mg || 0,
      vitamin_b6_mg: item.vitamin_b6_mg || 0,
      vitamin_b12_ug: item.vitamin_b12_ug || 0,
      vitamin_c_mg: item.vitamin_c_mg || 0,
      vitamin_d_ug: item.vitamin_d_ug || 0,
      vitamin_e_mg: item.vitamin_e_mg || 0,
      vitamin_k_ug: item.vitamin_k_ug || 0,
      folate_ug: item.folate_ug || 0,
      iron_mg: item.iron_mg || 0,
      potassium_mg: item.potassium_mg || 0,
      calcium_mg: item.calcium_mg || 0,
      magnesium_mg: item.magnesium_mg || 0,
      sodium_mg: item.sodium_mg || 0,
      phosphorus_mg: item.phosphorus_mg || 0,
      zinc_mg: item.zinc_mg || 0,
    });

    // 2. Also update the personal custom_product so scanning returns updated values
    if (item.barcode) {
      await supabase.from('custom_products').update({
        food_name: item.food_name,
        calories: Number(item.calories) || 0,
        protein_g: Number(item.protein_g) || 0,
        fat_g: Number(item.fat_g) || 0,
        carbs_g: Number(item.carbs_g) || 0,
        default_quantity: Number(item.quantity) || 100,
        default_unit: item.unit || 'g',
      } as any).eq('user_id', user.id).eq('barcode', item.barcode);
    }

    if (error) {
      toast.error(t('common.error'));
    } else {
      toast.success('👥 Zur Community geteilt!');
      setSharedIndices(prev => new Set(prev).add(index));
    }
    setSharingIndex(null);
  };

  const mealTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      breakfast: t('meals.breakfast'), lunch: t('meals.lunch'),
      dinner: t('meals.dinner'), snack: t('meals.snack'),
    };
    return map[type] || type;
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="page-container space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/dashboard')} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xl">{mealEmojis[mealType] || '🍽️'}</span>
          <h1 className="text-xl font-bold">{mealTypeLabel(mealType)} {t('common.edit').toLowerCase()}</h1>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
        >
          {deleting ? <Loader2 className="h-5 w-5 animate-spin text-destructive" /> : <Trash2 className="h-5 w-5 text-destructive" />}
        </button>
      </div>

      <EditableFoodItemsList
        items={items}
        isAiResult={false}
        onUpdateItem={(index, field, value) => {
          setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
        }}
        onRemoveItem={(index) => setItems(prev => prev.filter((_, i) => i !== index))}
        onAddItem={() => {
          setItems(prev => [...prev, { food_name: '', quantity: 100, unit: 'g', calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, confidence_score: 1 }]);
          setEditingIndex(items.length);
        }}
        onEditItem={(index) => setEditingIndex(index)}
      />

      {/* Share to Community buttons */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">👥 Zur Community teilen</p>
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
            <span className="text-sm truncate flex-1">{item.food_name || '—'}</span>
            <button
              onClick={() => handleShareToCommunity(index)}
              disabled={sharedIndices.has(index) || sharingIndex === index || !item.food_name}
              className="ml-2 p-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50"
            >
              {sharingIndex === index ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : sharedIndices.has(index) ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Users className="h-4 w-4 text-primary" />
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="nutri-card-highlight">
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div>
            <p className="font-bold text-foreground">{Math.round(items.reduce((s, i) => s + Number(i.calories), 0))}</p>
            <p className="text-xs text-muted-foreground">{t('dashboard.kcal')}</p>
          </div>
          <div>
            <p className="font-bold text-protein">{Math.round(items.reduce((s, i) => s + Number(i.protein_g), 0))}g</p>
            <p className="text-xs text-muted-foreground">{t('dashboard.protein')}</p>
          </div>
          <div>
            <p className="font-bold text-fat">{Math.round(items.reduce((s, i) => s + Number(i.fat_g), 0))}g</p>
            <p className="text-xs text-muted-foreground">{t('dashboard.fat')}</p>
          </div>
          <div>
            <p className="font-bold text-carbs">{Math.round(items.reduce((s, i) => s + Number(i.carbs_g), 0))}g</p>
            <p className="text-xs text-muted-foreground">{t('dashboard.carbs')}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
          {t('common.cancel')}
        </Button>
        <Button onClick={handleSave} className="flex-1" disabled={saving || items.length === 0 || items.some(i => !i.food_name)}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
          {t('common.save')}
        </Button>
      </div>

      <FoodItemEditorModal
        item={editingIndex !== null ? items[editingIndex] : null}
        open={editingIndex !== null}
        onClose={() => setEditingIndex(null)}
        onSave={(updatedItem) => {
          if (editingIndex !== null) {
            setItems(prev => prev.map((item, i) => i === editingIndex ? updatedItem : item));
          }
          setEditingIndex(null);
        }}
      />
    </div>
  );
}
