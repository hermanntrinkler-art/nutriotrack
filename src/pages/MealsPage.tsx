import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { analyzeFoodImage } from '@/lib/mock-ai';
import type { AnalyzedFoodItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload, PenLine, Plus, Trash2, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
type Step = 'select-type' | 'select-method' | 'analyzing' | 'review' | 'manual';

export default function MealsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>('select-type');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [items, setItems] = useState<AnalyzedFoodItem[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const mealTypes: { value: MealType; label: string; emoji: string }[] = [
    { value: 'breakfast', label: t('meals.breakfast'), emoji: '🌅' },
    { value: 'lunch', label: t('meals.lunch'), emoji: '☀️' },
    { value: 'dinner', label: t('meals.dinner'), emoji: '🌙' },
    { value: 'snack', label: t('meals.snack'), emoji: '🍎' },
  ];

  const handleImageUpload = async (file: File) => {
    setImageFile(file);
    setStep('analyzing');
    try {
      const results = await analyzeFoodImage();
      setItems(results);
      setStep('review');
    } catch {
      setStep('select-method');
    }
  };

  const handleTakePhoto = () => {
    // Create a file input that accepts camera
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
    setItems([{ food_name: '', quantity: 100, unit: 'g', calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, confidence_score: 1 }]);
    setStep('manual');
  };

  const updateItem = (index: number, field: keyof AnalyzedFoodItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems(prev => [...prev, { food_name: '', quantity: 100, unit: 'g', calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, confidence_score: 1 }]);
  };

  const totalCalories = items.reduce((s, i) => s + Number(i.calories), 0);
  const totalProtein = items.reduce((s, i) => s + Number(i.protein_g), 0);
  const totalFat = items.reduce((s, i) => s + Number(i.fat_g), 0);
  const totalCarbs = items.reduce((s, i) => s + Number(i.carbs_g), 0);

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
      ai_analysis_status: imageFile ? 'completed' : 'manual',
    } as any).select().single();

    if (mealError || !mealData) {
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
    setStep('select-type');
    setItems([]);
    setImageFile(null);
  };

  const handleReset = () => {
    setStep('select-type');
    setItems([]);
    setImageFile(null);
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
            <span className="text-2xl">{mealTypes.find(m => m.value === mealType)?.emoji}</span>
            <span className="font-medium">{mealTypes.find(m => m.value === mealType)?.label}</span>
          </div>

          <button onClick={handleTakePhoto} className="nutri-card w-full flex items-center gap-4 py-5 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">{t('meals.takePhoto')}</p>
              <p className="text-xs text-muted-foreground">KI analysiert dein Essen</p>
            </div>
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="nutri-card w-full flex items-center gap-4 py-5 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-info/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-info" />
            </div>
            <div className="text-left">
              <p className="font-medium">{t('meals.uploadImage')}</p>
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
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="font-medium">{t('meals.analyzing')}</p>
        </div>
      )}

      {/* Step: Review / Manual */}
      {(step === 'review' || step === 'manual') && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-sm text-muted-foreground">{t('meals.editHint')}</p>

          {items.map((item, i) => (
            <div key={i} className="nutri-card space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <Input
                    value={item.food_name}
                    onChange={e => updateItem(i, 'food_name', e.target.value)}
                    placeholder={t('meals.foodName')}
                    className="font-medium"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">{t('meals.quantity')}</Label>
                      <Input type="number" value={item.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))} />
                    </div>
                    <div>
                      <Label className="text-xs">{t('meals.unit')}</Label>
                      <Input value={item.unit} onChange={e => updateItem(i, 'unit', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <Label className="text-xs">{t('dashboard.kcal')}</Label>
                      <Input type="number" value={item.calories} onChange={e => updateItem(i, 'calories', Number(e.target.value))} />
                    </div>
                    <div>
                      <Label className="text-xs">P (g)</Label>
                      <Input type="number" value={item.protein_g} onChange={e => updateItem(i, 'protein_g', Number(e.target.value))} />
                    </div>
                    <div>
                      <Label className="text-xs">F (g)</Label>
                      <Input type="number" value={item.fat_g} onChange={e => updateItem(i, 'fat_g', Number(e.target.value))} />
                    </div>
                    <div>
                      <Label className="text-xs">C (g)</Label>
                      <Input type="number" value={item.carbs_g} onChange={e => updateItem(i, 'carbs_g', Number(e.target.value))} />
                    </div>
                  </div>
                </div>
                <button onClick={() => removeItem(i)} className="ml-2 p-2 text-destructive hover:bg-destructive/10 rounded-lg">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addItem} className="w-full">
            <Plus className="h-4 w-4 mr-1" /> {t('meals.addItem')}
          </Button>

          {/* Totals */}
          <div className="nutri-card-highlight">
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <div>
                <p className="font-bold text-foreground">{Math.round(totalCalories)}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.kcal')}</p>
              </div>
              <div>
                <p className="font-bold text-protein">{Math.round(totalProtein)}g</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.protein')}</p>
              </div>
              <div>
                <p className="font-bold text-fat">{Math.round(totalFat)}g</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.fat')}</p>
              </div>
              <div>
                <p className="font-bold text-carbs">{Math.round(totalCarbs)}g</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.carbs')}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              {t('meals.cancel')}
            </Button>
            <Button onClick={handleSave} disabled={saving || items.length === 0} className="flex-1">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Check className="h-4 w-4 mr-1" />}
              {t('meals.confirmSave')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
