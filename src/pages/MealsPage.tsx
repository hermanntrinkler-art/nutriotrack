import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { analyzeFoodImage } from '@/lib/ai-analysis';
import type { AnalyzedFoodItem, MealEntry, UserGoals, ActivityEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Camera, Upload, ScanBarcode, Search, Star, Flame, Plus, ChevronLeft, ChevronRight, X, Trash2, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import PaywallScreen from '@/components/PaywallScreen';
import { hapticFeedback } from '@/lib/haptics';
import { motion } from 'framer-motion';

import AnalyseScreen from '@/components/meals/AnalyseScreen';
import EditableFoodItemsList from '@/components/meals/EditableFoodItemsList';
import FoodItemEditorModal from '@/components/meals/FoodItemEditorModal';
import SaveMealConfirmation from '@/components/meals/SaveMealConfirmation';
import BarcodeScanner from '@/components/meals/BarcodeScanner';
import FoodSearchScreen from '@/components/meals/FoodSearchScreen';
import SavedRecipesScreen, { saveAsRecipe } from '@/components/meals/SavedRecipesScreen';

type MealSlot = 'breakfast' | 'snack1' | 'lunch' | 'snack2' | 'dinner' | 'snack3';
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
type Step = 'overview' | 'diary-entry' | 'analyzing' | 'review' | 'confirm' | 'barcode';
type DiaryTab = 'search' | 'favorites' | 'recipes' | 'activities';

const MEAL_SLOTS: { slot: MealSlot; type: MealType; label: { de: string; en: string }; emoji: string; timeRange: string }[] = [
  { slot: 'breakfast', type: 'breakfast', label: { de: 'Frühstück', en: 'Breakfast' }, emoji: '🌅', timeRange: '00:00–09:59' },
  { slot: 'snack1', type: 'snack', label: { de: 'Snack 1', en: 'Snack 1' }, emoji: '🍎', timeRange: '10:00–11:29' },
  { slot: 'lunch', type: 'lunch', label: { de: 'Mittagessen', en: 'Lunch' }, emoji: '☀️', timeRange: '11:30–13:59' },
  { slot: 'snack2', type: 'snack', label: { de: 'Snack 2', en: 'Snack 2' }, emoji: '🥜', timeRange: '14:00–16:59' },
  { slot: 'dinner', type: 'dinner', label: { de: 'Abendessen', en: 'Dinner' }, emoji: '🌙', timeRange: '17:00–20:59' },
  { slot: 'snack3', type: 'snack', label: { de: 'Snack 3', en: 'Snack 3' }, emoji: '🫖', timeRange: '21:00–23:59' },
];

function getSlotForTime(time: string | null): MealSlot {
  if (!time) return 'snack1';
  const h = parseInt(time.split(':')[0], 10);
  if (h < 10) return 'breakfast';
  if (h < 12) return 'snack1';
  if (h < 14) return 'lunch';
  if (h < 17) return 'snack2';
  if (h < 21) return 'dinner';
  return 'snack3';
}

function getWeekDays(selectedDate: Date): { date: Date; label: string; dayNum: number; isToday: boolean; isSelected: boolean }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(selectedDate);
  const day = startOfWeek.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  startOfWeek.setDate(startOfWeek.getDate() + diff);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return {
      date: d,
      label: d.toLocaleDateString('de-DE', { weekday: 'short' }),
      dayNum: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
      isSelected: d.toDateString() === selectedDate.toDateString(),
    };
  });
}

function formatDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

export default function MealsPage() {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const subscription = useSubscription();

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [step, setStep] = useState<Step>('overview');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [activeSlot, setActiveSlot] = useState<MealSlot>('lunch');
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
  const [diaryTab, setDiaryTab] = useState<DiaryTab>('search');
  const [dayMeals, setDayMeals] = useState<MealEntry[]>([]);
  const [goals, setGoals] = useState<UserGoals | null>(null);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [activityForm, setActivityForm] = useState({ name: '', duration: 30, calories: 0, emoji: '🏃' });
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dateStr = formatDateStr(selectedDate);
  const weekDays = useMemo(() => getWeekDays(selectedDate), [dateStr]);

  // Load goals + meals for selected date
  useEffect(() => {
    if (!user) return;
    supabase.from('user_goals').select('*').eq('user_id', user.id).single()
      .then(({ data }) => { if (data) setGoals(data as any); });
  }, [user]);

  const loadDayMeals = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('meal_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('entry_date', dateStr)
      .order('entry_time', { ascending: true });
    setDayMeals((data || []) as any as MealEntry[]);
  }, [user, dateStr]);

  const loadActivities = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('activity_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('entry_date', dateStr)
      .order('created_at', { ascending: true });
    setActivities((data || []) as any as ActivityEntry[]);
  }, [user, dateStr]);

  useEffect(() => { loadDayMeals(); loadActivities(); }, [loadDayMeals, loadActivities]);

  // Compute totals
  const totals = useMemo(() => ({
    calories: dayMeals.reduce((s, m) => s + Number(m.total_calories), 0),
    protein: dayMeals.reduce((s, m) => s + Number(m.total_protein_g), 0),
    fat: dayMeals.reduce((s, m) => s + Number(m.total_fat_g), 0),
    carbs: dayMeals.reduce((s, m) => s + Number(m.total_carbs_g), 0),
  }), [dayMeals]);

  const totalBurned = useMemo(() => activities.reduce((s, a) => s + Number(a.calories_burned), 0), [activities]);

  const calTarget = goals?.calorie_target || 2000;
  const remaining = calTarget - totals.calories + totalBurned;

  // Preset activities
  const PRESET_ACTIVITIES = [
    { name: 'Gehen', nameEn: 'Walking', kcalPerMin: 4, emoji: '🚶' },
    { name: 'Laufen', nameEn: 'Running', kcalPerMin: 10, emoji: '🏃' },
    { name: 'Radfahren', nameEn: 'Cycling', kcalPerMin: 7, emoji: '🚴' },
    { name: 'Krafttraining', nameEn: 'Strength', kcalPerMin: 6, emoji: '🏋️' },
    { name: 'Schwimmen', nameEn: 'Swimming', kcalPerMin: 8, emoji: '🏊' },
    { name: 'Yoga', nameEn: 'Yoga', kcalPerMin: 3, emoji: '🧘' },
  ];

  const selectPresetActivity = (preset: typeof PRESET_ACTIVITIES[0]) => {
    const dur = activityForm.duration || 30;
    setActivityForm({
      name: language === 'de' ? preset.name : preset.nameEn,
      duration: dur,
      calories: dur * preset.kcalPerMin,
      emoji: preset.emoji,
    });
  };

  const saveActivity = async () => {
    if (!user || !activityForm.name || activityForm.calories <= 0) return;
    await supabase.from('activity_entries').insert({
      user_id: user.id,
      entry_date: dateStr,
      activity_name: activityForm.name,
      duration_minutes: activityForm.duration || null,
      calories_burned: activityForm.calories,
      emoji: activityForm.emoji,
    } as any);
    setActivityForm({ name: '', duration: 30, calories: 0, emoji: '🏃' });
    
    loadActivities();
    toast.success(language === 'de' ? 'Aktivität gespeichert!' : 'Activity saved!');
  };

  const deleteActivity = async (id: string) => {
    await supabase.from('activity_entries').delete().eq('id', id);
    loadActivities();
  };

  // Group meals into slots
  const mealsBySlot = useMemo(() => {
    const grouped: Record<MealSlot, MealEntry[]> = {
      breakfast: [], snack1: [], lunch: [], snack2: [], dinner: [], snack3: [],
    };
    dayMeals.forEach(m => {
      const slot = getSlotForTime(m.entry_time);
      grouped[slot].push(m);
    });
    return grouped;
  }, [dayMeals]);

  const slotLabel = (slot: typeof MEAL_SLOTS[0]) => language === 'de' ? slot.label.de : slot.label.en;

  const currentSlotInfo = MEAL_SLOTS.find(s => s.slot === activeSlot) || MEAL_SLOTS[0];

  // --- Week navigation ---
  const goWeek = (dir: number) => {
    setSelectedDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + dir * 7);
      return d;
    });
  };

  // --- Camera / Image logic (unchanged) ---
  const handleImageUpload = async (file: File) => {
    if (!subscription.canScanPhoto) { setShowPaywall(true); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setStep('analyzing');
    setIsAiResult(true);
    await subscription.incrementScanCount();
    try {
      const results = await analyzeFoodImage(file, language);
      if (results.length === 0) { toast.error(t('meals.analysisFailed')); handleManualEntry(); return; }
      setItems(results);
      setStep('review');
    } catch (err: any) {
      if (err.message === 'RATE_LIMIT') toast.error(t('meals.rateLimited'));
      else if (err.message === 'PAYMENT_REQUIRED') toast.error(t('meals.paymentRequired'));
      else toast.error(t('meals.analysisFailed'));
      handleManualEntry();
    }
  };

  const stopCamera = () => {
    cameraStreamRef.current?.getTracks().forEach(t => t.stop());
    cameraStreamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOpen(false);
    setCameraLoading(false);
  };

  const handleOpenCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices?.getUserMedia) { toast.error('Kamera wird nicht unterstützt.'); return; }
    try {
      setCameraLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      cameraStreamRef.current = stream;
      setCameraOpen(true);
    } catch { setCameraError('Kamerazugriff blockiert.'); } finally { setCameraLoading(false); }
  };

  const handleCapturePhoto = async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', 0.9));
    if (!blob) return;
    stopCamera();
    handleImageUpload(new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    e.currentTarget.value = '';
  };

  const handleOpenFilePicker = () => {
    const input = fileInputRef.current;
    if (!input) return;
    try { (input as any).showPicker?.() || input.click(); } catch { input.click(); }
  };

  useEffect(() => {
    if (!cameraOpen || !videoRef.current || !cameraStreamRef.current) return;
    videoRef.current.srcObject = cameraStreamRef.current;
    videoRef.current.play().catch(() => undefined);
  }, [cameraOpen]);

  useEffect(() => { return () => { cameraStreamRef.current?.getTracks().forEach(t => t.stop()); }; }, []);

  // --- Item editing ---
  const handleManualEntry = () => {
    setIsAiResult(false);
    setItems([{ food_name: '', quantity: 100, unit: 'g', calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, confidence_score: 1 }]);
    setStep('review');
    setEditingIndex(0);
  };

  const updateItem = (index: number, field: keyof AnalyzedFoodItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value, confidence_score: 1 } : item));
  };
  const replaceItem = (index: number, newItem: AnalyzedFoodItem) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...newItem, confidence_score: 1 } : item));
  };
  const removeItem = (index: number) => setItems(prev => prev.filter((_, i) => i !== index));
  const addItem = () => {
    setItems(prev => [...prev, { food_name: '', quantity: 100, unit: 'g', calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, confidence_score: 1 }]);
    setEditingIndex(items.length);
  };

  const handleSaveEditedItem = (updatedItem: AnalyzedFoodItem) => {
    if (editingIndex !== null) setItems(prev => prev.map((item, i) => i === editingIndex ? updatedItem : item));
    setEditingIndex(null);
  };

  // --- Save meal ---
  const handleSave = async () => {
    if (!user || items.length === 0) return;
    setSaving(true);
    let imageUrl: string | null = null;
    if (imageFile) {
      const path = `${user.id}/${Date.now()}-${imageFile.name}`;
      const { data } = await supabase.storage.from('meal-images').upload(path, imageFile);
      if (data) { imageUrl = supabase.storage.from('meal-images').getPublicUrl(data.path).data.publicUrl; }
    }

    const totalCalories = items.reduce((s, i) => s + Number(i.calories), 0);
    const totalProtein = items.reduce((s, i) => s + Number(i.protein_g), 0);
    const totalFat = items.reduce((s, i) => s + Number(i.fat_g), 0);
    const totalCarbs = items.reduce((s, i) => s + Number(i.carbs_g), 0);

    const now = new Date();
    const mealName = items.map(i => i.food_name).filter(Boolean).slice(0, 3).join(', ');
    const { data: mealData, error: mealError } = await supabase.from('meal_entries').insert({
      user_id: user.id,
      entry_date: dateStr,
      entry_time: now.toTimeString().split(' ')[0],
      meal_type: mealType,
      image_url: imageUrl,
      notes: mealName || null,
      total_calories: totalCalories,
      total_protein_g: totalProtein,
      total_fat_g: totalFat,
      total_carbs_g: totalCarbs,
      ai_analysis_status: isAiResult ? 'completed' : 'manual',
    } as any).select().single();

    if (mealError || !mealData) { toast.error(t('common.error')); setSaving(false); return; }

    await supabase.from('meal_food_items').insert(items.map(item => ({
      meal_entry_id: (mealData as any).id,
      food_name: item.food_name, quantity: item.quantity, unit: item.unit,
      calories: item.calories, protein_g: item.protein_g, fat_g: item.fat_g, carbs_g: item.carbs_g,
      confidence_score: item.confidence_score, was_user_edited: true,
    })) as any);

    hapticFeedback('success');
    toast.success(t('meals.saved'));
    setSaving(false);
    handleReset();
    loadDayMeals();
  };

  const handleReset = () => {
    stopCamera();
    setCameraError(null);
    setStep('overview');
    setItems([]);
    setImageFile(null);
    setImagePreview(null);
    setIsAiResult(false);
    setEditingIndex(null);
    setReturnToReview(false);
  };

  const openSlot = (slot: typeof MEAL_SLOTS[0]) => {
    setActiveSlot(slot.slot);
    setMealType(slot.type);
    setDiaryTab('search');
    setStep('diary-entry');
  };

  // --- Render ---
  return (
    <div className="page-container space-y-3 pb-24">
      {/* Paywall */}
      {showPaywall && (
        <PaywallScreen onClose={() => setShowPaywall(false)} trigger="scan_limit"
          onUpgrade={() => { toast.info(t('paywall.comingSoon')); setShowPaywall(false); }} />
      )}

      {/* === OVERVIEW STEP === */}
      {step === 'overview' && (
        <div className="space-y-3 animate-fade-in">
          {/* Week Calendar */}
          <div className="flex items-center gap-1">
            <button onClick={() => goWeek(-1)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="flex-1 flex gap-0.5">
              {weekDays.map(wd => (
                <button
                  key={wd.date.toISOString()}
                  onClick={() => setSelectedDate(wd.date)}
                  className={`flex-1 flex flex-col items-center py-1.5 rounded-xl transition-all text-xs ${
                    wd.isSelected
                      ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                      : wd.isToday
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <span className="text-[10px] uppercase">{wd.label}</span>
                  <span className="text-sm font-bold">{wd.dayNum}</span>
                </button>
              ))}
            </div>
            <button onClick={() => goWeek(1)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Goal Header: Ziel - Gegessen + Verbrannt = Übrig */}
          <div className="nutri-card-highlight">
            <div className={`grid ${totalBurned > 0 ? 'grid-cols-4' : 'grid-cols-3'} text-center gap-2`}>
              <div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  {language === 'de' ? 'Ziel' : 'Goal'}
                </p>
                <p className="text-lg font-black tabular-nums text-foreground">{calTarget}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  {language === 'de' ? 'Gegessen' : 'Eaten'}
                </p>
                <p className="text-lg font-black tabular-nums text-foreground">{Math.round(totals.calories)}</p>
              </div>
              {totalBurned > 0 && (
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide flex items-center justify-center gap-0.5">
                    <Flame className="h-3 w-3 text-energy" />
                    {language === 'de' ? 'Verbrannt' : 'Burned'}
                  </p>
                  <p className="text-lg font-black tabular-nums text-energy">+{Math.round(totalBurned)}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  {language === 'de' ? 'Übrig' : 'Remaining'}
                </p>
                <p className={`text-lg font-black tabular-nums ${remaining >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {Math.round(remaining)}
                </p>
              </div>
            </div>
            {/* Macro bar */}
            <div className="flex gap-3 mt-2 pt-2 border-t border-border/50 text-[11px] justify-center">
              <span className="text-protein font-bold">P {Math.round(totals.protein)}g <span className="text-muted-foreground font-normal">/ {goals?.protein_target_g || 150}g</span></span>
              <span className="text-fat font-bold">F {Math.round(totals.fat)}g <span className="text-muted-foreground font-normal">/ {goals?.fat_target_g || 65}g</span></span>
              <span className="text-carbs font-bold">K {Math.round(totals.carbs)}g <span className="text-muted-foreground font-normal">/ {goals?.carbs_target_g || 250}g</span></span>
            </div>
          </div>

          {/* Scan counter for free users */}
          {!subscription.isPro && !subscription.loading && (
            <div className="flex items-center justify-between text-xs bg-muted/50 rounded-xl px-3 py-2">
              <span className="text-muted-foreground">{t('paywall.remainingScans', { count: subscription.remainingScans })}</span>
              <button onClick={() => setShowPaywall(true)} className="text-primary font-bold">{t('paywall.upgradeButton')}</button>
            </div>
          )}

          {/* Meal Slots */}
          <div className="space-y-2">
            {MEAL_SLOTS.map(slot => {
              const slotMeals = mealsBySlot[slot.slot];
              const slotCals = slotMeals.reduce((s, m) => s + Number(m.total_calories), 0);
              return (
                <div key={slot.slot} className="nutri-card overflow-hidden">
                  <button
                    onClick={() => openSlot(slot)}
                    className="w-full flex items-center gap-3 py-1 hover:opacity-80 transition-opacity"
                  >
                    <span className="text-xl">{slot.emoji}</span>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-sm">{slotLabel(slot)}</p>
                      <p className="text-[10px] text-muted-foreground">{slot.timeRange}</p>
                    </div>
                    {slotMeals.length > 0 ? (
                      <span className="text-sm font-bold tabular-nums">{Math.round(slotCals)} kcal</span>
                    ) : (
                      <Plus className="h-5 w-5 text-primary" />
                    )}
                  </button>
                  {/* Show items within slot */}
                  {slotMeals.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/40 space-y-1">
                      {slotMeals.map(meal => (
                        <div key={meal.id} className="flex items-center gap-2 text-xs py-1 px-1 rounded-lg hover:bg-muted/50 transition-colors group">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{meal.notes || slotLabel(slot)}</p>
                          </div>
                          <span className="text-muted-foreground tabular-nums">{Math.round(Number(meal.total_calories))} kcal</span>
                          <span className="text-[10px] text-muted-foreground">
                            P{Math.round(Number(meal.total_protein_g))} F{Math.round(Number(meal.total_fat_g))} K{Math.round(Number(meal.total_carbs_g))}
                          </span>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              await supabase.from('meal_food_items').delete().eq('meal_entry_id', meal.id);
                              await supabase.from('meal_entries').delete().eq('id', meal.id);
                              hapticFeedback('light');
                              toast.success(language === 'de' ? 'Gelöscht' : 'Deleted');
                              loadDayMeals();
                            }}
                            className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all sm:opacity-100"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => openSlot(slot)}
                        className="w-full flex items-center justify-center gap-1 text-primary text-xs font-semibold py-1 hover:bg-primary/5 rounded-lg transition-colors"
                      >
                        <Plus className="h-3 w-3" /> {language === 'de' ? 'Hinzufügen' : 'Add'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Activities Section */}
          <div className="nutri-card overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏃</span>
                <div>
                  <p className="font-semibold text-sm">{language === 'de' ? 'Aktivitäten' : 'Activities'}</p>
                  {totalBurned > 0 && (
                    <p className="text-[10px] text-energy font-bold">+{Math.round(totalBurned)} kcal</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => { setDiaryTab('activities'); setStep('diary-entry'); }}
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Plus className="h-4 w-4 text-primary" />
              </button>
            </div>
            {activities.length > 0 && (
              <div className="mt-2 pt-2 border-t border-border/40 space-y-1">
                {activities.map(act => (
                  <div key={act.id} className="flex items-center gap-2 text-xs py-1 px-1 rounded-lg hover:bg-muted/50 transition-colors group">
                    <span>{act.emoji || '🏃'}</span>
                    <span className="flex-1 font-medium">{act.activity_name}</span>
                    {act.duration_minutes && <span className="text-muted-foreground">{act.duration_minutes} min</span>}
                    <span className="text-energy font-bold tabular-nums">+{Math.round(Number(act.calories_burned))} kcal</span>
                    <button onClick={() => deleteActivity(act.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5">
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* === DIARY ENTRY STEP (Tabbed FDDB-style) === */}
      {step === 'diary-entry' && (
        <div className="space-y-3 animate-fade-in">
          {/* Header */}
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <X className="h-4 w-4" />
            </button>
            <span className="text-xl">{currentSlotInfo.emoji}</span>
            <span className="font-semibold flex-1">{language === 'de' ? 'Tagebucheintrag' : 'Diary Entry'}</span>
            <button onClick={handleManualEntry} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title={t('meals.manualEntry')}>
              <Plus className="h-4 w-4 text-primary" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border overflow-x-auto scrollbar-none">
            {([
              { key: 'search' as DiaryTab, label: language === 'de' ? 'Suche' : 'Search', icon: <Search className="h-3.5 w-3.5" /> },
              { key: 'favorites' as DiaryTab, label: language === 'de' ? 'Favoriten' : 'Favorites', icon: <Star className="h-3.5 w-3.5" /> },
              { key: 'recipes' as DiaryTab, label: language === 'de' ? 'Rezepte' : 'Recipes', icon: <BookOpen className="h-3.5 w-3.5" /> },
              { key: 'activities' as DiaryTab, label: language === 'de' ? 'Aktivitäten' : 'Activities', icon: <Flame className="h-3.5 w-3.5" /> },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setDiaryTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  diaryTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Search */}
          {diaryTab === 'search' && (
            <div className="space-y-3">
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
                onCancel={handleReset}
                hideHeader
                onBarcodeScan={() => setStep('barcode')}
              />

              {/* Photo & Upload secondary options */}
              <div className="flex gap-2 pt-2 border-t border-border/50">
                <button
                  onClick={handleOpenCamera}
                  disabled={cameraLoading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 bg-muted hover:bg-muted/80 border border-border text-sm font-medium transition-all active:scale-[0.98]"
                >
                  <Camera className="h-4 w-4 text-primary" />
                  {language === 'de' ? 'Foto' : 'Photo'}
                </button>
                <button
                  onClick={handleOpenFilePicker}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 bg-muted hover:bg-muted/80 border border-border text-sm font-medium transition-all active:scale-[0.98]"
                >
                  <Upload className="h-4 w-4 text-primary" />
                  {language === 'de' ? 'Hochladen' : 'Upload'}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>

              {cameraError && <p className="text-xs text-destructive">{cameraError}</p>}

              {cameraOpen && (
                <div className="nutri-card space-y-3">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-48 rounded-xl object-cover bg-muted" />
                  <div className="flex gap-2">
                    <Button type="button" className="flex-1" onClick={handleCapturePhoto}>
                      {language === 'de' ? 'Foto verwenden' : 'Use Photo'}
                    </Button>
                    <Button type="button" variant="outline" className="flex-1" onClick={stopCamera}>{t('common.cancel')}</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Favorites */}
          {diaryTab === 'favorites' && (
            <SavedRecipesScreen
              onSelect={(recipeItems, recipeMealType) => {
                setIsAiResult(false);
                setItems(recipeItems);
                if (['breakfast', 'lunch', 'dinner', 'snack'].includes(recipeMealType)) setMealType(recipeMealType as MealType);
                setStep('review');
              }}
              onCancel={handleReset}
              hideHeader
            />
          )}

          {/* Tab: Recipes */}
          {diaryTab === 'recipes' && (
            <SavedRecipesScreen
              onSelect={(recipeItems, recipeMealType) => {
                setIsAiResult(false);
                setItems(recipeItems);
                if (['breakfast', 'lunch', 'dinner', 'snack'].includes(recipeMealType)) setMealType(recipeMealType as MealType);
                setStep('review');
              }}
              onCancel={handleReset}
              hideHeader
            />
          )}

          {/* Tab: Activities */}
          {diaryTab === 'activities' && (
            <div className="space-y-4">
              {/* Presets */}
              <div className="grid grid-cols-3 gap-2">
                {PRESET_ACTIVITIES.map(p => (
                  <button
                    key={p.name}
                    onClick={() => selectPresetActivity(p)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                      activityForm.name === (language === 'de' ? p.name : p.nameEn)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <span className="text-2xl">{p.emoji}</span>
                    <span className="text-xs font-medium">{language === 'de' ? p.name : p.nameEn}</span>
                    <span className="text-[10px] text-muted-foreground">{p.kcalPerMin} kcal/min</span>
                  </button>
                ))}
              </div>

              {/* Form */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">{language === 'de' ? 'Name' : 'Name'}</label>
                  <Input value={activityForm.name} onChange={e => setActivityForm(f => ({ ...f, name: e.target.value }))}
                    placeholder={language === 'de' ? 'z.B. Spaziergang' : 'e.g. Walking'} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">{language === 'de' ? 'Dauer (Minuten)' : 'Duration (min)'}</label>
                  <Input type="number" value={activityForm.duration} min={1}
                    onChange={e => {
                      const dur = Number(e.target.value);
                      const preset = PRESET_ACTIVITIES.find(p => (language === 'de' ? p.name : p.nameEn) === activityForm.name);
                      setActivityForm(f => ({ ...f, duration: dur, calories: preset ? dur * preset.kcalPerMin : f.calories }));
                    }} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">{language === 'de' ? 'Verbrannte kcal' : 'Calories burned'}</label>
                  <Input type="number" value={activityForm.calories} min={0}
                    onChange={e => setActivityForm(f => ({ ...f, calories: Number(e.target.value) }))} />
                </div>
                <Button onClick={saveActivity} className="w-full" disabled={!activityForm.name || activityForm.calories <= 0}>
                  {language === 'de' ? 'Speichern' : 'Save'}
                </Button>
              </div>

              {/* Today's activities */}
              {activities.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {language === 'de' ? 'Heutige Aktivitäten' : "Today's Activities"}
                  </p>
                  {activities.map(act => (
                    <div key={act.id} className="flex items-center gap-2 text-xs py-1.5 px-2 rounded-lg hover:bg-muted/50 transition-colors group">
                      <span>{act.emoji || '🏃'}</span>
                      <span className="flex-1 font-medium">{act.activity_name}</span>
                      {act.duration_minutes && <span className="text-muted-foreground">{act.duration_minutes} min</span>}
                      <span className="text-energy font-bold tabular-nums">+{Math.round(Number(act.calories_burned))} kcal</span>
                      <button onClick={() => deleteActivity(act.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5">
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Barcode */}
      {step === 'barcode' && (
        <BarcodeScanner
          onResult={(item) => { setIsAiResult(false); setItems([item]); setStep('review'); }}
          onCancel={handleReset}
        />
      )}

      {/* Analyzing */}
      {step === 'analyzing' && <AnalyseScreen imagePreview={imagePreview} />}

      {/* Review */}
      {step === 'review' && (
        <div className="space-y-4 animate-fade-in">
          {imagePreview && (
            <div className="w-full rounded-2xl overflow-hidden border border-border">
              <img src={imagePreview} alt="Meal" className="w-full h-40 object-cover" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <button onClick={() => setStep('diary-entry')} className="p-1.5 rounded-lg hover:bg-muted">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xl">{currentSlotInfo.emoji}</span>
            <h2 className="font-semibold">{slotLabel(currentSlotInfo)}</h2>
            {isAiResult && <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">KI</span>}
          </div>

          <EditableFoodItemsList
            items={items} isAiResult={isAiResult}
            onUpdateItem={updateItem} onReplaceItem={replaceItem}
            onRemoveItem={removeItem} onAddItem={addItem}
            onEditItem={(i) => setEditingIndex(i)}
          />

          <button
            onClick={() => { setReturnToReview(true); setDiaryTab('search'); setStep('diary-entry'); }}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 bg-muted hover:bg-muted/80 border border-border text-foreground font-medium text-sm transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            {language === 'de' ? 'Weitere Lebensmittel hinzufügen' : 'Add more food'}
          </button>

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

          {/* Save as Favorite */}
          {items.length > 0 && items.some(i => i.food_name) && user && (
            <button
              onClick={async () => {
                setSavingRecipe(true);
                const name = items.map(i => i.food_name).filter(Boolean).slice(0, 3).join(', ');
                const success = await saveAsRecipe({
                  userId: user.id, name: name || 'Rezept',
                  emoji: currentSlotInfo.emoji, mealType, items,
                });
                setSavingRecipe(false);
                if (success) { hapticFeedback('success'); toast.success(language === 'de' ? 'Als Favorit gespeichert! ⭐' : 'Saved as favorite! ⭐'); }
                else toast.error(language === 'de' ? 'Fehler' : 'Failed');
              }}
              disabled={savingRecipe}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              {savingRecipe ? (language === 'de' ? 'Wird gespeichert...' : 'Saving...') : (language === 'de' ? 'Als Favorit speichern' : 'Save as Favorite')}
            </button>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">{t('meals.cancel')}</Button>
            <Button onClick={() => setStep('confirm')} disabled={items.length === 0 || items.some(i => !i.food_name)} className="flex-1">
              {t('meals.confirmSave')}
            </Button>
          </div>
        </div>
      )}

      {/* Confirm */}
      {step === 'confirm' && (
        <div className="space-y-4 animate-fade-in">
          <SaveMealConfirmation
            items={items}
            mealTypeLabel={slotLabel(currentSlotInfo)}
            mealEmoji={currentSlotInfo.emoji}
            imagePreview={imagePreview}
            saving={saving}
            onConfirm={handleSave}
            onCancel={() => setStep('review')}
          />
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
