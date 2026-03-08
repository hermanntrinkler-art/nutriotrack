import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { calculateNutrition } from '@/lib/nutrition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, User, Target, Activity, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

type Sex = 'male' | 'female' | 'other';
type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
type GoalType = 'lose' | 'maintain' | 'gain';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

const stepIcons = [User, Target, Activity];

export default function OnboardingPage() {
  const { user, refreshProfile } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(false);

  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [startWeight, setStartWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active');
  const [goalType, setGoalType] = useState<GoalType>('lose');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user || loaded) return;
    supabase.from('user_goals').select('*').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data) {
          const g = data as any;
          if (g.sex) setSex(g.sex);
          if (g.age) setAge(String(g.age));
          if (g.height_cm) setHeight(String(g.height_cm));
          if (g.current_weight_kg) setCurrentWeight(String(g.current_weight_kg));
          if (g.start_weight_kg) setStartWeight(String(g.start_weight_kg));
          if (g.goal_weight_kg) setGoalWeight(String(g.goal_weight_kg));
          if (g.activity_level) setActivityLevel(g.activity_level);
          if (g.goal_type) setGoalType(g.goal_type);
        }
        setLoaded(true);
      });
  }, [user, loaded]);

  const steps = [
    { title: t('onboarding.bodyInfo'), key: 'body', icon: User },
    { title: t('onboarding.goals'), key: 'goals', icon: Target },
    { title: t('onboarding.activity'), key: 'activity', icon: Activity },
  ];

  const goNext = () => { setDirection(1); setStep(s => s + 1); };
  const goBack = () => { setDirection(-1); setStep(s => s - 1); };

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);

    const calc = calculateNutrition({
      sex,
      age: Number(age),
      height_cm: Number(height),
      current_weight_kg: Number(currentWeight),
      activity_level: activityLevel,
      goal_type: goalType,
    });

    await supabase.from('user_goals').upsert({
      user_id: user.id,
      age: Number(age),
      sex,
      height_cm: Number(height),
      start_weight_kg: Number(startWeight || currentWeight),
      current_weight_kg: Number(currentWeight),
      goal_weight_kg: Number(goalWeight),
      activity_level: activityLevel,
      goal_type: goalType,
      calorie_target: calc.calorieTarget,
      protein_target_g: calc.proteinTarget,
      fat_target_g: calc.fatTarget,
      carbs_target_g: calc.carbsTarget,
    } as any, { onConflict: 'user_id' });

    await supabase.from('weight_entries').insert({
      user_id: user.id,
      weight_kg: Number(currentWeight),
    } as any);

    await supabase.from('profiles').update({ onboarding_completed: true } as any).eq('user_id', user.id);

    await refreshProfile();
    setLoading(false);
    navigate('/dashboard');
  };

  const canNext = () => {
    if (step === 0) return age && height && currentWeight;
    if (step === 1) return goalWeight;
    return true;
  };

  const sexOptions: { value: Sex; label: string; emoji: string }[] = [
    { value: 'male', label: t('onboarding.male'), emoji: '👨' },
    { value: 'female', label: t('onboarding.female'), emoji: '👩' },
    { value: 'other', label: t('onboarding.other'), emoji: '🧑' },
  ];

  const activityOptions: { value: ActivityLevel; label: string; desc: string; emoji: string }[] = [
    { value: 'sedentary', label: t('onboarding.sedentary'), desc: t('onboarding.sedentaryDesc'), emoji: '🪑' },
    { value: 'lightly_active', label: t('onboarding.lightlyActive'), desc: t('onboarding.lightlyActiveDesc'), emoji: '🚶' },
    { value: 'moderately_active', label: t('onboarding.moderatelyActive'), desc: t('onboarding.moderatelyActiveDesc'), emoji: '🏃' },
    { value: 'very_active', label: t('onboarding.veryActive'), desc: t('onboarding.veryActiveDesc'), emoji: '🏋️' },
    { value: 'extremely_active', label: t('onboarding.extremelyActive'), desc: t('onboarding.extremelyActiveDesc'), emoji: '⚡' },
  ];

  const goalOptions: { value: GoalType; label: string; emoji: string }[] = [
    { value: 'lose', label: t('onboarding.lose'), emoji: '📉' },
    { value: 'maintain', label: t('onboarding.maintain'), emoji: '⚖️' },
    { value: 'gain', label: t('onboarding.gain'), emoji: '📈' },
  ];

  const progressPct = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <motion.div
        className="px-6 pt-8 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2.5 mb-5">
          <img src={logo} alt="NutrioTrack" className="h-10" />
          <span className="font-bold text-lg tracking-tight">NutrioTrack</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-xl font-bold">{t('onboarding.title')}</h1>
            <p className="text-muted-foreground text-sm">{t('onboarding.subtitle')}</p>
          </div>
        </div>
      </motion.div>

      {/* Animated progress bar */}
      <div className="px-6 pb-5">
        <div className="relative">
          {/* Step icons */}
          <div className="flex justify-between mb-3">
            {steps.map((s, i) => {
              const Icon = stepIcons[i];
              const isActive = i <= step;
              const isCurrent = i === step;
              return (
                <motion.div
                  key={s.key}
                  className="flex flex-col items-center gap-1"
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-[10px] font-medium transition-colors duration-300 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {s.title}
                  </span>
                </motion.div>
              );
            })}
          </div>
          {/* Bar */}
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {t('onboarding.step')} {step + 1} {t('onboarding.of')} {steps.length}
          </p>
        </div>
      </div>

      {/* Step content with slide animation */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeOut' as const }}
          >
            {step === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('onboarding.sex')}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {sexOptions.map(opt => (
                      <motion.button
                        key={opt.value}
                        type="button"
                        onClick={() => setSex(opt.value)}
                        whileTap={{ scale: 0.95 }}
                        className={`py-3.5 px-2 rounded-xl text-sm font-medium transition-colors border ${
                          sex === opt.value
                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                            : 'bg-card border-border text-foreground hover:bg-accent'
                        }`}
                      >
                        <span className="text-lg block mb-0.5">{opt.emoji}</span>
                        {opt.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">{t('onboarding.age')}</Label>
                  <Input id="age" type="number" value={age} onChange={e => setAge(e.target.value)} min={10} max={120} placeholder="25" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">{t('onboarding.height')}</Label>
                  <Input id="height" type="number" value={height} onChange={e => setHeight(e.target.value)} min={100} max={250} placeholder="175" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentWeight">{t('onboarding.currentWeight')}</Label>
                  <Input id="currentWeight" type="number" step="0.1" value={currentWeight} onChange={e => setCurrentWeight(e.target.value)} min={30} max={300} placeholder="80" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startWeight">{t('onboarding.startWeight')}</Label>
                  <Input id="startWeight" type="number" step="0.1" value={startWeight} onChange={e => setStartWeight(e.target.value)} placeholder={currentWeight || '80'} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goalWeight">{t('onboarding.goalWeight')}</Label>
                  <Input id="goalWeight" type="number" step="0.1" value={goalWeight} onChange={e => setGoalWeight(e.target.value)} min={30} max={300} placeholder="70" />
                </div>
                <div className="space-y-2">
                  <Label>{t('onboarding.goalType')}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {goalOptions.map(opt => (
                      <motion.button
                        key={opt.value}
                        type="button"
                        onClick={() => setGoalType(opt.value)}
                        whileTap={{ scale: 0.95 }}
                        className={`py-3.5 px-2 rounded-xl text-sm font-medium transition-colors border ${
                          goalType === opt.value
                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                            : 'bg-card border-border text-foreground hover:bg-accent'
                        }`}
                      >
                        <span className="text-lg block mb-0.5">{opt.emoji}</span>
                        {opt.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <Label>{t('onboarding.activityLevel')}</Label>
                {activityOptions.map((opt, i) => (
                  <motion.button
                    key={opt.value}
                    type="button"
                    onClick={() => setActivityLevel(opt.value)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-3.5 px-4 rounded-xl text-left transition-colors border flex items-center gap-3 ${
                      activityLevel === opt.value
                        ? 'bg-primary text-primary-foreground border-primary shadow-md'
                        : 'bg-card border-border text-foreground hover:bg-accent'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{opt.emoji}</span>
                    <div>
                      <span className="text-sm font-medium block">{opt.label}</span>
                      <span className={`text-xs mt-0.5 block ${activityLevel === opt.value ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {opt.desc}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <motion.div
        className="px-6 pb-8 flex gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {step > 0 && (
          <motion.div className="flex-1" whileTap={{ scale: 0.97 }}>
            <Button variant="outline" onClick={goBack} className="w-full rounded-xl h-11">
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('onboarding.back')}
            </Button>
          </motion.div>
        )}
        <motion.div className="flex-1" whileTap={{ scale: 0.97 }}>
          {step < steps.length - 1 ? (
            <Button onClick={goNext} disabled={!canNext()} className="w-full rounded-xl h-11 text-base font-semibold">
              {t('onboarding.next')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={loading || !canNext()} className="w-full rounded-xl h-11 text-base font-semibold">
              {loading ? t('common.loading') : t('onboarding.finish')}
            </Button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
