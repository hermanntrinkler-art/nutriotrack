import { useTranslation } from '@/lib/i18n';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { MealEntry, UserGoals, ActivityEntry } from '@/lib/types';
import { Flame } from 'lucide-react';

function MacroProgress({ label, current, target, color }: { label: string; current: number; target: number; color: string }) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const remaining = Math.max(target - current, 0);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{Math.round(current)} / {target} g</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-muted-foreground text-right">{Math.round(remaining)} g übrig</p>
    </div>
  );
}

interface DailyViewProps {
  meals: MealEntry[];
  selectedDate: string;
  goals: UserGoals | null;
}

export default function DailyView({ meals, selectedDate, goals }: DailyViewProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('activity_entries').select('*').eq('user_id', user.id).eq('entry_date', selectedDate)
      .then(({ data }) => setActivities((data || []) as any as ActivityEntry[]));
  }, [user, selectedDate]);

  const dayMeals = meals.filter(m => m.entry_date === selectedDate);
  const totalBurned = activities.reduce((s, a) => s + Number(a.calories_burned), 0);

  const totals = {
    calories: dayMeals.reduce((s, m) => s + Number(m.total_calories), 0),
    protein: dayMeals.reduce((s, m) => s + Number(m.total_protein_g), 0),
    fat: dayMeals.reduce((s, m) => s + Number(m.total_fat_g), 0),
    carbs: dayMeals.reduce((s, m) => s + Number(m.total_carbs_g), 0),
  };

  const calTarget = goals?.calorie_target || 2000;
  const calRemaining = calTarget - totals.calories + totalBurned;
  const calPct = Math.min((totals.calories / calTarget) * 100, 100);

  const mealEmoji: Record<string, string> = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };
  const mealTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      breakfast: t('meals.breakfast'), lunch: t('meals.lunch'),
      dinner: t('meals.dinner'), snack: t('meals.snack'),
    };
    return map[type] || type;
  };

  const dateObj = new Date(selectedDate + 'T00:00:00');
  const dateFormatted = dateObj.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Date header */}
      <h2 className="font-semibold text-sm capitalize">{dateFormatted}</h2>

      {/* Calorie summary card */}
      <div className="nutri-card-highlight">
        <div className="flex items-center gap-5">
          {/* Ring */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" strokeWidth="10" className="stroke-muted" />
              <circle cx="50" cy="50" r="40" fill="none" strokeWidth="10" strokeLinecap="round"
                className="stroke-primary transition-all duration-700"
                strokeDasharray={`${calPct * 2.51} ${251 - calPct * 2.51}`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold">{Math.round(calRemaining > 0 ? calRemaining : 0)}</span>
              <span className="text-[9px] text-muted-foreground">{t('dashboard.remaining')}</span>
            </div>
          </div>
          {/* Stats */}
          <div className="flex-1 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('dashboard.eaten')}</span>
              <span className="font-semibold">{Math.round(totals.calories)} {t('dashboard.kcal')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('dashboard.goal')}</span>
              <span className="font-semibold">{calTarget} {t('dashboard.kcal')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('history.remainingGoal')}</span>
              <span className={`font-semibold ${calRemaining >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {Math.round(calRemaining)} {t('dashboard.kcal')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Macro progress */}
      <div className="nutri-card space-y-3">
        <h3 className="font-semibold text-sm">{t('history.macroSplit')}</h3>
        <MacroProgress label={t('dashboard.protein')} current={totals.protein} target={goals?.protein_target_g || 150} color="bg-protein" />
        <MacroProgress label={t('dashboard.fat')} current={totals.fat} target={goals?.fat_target_g || 65} color="bg-fat" />
        <MacroProgress label={t('dashboard.carbs')} current={totals.carbs} target={goals?.carbs_target_g || 250} color="bg-carbs" />
      </div>

      {/* Burned calories */}
      {totalBurned > 0 && (
        <div className="nutri-card">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-energy" />
            <h3 className="font-semibold text-sm">{language === 'de' ? 'Verbrannt' : 'Burned'}</h3>
            <span className="ml-auto text-sm font-bold text-energy">+{Math.round(totalBurned)} kcal</span>
          </div>
          <div className="space-y-1">
            {activities.map(act => (
              <div key={act.id} className="flex items-center gap-2 text-xs">
                <span>{act.emoji || '🏃'}</span>
                <span className="flex-1">{act.activity_name}</span>
                {act.duration_minutes && <span className="text-muted-foreground">{act.duration_minutes} min</span>}
                <span className="text-energy font-semibold">+{Math.round(Number(act.calories_burned))} kcal</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meals list */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">{t('dashboard.recentMeals')} ({dayMeals.length})</h3>
        {dayMeals.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-6">{t('history.noData')}</p>
        ) : (
          dayMeals.map(meal => (
            <div key={meal.id} className="nutri-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-lg">
                {mealEmoji[meal.meal_type] || '🍽️'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{mealTypeLabel(meal.meal_type)}</p>
                <p className="text-xs text-muted-foreground">
                  {meal.entry_time ? meal.entry_time.slice(0, 5) : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{Math.round(Number(meal.total_calories))} {t('dashboard.kcal')}</p>
                <p className="text-[10px] text-muted-foreground">
                  P{Math.round(Number(meal.total_protein_g))} F{Math.round(Number(meal.total_fat_g))} C{Math.round(Number(meal.total_carbs_g))}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
