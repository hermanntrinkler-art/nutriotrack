import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import type { AnalyzedFoodItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import EditableFoodItemsList from '@/components/meals/EditableFoodItemsList';
import FoodItemEditorModal from '@/components/meals/FoodItemEditorModal';

export default function EditMealPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mealType, setMealType] = useState('');
  const [items, setItems] = useState<AnalyzedFoodItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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
    setItems((foodItems || []).map((fi: any) => ({
      food_name: fi.food_name,
      quantity: Number(fi.quantity) || 0,
      unit: fi.unit || 'g',
      calories: Number(fi.calories) || 0,
      protein_g: Number(fi.protein_g) || 0,
      fat_g: Number(fi.fat_g) || 0,
      carbs_g: Number(fi.carbs_g) || 0,
      confidence_score: Number(fi.confidence_score) || 1,
    })));
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
        <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
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

      {/* Totals */}
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
        <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
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
