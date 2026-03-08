import { useMemo, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Share2, Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { fireCenterBurst } from '@/lib/confetti';
import { generateShareImage, shareImage, shareBadgeLink } from '@/lib/share-image';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

// Badge images
import badgeFirstMeal from '@/assets/badges/first-meal.png';
import badgeStreak3 from '@/assets/badges/streak-3.png';
import badgeStreak7 from '@/assets/badges/streak-7.png';
import badgeStreak14 from '@/assets/badges/streak-14.png';
import badgeStreak30 from '@/assets/badges/streak-30.png';
import badgeStreak60 from '@/assets/badges/streak-60.png';
import badgeStreak100 from '@/assets/badges/streak-100.png';
import badgeMeal10 from '@/assets/badges/meal-10.png';
import badgeMeal25 from '@/assets/badges/meal-25.png';
import badgeMeal50 from '@/assets/badges/meal-50.png';
import badgeMeal100 from '@/assets/badges/meal-100.png';
import badgeMeal500 from '@/assets/badges/meal-500.png';
import badgeWeight1 from '@/assets/badges/weight-1.png';
import badgeWeight5 from '@/assets/badges/weight-5.png';
import badgeWeight10 from '@/assets/badges/weight-10.png';
import badgeWeight15 from '@/assets/badges/weight-15.png';
import badgeWeight20 from '@/assets/badges/weight-20.png';
import badgeWeight25 from '@/assets/badges/weight-25.png';
import badgeGoalReached from '@/assets/badges/goal-reached.png';
import badgeWeek1 from '@/assets/badges/week-1.png';
import badgeMonth1 from '@/assets/badges/month-1.png';
import badgeQuarter from '@/assets/badges/quarter.png';
import badgeMonth6 from '@/assets/badges/month-6.png';

interface AchievementsBadgesProps {
  totalMeals: number;
  streak: number;
  goalReached: boolean;
  userName?: string;
  weightLostKg?: number;
  daysTracked?: number;
}

interface Achievement {
  id: string;
  badgeImage: string;
  title: string;
  desc: string;
  shareText: string;
  unlocked: boolean;
  color: string;
  xp: number;
  category: 'streak' | 'meals' | 'weight' | 'special';
}

// Level thresholds
const LEVELS = [
  { level: 1, xpNeeded: 0, title: { de: 'Anfänger', en: 'Beginner' }, emoji: '🌱' },
  { level: 2, xpNeeded: 50, title: { de: 'Einsteiger', en: 'Starter' }, emoji: '🌿' },
  { level: 3, xpNeeded: 150, title: { de: 'Entdecker', en: 'Explorer' }, emoji: '🍀' },
  { level: 4, xpNeeded: 300, title: { de: 'Fortgeschritten', en: 'Advanced' }, emoji: '⚡' },
  { level: 5, xpNeeded: 500, title: { de: 'Profi', en: 'Pro' }, emoji: '🔥' },
  { level: 6, xpNeeded: 800, title: { de: 'Experte', en: 'Expert' }, emoji: '💎' },
  { level: 7, xpNeeded: 1200, title: { de: 'Meister', en: 'Master' }, emoji: '👑' },
  { level: 8, xpNeeded: 1800, title: { de: 'Legende', en: 'Legend' }, emoji: '🏆' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

export default function AchievementsBadges({ totalMeals, streak, goalReached, userName = '', weightLostKg = 0, daysTracked = 0 }: AchievementsBadgesProps) {
  const { language } = useTranslation();
  const de = language === 'de';
  const [sharing, setSharing] = useState(false);
  const [sharingBadgeId, setSharingBadgeId] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);

  const [customBadgeImages, setCustomBadgeImages] = useState<Record<string, string>>({});

  // Load custom badge images from DB
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('badge_images').select('badge_id, image_url');
      if (data) {
        const map: Record<string, string> = {};
        (data as Array<{ badge_id: string; image_url: string }>).forEach(r => { map[r.badge_id] = r.image_url; });
        setCustomBadgeImages(map);
      }
    };
    load();
  }, []);

  const getBadgeImage = (id: string, fallback: string) => customBadgeImages[id] || fallback;

  const achievements: Achievement[] = useMemo(() => [
    // Streak badges
    { id: 'streak_3', badgeImage: getBadgeImage('streak_3', badgeStreak3), title: '3-Day Streak', desc: de ? '3 Tage am Stück geloggt' : 'Logged 3 days in a row', shareText: de ? '3 Tage am Stück getrackt – der Anfang einer Gewohnheit! 🔥' : '3 days tracked in a row – building a habit! 🔥', unlocked: streak >= 3, color: 'hsl(var(--energy))', xp: 15, category: 'streak' },
    { id: 'streak_7', badgeImage: getBadgeImage('streak_7', badgeStreak7), title: '7-Day Streak', desc: de ? 'Eine ganze Woche durchgehalten!' : 'A full week of tracking!', shareText: de ? '7 Tage am Stück – Disziplin zahlt sich aus! 💪🔥' : '7 days in a row – consistency pays off! 💪🔥', unlocked: streak >= 7, color: 'hsl(var(--energy))', xp: 30, category: 'streak' },
    { id: 'streak_14', badgeImage: getBadgeImage('streak_14', badgeStreak14), title: '14-Day Streak', desc: de ? '2 Wochen am Stück – stark!' : '2 weeks straight – strong!', shareText: de ? '2 Wochen Streak – nichts hält mich auf! ⚡' : '2-week streak – nothing can stop me! ⚡', unlocked: streak >= 14, color: 'hsl(var(--energy))', xp: 60, category: 'streak' },
    { id: 'streak_30', badgeImage: getBadgeImage('streak_30', badgeStreak30), title: '30-Day Streak', desc: de ? 'Ein ganzer Monat! Wahnsinn!' : 'A full month! Amazing!', shareText: de ? '30 Tage Streak! Ein ganzer Monat Disziplin! 🏅' : '30-day streak! A full month of discipline! 🏅', unlocked: streak >= 30, color: 'hsl(var(--fat))', xp: 120, category: 'streak' },
    { id: 'streak_60', badgeImage: getBadgeImage('streak_60', badgeStreak60), title: '60-Day Streak', desc: de ? 'Disziplin pur!' : 'Pure discipline!', shareText: de ? '60 Tage ohne Pause – das ist Lifestyle! 💎' : '60 days without a break – this is lifestyle! 💎', unlocked: streak >= 60, color: 'hsl(var(--protein))', xp: 200, category: 'streak' },
    { id: 'streak_100', badgeImage: getBadgeImage('streak_100', badgeStreak100), title: '100-Day Streak', desc: de ? 'Unstoppbar! 100 Tage!' : 'Unstoppable! 100 days!', shareText: de ? '100 Tage Streak – absolut unstoppbar! 👑🔥' : '100-day streak – absolutely unstoppable! 👑🔥', unlocked: streak >= 100, color: 'hsl(var(--primary))', xp: 350, category: 'streak' },
    
    // Meal badges
    { id: 'meal_1', badgeImage: getBadgeImage('meal_1', badgeFirstMeal), title: 'First Meal', desc: de ? 'Deine Reise beginnt!' : 'Your journey begins!', shareText: de ? 'Meine erste Mahlzeit mit NutrioTrack geloggt! 🍽️' : 'Just logged my first meal with NutrioTrack! 🍽️', unlocked: totalMeals >= 1, color: 'hsl(var(--primary))', xp: 10, category: 'meals' },
    { id: 'meal_10', badgeImage: getBadgeImage('meal_10', badgeMeal10), title: '10 Meals', desc: de ? 'Du bleibst dran!' : 'You\'re keeping at it!', shareText: de ? '10 Mahlzeiten getrackt – ich bleibe dran! 🥗' : '10 meals tracked – staying consistent! 🥗', unlocked: totalMeals >= 10, color: 'hsl(var(--carbs))', xp: 25, category: 'meals' },
    { id: 'meal_25', badgeImage: getBadgeImage('meal_25', badgeMeal25), title: '25 Meals', desc: de ? 'Silber-Status erreicht' : 'Silver status reached', shareText: de ? '25 Mahlzeiten – Silber-Status bei NutrioTrack! ⭐' : '25 meals – Silver status on NutrioTrack! ⭐', unlocked: totalMeals >= 25, color: 'hsl(var(--protein))', xp: 50, category: 'meals' },
    { id: 'meal_50', badgeImage: getBadgeImage('meal_50', badgeMeal50), title: '50 Meals', desc: de ? 'Gold-Status erreicht' : 'Gold status reached', shareText: de ? '50 Mahlzeiten getrackt – Gold-Status! 🌟' : '50 meals tracked – Gold status! 🌟', unlocked: totalMeals >= 50, color: 'hsl(var(--fat))', xp: 80, category: 'meals' },
    { id: 'meal_100', badgeImage: getBadgeImage('meal_100', badgeMeal100), title: '100 Meals', desc: de ? 'Platin! Echte Hingabe!' : 'Platinum! True dedication!', shareText: de ? '100 Mahlzeiten getrackt – was für eine Reise! 🏆' : '100 meals tracked – what a journey! 🏆', unlocked: totalMeals >= 100, color: 'hsl(var(--energy))', xp: 150, category: 'meals' },
    { id: 'meal_500', badgeImage: getBadgeImage('meal_500', badgeMeal500), title: '500 Meals', desc: de ? 'Diamant-Status! Legendär!' : 'Diamond status! Legendary!', shareText: de ? '500 Mahlzeiten – Diamant-Status erreicht! 💎👑' : '500 meals – Diamond status achieved! 💎👑', unlocked: totalMeals >= 500, color: 'hsl(var(--primary))', xp: 400, category: 'meals' },

    // Weight badges
    { id: 'weight_1', badgeImage: getBadgeImage('weight_1', badgeWeight1), title: '1 kg Milestone', desc: de ? 'Erster Kilo geschafft!' : 'First kg done!', shareText: de ? 'Erstes Kilo geschafft – der Anfang ist gemacht! ⚖️' : 'First kg down – the journey has begun! ⚖️', unlocked: weightLostKg >= 1, color: 'hsl(var(--primary))', xp: 30, category: 'weight' },
    { id: 'weight_5', badgeImage: getBadgeImage('weight_5', badgeWeight5), title: '5 kg Milestone', desc: de ? '5 kg – toller Fortschritt!' : '5 kg – great progress!', shareText: de ? '5 kg abgenommen – der Fortschritt ist real! 💪⚖️' : '5 kg down – the progress is real! 💪⚖️', unlocked: weightLostKg >= 5, color: 'hsl(var(--carbs))', xp: 80, category: 'weight' },
    { id: 'weight_10', badgeImage: getBadgeImage('weight_10', badgeWeight10), title: '10 kg Milestone', desc: de ? '10 kg! Beeindruckend!' : '10 kg! Impressive!', shareText: de ? '10 kg Meilenstein geknackt – unglaublich! 🎯' : '10 kg milestone crushed – incredible! 🎯', unlocked: weightLostKg >= 10, color: 'hsl(var(--protein))', xp: 200, category: 'weight' },
    { id: 'weight_15', badgeImage: getBadgeImage('weight_15', badgeWeight15), title: '15 kg Milestone', desc: de ? '15 kg! Unglaublich!' : '15 kg! Unbelievable!', shareText: de ? '15 kg abgenommen – der Wahnsinn! 🔥⚖️' : '15 kg down – absolutely amazing! 🔥⚖️', unlocked: weightLostKg >= 15, color: 'hsl(var(--energy))', xp: 280, category: 'weight' },
    { id: 'weight_20', badgeImage: getBadgeImage('weight_20', badgeWeight20), title: '20 kg Milestone', desc: de ? '20 kg! Transformation!' : '20 kg! Transformation!', shareText: de ? '20 kg Meilenstein – echte Transformation! 💪🏆' : '20 kg milestone – real transformation! 💪🏆', unlocked: weightLostKg >= 20, color: 'hsl(var(--fat))', xp: 350, category: 'weight' },
    { id: 'weight_25', badgeImage: getBadgeImage('weight_25', badgeWeight25), title: '25 kg Milestone', desc: de ? '25 kg! Legendär!' : '25 kg! Legendary!', shareText: de ? '25 kg abgenommen – legendäre Leistung! 💎👑' : '25 kg down – legendary achievement! 💎👑', unlocked: weightLostKg >= 25, color: 'hsl(var(--primary))', xp: 450, category: 'weight' },
    { id: 'goal_reached', badgeImage: getBadgeImage('goal_reached', badgeGoalReached), title: 'Goal Reached!', desc: de ? 'Zielgewicht erreicht – Respekt!' : 'Goal weight reached – respect!', shareText: de ? 'Zielgewicht erreicht! Alles ist möglich! 🎯🏆' : 'Goal weight reached! Anything is possible! 🎯🏆', unlocked: goalReached, color: 'hsl(var(--success, var(--primary)))', xp: 500, category: 'weight' },

    // Special badges
    { id: 'week_1', badgeImage: getBadgeImage('week_1', badgeWeek1), title: 'First Week', desc: de ? '7 Tage dabei!' : '7 days in!', shareText: de ? 'Erste Woche mit NutrioTrack geschafft! 📅' : 'First week with NutrioTrack complete! 📅', unlocked: daysTracked >= 7, color: 'hsl(var(--info))', xp: 20, category: 'special' },
    { id: 'month_1', badgeImage: getBadgeImage('month_1', badgeMonth1), title: 'First Month', desc: de ? '30 Tage dabei – Gewohnheit!' : '30 days in – it\'s a habit!', shareText: de ? 'Einen Monat dabei – es ist zur Gewohnheit geworden! ❤️' : 'One month in – it\'s become a habit! ❤️', unlocked: daysTracked >= 30, color: 'hsl(var(--destructive))', xp: 100, category: 'special' },
    { id: 'quarter', badgeImage: getBadgeImage('quarter', badgeQuarter), title: '3 Months', desc: de ? 'Vierteljahr! Lifestyle!' : 'Quarter year! Lifestyle!', shareText: de ? '3 Monate NutrioTrack – das ist jetzt Lifestyle! ✨' : '3 months on NutrioTrack – this is lifestyle now! ✨', unlocked: daysTracked >= 90, color: 'hsl(var(--primary))', xp: 250, category: 'special' },
    { id: 'month_6', badgeImage: getBadgeImage('month_6', badgeMonth6), title: '6 Months', desc: de ? 'Halbes Jahr! Unaufhaltbar!' : 'Half a year! Unstoppable!', shareText: de ? '6 Monate NutrioTrack – absolut unaufhaltbar! 🌟🏆' : '6 months on NutrioTrack – absolutely unstoppable! 🌟🏆', unlocked: daysTracked >= 180, color: 'hsl(var(--energy))', xp: 400, category: 'special' },
  ], [totalMeals, streak, goalReached, weightLostKg, daysTracked, de, customBadgeImages]);

  // XP & Level calculation
  const totalXP = useMemo(() => achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0), [achievements]);
  
  const currentLevel = useMemo(() => {
    let lvl = LEVELS[0];
    for (const l of LEVELS) {
      if (totalXP >= l.xpNeeded) lvl = l;
    }
    return lvl;
  }, [totalXP]);

  const nextLevel = useMemo(() => {
    const idx = LEVELS.findIndex(l => l.level === currentLevel.level);
    return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
  }, [currentLevel]);

  const xpProgress = useMemo(() => {
    if (!nextLevel) return 100;
    const xpInLevel = totalXP - currentLevel.xpNeeded;
    const xpForLevel = nextLevel.xpNeeded - currentLevel.xpNeeded;
    return Math.min(100, Math.round((xpInLevel / xpForLevel) * 100));
  }, [totalXP, currentLevel, nextLevel]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Confetti on new unlock
  const prevUnlocked = useRef<number | null>(null);
  useEffect(() => {
    if (prevUnlocked.current !== null && unlockedCount > prevUnlocked.current) {
      fireCenterBurst();
    }
    prevUnlocked.current = unlockedCount;
  }, [unlockedCount]);

  const handleShare = async () => {
    setSharing(true);
    try {
      const blob = await generateShareImage({
        name: userName,
        streak,
        totalMeals,
        unlockedAchievements: unlockedCount,
        totalAchievements: achievements.length,
        language: language as 'de' | 'en',
      });
      const shared = await shareImage(blob, language as 'de' | 'en');
      if (!shared) toast.success(de ? 'Bild heruntergeladen!' : 'Image downloaded!');
    } catch {
      toast.error(de ? 'Teilen fehlgeschlagen' : 'Sharing failed');
    } finally {
      setSharing(false);
    }
  };

  const handleShareBadge = async (badge: Achievement) => {
    setSharingBadgeId(badge.id);
    try {
      const blob = await generateShareImage({
        name: userName,
        streak,
        totalMeals,
        unlockedAchievements: unlockedCount,
        totalAchievements: achievements.length,
        language: language as 'de' | 'en',
        badgeTitle: badge.title,
        badgeShareText: badge.shareText,
        badgeImageUrl: badge.badgeImage,
      });
      const shared = await shareImage(blob, language as 'de' | 'en', badge.shareText);
      if (!shared) toast.success(de ? 'Bild heruntergeladen!' : 'Image downloaded!');
    } catch {
      toast.error(de ? 'Teilen fehlgeschlagen' : 'Sharing failed');
    } finally {
      setSharingBadgeId(null);
    }
  };

  const categories = [
    { key: 'all', label: de ? 'Alle' : 'All' },
    { key: 'streak', label: de ? 'Streaks' : 'Streaks' },
    { key: 'meals', label: de ? 'Mahlzeiten' : 'Meals' },
    { key: 'weight', label: de ? 'Gewicht' : 'Weight' },
    { key: 'special', label: de ? 'Spezial' : 'Special' },
  ];

  const renderBadges = (filter: string) => {
    const filtered = filter === 'all' ? achievements : achievements.filter(a => a.category === filter);
    return (
      <motion.div className="grid grid-cols-3 gap-2" variants={stagger} initial="hidden" animate="show">
        {filtered.map((a) => (
          <motion.button
            key={a.id}
            onClick={() => setSelectedBadge(selectedBadge?.id === a.id ? null : a)}
            className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border transition-all text-center ${
              a.unlocked
                ? 'border-primary/20 bg-primary/5 hover:border-primary/40'
                : 'border-border bg-muted/30'
            }`}
            variants={fadeUp}
            whileHover={a.unlocked ? { scale: 1.05 } : {}}
            whileTap={{ scale: 0.95 }}
          >
            {a.unlocked && (
              <span className="absolute -top-1.5 -right-1.5 text-[8px] font-black bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                +{a.xp}XP
              </span>
            )}
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src={a.badgeImage}
                alt={a.title}
                className={`w-full h-full object-cover transition-all ${
                  a.unlocked ? '' : 'grayscale brightness-50 opacity-40'
                }`}
              />
            </div>
            <span className="text-[10px] font-bold leading-tight">{a.title}</span>
          </motion.button>
        ))}
      </motion.div>
    );
  };

  return (
    <motion.div className="space-y-4" variants={fadeUp}>
      {/* Level Card */}
      <div className="nutri-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
              {currentLevel.emoji}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Level {currentLevel.level}</p>
              <p className="font-bold text-base">{de ? currentLevel.title.de : currentLevel.title.en}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-primary">{totalXP} XP</p>
            <p className="text-[10px] text-muted-foreground">
              {nextLevel ? `${nextLevel.xpNeeded - totalXP} XP ${de ? 'bis' : 'to'} Lvl ${nextLevel.level}` : (de ? 'Max Level!' : 'Max Level!')}
            </p>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="space-y-1">
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          {nextLevel && (
            <div className="flex justify-between text-[9px] text-muted-foreground font-medium">
              <span>{currentLevel.emoji} {de ? currentLevel.title.de : currentLevel.title.en}</span>
              <span>{nextLevel.emoji} {de ? nextLevel.title.de : nextLevel.title.en}</span>
            </div>
          )}
        </div>
      </div>

      {/* Badges Card */}
      <div className="nutri-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-energy" />
            <h3 className="font-semibold text-sm">Badges</h3>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleShare}
              disabled={sharing}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              {sharing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Share2 className="h-3 w-3" />}
              {de ? 'Teilen' : 'Share'}
            </motion.button>
            <span className="text-xs font-bold text-muted-foreground">{unlockedCount}/{achievements.length}</span>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="w-full h-8 bg-muted/50 p-0.5 grid grid-cols-5">
            {categories.map(c => (
              <TabsTrigger key={c.key} value={c.key} className="text-[10px] font-bold px-1 py-1 data-[state=active]:bg-card">
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map(c => (
            <TabsContent key={c.key} value={c.key} className="mt-3">
              {renderBadges(c.key)}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Selected Badge Detail */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="nutri-card overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={selectedBadge.badgeImage}
                  alt={selectedBadge.title}
                  className={`w-full h-full object-cover ${
                    selectedBadge.unlocked ? '' : 'grayscale brightness-50 opacity-40'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{selectedBadge.title}</p>
                <p className="text-xs text-muted-foreground">{selectedBadge.desc}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {selectedBadge.unlocked && (
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); handleShareBadge(selectedBadge); }}
                    disabled={sharingBadgeId === selectedBadge.id}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors disabled:opacity-50"
                  >
                    {sharingBadgeId === selectedBadge.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Share2 className="h-3.5 w-3.5" />}
                  </motion.button>
                )}
                <div className="text-right">
                  <span className="text-xs font-black text-primary">+{selectedBadge.xp} XP</span>
                  <p className="text-[10px] text-muted-foreground">
                    {selectedBadge.unlocked ? '✅ Unlocked' : '🔒 Locked'}
                  </p>
                </div>
              </div>
            </div>
            {selectedBadge.unlocked && (
              <p className="text-[11px] text-muted-foreground italic mt-2 pl-15">
                "{selectedBadge.shareText}"
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
