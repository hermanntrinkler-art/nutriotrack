import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { analyzeFoodImage } from '@/lib/ai-analysis';
import type { AnalyzedFoodItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Camera, Upload, PenLine } from 'lucide-react';
import { toast } from 'sonner';

import AnalyseScreen from '@/components/meals/AnalyseScreen';
import EditableFoodItemsList from '@/components/meals/EditableFoodItemsList';
import FoodItemEditorModal from '@/components/meals/FoodItemEditorModal';
import SaveMealConfirmation from '@/components/meals/SaveMealConfirmation';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
type Step = 'select-type' | 'select-method' | 'analyzing' | 'review' | 'confirm';

export default function MealsPage() {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>('select-type');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [items, setItems] = useState<AnalyzedFoodItem[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isAiResult, setIsAiResult] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const mealTypes: { value: MealType; label: string; emoji: string }[] = [
    { value: 'breakfast', label: t('meals.breakfast'), emoji: '🌅' },
    { value: 'lunch', label: t('meals.lunch'), emoji: '☀️' },
    { value: 'dinner', label: t('meals.dinner'), emoji: '🌙' },
    { value: 'snack', label: t('meals.snack'), emoji: '🍎' },
  ];

  const currentMealType = mealTypes.find(m => m.value === mealType);

  const handleImageUpload = async (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setStep('analyzing');
    setIsAiResult(true);

    try {
      const results = await analyzeFoodImage(file, language);
      if (results.length === 0) {
        toast.error(t('meals.analysisFailed'));
        handleManualEntry();
        return;
      }
      setItems(results);
      setStep('review');
    } catch (err: any) {
      if (err.message === 'RATE_LIMIT') {
        toast.error(t('meals.rateLimited'));
      } else if (err.message === 'PAYMENT_REQUIRED') {
        toast.error(t('meals.paymentRequired'));
      } else {
        toast.error(t('meals.analysisFailed'));
      }
      // Fall back to manual entry with the image still attached
      handleManualEntry();
    }
  };

  const handleTakePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleImageUpload(file);
    };
    input.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleManualEntry = () => {
    setIsAiResult(false);
    const emptyItem: AnalyzedFoodItem = { food_name: '', quantity: 100, unit: 'g', calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, confidence_score: 1 };
    setItems([emptyItem]);
    setStep('review');
    setEditingIndex(0); // Immediately open editor for the first item
  };

  const updateItem = (index: number, field: keyof AnalyzedFoodItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value, confidence_score: 1 } : item));
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems(prev => [...prev, { food_name: '', quantity: 100, unit: 'g', calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, confidence_score: 1 }]);
    setEditingIndex(items.length);
  };

  const handleEditItem = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEditedItem = (updatedItem: AnalyzedFoodItem) => {
    if (editingIndex !== null) {
      setItems(prev => prev.map((item, i) => i === editingIndex ? updatedItem : item));
    }
    setEditingIndex(null);
  };

  const handleSave = async () => {
    if (!user || items.length === 0) return;
    setSaving(true);

    let imageUrl: string | null = null;
    if (imageFile) {
      const path = `${user.id}/${Date.now()}-${imageFile.name}`;
      const { data } = await supabase.storage.from('meal-images').upload(path, imageFile);
      if (data) {
        const { data: urlData } = supabase.storage.from('meal-images').getPublicUrl(data.path);
        imageUrl = urlData.publicUrl;
      }
    }

    const totalCalories = items.reduce((s, i) => s + Number(i.calories), 0);
    const totalProtein = items.reduce((s, i) => s + Number(i.protein_g), 0);
    const totalFat = items.reduce((s, i) => s + Number(i.fat_g), 0);
    const totalCarbs = items.reduce((s, i) => s + Number(i.carbs_g), 0);

    const now = new Date();
    const { data: mealData, error: mealError } = await supabase.from('meal_entries').insert({
      user_id: user.id,
      entry_date: now.toISOString().split('T')[0],
      entry_time: now.toTimeString().split(' ')[0],
      meal_type: mealType,
      image_url: imageUrl,
      total_calories: totalCalories,
      total_protein_g: totalProtein,
      total_fat_g: totalFat,
      total_carbs_g: totalCarbs,
      ai_analysis_status: isAiResult ? 'completed' : 'manual',
    } as any).select().single();

    if (mealError || !mealData) {
      toast.error(t('common.error'));
      setSaving(false);
      return;
    }

    const foodItems = items.map(item => ({
      meal_entry_id: (mealData as any).id,
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
    handleReset();
  };

  const handleReset = () => {
    setStep('select-type');
    setItems([]);
    setImageFile(null);
    setImagePreview(null);
    setIsAiResult(false);
    setEditingIndex(null);
  };

  return (
    <div className="page-container space-y-4">
      <h1 className="text-xl font-bold">{t('meals.title')}</h1>

      {/* Step: Select meal type */}
      {step === 'select-type' && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-sm text-muted-foreground">{t('meals.selectType')}</p>
          <div className="grid grid-cols-2 gap-3">
            {mealTypes.map(mt => (
              <button
                key={mt.value}
                onClick={() => { setMealType(mt.value); setStep('select-method'); }}
                className="nutri-card flex flex-col items-center gap-2 py-6 hover:border-primary/30 transition-colors"
              >
                <span className="text-3xl">{mt.emoji}</span>
                <span className="font-medium text-sm">{mt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Select method */}
      {step === 'select-method' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{currentMealType?.emoji}</span>
            <span className="font-medium">{currentMealType?.label}</span>
          </div>

          <button onClick={handleTakePhoto} className="nutri-card w-full flex items-center gap-4 py-5 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">{t('meals.takePhoto')}</p>
              <p className="text-xs text-muted-foreground">{t('meals.aiDescription')}</p>
            </div>
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="nutri-card w-full flex items-center gap-4 py-5 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-info/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-info" />
            </div>
            <div className="text-left">
              <p className="font-medium">{t('meals.uploadImage')}</p>
              <p className="text-xs text-muted-foreground">{t('meals.aiDescription')}</p>
            </div>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

          <button onClick={handleManualEntry} className="nutri-card w-full flex items-center gap-4 py-5 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center">
              <PenLine className="h-6 w-6 text-warning" />
            </div>
            <div className="text-left">
              <p className="font-medium">{t('meals.manualEntry')}</p>
            </div>
          </button>

          <Button variant="ghost" onClick={handleReset} className="w-full">
            {t('meals.cancel')}
          </Button>
        </div>
      )}

      {/* Step: Analyzing */}
      {step === 'analyzing' && (
        <AnalyseScreen imagePreview={imagePreview} />
      )}

      {/* Step: Review */}
      {step === 'review' && (
        <div className="space-y-4 animate-fade-in">
          {/* Image preview if available */}
          {imagePreview && (
            <div className="w-full rounded-2xl overflow-hidden border border-border">
              <img src={imagePreview} alt="Meal" className="w-full h-40 object-cover" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xl">{currentMealType?.emoji}</span>
            <h2 className="font-semibold">{currentMealType?.label}</h2>
            {isAiResult && (
              <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">KI</span>
            )}
          </div>

          <EditableFoodItemsList
            items={items}
            isAiResult={isAiResult}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onAddItem={addItem}
            onEditItem={handleEditItem}
          />

          {/* Totals bar */}
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
            <Button variant="outline" onClick={handleReset} className="flex-1">
              {t('meals.cancel')}
            </Button>
            <Button onClick={() => setStep('confirm')} disabled={items.length === 0 || items.some(i => !i.food_name)} className="flex-1">
              {t('meals.confirmSave')}
            </Button>
          </div>
        </div>
      )}

      {/* Step: Confirmation */}
      {step === 'confirm' && (
        <SaveMealConfirmation
          items={items}
          mealTypeLabel={currentMealType?.label || ''}
          mealEmoji={currentMealType?.emoji || ''}
          imagePreview={imagePreview}
          saving={saving}
          onConfirm={handleSave}
          onCancel={() => setStep('review')}
        />
      )}

      {/* Editor Modal */}
      <FoodItemEditorModal
        item={editingIndex !== null ? items[editingIndex] : null}
        open={editingIndex !== null}
        onClose={() => setEditingIndex(null)}
        onSave={handleSaveEditedItem}
      />
    </div>
  );
}
