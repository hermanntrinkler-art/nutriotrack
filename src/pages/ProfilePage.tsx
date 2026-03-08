import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import { supabase } from '@/integrations/supabase/client';
import { calculateNutrition } from '@/lib/nutrition';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { LogOut, Globe, Target, Leaf, AlertTriangle, ShieldCheck, ShieldAlert, Skull, Activity, Crown, Sun, Moon, Monitor, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import PaywallScreen from '@/components/PaywallScreen';
import { motion } from 'framer-motion';
import { hapticFeedback } from '@/lib/haptics';
import AchievementsBadges from '@/components/AchievementsBadges';
import ReminderSettings from '@/components/ReminderSettings';
import MilestoneTimeline from '@/components/MilestoneTimeline';
import { useAdmin } from '@/hooks/useAdmin';
import type { MealEntry } from '@/lib/types';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const DEFICIT_VALUES = [300, 500, 750, 1000, 1250];
const SURPLUS_VALUES = [200, 300, 450, 600, 800];
const WEEKLY_LOSS = [0.3, 0.5, 0.75, 1.0, 1.25];

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const subscription = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  const [goals, setGoals] = useState<any>(null);
  const [intensity, setIntensity] = useState(2);
  const [saving, setSaving] = useState(false);
  const [previewCalories, setPreviewCalories] = useState<number | null>(null);
  const [allMeals, setAllMeals] = useState<MealEntry[]>([]);
  const [weightEntries, setWeightEntries] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('user_goals').select('*').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setGoals(data);
          setIntensity((data as any).deficit_intensity || 2);
        }
      });
    supabase.from('meal_entries').select('*').eq('user_id', user.id)
      .then(({ data }) => setAllMeals((data || []) as any));
    supabase.from('weight_entries').select('*').eq('user_id', user.id).order('entry_date', { ascending: true })
      .then(({ data }) => setWeightEntries(data || []));
  }, [user]);

  useEffect(() => {
    if (!goals) return;
    const result = calculateNutrition({
      sex: goals.sex || 'male',
      age: goals.age || 30,
      height_cm: goals.height_cm || 175,
      current_weight_kg: goals.current_weight_kg || 80,
      activity_level: goals.activity_level || 'moderately_active',
      goal_type: goals.goal_type || 'lose',
      deficit_intensity: intensity,
    });
    setPreviewCalories(result.calorieTarget);
  }, [goals, intensity]);

  const handleSaveIntensity = async () => {
    if (!user || !goals) return;
    setSaving(true);

    const result = calculateNutrition({
      sex: goals.sex || 'male',
      age: goals.age || 30,
      height_cm: goals.height_cm || 175,
      current_weight_kg: goals.current_weight_kg || 80,
      activity_level: goals.activity_level || 'moderately_active',
      goal_type: goals.goal_type || 'lose',
      deficit_intensity: intensity,
    });

    await supabase.from('user_goals').update({
      deficit_intensity: intensity,
      calorie_target: result.calorieTarget,
      protein_target_g: result.proteinTarget,
      fat_target_g: result.fatTarget,
      carbs_target_g: result.carbsTarget,
    } as any).eq('user_id', user.id);

    setGoals((prev: any) => ({ ...prev, deficit_intensity: intensity, calorie_target: result.calorieTarget }));
    hapticFeedback('success');
    toast.success(t('profile.intensitySaved'));
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const goalType = goals?.goal_type;
  const isLoseOrGain = goalType === 'lose' || goalType === 'gain';

  // Computed values for AchievementsBadges
  const streakValue = useMemo(() => {
    const uniqueDays = new Set(allMeals.map(m => m.entry_date));
    const today = new Date();
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      if (uniqueDays.has(ds)) { s++; } else { if (i === 0) continue; break; }
    }
    return s;
  }, [allMeals]);

  const goalReachedValue = useMemo(() => {
    if (!goals?.goal_weight_kg || weightEntries.length === 0) return false;
    const last = Number(weightEntries[weightEntries.length - 1]?.weight_kg);
    return goals.goal_type === 'lose' ? last <= Number(goals.goal_weight_kg) : last >= Number(goals.goal_weight_kg);
  }, [goals, weightEntries]);

  const weightLostKgValue = useMemo(() => {
    if (!goals?.start_weight_kg || weightEntries.length === 0) return 0;
    const last = Number(weightEntries[weightEntries.length - 1]?.weight_kg);
    return Math.max(0, Math.abs(Number(goals.start_weight_kg) - last));
  }, [goals, weightEntries]);

  const daysTrackedValue = useMemo(() => {
    return new Set(allMeals.map(m => m.entry_date)).size;
  }, [allMeals]);

  const activityDescMap: Record<string, { label: string; desc: string }> = {
    sedentary: { label: t('onboarding.sedentary'), desc: t('onboarding.sedentaryDesc') },
    lightly_active: { label: t('onboarding.lightlyActive'), desc: t('onboarding.lightlyActiveDesc') },
    moderately_active: { label: t('onboarding.moderatelyActive'), desc: t('onboarding.moderatelyActiveDesc') },
    very_active: { label: t('onboarding.veryActive'), desc: t('onboarding.veryActiveDesc') },
    extremely_active: { label: t('onboarding.extremelyActive'), desc: t('onboarding.extremelyActiveDesc') },
  };
  const currentActivity = activityDescMap[goals?.activity_level || 'moderately_active'];

  const getIntensityLabel = (val: number) => {
    const key = `profile.intensity${val}` as any;
    return t(key);
  };

  const getIntensityColor = (val: number) => {
    if (val <= 2) return 'text-primary';
    if (val === 3) return 'text-warning';
    return 'text-destructive';
  };

  const getIntensityBgColor = (val: number) => {
    if (val <= 2) return 'bg-primary/10';
    if (val === 3) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  const getIntensityIcon = (val: number) => {
    if (val <= 2) return <ShieldCheck className="h-5 w-5 text-primary" />;
    if (val === 3) return <AlertTriangle className="h-5 w-5 text-warning" />;
    if (val === 4) return <ShieldAlert className="h-5 w-5 text-destructive" />;
    return <Skull className="h-5 w-5 text-destructive" />;
  };

  const getIntensityHint = (val: number) => {
    if (val <= 2) return t('profile.intensityHealthy');
    if (val <= 3) return t('profile.intensityWarning');
    return t('profile.intensityDanger');
  };

  const deficitValue = goalType === 'lose' ? DEFICIT_VALUES[intensity - 1] : SURPLUS_VALUES[intensity - 1];
  const weeklyValue = WEEKLY_LOSS[intensity - 1];

  const themeOptions = [
    { value: 'light' as const, label: t('profile.themeLight'), icon: Sun },
    { value: 'dark' as const, label: t('profile.themeDark'), icon: Moon },
    { value: 'system' as const, label: t('profile.themeSystem'), icon: Monitor },
  ];

  return (
    <motion.div
      className="page-container space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.h1 className="text-xl font-bold" variants={fadeUp}>{t('profile.title')}</motion.h1>

      {/* Subscription Status */}
      <motion.div className="nutri-card flex items-center justify-between" variants={fadeUp}>
        <div className="flex items-center gap-3">
          <Crown className={`h-5 w-5 ${subscription.isPro ? 'text-primary' : 'text-muted-foreground'}`} />
          <div>
            <p className="font-semibold text-sm">{t('profile.account')}</p>
            <p className={`text-xs font-bold ${subscription.isPro ? 'text-primary' : 'text-muted-foreground'}`}>
              {subscription.status === 'lifetime' ? t('paywall.lifetime2') : subscription.status === 'pro' ? t('paywall.pro') : t('paywall.free')}
            </p>
          </div>
        </div>
        {!subscription.isPro && (
          <Button size="sm" onClick={() => setShowPaywall(true)}>
            {t('paywall.upgradeButton')}
          </Button>
        )}
      </motion.div>

      {/* User info */}
      <motion.div className="nutri-card flex items-center gap-4" variants={fadeUp}>
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Leaf className="h-7 w-7 text-primary" />
        </div>
        <div>
          <p className="font-semibold">{profile?.name || user?.email?.split('@')[0]}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </motion.div>

      {/* Activity Level Info */}
      {goals && (
        <motion.div className="nutri-card flex items-center gap-3" variants={fadeUp}>
          <Activity className="h-5 w-5 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">{currentActivity.label}</p>
            <p className="text-xs text-muted-foreground">{currentActivity.desc}</p>
          </div>
        </motion.div>
      )}

      {/* Achievements & Milestones Tab */}
      <motion.div variants={fadeUp}>
        <Tabs defaultValue="badges">
          <TabsList className="w-full grid grid-cols-2 mb-3">
            <TabsTrigger value="badges" className="text-xs font-bold">
              🏆 {language === 'de' ? 'Badges & Level' : 'Badges & Level'}
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs font-bold">
              📅 {language === 'de' ? 'Timeline' : 'Timeline'}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="badges">
            <AchievementsBadges
              userName={profile?.name || user?.email?.split('@')[0] || ''}
              totalMeals={allMeals.length}
              streak={streakValue}
              goalReached={goalReachedValue}
              weightLostKg={weightLostKgValue}
              daysTracked={daysTrackedValue}
            />
          </TabsContent>
          <TabsContent value="timeline">
            <MilestoneTimeline
              meals={allMeals}
              weightEntries={weightEntries}
              goalWeightKg={goals?.goal_weight_kg || null}
              goalType={goals?.goal_type || null}
              startWeightKg={goals?.start_weight_kg || null}
            />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Deficit Intensity Slider */}
      {isLoseOrGain && goals && (
        <motion.div className="nutri-card space-y-4" variants={fadeUp}>
          <div className="flex items-center gap-3">
            {getIntensityIcon(intensity)}
            <div>
              <h3 className="font-semibold text-sm">{t('profile.deficitIntensity')}</h3>
              <p className={`text-xs font-medium ${getIntensityColor(intensity)}`}>
                {getIntensityLabel(intensity)}
              </p>
            </div>
          </div>

          <div className="px-1">
            <Slider
              min={1}
              max={5}
              step={1}
              value={[intensity]}
              onValueChange={(val) => setIntensity(val[0])}
              className="w-full"
            />
            <div className="flex justify-between mt-1.5">
              {[1, 2, 3, 4, 5].map((val) => (
                <div key={val} className="flex flex-col items-center">
                  <span className={`text-[9px] font-medium ${val === intensity ? getIntensityColor(val) : 'text-muted-foreground'}`}>
                    {getIntensityLabel(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-xl p-3 ${getIntensityBgColor(intensity)} space-y-1.5`}>
            <p className={`text-sm font-medium ${getIntensityColor(intensity)}`}>
              {getIntensityHint(intensity)}
            </p>
            <p className="text-xs text-muted-foreground">
              {goalType === 'lose'
                ? t('profile.deficitKcal', { value: deficitValue })
                : t('profile.surplusKcal', { value: deficitValue })
              }
            </p>
            <p className="text-xs text-muted-foreground">
              {t('profile.weeklyLoss', { value: weeklyValue })}
            </p>
            {previewCalories && (
              <p className="text-sm font-semibold text-foreground">
                {t('profile.newCalorieTarget', { value: previewCalories })}
              </p>
            )}
          </div>

          {intensity >= 4 && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-xs text-destructive">
                {language === 'de'
                  ? 'Ein so hohes Defizit kann zu Muskelabbau, Nährstoffmangel und Jojo-Effekt führen. Sprich vorher mit einem Arzt.'
                  : 'Such a high deficit can lead to muscle loss, nutrient deficiency and yo-yo effect. Consult a doctor first.'
                }
              </p>
            </div>
          )}

          <Button
            onClick={handleSaveIntensity}
            disabled={saving || intensity === (goals?.deficit_intensity || 2)}
            className="w-full"
          >
            {saving ? t('common.loading') : t('common.save')}
          </Button>
        </motion.div>
      )}

      {/* Settings */}
      <motion.div className="space-y-2" variants={fadeUp}>
        <h3 className="font-semibold text-sm px-1">{t('profile.settings')}</h3>

        {/* Theme */}
        <div className="nutri-card space-y-3">
          <div className="flex items-center gap-3">
            <Sun className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-sm">{t('profile.theme')}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setTheme(opt.value); hapticFeedback('light'); }}
                className={`py-2.5 rounded-xl text-sm font-medium transition-colors border flex items-center justify-center gap-1.5 ${
                  theme === opt.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:bg-accent'
                }`}
              >
                <opt.icon className="h-3.5 w-3.5" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="nutri-card space-y-3">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-sm">{t('profile.language')}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLanguage('de')}
              className={`py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                language === 'de' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:bg-accent'
              }`}
            >
              🇩🇪 {t('profile.german')}
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                language === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:bg-accent'
              }`}
            >
              🇬🇧 {t('profile.english')}
            </button>
          </div>
        </div>

        {/* Reminders */}
        <ReminderSettings />

        {/* Edit Goals */}
        <button onClick={() => navigate('/onboarding')} className="nutri-card w-full flex items-center gap-3 hover:border-primary/30 transition-colors">
          <Target className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium text-sm">{t('profile.editGoals')}</span>
        </button>

        {/* Admin Link */}
        <AdminLink />
      </motion.div>

      {/* Logout */}
      <motion.div variants={fadeUp}>
        <Button variant="outline" onClick={handleLogout} className="w-full rounded-xl">
          <LogOut className="h-4 w-4 mr-2" />
          {t('auth.logout')}
        </Button>
      </motion.div>

      {showPaywall && (
        <PaywallScreen
          onClose={() => setShowPaywall(false)}
          trigger="premium_feature"
          onUpgrade={(plan) => {
            toast.info(t('paywall.comingSoon'));
            setShowPaywall(false);
          }}
        />
      )}
    </motion.div>
  );
}

function AdminLink() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  if (loading || !isAdmin) return null;

  return (
    <button onClick={() => navigate('/admin')} className="nutri-card w-full flex items-center gap-3 hover:border-primary/30 transition-colors">
      <Shield className="h-5 w-5 text-primary" />
      <span className="font-medium text-sm">Admin Dashboard</span>
    </button>
  );
}
