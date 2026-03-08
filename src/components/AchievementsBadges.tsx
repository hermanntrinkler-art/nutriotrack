import { useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Utensils, Target, Award, Star } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import type { MealEntry } from '@/lib/types';
import { fireCenterBurst } from '@/lib/confetti';

interface AchievementsBadgesProps {
  totalMeals: number;
  streak: number;
  goalReached: boolean;
}

interface Achievement {
  id: string;
  icon: React.ElementType;
  titleKey: string;
  descKey: string;
  unlocked: boolean;
  color: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export default function AchievementsBadges({ totalMeals, streak, goalReached }: AchievementsBadgesProps) {
  const { t } = useTranslation();

  const achievements: Achievement[] = useMemo(() => [
    {
      id: 'first_meal',
      icon: Utensils,
      titleKey: 'achievement.firstMeal',
      descKey: 'achievement.firstMealDesc',
      unlocked: totalMeals >= 1,
      color: 'hsl(var(--primary))',
    },
    {
      id: 'streak_7',
      icon: Flame,
      titleKey: 'achievement.streak7',
      descKey: 'achievement.streak7Desc',
      unlocked: streak >= 7,
      color: 'hsl(var(--energy))',
    },
    {
      id: 'streak_30',
      icon: Award,
      titleKey: 'achievement.streak30',
      descKey: 'achievement.streak30Desc',
      unlocked: streak >= 30,
      color: 'hsl(var(--fat))',
    },
    {
      id: 'meals_50',
      icon: Star,
      titleKey: 'achievement.meals50',
      descKey: 'achievement.meals50Desc',
      unlocked: totalMeals >= 50,
      color: 'hsl(var(--protein))',
    },
    {
      id: 'meals_100',
      icon: Trophy,
      titleKey: 'achievement.meals100',
      descKey: 'achievement.meals100Desc',
      unlocked: totalMeals >= 100,
      color: 'hsl(var(--carbs))',
    },
    {
      id: 'weight_goal',
      icon: Target,
      titleKey: 'achievement.weightGoal',
      descKey: 'achievement.weightGoalDesc',
      unlocked: goalReached,
      color: 'hsl(var(--success))',
    },
  ], [totalMeals, streak, goalReached]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Fire confetti when a new achievement is unlocked
  const prevUnlocked = useRef<number | null>(null);
  useEffect(() => {
    if (prevUnlocked.current !== null && unlockedCount > prevUnlocked.current) {
      fireCenterBurst();
    }
    prevUnlocked.current = unlockedCount;
  }, [unlockedCount]);

  return (
    <motion.div className="nutri-card space-y-3" variants={fadeUp}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-energy" />
          <h3 className="font-semibold text-sm">{t('profile.achievements')}</h3>
        </div>
        <span className="text-xs font-bold text-muted-foreground">{unlockedCount}/{achievements.length}</span>
      </div>

      <motion.div
        className="grid grid-cols-3 gap-2"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {achievements.map((a) => (
          <motion.div
            key={a.id}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
              a.unlocked
                ? 'border-primary/20 bg-primary/5'
                : 'border-border bg-muted/30 opacity-40'
            }`}
            variants={fadeUp}
            whileHover={a.unlocked ? { scale: 1.05 } : {}}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: a.unlocked ? `${a.color}20` : undefined,
              }}
            >
              <a.icon
                className="h-5 w-5"
                style={{ color: a.unlocked ? a.color : 'hsl(var(--muted-foreground))' }}
              />
            </div>
            <span className="text-[10px] font-bold text-center leading-tight">
              {t(a.titleKey as any)}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
