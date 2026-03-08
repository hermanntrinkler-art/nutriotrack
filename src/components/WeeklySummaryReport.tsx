import { useState, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Target, X, Lightbulb, Award, Utensils, Flame, ChevronRight } from 'lucide-react';
import type { MealEntry, UserGoals } from '@/lib/types';

interface Props {
  meals: MealEntry[];
  goals: UserGoals | null;
}

export default function WeeklySummaryReport({ meals, goals }: Props) {
  const { language } = useTranslation();
  const [dismissed, setDismissed] = useState(false);

  const isSunday = new Date().getDay() === 0;
  const dismissKey = `nutri-weekly-dismissed-${new Date().toISOString().split('T')[0]}`;

  const report = useMemo(() => {
    if (!isSunday) return null;

    const today = new Date();
    const thisWeek: string[] = [];
    const prevWeek: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d1 = new Date(today); d1.setDate(d1.getDate() - i);
      thisWeek.push(d1.toISOString().split('T')[0]);
      const d2 = new Date(today); d2.setDate(d2.getDate() - 7 - i);
      prevWeek.push(d2.toISOString().split('T')[0]);
    }

    const weekMeals = meals.filter(m => thisWeek.includes(m.entry_date));
    const prevMeals = meals.filter(m => prevWeek.includes(m.entry_date));

    const daysTracked = new Set(weekMeals.map(m => m.entry_date)).size;
    const prevDaysTracked = new Set(prevMeals.map(m => m.entry_date)).size;
    const totalMeals = weekMeals.length;
    const totalCal = weekMeals.reduce((s, m) => s + Number(m.total_calories), 0);
    const totalProtein = weekMeals.reduce((s, m) => s + Number(m.total_protein_g), 0);
    const totalFat = weekMeals.reduce((s, m) => s + Number(m.total_fat_g), 0);
    const totalCarbs = weekMeals.reduce((s, m) => s + Number(m.total_carbs_g), 0);
    const avgCal = daysTracked > 0 ? Math.round(totalCal / daysTracked) : 0;
    const avgProtein = daysTracked > 0 ? Math.round(totalProtein / daysTracked) : 0;

    const prevTotalCal = prevMeals.reduce((s, m) => s + Number(m.total_calories), 0);
    const prevAvgCal = prevDaysTracked > 0 ? Math.round(prevTotalCal / prevDaysTracked) : 0;
    const calChange = prevAvgCal > 0 ? Math.round(((avgCal - prevAvgCal) / prevAvgCal) * 100) : 0;

    // Best day (closest to goal)
    const calTarget = goals?.calorie_target || 2000;
    const dayMap = new Map<string, number>();
    weekMeals.forEach(m => {
      dayMap.set(m.entry_date, (dayMap.get(m.entry_date) || 0) + Number(m.total_calories));
    });
    let bestDay = '';
    let bestDiff = Infinity;
    dayMap.forEach((cal, date) => {
      const diff = Math.abs(cal - calTarget);
      if (diff < bestDiff) { bestDiff = diff; bestDay = date; }
    });

    // Days on target (within 10%)
    let daysOnTarget = 0;
    dayMap.forEach(cal => {
      if (Math.abs(cal - calTarget) / calTarget <= 0.1) daysOnTarget++;
    });

    // Protein goal hit rate
    const proteinTarget = goals?.protein_target_g || 150;
    let proteinGoalDays = 0;
    const proteinMap = new Map<string, number>();
    weekMeals.forEach(m => {
      proteinMap.set(m.entry_date, (proteinMap.get(m.entry_date) || 0) + Number(m.total_protein_g));
    });
    proteinMap.forEach(p => { if (p >= proteinTarget * 0.9) proteinGoalDays++; });

    // Highlights
    const highlights: { icon: React.ReactNode; text: string }[] = [];
    if (daysTracked >= 7) {
      highlights.push({
        icon: <Trophy className="h-4 w-4 text-energy" />,
        text: language === 'de' ? '🏆 Perfekte Woche! Jeden Tag geloggt.' : '🏆 Perfect week! Logged every day.',
      });
    } else if (daysTracked >= 5) {
      highlights.push({
        icon: <Award className="h-4 w-4 text-primary" />,
        text: language === 'de' ? `💪 ${daysTracked}/7 Tage geloggt – starke Woche!` : `💪 ${daysTracked}/7 days logged – strong week!`,
      });
    }
    if (daysOnTarget >= 3) {
      highlights.push({
        icon: <Target className="h-4 w-4 text-primary" />,
        text: language === 'de' ? `🎯 ${daysOnTarget} Tage im Kalorienziel` : `🎯 ${daysOnTarget} days on calorie target`,
      });
    }
    if (calChange < -5) {
      highlights.push({
        icon: <TrendingDown className="h-4 w-4 text-primary" />,
        text: language === 'de' ? `📉 ${Math.abs(calChange)}% weniger Kalorien als letzte Woche` : `📉 ${Math.abs(calChange)}% fewer calories than last week`,
      });
    }

    // Suggestions
    const suggestions: string[] = [];
    if (daysTracked < 5) {
      suggestions.push(language === 'de' ? 'Versuche nächste Woche mindestens 5 Tage zu loggen.' : 'Try to log at least 5 days next week.');
    }
    if (proteinGoalDays < daysTracked * 0.5 && daysTracked > 0) {
      suggestions.push(language === 'de' ? `Dein Protein lag oft unter dem Ziel (${proteinTarget}g). Mehr Eier, Quark oder Hähnchen!` : `Your protein was often below target (${proteinTarget}g). Try more eggs, yogurt, or chicken!`);
    }
    if (avgCal > calTarget * 1.1) {
      suggestions.push(language === 'de' ? `Im Schnitt ${avgCal - calTarget} kcal über dem Ziel. Portionsgrößen prüfen.` : `Averaged ${avgCal - calTarget} kcal over target. Check portion sizes.`);
    }
    if (avgCal < calTarget * 0.7 && avgCal > 0) {
      suggestions.push(language === 'de' ? 'Du isst deutlich unter deinem Ziel. Achte auf ausreichende Nährstoffzufuhr.' : "You're eating well below your target. Ensure adequate nutrient intake.");
    }
    if (suggestions.length === 0) {
      suggestions.push(language === 'de' ? 'Weiter so! Konsistenz ist der Schlüssel zum Erfolg. 🔑' : 'Keep it up! Consistency is key. 🔑');
    }

    return {
      daysTracked, totalMeals, avgCal, avgProtein, calChange, prevAvgCal,
      bestDay, daysOnTarget, highlights, suggestions, proteinGoalDays,
    };
  }, [meals, goals, language, isSunday]);

  if (!isSunday || !report || report.daysTracked === 0) return null;
  if (dismissed || sessionStorage.getItem(dismissKey)) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(dismissKey, '1');
  };

  return (
    <AnimatePresence>
      <motion.div
        className="rounded-2xl border-2 border-primary/30 overflow-hidden shadow-xl"
        style={{ background: 'linear-gradient(145deg, hsl(var(--primary) / 0.06), hsl(var(--card)))' }}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/15"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <Trophy className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <h3 className="font-black text-sm text-foreground">
                {language === 'de' ? 'Wochen-Report' : 'Weekly Report'}
              </h3>
              <p className="text-[10px] text-muted-foreground font-medium">
                {language === 'de' ? 'Deine Zusammenfassung der letzten 7 Tage' : 'Your last 7 days summary'}
              </p>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground p-1 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="px-4 pb-3 grid grid-cols-4 gap-2">
          {[
            { value: report.daysTracked, label: language === 'de' ? 'Tage' : 'Days', sub: '/7' },
            { value: report.totalMeals, label: language === 'de' ? 'Mahlzeiten' : 'Meals', sub: '' },
            { value: report.avgCal, label: language === 'de' ? 'Ø kcal' : 'Avg kcal', sub: '' },
            { value: report.avgProtein, label: language === 'de' ? 'Ø Protein' : 'Avg Protein', sub: 'g' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="text-center p-2 rounded-xl bg-background/60"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
            >
              <p className="text-base font-black text-foreground tabular-nums">
                {stat.value}<span className="text-xs text-muted-foreground font-normal">{stat.sub}</span>
              </p>
              <p className="text-[9px] text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Comparison to last week */}
        {report.prevAvgCal > 0 && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-background/60">
              {report.calChange < 0 ? (
                <TrendingDown className="h-4 w-4 text-primary" />
              ) : report.calChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-energy" />
              ) : null}
              <span className="text-xs text-foreground font-medium">
                {language === 'de' ? 'Vs. Vorwoche: ' : 'Vs. last week: '}
                <span className={`font-bold ${report.calChange < 0 ? 'text-primary' : report.calChange > 0 ? 'text-energy' : 'text-foreground'}`}>
                  {report.calChange > 0 ? '+' : ''}{report.calChange}% {language === 'de' ? 'Kalorien' : 'calories'}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Highlights */}
        {report.highlights.length > 0 && (
          <div className="px-4 pb-3 space-y-1.5">
            {report.highlights.map((h, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 text-xs font-medium text-foreground"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                {h.icon}
                <span>{h.text}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Suggestions */}
        <div className="px-4 pb-4 space-y-1.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Lightbulb className="h-3.5 w-3.5 text-energy" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {language === 'de' ? 'Tipps für nächste Woche' : 'Tips for next week'}
            </span>
          </div>
          {report.suggestions.map((s, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-2 text-xs text-foreground/80"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <ChevronRight className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
              <span>{s}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
