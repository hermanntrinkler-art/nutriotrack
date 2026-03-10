import { useEffect, useState, useMemo, useRef } from 'react';
import type { Easing } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import type { UserGoals, MealEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, TrendingDown, TrendingUp, Minus, Flame, Zap, Dumbbell, Droplets, Sparkles, CalendarDays, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import WaterTracker from '@/components/WaterTracker';
import ReminderBanner from '@/components/ReminderBanner';
import CalendarHeatmap from '@/components/CalendarHeatmap';
import WeeklySummaryReport from '@/components/WeeklySummaryReport';
import MicronutrientCard from '@/components/MicronutrientCard';
import { fireConfetti } from '@/lib/confetti';
import { markTodayHasMeals, initReminders } from '@/components/ReminderSettings';

// --- Animated Macro Ring ---
function MacroRing({ label, current, target, color, icon: Icon, delay = 0 }: {
  label: string; current: number; target: number; color: string; icon: React.ElementType; delay?: number;
}) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <motion.div
      className="flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      <div className="relative w-[76px] h-[76px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" strokeWidth="5" className="stroke-muted/50" />
          <motion.circle
            cx="32" cy="32" r="28"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            stroke={color}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, delay: delay + 0.3, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${color}18` }}>
            <Icon className="h-4 w-4" style={{ color }} />
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-foreground tabular-nums">{Math.round(current)}g</p>
        <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
        <p className="text-[10px] text-muted-foreground tabular-nums">/ {target}g</p>
      </div>
    </motion.div>
  );
}

// --- Motivational messages ---
function getMotivationalMessage(calPct: number, language: string): string {
  if (language === 'de') {
    if (calPct === 0) return '🌟 Neuer Tag, neue Energie! Starte jetzt.';
    if (calPct < 30) return '🚀 Guter Start! Bleib am Ball.';
    if (calPct < 60) return '💪 Läuft super! Du bist auf Kurs.';
    if (calPct < 85) return '🔥 Fast geschafft! Starke Leistung.';
    if (calPct <= 100) return '🏆 Ziel fast erreicht! Perfekter Tag.';
    return '⚠️ Über dem Ziel – morgen packst du es!';
  }
  if (calPct === 0) return '🌟 New day, new energy! Let\'s go.';
  if (calPct < 30) return '🚀 Great start! Keep it up.';
  if (calPct < 60) return '💪 Going strong! You\'re on track.';
  if (calPct < 85) return '🔥 Almost there! Strong performance.';
  if (calPct <= 100) return '🏆 Goal almost reached! Perfect day.';
  return '⚠️ Over goal – you\'ll nail it tomorrow!';
}

// --- Calculate streak ---
function calculateStreak(meals: MealEntry[]): number {
  const uniqueDays = new Set(meals.map(m => m.entry_date));
  const today = new Date();
  let streak = 0;

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (uniqueDays.has(dateStr)) {
      streak++;
    } else {
      if (i === 0) continue;
      break;
    }
  }
  return streak;
}

// --- Widget visibility helper ---
type WidgetKey = 'yesterdayComparison' | '7dayTrend' | '30dayHeatmap' | 'weeklyReport' | 'micronutrients';

function getHiddenWidgets(): Set<WidgetKey> {
  try {
    const raw = localStorage.getItem('dashboard_hidden_widgets');
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

// --- Animation variants ---
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [goals, setGoals] = useState<UserGoals | null>(null);
  const [todayMeals, setTodayMeals] = useState<MealEntry[]>([]);
  const [allMeals, setAllMeals] = useState<MealEntry[]>([]);
  const [todayTotals, setTodayTotals] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0 });
  const [statsOpen, setStatsOpen] = useState(() => {
    try { return localStorage.getItem('dashboard_stats_collapsed') !== 'true'; } catch { return true; }
  });
  const [hiddenWidgets] = useState(() => getHiddenWidgets());

  useEffect(() => {
    localStorage.setItem('dashboard_stats_collapsed', statsOpen ? 'false' : 'true');
  }, [statsOpen]);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];

    supabase.from('user_goals').select('*').eq('user_id', user.id).single()
      .then(({ data }) => { if (data) setGoals(data as any); });

    supabase.from('meal_entries').select('*').eq('user_id', user.id).order('entry_date', { ascending: false })
      .then(({ data }) => {
        const meals = (data || []) as any as MealEntry[];
        setAllMeals(meals);
        const today_meals = meals.filter(m => m.entry_date === today);
        setTodayMeals(today_meals);
        setTodayTotals({
          calories: today_meals.reduce((s, m) => s + Number(m.total_calories), 0),
          protein: today_meals.reduce((s, m) => s + Number(m.total_protein_g), 0),
          fat: today_meals.reduce((s, m) => s + Number(m.total_fat_g), 0),
          carbs: today_meals.reduce((s, m) => s + Number(m.total_carbs_g), 0),
        });
        if (today_meals.length > 0) markTodayHasMeals();
        initReminders();
      });
  }, [user]);

  const streak = useMemo(() => calculateStreak(allMeals), [allMeals]);

  const weeklyReport = useMemo(() => {
    const today = new Date();
    const last7: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      last7.push(d.toISOString().split('T')[0]);
    }
    const weekMeals = allMeals.filter(m => last7.includes(m.entry_date));
    const daysWithData = new Set(weekMeals.map(m => m.entry_date)).size;
    const totalCal = weekMeals.reduce((s, m) => s + Number(m.total_calories), 0);
    const totalProtein = weekMeals.reduce((s, m) => s + Number(m.total_protein_g), 0);
    return {
      daysTracked: daysWithData,
      avgCalories: daysWithData > 0 ? Math.round(totalCal / daysWithData) : 0,
      avgProtein: daysWithData > 0 ? Math.round(totalProtein / daysWithData) : 0,
    };
  }, [allMeals]);

  const yesterdayTotals = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];
    const yMeals = allMeals.filter(m => m.entry_date === yStr);
    return {
      calories: yMeals.reduce((s, m) => s + Number(m.total_calories), 0),
      protein: yMeals.reduce((s, m) => s + Number(m.total_protein_g), 0),
      fat: yMeals.reduce((s, m) => s + Number(m.total_fat_g), 0),
      carbs: yMeals.reduce((s, m) => s + Number(m.total_carbs_g), 0),
    };
  }, [allMeals]);

  const last7DaysData = useMemo(() => {
    const today = new Date();
    const days: { label: string; calories: number; protein: number; fat: number; carbs: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayMeals = allMeals.filter(m => m.entry_date === dateStr);
      days.push({
        label: d.toLocaleDateString(undefined, { weekday: 'narrow' }),
        calories: dayMeals.reduce((s, m) => s + Number(m.total_calories), 0),
        protein: dayMeals.reduce((s, m) => s + Number(m.total_protein_g), 0),
        fat: dayMeals.reduce((s, m) => s + Number(m.total_fat_g), 0),
        carbs: dayMeals.reduce((s, m) => s + Number(m.total_carbs_g), 0),
      });
    }
    return days;
  }, [allMeals]);

  const calorieTarget = goals?.calorie_target || 2000;
  const remaining = calorieTarget - todayTotals.calories;
  const calPct = Math.min((todayTotals.calories / calorieTarget) * 100, 100);
  const circumference = 2 * Math.PI * 42;
  const calOffset = circumference - (calPct / 100) * circumference;

  const confettiFired = useRef(false);
  useEffect(() => {
    if (calPct >= 95 && calPct <= 105 && todayTotals.calories > 0 && !confettiFired.current) {
      confettiFired.current = true;
      const key = `confetti_cal_${new Date().toISOString().split('T')[0]}`;
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        setTimeout(() => fireConfetti(), 800);
      }
    }
  }, [calPct, todayTotals.calories]);

  const motivationalMsg = useMemo(() => getMotivationalMessage(calPct, language), [calPct, language]);

  const mealTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      breakfast: t('meals.breakfast'), lunch: t('meals.lunch'),
      dinner: t('meals.dinner'), snack: t('meals.snack'),
    };
    return map[type] || type;
  };

  const mealTypeIcon = (type: string) => {
    const map: Record<string, string> = {
      breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '⚡',
    };
    return map[type] || '🍽️';
  };

  const hints: string[] = [];
  if (remaining > 0) hints.push(t('hint.caloriesRemaining', { value: Math.round(remaining) }));
  else if (remaining < 0) hints.push(t('hint.overGoal'));
  const proteinRemaining = (goals?.protein_target_g || 0) - todayTotals.protein;
  if (proteinRemaining > 10) hints.push(t('hint.proteinMissing', { value: Math.round(proteinRemaining) }));
  const fatPct = goals?.fat_target_g ? todayTotals.fat / goals.fat_target_g : 0;
  if (fatPct >= 0.85 && fatPct < 1) hints.push(t('hint.fatAlmost'));

  const displayName = profile?.name || profile?.email?.split('@')[0] || '';
  const weeklyTrendPct = calorieTarget > 0 ? Math.round((weeklyReport.avgCalories / calorieTarget) * 100) : 0;

  const isWidgetVisible = (key: WidgetKey) => !hiddenWidgets.has(key);

  return (
    <motion.div
      className="page-container space-y-5 pb-24"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div className="flex items-center justify-between" variants={fadeUp}>
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t('dashboard.today')}</p>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {t('dashboard.hello')}, <span className="gradient-text">{displayName}</span> 💪
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Streak inline */}
          <motion.div
            className="sport-badge"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Flame className="h-3.5 w-3.5" />
            {streak} {t('dashboard.streak')}
          </motion.div>
        </div>
      </motion.div>

      {/* Reminder Banner */}
      <ReminderBanner hasMealsToday={todayMeals.length > 0} />

      {/* Calorie Ring + Macros combined card */}
      <motion.div
        className="nutri-card-highlight shadow-lg hover:shadow-xl transition-shadow duration-300"
        variants={fadeUp}
      >
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" className="stroke-muted/40" />
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                style={{ stroke: 'url(#calGradient)' }}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: calOffset }}
                transition={{ duration: 1.5, delay: 0.4, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="calGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--energy))" />
                </linearGradient>
              </defs>
            </svg>
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Flame className="h-3.5 w-3.5 text-primary mb-0.5" />
              <span className="text-xl font-black text-foreground tracking-tight tabular-nums">{Math.round(remaining)}</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t('dashboard.kcal')}</span>
            </motion.div>
          </div>

          <div className="flex-1 space-y-2">
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

        {/* Macro rings inline */}
        <div className="flex justify-around mt-4 pt-4 border-t border-border/50">
          <MacroRing
            label={t('dashboard.protein')}
            current={todayTotals.protein}
            target={goals?.protein_target_g || 150}
            color="hsl(var(--protein))"
            icon={Dumbbell}
            delay={0}
          />
          <MacroRing
            label={t('dashboard.fat')}
            current={todayTotals.fat}
            target={goals?.fat_target_g || 65}
            color="hsl(var(--fat))"
            icon={Droplets}
            delay={0.15}
          />
          <MacroRing
            label={t('dashboard.carbs')}
            current={todayTotals.carbs}
            target={goals?.carbs_target_g || 250}
            color="hsl(var(--carbs))"
            icon={Zap}
            delay={0.3}
          />
        </div>
      </motion.div>

      {/* Motivational + Streak inline */}
      <motion.div
        className="rounded-2xl p-3 border border-primary/20 bg-primary/5 flex items-center gap-2.5"
        variants={fadeUp}
      >
        <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
        <p className="text-sm font-medium text-foreground flex-1">{motivationalMsg}</p>
      </motion.div>

      {/* Today's Meals */}
      <motion.div className="space-y-3" variants={fadeUp}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold uppercase tracking-wider text-sm text-muted-foreground">{t('dashboard.recentMeals')}</h3>
          <motion.button
            onClick={() => navigate('/meals')}
            className="text-primary text-sm font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-4 w-4" /> {t('dashboard.addMeal')}
          </motion.button>
        </div>
        {todayMeals.length === 0 ? (
          <motion.div
            className="nutri-card text-center py-8 shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center">
              <Flame className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">{t('dashboard.noMeals')}</p>
            <Button className="mt-3 font-bold" onClick={() => navigate('/meals')}>
              <Plus className="h-4 w-4 mr-1" /> {t('dashboard.addMeal')}
            </Button>
          </motion.div>
        ) : (
          todayMeals.slice(0, 5).map((meal, i) => (
            <motion.div
              key={meal.id}
              onClick={() => navigate(`/meals/${meal.id}/edit`)}
              className="nutri-card flex items-center gap-3 cursor-pointer shadow-sm hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              whileHover={{ y: -2 }}
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
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Water Tracker */}
      <WaterTracker />

      {/* Hints */}
      {hints.length > 0 && (
        <motion.div
          className="rounded-2xl border border-primary/15 p-3 space-y-1.5 shadow-sm"
          style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.06), hsl(var(--gradient-end) / 0.06))' }}
          variants={fadeUp}
        >
          <h3 className="font-bold text-sm text-primary flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" /> {t('dashboard.hints')}
          </h3>
          {hints.map((hint, i) => (
            <p key={i} className="text-sm text-foreground/80">💡 {hint}</p>
          ))}
        </motion.div>
      )}

      {/* Weekly Summary Report (Sundays) */}
      <WeeklySummaryReport meals={allMeals} goals={goals} />

      {/* Collapsible Statistics Section */}
      <motion.div variants={fadeUp}>
        <button
          onClick={() => setStatsOpen(!statsOpen)}
          className="w-full flex items-center justify-between rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm px-4 py-3 transition-colors hover:border-primary/30"
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="font-bold text-sm text-foreground">
              📊 {language === 'de' ? 'Statistiken' : 'Statistics'}
            </span>
          </div>
          {statsOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {statsOpen && (
            <motion.div
              className="space-y-4 mt-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              {/* Yesterday Comparison */}
              {isWidgetVisible('yesterdayComparison') && (
                <div className="nutri-card shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                      {language === 'de' ? 'Vergleich zu gestern' : 'vs. Yesterday'}
                    </h3>
                  </div>
                  {yesterdayTotals.calories > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {([
                        { label: t('dashboard.kcal'), today: todayTotals.calories, yesterday: yesterdayTotals.calories, color: 'text-primary' },
                        { label: t('dashboard.protein'), today: todayTotals.protein, yesterday: yesterdayTotals.protein, color: 'text-protein' },
                        { label: t('dashboard.fat'), today: todayTotals.fat, yesterday: yesterdayTotals.fat, color: 'text-fat' },
                        { label: t('dashboard.carbs'), today: todayTotals.carbs, yesterday: yesterdayTotals.carbs, color: 'text-carbs' },
                      ] as const).map(({ label, today, yesterday, color }) => {
                        const diff = today - yesterday;
                        const diffPct = yesterday > 0 ? Math.round((diff / yesterday) * 100) : 0;
                        return (
                          <div key={label} className="text-center p-2 rounded-xl bg-muted/50">
                            <p className={`text-base font-black tabular-nums ${color}`}>
                              {Math.round(today)}{label !== t('dashboard.kcal') ? 'g' : ''}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
                            <div className="flex items-center justify-center gap-0.5 mt-1">
                              {diff > 0 ? <TrendingUp className="h-3 w-3 text-energy" /> : diff < 0 ? <TrendingDown className="h-3 w-3 text-primary" /> : <Minus className="h-3 w-3 text-muted-foreground" />}
                              <span className={`text-[10px] font-bold tabular-nums ${diff > 0 ? 'text-energy' : diff < 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                                {diff > 0 ? '+' : ''}{diffPct}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-3">
                      {language === 'de' ? 'Keine Daten von gestern' : 'No data from yesterday'}
                    </p>
                  )}
                </div>
              )}

              {/* 7-Day Trend */}
              {isWidgetVisible('7dayTrend') && (
                <div className="nutri-card shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                      {language === 'de' ? '7-Tage Trend' : '7-Day Trend'}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {([
                      { key: 'calories' as const, label: t('dashboard.kcal'), color: 'hsl(var(--primary))' },
                      { key: 'protein' as const, label: t('dashboard.protein'), color: 'hsl(var(--protein))' },
                      { key: 'fat' as const, label: t('dashboard.fat'), color: 'hsl(var(--fat))' },
                      { key: 'carbs' as const, label: t('dashboard.carbs'), color: 'hsl(var(--carbs))' },
                    ]).map(({ key, label, color }) => {
                      const values = last7DaysData.map(d => d[key]);
                      const max = Math.max(...values, 1);
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-muted-foreground w-12 text-right">{label}</span>
                          <div className="flex-1 flex items-end gap-0.5 h-6">
                            {values.map((v, i) => (
                              <motion.div
                                key={i}
                                className="flex-1 rounded-sm"
                                style={{ backgroundColor: color, opacity: i === 6 ? 1 : 0.5 }}
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max((v / max) * 100, 4)}%` }}
                                transition={{ duration: 0.6, delay: i * 0.05 }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold tabular-nums text-foreground w-10">
                            {Math.round(values[6])}{key !== 'calories' ? 'g' : ''}
                          </span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between px-12 mt-1">
                      {last7DaysData.map((d, i) => (
                        <span key={i} className={`text-[8px] font-medium flex-1 text-center ${i === 6 ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {d.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Calendar Heatmap */}
              {isWidgetVisible('30dayHeatmap') && (
                <CalendarHeatmap meals={allMeals} calorieTarget={calorieTarget} />
              )}

              {/* Weekly Report */}
              {isWidgetVisible('weeklyReport') && (
                <div className="nutri-card shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                      {t('dashboard.weeklyReport')}
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 rounded-xl bg-muted/50">
                      <p className="text-lg font-black text-foreground tabular-nums">{weeklyReport.avgCalories}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{t('dashboard.avgCalories')}</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-muted/50">
                      <p className="text-lg font-black text-protein tabular-nums">{weeklyReport.avgProtein}g</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{t('dashboard.avgProtein')}</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-muted/50">
                      <p className="text-lg font-black text-foreground tabular-nums">{weeklyReport.daysTracked}<span className="text-xs text-muted-foreground">/7</span></p>
                      <p className="text-[10px] text-muted-foreground font-medium">{t('dashboard.daysTracked')}</p>
                    </div>
                  </div>
                  {weeklyReport.daysTracked > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--energy)))` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(weeklyTrendPct, 100)}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground tabular-nums">{weeklyTrendPct}%</span>
                    </div>
                  )}
                </div>
              )}

              {/* Micronutrients */}
              {isWidgetVisible('micronutrients') && <MicronutrientCard />}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* FAB - Floating Action Button */}
      <motion.button
        onClick={() => navigate('/meals')}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </motion.div>
  );
}
