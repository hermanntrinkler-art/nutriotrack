import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { analyzeFoodImage } from '@/lib/ai-analysis';
import type { AnalyzedFoodItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Camera, Upload, ScanBarcode, Search, Star, Flame, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import PaywallScreen from '@/components/PaywallScreen';
import { hapticFeedback } from '@/lib/haptics';

import AnalyseScreen from '@/components/meals/AnalyseScreen';
import EditableFoodItemsList from '@/components/meals/EditableFoodItemsList';
import FoodItemEditorModal from '@/components/meals/FoodItemEditorModal';
import SaveMealConfirmation from '@/components/meals/SaveMealConfirmation';
import BarcodeScanner from '@/components/meals/BarcodeScanner';
import FoodSearchScreen from '@/components/meals/FoodSearchScreen';
import SavedRecipesScreen, { saveAsRecipe } from '@/components/meals/SavedRecipesScreen';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
type Step = 'select-type' | 'select-method' | 'analyzing' | 'review' | 'confirm' | 'barcode' | 'search' | 'recipes';

export default function MealsPage() {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const subscription = useSubscription();

  const [step, setStep] = useState<Step>('select-type');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [items, setItems] = useState<AnalyzedFoodItem[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isAiResult, setIsAiResult] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [returnToReview, setReturnToReview] = useState(false);
  const [favorites, setFavorites] = useState<{id: string; name: string; emoji: string; meal_type: string; total_calories: number; total_protein_g: number; total_fat_g: number; total_carbs_g: number}[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mealTypes: { value: MealType; label: string; emoji: string }[] = [
    { value: 'breakfast', label: t('meals.breakfast'), emoji: '🌅' },
    { value: 'lunch', label: t('meals.lunch'), emoji: '☀️' },
    { value: 'dinner', label: t('meals.dinner'), emoji: '🌙' },
    { value: 'snack', label: t('meals.snack'), emoji: '🍎' },
  ];

  const currentMealType = mealTypes.find(m => m.value === mealType);

  // Load favorites (top saved recipes)
  const loadFavorites = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('saved_recipes')
      .select('id, name, emoji, meal_type, total_calories, total_protein_g, total_fat_g, total_carbs_g')
      .eq('user_id', user.id)
      .order('use_count', { ascending: false })
      .limit(5);
    setFavorites((data || []) as any);
  }, [user]);

  useEffect(() => { loadFavorites(); }, [loadFavorites]);

  const handleSelectFavorite = async (fav: typeof favorites[0]) => {
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
    await supabase.from('saved_recipes').update({ use_count: ((fav as any).use_count || 0) + 1 } as any).eq('id', fav.id);
    
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
    setIsAiResult(false);
    setItems(analyzedItems);
    if (['breakfast', 'lunch', 'dinner', 'snack'].includes(fav.meal_type)) {
      setMealType(fav.meal_type as MealType);
    }
    setStep('review');
  };

  const handleImageUpload = async (file: File) => {
    // Check scan limit for free users
    if (!subscription.canScanPhoto) {
      setShowPaywall(true);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setStep('analyzing');
    setIsAiResult(true);

    // Increment scan count before analysis
    await subscription.incrementScanCount();

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

  const stopCamera = () => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOpen(false);
    setCameraLoading(false);
  };

  const handleOpenCamera = async () => {
    setCameraError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error('Kamera wird auf diesem Gerät nicht unterstützt.');
      return;
    }

    try {
      setCameraLoading(true);
      // CRITICAL: called directly in user click handler
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      cameraStreamRef.current = stream;
      setCameraOpen(true);
    } catch (error) {
      setCameraError('Kamerazugriff blockiert. Bitte Berechtigung erlauben.');
      toast.error('Kein Kamerazugriff. Bitte Browser-App Berechtigung prüfen.');
    } finally {
      setCameraLoading(false);
    }
  };

  const handleCapturePhoto = async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      toast.error('Foto konnte nicht verarbeitet werden.');
      return;
    }

    context.drawImage(video, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.9);
    });

    if (!blob) {
      toast.error('Foto konnte nicht erstellt werden.');
      return;
    }

    stopCamera();
    const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
    handleImageUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    e.currentTarget.value = '';
  };

  const handleOpenFilePicker = () => {
    const input = fileInputRef.current;
    if (!input) return;

    const pickerInput = input as HTMLInputElement & { showPicker?: () => void };
    try {
      if (pickerInput.showPicker) {
        pickerInput.showPicker();
      } else {
        input.click();
      }
    } catch {
      input.click();
    }
  };

  useEffect(() => {
    if (!cameraOpen || !videoRef.current || !cameraStreamRef.current) return;
    videoRef.current.srcObject = cameraStreamRef.current;
    videoRef.current.play().catch(() => undefined);
  }, [cameraOpen]);

  useEffect(() => {
    return () => {
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

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

  const replaceItem = (index: number, newItem: AnalyzedFoodItem) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...newItem, confidence_score: 1 } : item));
  };

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

    hapticFeedback('success');
    toast.success(t('meals.saved'));
    setSaving(false);
    handleReset();
  };

  const handleReset = () => {
    stopCamera();
    setCameraError(null);
    setStep('select-type');
    setItems([]);
    setImageFile(null);
    setImagePreview(null);
    setIsAiResult(false);
    setEditingIndex(null);
    setReturnToReview(false);
  };

  return (
    <div className="page-container space-y-4">
      <h1 className="text-xl font-bold">{t('meals.title')}</h1>

      {/* Scan counter for free users */}
      {!subscription.isPro && !subscription.loading && (
        <div className="flex items-center justify-between text-xs bg-muted/50 rounded-xl px-3 py-2">
          <span className="text-muted-foreground">
            {t('paywall.remainingScans', { count: subscription.remainingScans })}
          </span>
          <button onClick={() => setShowPaywall(true)} className="text-primary font-bold">
            {t('paywall.upgradeButton')}
          </button>
        </div>
      )}

      {/* Paywall */}
      {showPaywall && (
        <PaywallScreen
          onClose={() => setShowPaywall(false)}
          trigger="scan_limit"
          onUpgrade={(plan) => {
            toast.info(t('paywall.comingSoon'));
            setShowPaywall(false);
          }}
        />
      )}

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

          {/* Quick Favorites */}
          {favorites.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 px-1">
                <Star className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  {language === 'de' ? 'Favoriten' : 'Favorites'}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {favorites.map(fav => (
                  <button
                    key={fav.id}
                    onClick={() => handleSelectFavorite(fav)}
                    className="nutri-card flex items-center gap-3 py-3 hover:border-primary/30 transition-all active:scale-[0.98]"
                  >
                    <span className="text-lg">{fav.emoji}</span>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-semibold truncate">{fav.name}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Flame className="h-3 w-3 text-energy" />
                      <span className="text-xs font-bold tabular-nums">{Math.round(fav.total_calories)}</span>
                      <span className="text-[10px] text-muted-foreground">kcal</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="nutri-card w-full flex items-center gap-4 py-5 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{t('meals.takePhoto')}</p>
              <p className="text-xs text-muted-foreground mb-2">{t('meals.aiDescription')}</p>
              <Button type="button" onClick={handleOpenCamera} className="w-full" disabled={cameraLoading}>
                {cameraLoading ? 'Öffne Kamera…' : t('meals.takePhoto')}
              </Button>
              {cameraError && <p className="text-xs text-destructive mt-2">{cameraError}</p>}
            </div>
          </div>

          {cameraOpen && (
            <div className="nutri-card space-y-3">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-56 rounded-xl object-cover bg-muted"
              />
              <div className="flex gap-2">
                <Button type="button" className="flex-1" onClick={handleCapturePhoto}>
                  Foto verwenden
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={stopCamera}>
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          )}

          <div className="nutri-card w-full flex items-center gap-4 py-5 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-info/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-info" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{t('meals.uploadImage')}</p>
              <p className="text-xs text-muted-foreground mb-2">{t('meals.aiDescription')}</p>
              <Button type="button" variant="outline" onClick={handleOpenFilePicker} className="w-full">
                {t('meals.uploadImage')}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full mt-2 text-xs text-muted-foreground file:mr-2 file:rounded-lg file:border-0 file:bg-secondary file:text-secondary-foreground file:px-3 file:py-1.5"
                aria-label={t('meals.uploadImage')}
              />
            </div>
          </div>

          {/* Food Search - PRIMARY and ONLY entry point */}
          <button onClick={() => setStep('search')} className="nutri-card w-full flex items-center gap-4 py-5 hover:border-primary/30 transition-colors border-primary/20">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium">{language === 'de' ? 'Lebensmittel suchen' : 'Search Food'}</p>
              <p className="text-xs text-muted-foreground">{language === 'de' ? 'Suchen, Favoriten & Stücklisten – alles an einem Ort' : 'Search, favorites & combos – all in one place'}</p>
            </div>
          </button>

          <button onClick={() => setStep('barcode')} className="nutri-card w-full flex items-center gap-4 py-5 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-accent/30 flex items-center justify-center">
              <ScanBarcode className="h-6 w-6 text-foreground" />
            </div>
            <div className="text-left">
              <p className="font-medium">{t('meals.scanBarcode')}</p>
              <p className="text-xs text-muted-foreground">{t('meals.barcodeDescription')}</p>
            </div>
          </button>

          <Button variant="ghost" onClick={handleReset} className="w-full">
            {t('meals.cancel')}
          </Button>
        </div>
      )}

      {/* Step: Food Search */}
      {step === 'search' && (
        <FoodSearchScreen
          onDone={(searchItems) => {
            setIsAiResult(false);
            if (returnToReview) {
              setItems(prev => [...prev.filter(i => i.food_name), ...searchItems]);
              setReturnToReview(false);
            } else {
              setItems(searchItems);
            }
            setStep('review');
          }}
          onCancel={() => {
            if (returnToReview) {
              setReturnToReview(false);
              setStep('review');
            } else {
              setStep('select-method');
            }
          }}
        />
      )}

      {/* Step: Saved Recipes */}
      {step === 'recipes' && (
        <SavedRecipesScreen
          onSelect={(recipeItems, recipeMealType) => {
            setIsAiResult(false);
            setItems(recipeItems);
            if (['breakfast', 'lunch', 'dinner', 'snack'].includes(recipeMealType)) {
              setMealType(recipeMealType as MealType);
            }
            setStep('review');
          }}
          onCancel={() => setStep('select-method')}
        />
      )}

      {/* Step: Barcode */}
      {step === 'barcode' && (
        <BarcodeScanner
          onResult={(item) => {
            setIsAiResult(false);
            setItems([item]);
            setStep('review');
          }}
          onCancel={handleReset}
        />
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

          {/* Add more items — goes to search (which has favorites built in) */}
          <button
            onClick={() => { setReturnToReview(true); setStep('search'); }}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 bg-muted hover:bg-muted/80 border border-border text-foreground font-medium text-sm transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            {language === 'de' ? 'Weitere Lebensmittel hinzufügen' : 'Add more food'}
          </button>

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

          {/* Save as Favorite button — prominent */}
          {items.length > 0 && items.some(i => i.food_name) && user && (
            <button
              onClick={async () => {
                setSavingRecipe(true);
                const recipeName = items.map(i => i.food_name).filter(Boolean).slice(0, 3).join(', ');
                const success = await saveAsRecipe({
                  userId: user.id,
                  name: recipeName || 'Rezept',
                  emoji: currentMealType?.emoji || '🍽️',
                  mealType,
                  items,
                });
                setSavingRecipe(false);
                if (success) {
                  hapticFeedback('success');
                  toast.success(language === 'de' ? 'Als Favorit gespeichert! ⭐' : 'Saved as favorite! ⭐');
                } else {
                  toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Failed to save');
                }
              }}
              disabled={savingRecipe}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Star className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />
              {savingRecipe
                ? (language === 'de' ? 'Wird gespeichert...' : 'Saving...')
                : (language === 'de' ? 'Als Favorit speichern' : 'Save as Favorite')}
            </button>
          )}

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
        <div className="space-y-4 animate-fade-in">
          <SaveMealConfirmation
            items={items}
            mealTypeLabel={currentMealType?.label || ''}
            mealEmoji={currentMealType?.emoji || ''}
            imagePreview={imagePreview}
            saving={saving}
            onConfirm={handleSave}
            onCancel={() => setStep('review')}
          />
          {/* Favorite button also on confirmation screen */}
          {user && items.length > 0 && (
            <button
              onClick={async () => {
                setSavingRecipe(true);
                const recipeName = items.map(i => i.food_name).filter(Boolean).slice(0, 3).join(', ');
                const success = await saveAsRecipe({
                  userId: user.id,
                  name: recipeName || 'Rezept',
                  emoji: currentMealType?.emoji || '🍽️',
                  mealType,
                  items,
                });
                setSavingRecipe(false);
                if (success) {
                  hapticFeedback('success');
                  toast.success(language === 'de' ? 'Als Favorit gespeichert! ⭐' : 'Saved as favorite! ⭐');
                } else {
                  toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Failed to save');
                }
              }}
              disabled={savingRecipe || saving}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Star className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />
              {savingRecipe
                ? (language === 'de' ? 'Wird gespeichert...' : 'Saving...')
                : (language === 'de' ? 'Als Favorit speichern' : 'Save as Favorite')}
            </button>
          )}
        </div>
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
