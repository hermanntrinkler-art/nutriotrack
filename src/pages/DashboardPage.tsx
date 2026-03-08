import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import type { UserGoals, MealEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, TrendingDown, TrendingUp, Minus, Flame, Zap, Dumbbell, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function MacroRing({ label, current, target, color, icon: Icon }: {
  label: string; current: number; target: number; color: string; icon: React.ElementType;
}) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-[72px] h-[72px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" strokeWidth="5" className="stroke-muted" />
          <circle
            cx="32" cy="32" r="28"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            stroke={color}
            className="transition-all duration-700"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-foreground">{Math.round(current)}g</p>
        <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
        <p className="text-[10px] text-muted-foreground">/ {target}g</p>
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

  const mealTypeIcon = (type: string) => {
    const map: Record<string, string> = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '⚡',
    };
    return map[type] || '🍽️';
  };

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
    <div className="page-container space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t('dashboard.today')}</p>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {t('dashboard.hello')}, <span className="gradient-text">{displayName}</span> 💪
          </h1>
        </div>
        <div className="sport-badge">
          <Flame className="h-3.5 w-3.5" />
          {t('dashboard.goal')}
        </div>
      </div>

      {/* Calorie Ring Card */}
      <div className="nutri-card-highlight">
        <div className="flex items-center gap-6">
          {/* Circular progress */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" className="stroke-muted" />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className="transition-all duration-1000"
                style={{
                  stroke: 'url(#calGradient)',
                  strokeDasharray: `${calPct * 2.64} ${264 - calPct * 2.64}`,
                }}
              />
              <defs>
                <linearGradient id="calGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(153, 58%, 45%)" />
                  <stop offset="50%" stopColor="hsl(168, 70%, 38%)" />
                  <stop offset="100%" stopColor="hsl(32, 95%, 55%)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Flame className="h-4 w-4 text-primary mb-0.5" />
              <span className="text-2xl font-black text-foreground tracking-tight">{Math.round(remaining)}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('dashboard.kcal')}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">{t('dashboard.eaten')}</span>
              <span className="font-bold tabular-nums">{Math.round(todayTotals.calories)} <span className="text-muted-foreground font-normal text-xs">{t('dashboard.kcal')}</span></span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">{t('dashboard.goal')}</span>
              <span className="font-bold tabular-nums">{calorieTarget} <span className="text-muted-foreground font-normal text-xs">{t('dashboard.kcal')}</span></span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center gap-1.5 text-sm">
              {remaining > 0 ? (
                <TrendingDown className="h-4 w-4 text-primary" />
              ) : remaining < 0 ? (
                <TrendingUp className="h-4 w-4 text-destructive" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={`font-bold ${remaining >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {Math.abs(Math.round(remaining))} {t('dashboard.kcal')}
              </span>
              <span className="text-muted-foreground text-xs">{t('dashboard.remaining')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Macros as rings */}
      <div className="nutri-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">{t('dashboard.protein')} / {t('dashboard.fat')} / {t('dashboard.carbs')}</h3>
        </div>
        <div className="flex justify-around">
          <MacroRing
            label={t('dashboard.protein')}
            current={todayTotals.protein}
            target={goals?.protein_target_g || 150}
            color="hsl(210, 80%, 55%)"
            icon={Dumbbell}
          />
          <MacroRing
            label={t('dashboard.fat')}
            current={todayTotals.fat}
            target={goals?.fat_target_g || 65}
            color="hsl(38, 92%, 55%)"
            icon={Droplets}
          />
          <MacroRing
            label={t('dashboard.carbs')}
            current={todayTotals.carbs}
            target={goals?.carbs_target_g || 250}
            color="hsl(153, 58%, 45%)"
            icon={Zap}
          />
        </div>
      </div>

      {/* Hints */}
      {hints.length > 0 && (
        <div className="glass-card space-y-2" style={{
          background: 'linear-gradient(135deg, hsl(153 58% 45% / 0.06), hsl(168 70% 38% / 0.06))',
        }}>
          <h3 className="font-bold text-sm text-primary flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" /> {t('dashboard.hints')}
          </h3>
          {hints.map((hint, i) => (
            <p key={i} className="text-sm text-foreground/80">💡 {hint}</p>
          ))}
        </div>
      )}

      {/* Recent meals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold uppercase tracking-wider text-sm text-muted-foreground">{t('dashboard.recentMeals')}</h3>
          <button onClick={() => navigate('/meals')} className="text-primary text-sm font-bold flex items-center gap-1 hover:opacity-80 transition-opacity">
            <Plus className="h-4 w-4" /> {t('dashboard.addMeal')}
          </button>
        </div>
        {todayMeals.length === 0 ? (
          <div className="nutri-card text-center py-10">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center">
              <Flame className="h-7 w-7 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">{t('dashboard.noMeals')}</p>
            <Button className="mt-4 font-bold" onClick={() => navigate('/meals')}>
              <Plus className="h-4 w-4 mr-1" /> {t('dashboard.addMeal')}
            </Button>
          </div>
        ) : (
          todayMeals.slice(0, 5).map(meal => (
            <div
              key={meal.id}
              onClick={() => navigate(`/meals/${meal.id}/edit`)}
              className="nutri-card flex items-center gap-3 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98]"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center text-lg">
                {mealTypeIcon(meal.meal_type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{mealTypeLabel(meal.meal_type)}</p>
                <p className="text-xs text-muted-foreground font-medium">{Math.round(Number(meal.total_calories))} {t('dashboard.kcal')}</p>
              </div>
              <div className="text-right">
                <div className="flex gap-2 text-[11px] font-semibold">
                  <span className="text-protein">{Math.round(Number(meal.total_protein_g))}P</span>
                  <span className="text-fat">{Math.round(Number(meal.total_fat_g))}F</span>
                  <span className="text-carbs">{Math.round(Number(meal.total_carbs_g))}C</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
