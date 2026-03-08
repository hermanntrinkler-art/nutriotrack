import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import type { MealEntry } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HistoryPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [meals, setMeals] = useState<MealEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('meal_entries').select('*').eq('user_id', user.id)
      .order('entry_date', { ascending: false }).order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => setMeals((data || []) as any));
  }, [user]);

  const mealTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      breakfast: t('meals.breakfast'),
      lunch: t('meals.lunch'),
      dinner: t('meals.dinner'),
      snack: t('meals.snack'),
    };
    return map[type] || type;
  };

  // Group by date
  const grouped = meals.reduce((acc, meal) => {
    const date = meal.entry_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(meal);
    return acc;
  }, {} as Record<string, MealEntry[]>);

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  // Weekly averages
  const last7 = meals.filter(m => {
    const d = new Date(m.entry_date);
    const now = new Date();
    return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= 7;
  });
  const weekDays = new Set(last7.map(m => m.entry_date)).size || 1;
  const weekAvg = {
    calories: last7.reduce((s, m) => s + Number(m.total_calories), 0) / weekDays,
    protein: last7.reduce((s, m) => s + Number(m.total_protein_g), 0) / weekDays,
    fat: last7.reduce((s, m) => s + Number(m.total_fat_g), 0) / weekDays,
    carbs: last7.reduce((s, m) => s + Number(m.total_carbs_g), 0) / weekDays,
  };

  return (
    <div className="page-container space-y-4">
      <h1 className="text-xl font-bold">{t('history.title')}</h1>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="daily" className="flex-1">{t('history.daily')}</TabsTrigger>
          <TabsTrigger value="weekly" className="flex-1">{t('history.weekly')}</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4 mt-4">
          {dates.length === 0 && (
            <p className="text-center text-muted-foreground py-8">{t('dashboard.noMeals')}</p>
          )}
          {dates.map(date => {
            const dayMeals = grouped[date];
            const dayCal = dayMeals.reduce((s, m) => s + Number(m.total_calories), 0);
            return (
              <div key={date} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{new Date(date).toLocaleDateString()}</h3>
                  <span className="text-xs text-muted-foreground">{Math.round(dayCal)} {t('dashboard.kcal')}</span>
                </div>
                {dayMeals.map(meal => (
                  <div key={meal.id} className="nutri-card flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-sm">
                      {meal.meal_type === 'breakfast' ? '🌅' : meal.meal_type === 'lunch' ? '☀️' : meal.meal_type === 'dinner' ? '🌙' : '🍎'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{mealTypeLabel(meal.meal_type)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{Math.round(Number(meal.total_calories))} {t('dashboard.kcal')}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          <div className="nutri-card space-y-3">
            <h3 className="font-semibold text-sm">{t('dashboard.weekSummary')} ({t('history.average')})</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-xl bg-muted">
                <p className="text-lg font-bold">{Math.round(weekAvg.calories)}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.kcal')}/{t('history.daily')}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted">
                <p className="text-lg font-bold text-protein">{Math.round(weekAvg.protein)}g</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.protein')}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted">
                <p className="text-lg font-bold text-fat">{Math.round(weekAvg.fat)}g</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.fat')}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted">
                <p className="text-lg font-bold text-carbs">{Math.round(weekAvg.carbs)}g</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.carbs')}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
