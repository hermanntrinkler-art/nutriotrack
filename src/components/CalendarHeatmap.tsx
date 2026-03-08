import { useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import type { MealEntry } from '@/lib/types';

interface Props {
  meals: MealEntry[];
  calorieTarget: number;
}

export default function CalendarHeatmap({ meals, calorieTarget }: Props) {
  const { language } = useTranslation();

  const { days, weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const daysList: { date: string; calories: number; dayNum: number; isToday: boolean }[] = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayMeals = meals.filter(m => m.entry_date === dateStr);
      const cal = dayMeals.reduce((s, m) => s + Number(m.total_calories), 0);
      daysList.push({
        date: dateStr,
        calories: cal,
        dayNum: d.getDate(),
        isToday: i === 0,
      });
    }

    // Group into weeks (rows of 7)
    const weeksList: typeof daysList[] = [];
    // Pad start so first day aligns to correct weekday
    const firstDate = new Date(today);
    firstDate.setDate(firstDate.getDate() - 29);
    const startPad = firstDate.getDay() === 0 ? 6 : firstDate.getDay() - 1; // Mon=0
    const padded = [...Array(startPad).fill(null), ...daysList];
    for (let i = 0; i < padded.length; i += 7) {
      weeksList.push(padded.slice(i, i + 7));
    }

    // Month labels
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    daysList.forEach((day, i) => {
      const m = new Date(day.date).getMonth();
      if (m !== lastMonth) {
        lastMonth = m;
        const monthName = new Date(day.date).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', { month: 'short' });
        labels.push({ label: monthName, col: i + startPad });
      }
    });

    return { days: daysList, weeks: weeksList, monthLabels: labels };
  }, [meals, language]);

  const getIntensity = (cal: number): string => {
    if (cal === 0) return 'bg-muted/40';
    const pct = cal / calorieTarget;
    if (pct < 0.25) return 'bg-primary/20';
    if (pct < 0.5) return 'bg-primary/35';
    if (pct < 0.75) return 'bg-primary/55';
    if (pct <= 1.05) return 'bg-primary/80';
    return 'bg-energy/70'; // over goal
  };

  const weekdayLabels = language === 'de' ? ['M', 'D', 'M', 'D', 'F', 'S', 'S'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <motion.div
      className="nutri-card shadow-md hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="h-4 w-4 text-primary" />
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
          {language === 'de' ? '30-Tage Heatmap' : '30-Day Heatmap'}
        </h3>
      </div>

      <div className="flex gap-1">
        {/* Weekday labels */}
        <div className="flex flex-col gap-1 mr-1">
          {weekdayLabels.map((d, i) => (
            <span key={i} className="text-[8px] text-muted-foreground font-medium h-[18px] flex items-center justify-end w-3">
              {i % 2 === 0 ? d : ''}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex gap-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1 flex-1">
                {Array.from({ length: 7 }).map((_, di) => {
                  const day = week[di];
                  if (!day) {
                    return <div key={di} className="aspect-square rounded-[3px]" />;
                  }
                  return (
                    <motion.div
                      key={di}
                      className={`aspect-square rounded-[3px] ${getIntensity(day.calories)} ${day.isToday ? 'ring-1 ring-primary ring-offset-1 ring-offset-background' : ''} relative group cursor-default`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2, delay: (29 - days.indexOf(day)) * 0.01 }}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10 pointer-events-none">
                        <div className="bg-popover border border-border rounded-lg px-2 py-1 shadow-lg whitespace-nowrap">
                          <p className="text-[10px] font-bold text-foreground">{Math.round(day.calories)} kcal</p>
                          <p className="text-[8px] text-muted-foreground">{new Date(day.date).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', { day: 'numeric', month: 'short' })}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-[9px] text-muted-foreground">
          {language === 'de' ? 'Weniger' : 'Less'}
        </span>
        <div className="flex gap-1 items-center">
          <div className="w-3 h-3 rounded-[2px] bg-muted/40" />
          <div className="w-3 h-3 rounded-[2px] bg-primary/20" />
          <div className="w-3 h-3 rounded-[2px] bg-primary/35" />
          <div className="w-3 h-3 rounded-[2px] bg-primary/55" />
          <div className="w-3 h-3 rounded-[2px] bg-primary/80" />
          <div className="w-3 h-3 rounded-[2px] bg-energy/70" />
        </div>
        <span className="text-[9px] text-muted-foreground">
          {language === 'de' ? 'Mehr' : 'More'}
        </span>
      </div>
    </motion.div>
  );
}
