import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import type { UserGoals, MealEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function MacroBar({ label, current, target, color }: { label: string; current: number; target: number; color: string }) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{Math.round(current)} / {target} g</span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div className={`macro-bar ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [goals, setGoals] = useState<UserGoals | null>(null);
  const [todayMeals, setTodayMeals] = useState<MealEntry[]>([]);
  const [todayTotals, setTodayTotals] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0 });

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];

    supabase.from('user_goals').select('*').eq('user_id', user.id).single()
      .then(({ data }) => { if (data) setGoals(data as any); });

    supabase.from('meal_entries').select('*').eq('user_id', user.id).eq('entry_date', today).order('created_at', { ascending: false })
      .then(({ data }) => {
        const meals = (data || []) as any as MealEntry[];
        setTodayMeals(meals);
        setTodayTotals({
          calories: meals.reduce((s, m) => s + Number(m.total_calories), 0),
          protein: meals.reduce((s, m) => s + Number(m.total_protein_g), 0),
          fat: meals.reduce((s, m) => s + Number(m.total_fat_g), 0),
          carbs: meals.reduce((s, m) => s + Number(m.total_carbs_g), 0),
        });
      });
  }, [user]);

  const calorieTarget = goals?.calorie_target || 2000;
  const remaining = calorieTarget - todayTotals.calories;
  const calPct = Math.min((todayTotals.calories / calorieTarget) * 100, 100);

  const mealTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      breakfast: t('meals.breakfast'),
      lunch: t('meals.lunch'),
      dinner: t('meals.dinner'),
      snack: t('meals.snack'),
    };
    return map[type] || type;
  };

  // Generate hints
  const hints: string[] = [];
  if (remaining > 0) {
    hints.push(t('hint.caloriesRemaining', { value: Math.round(remaining) }));
  } else if (remaining < 0) {
    hints.push(t('hint.overGoal'));
  }
  const proteinRemaining = (goals?.protein_target_g || 0) - todayTotals.protein;
  if (proteinRemaining > 10) {
    hints.push(t('hint.proteinMissing', { value: Math.round(proteinRemaining) }));
  }
  const fatPct = goals?.fat_target_g ? todayTotals.fat / goals.fat_target_g : 0;
  if (fatPct >= 0.85 && fatPct < 1) {
    hints.push(t('hint.fatAlmost'));
  }

  const displayName = profile?.name || profile?.email?.split('@')[0] || '';

  return (
    <div className="page-container space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{t('dashboard.hello')}, {displayName} 👋</h1>
          <p className="text-sm text-muted-foreground">{t('dashboard.today')}</p>
        </div>
      </div>

      {/* Calorie Ring Card */}
      <div className="nutri-card-highlight">
        <div className="flex items-center gap-6">
          {/* Circular progress */}
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" strokeWidth="10" className="stroke-muted" />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                className="stroke-primary transition-all duration-700"
                strokeDasharray={`${calPct * 2.64} ${264 - calPct * 2.64}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-foreground">{Math.round(remaining)}</span>
              <span className="text-[10px] text-muted-foreground">{t('dashboard.kcal')}</span>
              <span className="text-[10px] text-muted-foreground">{t('dashboard.remaining')}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('dashboard.eaten')}</span>
              <span className="font-semibold">{Math.round(todayTotals.calories)} {t('dashboard.kcal')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('dashboard.goal')}</span>
              <span className="font-semibold">{calorieTarget} {t('dashboard.kcal')}</span>
            </div>
            <div className="h-px bg-border my-1" />
            <div className="flex items-center gap-1 text-sm">
              {remaining > 0 ? (
                <TrendingDown className="h-3.5 w-3.5 text-primary" />
              ) : remaining < 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-destructive" />
              ) : (
                <Minus className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              <span className={remaining >= 0 ? 'text-primary font-medium' : 'text-destructive font-medium'}>
                {Math.abs(Math.round(remaining))} {t('dashboard.kcal')} {t('dashboard.remaining')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Macros */}
      <div className="nutri-card space-y-3">
        <h3 className="font-semibold text-sm">{t('dashboard.protein')} / {t('dashboard.fat')} / {t('dashboard.carbs')}</h3>
        <MacroBar label={t('dashboard.protein')} current={todayTotals.protein} target={goals?.protein_target_g || 150} color="bg-protein" />
        <MacroBar label={t('dashboard.fat')} current={todayTotals.fat} target={goals?.fat_target_g || 65} color="bg-fat" />
        <MacroBar label={t('dashboard.carbs')} current={todayTotals.carbs} target={goals?.carbs_target_g || 250} color="bg-carbs" />
      </div>

      {/* Hints */}
      {hints.length > 0 && (
        <div className="nutri-card bg-accent/50 space-y-2">
          <h3 className="font-semibold text-sm text-accent-foreground">{t('dashboard.hints')}</h3>
          {hints.map((hint, i) => (
            <p key={i} className="text-sm text-accent-foreground/80">💡 {hint}</p>
          ))}
        </div>
      )}

      {/* Recent meals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{t('dashboard.recentMeals')}</h3>
          <button onClick={() => navigate('/meals')} className="text-primary text-sm font-medium flex items-center gap-1">
            <Plus className="h-4 w-4" /> {t('dashboard.addMeal')}
          </button>
        </div>
        {todayMeals.length === 0 ? (
          <div className="nutri-card text-center py-8">
            <p className="text-muted-foreground text-sm">{t('dashboard.noMeals')}</p>
            <Button variant="outline" className="mt-3" onClick={() => navigate('/meals')}>
              <Plus className="h-4 w-4 mr-1" /> {t('dashboard.addMeal')}
            </Button>
          </div>
        ) : (
          todayMeals.slice(0, 5).map(meal => (
            <div key={meal.id} className="nutri-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-lg">
                {meal.meal_type === 'breakfast' ? '🌅' : meal.meal_type === 'lunch' ? '☀️' : meal.meal_type === 'dinner' ? '🌙' : '🍎'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{mealTypeLabel(meal.meal_type)}</p>
                <p className="text-xs text-muted-foreground">{Math.round(Number(meal.total_calories))} {t('dashboard.kcal')}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>{Math.round(Number(meal.total_protein_g))}P / {Math.round(Number(meal.total_fat_g))}F / {Math.round(Number(meal.total_carbs_g))}C</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
