import { useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Clock, Utensils, Flame, Award, Star, Trophy, Target, Scale, TrendingDown, Baby } from 'lucide-react';
import type { MealEntry, WeightEntry } from '@/lib/types';

interface Props {
  meals: MealEntry[];
  weightEntries: WeightEntry[];
  goalWeightKg: number | null;
  goalType: string | null;
  startWeightKg: number | null;
}

interface Milestone {
  date: string;
  icon: React.ElementType;
  color: string;
  title: string;
  subtitle: string;
}

export default function MilestoneTimeline({ meals, weightEntries, goalWeightKg, goalType, startWeightKg }: Props) {
  const { language } = useTranslation();
  const de = language === 'de';

  const milestones = useMemo(() => {
    const items: Milestone[] = [];
    if (meals.length === 0) return items;

    const sortedMeals = [...meals].sort((a, b) => a.entry_date.localeCompare(b.entry_date));
    const uniqueDays = [...new Set(sortedMeals.map(m => m.entry_date))].sort();

    // 1. First meal ever
    if (sortedMeals.length > 0) {
      items.push({
        date: sortedMeals[0].entry_date,
        icon: Baby,
        color: 'hsl(var(--primary))',
        title: de ? '🎉 Erste Mahlzeit geloggt' : '🎉 First meal logged',
        subtitle: de ? 'Deine Reise hat begonnen!' : 'Your journey began!',
      });
    }

    // 2. Meal milestones
    const mealMilestones = [
      { count: 10, emoji: '🍽️', de: '10 Mahlzeiten', en: '10 Meals' },
      { count: 25, emoji: '🥗', de: '25 Mahlzeiten', en: '25 Meals' },
      { count: 50, emoji: '⭐', de: '50 Mahlzeiten', en: '50 Meals' },
      { count: 100, emoji: '🏅', de: '100 Mahlzeiten', en: '100 Meals' },
      { count: 200, emoji: '💎', de: '200 Mahlzeiten', en: '200 Meals' },
      { count: 500, emoji: '👑', de: '500 Mahlzeiten', en: '500 Meals' },
    ];
    for (const m of mealMilestones) {
      if (sortedMeals.length >= m.count) {
        items.push({
          date: sortedMeals[m.count - 1].entry_date,
          icon: Utensils,
          color: 'hsl(var(--protein))',
          title: `${m.emoji} ${de ? m.de : m.en}`,
          subtitle: de ? `${m.count}. Mahlzeit erreicht` : `Reached meal #${m.count}`,
        });
      }
    }

    // 3. Streak milestones (calculate from unique days)
    let maxStreak = 0;
    let currentStreak = 1;
    let streakEndIdx = 0;
    for (let i = 1; i < uniqueDays.length; i++) {
      const prev = new Date(uniqueDays[i - 1]);
      const curr = new Date(uniqueDays[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
          streakEndIdx = i - 1;
        }
        currentStreak = 1;
      }
    }
    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
      streakEndIdx = uniqueDays.length - 1;
    }

    const streakMilestones = [
      { days: 3, emoji: '🔥' },
      { days: 7, emoji: '🔥' },
      { days: 14, emoji: '🔥🔥' },
      { days: 30, emoji: '🔥🔥🔥' },
      { days: 60, emoji: '💪' },
      { days: 100, emoji: '🏆' },
    ];
    for (const s of streakMilestones) {
      if (maxStreak >= s.days) {
        // Find the date when this streak was reached
        let streak = 1;
        let reachedDate = uniqueDays[0];
        for (let i = 1; i < uniqueDays.length; i++) {
          const prev = new Date(uniqueDays[i - 1]);
          const curr = new Date(uniqueDays[i]);
          const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
          if (diff === 1) {
            streak++;
            if (streak === s.days) {
              reachedDate = uniqueDays[i];
              break;
            }
          } else {
            streak = 1;
          }
        }
        items.push({
          date: reachedDate,
          icon: Flame,
          color: 'hsl(var(--energy))',
          title: `${s.emoji} ${s.days}-${de ? 'Tage-Streak' : 'Day Streak'}`,
          subtitle: de ? `${s.days} Tage am Stück geloggt` : `Logged ${s.days} days in a row`,
        });
      }
    }

    // 4. Weight milestones
    if (weightEntries.length > 0 && startWeightKg) {
      const sortedWeights = [...weightEntries].sort((a, b) => a.entry_date.localeCompare(b.entry_date));
      const weightLost = [1, 2, 5, 10, 15, 20, 25];
      const weightGained = [1, 2, 5, 10];

      for (const w of sortedWeights) {
        const diff = startWeightKg - Number(w.weight_kg);

        if (goalType === 'lose') {
          for (const target of weightLost) {
            if (diff >= target) {
              const alreadyAdded = items.some(i => i.title.includes(`${target} kg`));
              if (!alreadyAdded) {
                items.push({
                  date: w.entry_date,
                  icon: TrendingDown,
                  color: 'hsl(var(--primary))',
                  title: `📉 ${target} kg ${de ? 'abgenommen' : 'lost'}`,
                  subtitle: de ? `Von ${startWeightKg} auf ${Number(w.weight_kg).toFixed(1)} kg` : `From ${startWeightKg} to ${Number(w.weight_kg).toFixed(1)} kg`,
                });
              }
            }
          }
        } else if (goalType === 'gain') {
          const gained = Number(w.weight_kg) - startWeightKg;
          for (const target of weightGained) {
            if (gained >= target) {
              const alreadyAdded = items.some(i => i.title.includes(`${target} kg`));
              if (!alreadyAdded) {
                items.push({
                  date: w.entry_date,
                  icon: Scale,
                  color: 'hsl(var(--protein))',
                  title: `📈 ${target} kg ${de ? 'zugenommen' : 'gained'}`,
                  subtitle: de ? `Von ${startWeightKg} auf ${Number(w.weight_kg).toFixed(1)} kg` : `From ${startWeightKg} to ${Number(w.weight_kg).toFixed(1)} kg`,
                });
              }
            }
          }
        }
      }

      // Goal reached
      if (goalWeightKg) {
        const reached = sortedWeights.find(w =>
          goalType === 'lose'
            ? Number(w.weight_kg) <= goalWeightKg
            : Number(w.weight_kg) >= goalWeightKg
        );
        if (reached) {
          items.push({
            date: reached.entry_date,
            icon: Target,
            color: 'hsl(var(--success, var(--primary)))',
            title: `🎯 ${de ? 'Zielgewicht erreicht!' : 'Goal weight reached!'}`,
            subtitle: `${goalWeightKg} kg`,
          });
        }
      }
    }

    // 5. First week completed
    if (uniqueDays.length >= 7) {
      items.push({
        date: uniqueDays[6],
        icon: Award,
        color: 'hsl(var(--carbs))',
        title: de ? '📅 Erste Woche geschafft' : '📅 First week completed',
        subtitle: de ? '7 verschiedene Tage geloggt' : '7 different days logged',
      });
    }

    // Sort by date descending (newest first)
    items.sort((a, b) => b.date.localeCompare(a.date));

    // Deduplicate by title
    const seen = new Set<string>();
    return items.filter(i => {
      if (seen.has(i.title)) return false;
      seen.add(i.title);
      return true;
    });
  }, [meals, weightEntries, goalWeightKg, goalType, startWeightKg, de]);

  if (milestones.length === 0) return null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(de ? 'de-DE' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <motion.div
      className="nutri-card space-y-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-sm">
          {de ? 'Deine Erfolgs-Timeline' : 'Your Achievement Timeline'}
        </h3>
        <span className="text-[10px] font-bold text-muted-foreground ml-auto">
          {milestones.length} {de ? 'Meilensteine' : 'milestones'}
        </span>
      </div>

      <div className="relative pl-6">
        {/* Timeline line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border rounded-full" />

        <div className="space-y-0">
          {milestones.map((m, i) => (
            <motion.div
              key={`${m.title}-${m.date}`}
              className="relative flex items-start gap-3 pb-4 last:pb-0"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              {/* Dot */}
              <div
                className="absolute -left-6 top-0.5 w-[22px] h-[22px] rounded-full border-2 border-background flex items-center justify-center z-10"
                style={{ backgroundColor: m.color }}
              >
                <m.icon className="h-3 w-3 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground leading-tight">{m.title}</p>
                <p className="text-[10px] text-muted-foreground">{m.subtitle}</p>
              </div>

              {/* Date */}
              <span className="text-[9px] font-medium text-muted-foreground whitespace-nowrap mt-0.5">
                {formatDate(m.date)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
