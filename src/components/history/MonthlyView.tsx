import { useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';
import type { MealEntry, WeightEntry, UserGoals } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';
import { Trophy, AlertTriangle, Calendar, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface MonthlyViewProps {
  meals: MealEntry[];
  weightEntries: WeightEntry[];
  goals: UserGoals | null;
  month: Date; // first day of month
}

export default function MonthlyView({ meals, weightEntries, goals, month }: MonthlyViewProps) {
  const { t } = useTranslation();

  const calTarget = goals?.calorie_target || 2000;

  const monthData = useMemo(() => {
    const year = month.getFullYear();
    const m = month.getMonth();
    const daysInMonth = new Date(year, m + 1, 0).getDate();

    const days: { date: string; day: number; calories: number; protein: number; fat: number; carbs: number; mealCount: number }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayMeals = meals.filter(ml => ml.entry_date === dateStr);
      days.push({
        date: dateStr,
        day: d,
        calories: dayMeals.reduce((s, ml) => s + Number(ml.total_calories), 0),
        protein: dayMeals.reduce((s, ml) => s + Number(ml.total_protein_g), 0),
        fat: dayMeals.reduce((s, ml) => s + Number(ml.total_fat_g), 0),
        carbs: dayMeals.reduce((s, ml) => s + Number(ml.total_carbs_g), 0),
        mealCount: dayMeals.length,
      });
    }
    return days;
  }, [meals, month]);

  const trackedDays = monthData.filter(d => d.mealCount > 0);
  const trackedCount = trackedDays.length;
  const totalMeals = monthData.reduce((s, d) => s + d.mealCount, 0);

  const avgCalories = trackedCount > 0 ? trackedDays.reduce((s, d) => s + d.calories, 0) / trackedCount : 0;
  const avgProtein = trackedCount > 0 ? trackedDays.reduce((s, d) => s + d.protein, 0) / trackedCount : 0;
  const avgFat = trackedCount > 0 ? trackedDays.reduce((s, d) => s + d.fat, 0) / trackedCount : 0;
  const avgCarbs = trackedCount > 0 ? trackedDays.reduce((s, d) => s + d.carbs, 0) / trackedCount : 0;

  // Best and worst days (only tracked days)
  const bestDay = trackedDays.length > 0
    ? trackedDays.reduce((best, d) => Math.abs(d.calories - calTarget) < Math.abs(best.calories - calTarget) ? d : best)
    : null;
  const worstDay = trackedDays.length > 0
    ? trackedDays.reduce((worst, d) => Math.abs(d.calories - calTarget) > Math.abs(worst.calories - calTarget) ? d : worst)
    : null;

  // Weight data for the month
  const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
  const monthWeights = weightEntries
    .filter(w => w.entry_date.startsWith(monthStr))
    .sort((a, b) => a.entry_date.localeCompare(b.entry_date));

  const weightChange = monthWeights.length >= 2
    ? Number(monthWeights[monthWeights.length - 1].weight_kg) - Number(monthWeights[0].weight_kg)
    : null;

  const weightChartData = monthWeights.map(w => ({
    day: new Date(w.entry_date).getDate(),
    weight: Number(w.weight_kg),
  }));

  // Calorie chart: show every other day label for readability
  const calChartData = monthData.map(d => ({
    day: d.day,
    calories: d.mealCount > 0 ? d.calories : null,
  }));

  const monthLabel = month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="font-semibold text-sm capitalize">{t('history.monthOverview')}: {monthLabel}</h2>

      {trackedCount === 0 ? (
        <p className="text-center text-muted-foreground text-sm py-8">{t('history.noData')}</p>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="nutri-card text-center py-3">
              <Calendar className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-lg font-bold">{trackedCount}</p>
              <p className="text-[9px] text-muted-foreground">{t('history.trackedDays')}</p>
            </div>
            <div className="nutri-card-highlight text-center py-3">
              <p className="text-lg font-bold">{Math.round(avgCalories)}</p>
              <p className="text-[9px] text-muted-foreground">{t('history.avgPerDay')}</p>
            </div>
            <div className="nutri-card text-center py-3">
              {weightChange !== null ? (
                <>
                  <div className="flex items-center justify-center mb-0.5">
                    {weightChange < 0 ? <TrendingDown className="h-3.5 w-3.5 text-primary" /> :
                      weightChange > 0 ? <TrendingUp className="h-3.5 w-3.5 text-destructive" /> :
                        <Minus className="h-3.5 w-3.5" />}
                  </div>
                  <p className={`text-lg font-bold ${weightChange < 0 ? 'text-primary' : weightChange > 0 ? 'text-destructive' : ''}`}>
                    {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}
                  </p>
                  <p className="text-[9px] text-muted-foreground">kg</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-muted-foreground">–</p>
                  <p className="text-[9px] text-muted-foreground">kg</p>
                </>
              )}
            </div>
          </div>

          {/* Calorie trend chart */}
          <div className="nutri-card">
            <h3 className="font-semibold text-sm mb-3">{t('history.calorieChart')}</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={calChartData} barSize={6}>
                <XAxis dataKey="day" tick={{ fontSize: 8 }} axisLine={false} tickLine={false}
                  interval={Math.floor(monthData.length / 8)} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '11px' }}
                  formatter={(value: number | null) => value !== null ? [`${Math.round(value)} kcal`] : ['–']}
                />
                <Bar dataKey="calories" radius={[3, 3, 0, 0]} fill="hsl(var(--primary))" opacity={0.75} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weight chart */}
          {weightChartData.length > 1 && (
            <div className="nutri-card">
              <h3 className="font-semibold text-sm mb-3">{t('dashboard.weightProgress')}</h3>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={weightChartData}>
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{ fontSize: 9 }} width={30} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '11px' }}
                    formatter={(value: number) => [`${value.toFixed(1)} kg`]}
                  />
                  <Line type="monotone" dataKey="weight" stroke="hsl(165, 60%, 40%)" strokeWidth={2} dot={{ r: 2.5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Macro averages */}
          <div className="nutri-card">
            <h3 className="font-semibold text-sm mb-3">{t('history.macroSplit')} ({t('history.average')})</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2.5 rounded-xl bg-protein/10">
                <p className="text-base font-bold text-protein">{Math.round(avgProtein)}g</p>
                <p className="text-[9px] text-muted-foreground">{t('dashboard.protein')}</p>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-fat/10">
                <p className="text-base font-bold text-fat">{Math.round(avgFat)}g</p>
                <p className="text-[9px] text-muted-foreground">{t('dashboard.fat')}</p>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-carbs/10">
                <p className="text-base font-bold text-carbs">{Math.round(avgCarbs)}g</p>
                <p className="text-[9px] text-muted-foreground">{t('dashboard.carbs')}</p>
              </div>
            </div>
          </div>

          {/* Best & worst day */}
          <div className="grid grid-cols-2 gap-3">
            {bestDay && (
              <div className="nutri-card space-y-1">
                <div className="flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-primary">{t('history.bestDay')}</span>
                </div>
                <p className="text-sm font-bold">{formatDate(bestDay.date)}</p>
                <p className="text-[10px] text-muted-foreground">{Math.round(bestDay.calories)} {t('dashboard.kcal')}</p>
                <p className="text-[10px] text-primary">{t('history.closestToGoal')}</p>
              </div>
            )}
            {worstDay && (
              <div className="nutri-card space-y-1">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                  <span className="text-xs font-medium text-warning">{t('history.worstDay')}</span>
                </div>
                <p className="text-sm font-bold">{formatDate(worstDay.date)}</p>
                <p className="text-[10px] text-muted-foreground">{Math.round(worstDay.calories)} {t('dashboard.kcal')}</p>
                <p className="text-[10px] text-warning">
                  {worstDay.calories > calTarget ? t('history.overGoal') : t('history.underGoal')}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
