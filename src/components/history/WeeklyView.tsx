import { useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';
import type { MealEntry, WeightEntry, UserGoals } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import { TrendingDown, TrendingUp, Minus, Calendar, Utensils } from 'lucide-react';

interface WeeklyViewProps {
  meals: MealEntry[];
  weightEntries: WeightEntry[];
  goals: UserGoals | null;
  weekStart: Date;
}

export default function WeeklyView({ meals, weightEntries, goals, weekStart }: WeeklyViewProps) {
  const { t } = useTranslation();

  const weekData = useMemo(() => {
    const days: { date: string; label: string; calories: number; protein: number; fat: number; carbs: number; mealCount: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayMeals = meals.filter(m => m.entry_date === dateStr);
      days.push({
        date: dateStr,
        label: d.toLocaleDateString(undefined, { weekday: 'short' }),
        calories: dayMeals.reduce((s, m) => s + Number(m.total_calories), 0),
        protein: dayMeals.reduce((s, m) => s + Number(m.total_protein_g), 0),
        fat: dayMeals.reduce((s, m) => s + Number(m.total_fat_g), 0),
        carbs: dayMeals.reduce((s, m) => s + Number(m.total_carbs_g), 0),
        mealCount: dayMeals.length,
      });
    }
    return days;
  }, [meals, weekStart]);

  const trackedDays = weekData.filter(d => d.mealCount > 0).length;
  const totalMeals = weekData.reduce((s, d) => s + d.mealCount, 0);
  const avgCalories = trackedDays > 0 ? weekData.reduce((s, d) => s + d.calories, 0) / trackedDays : 0;
  const avgProtein = trackedDays > 0 ? weekData.reduce((s, d) => s + d.protein, 0) / trackedDays : 0;
  const avgFat = trackedDays > 0 ? weekData.reduce((s, d) => s + d.fat, 0) / trackedDays : 0;
  const avgCarbs = trackedDays > 0 ? weekData.reduce((s, d) => s + d.carbs, 0) / trackedDays : 0;

  // Weight change
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekStartStr = weekStart.toISOString().split('T')[0];
  const weekEndStr = weekEnd.toISOString().split('T')[0];

  const weekWeights = weightEntries
    .filter(w => w.entry_date >= weekStartStr && w.entry_date <= weekEndStr)
    .sort((a, b) => a.entry_date.localeCompare(b.entry_date));

  const weightChange = weekWeights.length >= 2
    ? Number(weekWeights[weekWeights.length - 1].weight_kg) - Number(weekWeights[0].weight_kg)
    : null;

  const calTarget = goals?.calorie_target || 2000;

  const weekLabel = `${weekStart.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} – ${weekEnd.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`;

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="font-semibold text-sm">{t('history.weekOverview')}: {weekLabel}</h2>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="nutri-card text-center">
          <Calendar className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
          <p className="text-xl font-bold">{trackedDays}<span className="text-sm font-normal text-muted-foreground">/7</span></p>
          <p className="text-[10px] text-muted-foreground">{t('history.trackedDays')}</p>
        </div>
        <div className="nutri-card text-center">
          <Utensils className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
          <p className="text-xl font-bold">{totalMeals}</p>
          <p className="text-[10px] text-muted-foreground">{t('history.mealsLogged')}</p>
        </div>
        <div className="nutri-card-highlight text-center">
          <p className="text-xl font-bold">{Math.round(avgCalories)}</p>
          <p className="text-[10px] text-muted-foreground">{t('history.avgPerDay')} {t('dashboard.kcal')}</p>
        </div>
        <div className="nutri-card text-center">
          {weightChange !== null ? (
            <>
              <div className="flex items-center justify-center gap-1 mb-0.5">
                {weightChange < 0 ? <TrendingDown className="h-4 w-4 text-primary" /> :
                  weightChange > 0 ? <TrendingUp className="h-4 w-4 text-destructive" /> :
                    <Minus className="h-4 w-4" />}
              </div>
              <p className={`text-xl font-bold ${weightChange < 0 ? 'text-primary' : weightChange > 0 ? 'text-destructive' : ''}`}>
                {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
              </p>
              <p className="text-[10px] text-muted-foreground">{t('history.weightChange')}</p>
            </>
          ) : (
            <>
              <p className="text-xl font-bold text-muted-foreground">–</p>
              <p className="text-[10px] text-muted-foreground">{t('history.weightChange')}</p>
            </>
          )}
        </div>
      </div>

      {/* Calorie chart */}
      <div className="nutri-card">
        <h3 className="font-semibold text-sm mb-3">{t('history.calorieChart')}</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weekData} barSize={28}>
            <XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '12px' }}
              formatter={(value: number) => [`${Math.round(value)} kcal`]}
            />
            <ReferenceLine y={calTarget} stroke="hsl(var(--primary))" strokeDasharray="4 4" strokeWidth={1.5} />
            <Bar dataKey="calories" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-2 mt-1">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-primary rounded" style={{ borderTop: '1.5px dashed' }} />
            <span className="text-[10px] text-muted-foreground">{t('dashboard.goal')}: {calTarget} {t('dashboard.kcal')}</span>
          </div>
        </div>
      </div>

      {/* Macro averages */}
      <div className="nutri-card">
        <h3 className="font-semibold text-sm mb-3">{t('history.macroSplit')} ({t('history.average')})</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-protein/10">
            <p className="text-lg font-bold text-protein">{Math.round(avgProtein)}g</p>
            <p className="text-[10px] text-muted-foreground">{t('dashboard.protein')}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-fat/10">
            <p className="text-lg font-bold text-fat">{Math.round(avgFat)}g</p>
            <p className="text-[10px] text-muted-foreground">{t('dashboard.fat')}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-carbs/10">
            <p className="text-lg font-bold text-carbs">{Math.round(avgCarbs)}g</p>
            <p className="text-[10px] text-muted-foreground">{t('dashboard.carbs')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
