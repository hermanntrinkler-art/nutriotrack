import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

// Badge fallback images
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

const BADGE_META: Record<string, { title: string; shareText: string; fallback: string }> = {
  streak_3: { title: '3-Day Streak', shareText: '3 Tage am Stück getrackt! 🔥', fallback: badgeStreak3 },
  streak_7: { title: '7-Day Streak', shareText: '7 Tage Streak! 💪🔥', fallback: badgeStreak7 },
  streak_14: { title: '14-Day Streak', shareText: '2 Wochen Streak! ⚡', fallback: badgeStreak14 },
  streak_30: { title: '30-Day Streak', shareText: '30 Tage Streak! 🏅', fallback: badgeStreak30 },
  streak_60: { title: '60-Day Streak', shareText: '60 Tage Streak! 💎', fallback: badgeStreak60 },
  streak_100: { title: '100-Day Streak', shareText: '100 Tage Streak! 👑🔥', fallback: badgeStreak100 },
  meal_1: { title: 'First Meal', shareText: 'Erste Mahlzeit geloggt! 🍽️', fallback: badgeFirstMeal },
  meal_10: { title: '10 Meals', shareText: '10 Mahlzeiten getrackt! 🥗', fallback: badgeMeal10 },
  meal_25: { title: '25 Meals', shareText: '25 Mahlzeiten! ⭐', fallback: badgeMeal25 },
  meal_50: { title: '50 Meals', shareText: '50 Mahlzeiten! 🌟', fallback: badgeMeal50 },
  meal_100: { title: '100 Meals', shareText: '100 Mahlzeiten! 🏆', fallback: badgeMeal100 },
  meal_500: { title: '500 Meals', shareText: '500 Mahlzeiten! 💎👑', fallback: badgeMeal500 },
  weight_1: { title: '1 kg Milestone', shareText: 'Erstes Kilo geschafft! ⚖️', fallback: badgeWeight1 },
  weight_5: { title: '5 kg Milestone', shareText: '5 kg abgenommen! 💪⚖️', fallback: badgeWeight5 },
  weight_10: { title: '10 kg Milestone', shareText: '10 kg Meilenstein! 🎯', fallback: badgeWeight10 },
  weight_15: { title: '15 kg Milestone', shareText: '15 kg abgenommen! 🔥⚖️', fallback: badgeWeight15 },
  weight_20: { title: '20 kg Milestone', shareText: '20 kg Transformation! 💪🏆', fallback: badgeWeight20 },
  weight_25: { title: '25 kg Milestone', shareText: '25 kg – legendär! 💎👑', fallback: badgeWeight25 },
  goal_reached: { title: 'Goal Reached!', shareText: 'Zielgewicht erreicht! 🎯🏆', fallback: badgeGoalReached },
  week_1: { title: 'First Week', shareText: 'Erste Woche geschafft! 📅', fallback: badgeWeek1 },
  month_1: { title: 'First Month', shareText: 'Erster Monat! ❤️', fallback: badgeMonth1 },
  quarter: { title: '3 Months', shareText: '3 Monate Lifestyle! ✨', fallback: badgeQuarter },
  month_6: { title: '6 Months', shareText: '6 Monate unaufhaltbar! 🌟🏆', fallback: badgeMonth6 },
};

export default function ShareBadgePage() {
  const { badgeId } = useParams<{ badgeId: string }>();
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customShareText, setCustomShareText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const meta = badgeId ? BADGE_META[badgeId] : null;

  useEffect(() => {
    if (!badgeId) return;
    const load = async () => {
      const { data } = await supabase
        .from('badge_images')
        .select('image_url, share_text')
        .eq('badge_id', badgeId)
        .maybeSingle();
      if (data) {
        setCustomImage(data.image_url);
        setCustomShareText(data.share_text as string | null);
      }
      setLoading(false);
    };
    load();
  }, [badgeId]);

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-2xl">🏆</p>
          <p className="text-muted-foreground">Badge nicht gefunden</p>
          <Link to="/" className="text-primary font-bold underline">Zur Startseite</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const imageUrl = customImage || meta.fallback;
  const shareText = customShareText || meta.shareText;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, hsl(220 50% 8%), hsl(220 45% 12%), hsl(220 50% 8%))'
    }}>
      <div className="text-center max-w-sm space-y-6">
        {/* Label */}
        <p className="text-[11px] tracking-[0.15em] uppercase text-white/40 font-semibold">
          Badge freigeschaltet
        </p>

        {/* Badge Ring */}
        <div className="mx-auto w-40 h-40 rounded-full overflow-hidden border-4 border-primary"
          style={{ boxShadow: '0 0 40px rgba(34, 197, 94, 0.2)' }}>
          <img src={imageUrl} alt={meta.title} className="w-full h-full object-cover" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-white">{meta.title}</h1>

        {/* Share Text */}
        <p className="text-lg text-white/70 italic leading-relaxed">
          "{shareText}"
        </p>

        {/* CTA */}
        <Link
          to="/register"
          className="inline-block px-8 py-3 rounded-full font-bold text-white text-base"
          style={{
            background: 'linear-gradient(135deg, #22c55e, #14b8a6)',
          }}
        >
          Jetzt auch tracken! 🌱
        </Link>

        {/* Logo */}
        <p className="text-primary font-bold text-sm mt-6">NutrioTrack</p>
      </div>
    </div>
  );
}
