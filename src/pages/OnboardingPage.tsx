import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { calculateNutrition } from '@/lib/nutrition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, User, Target, Activity, Sparkles, Check, Flame, Dumbbell, Zap, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fireCenterBurst } from '@/lib/confetti';
import logo from '@/assets/logo.png';

type Sex = 'male' | 'female' | 'other';
type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
type GoalType = 'lose' | 'maintain' | 'gain';

const TOTAL_STEPS = 4;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
    scale: 0.96,
  }),
};

// --- Hero illustration per step ---
function StepIllustration({ step }: { step: number }) {
  const illustrations = [
    { emoji: '📐', bg: 'from-primary/15 to-accent', label: 'Body' },
    { emoji: '🎯', bg: 'from-energy/15 to-primary/10', label: 'Goals' },
    { emoji: '🏃', bg: 'from-protein/15 to-primary/10', label: 'Activity' },
    { emoji: '✨', bg: 'from-primary/20 to-energy/15', label: 'Summary' },
  ];
  const ill = illustrations[step];

  return (
    <motion.div
      className={`mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br ${ill.bg} flex items-center justify-center mb-3`}
      initial={{ scale: 0, rotate: -15 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
      key={step}
    >
      <span className="text-4xl">{ill.emoji}</span>
    </motion.div>
  );
}

// --- Progress dots with connecting lines ---
function ProgressBar({ step }: { step: number }) {
  const icons = [User, Target, Activity, Sparkles];

  return (
    <div className="flex items-center justify-center gap-0 px-4">
      {icons.map((Icon, i) => {
        const isCompleted = i < step;
        const isCurrent = i === step;
        const isUpcoming = i > step;

        return (
          <div key={i} className="flex items-center">
            <motion.div
              className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                isCompleted
                  ? 'bg-primary border-primary'
                  : isCurrent
                  ? 'bg-primary/10 border-primary'
                  : 'bg-muted/50 border-border'
              }`}
              animate={isCurrent ? { scale: [1, 1.08, 1] } : {}}
              transition={isCurrent ? { duration: 1.5, repeat: Infinity, repeatDelay: 1 } : {}}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Check className="h-4 w-4 text-primary-foreground" />
                </motion.div>
              ) : (
                <Icon className={`h-4 w-4 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
              )}
            </motion.div>
            {i < icons.length - 1 && (
              <div className="w-8 h-0.5 mx-0.5 rounded-full overflow-hidden bg-border">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: i < step ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- Selection card component ---
function SelectionCard({ selected, onClick, emoji, label, description, className = '' }: {
  selected: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
  description?: string;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={`relative w-full py-3.5 px-4 rounded-2xl text-left transition-all border-2 flex items-center gap-3 ${
        selected
          ? 'border-primary bg-primary/8 shadow-md shadow-primary/10'
          : 'border-border bg-card hover:border-primary/30 hover:bg-accent/30'
      } ${className}`}
    >
      {selected && (
        <motion.div
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          <Check className="h-3 w-3 text-primary-foreground" />
        </motion.div>
      )}
      <span className="text-xl flex-shrink-0">{emoji}</span>
      <div>
        <span className="text-sm font-semibold block text-foreground">{label}</span>
        {description && (
          <span className={`text-xs mt-0.5 block ${selected ? 'text-primary/70' : 'text-muted-foreground'}`}>
            {description}
          </span>
        )}
      </div>
    </motion.button>
  );
}

// --- Input with unit suffix ---
function UnitInput({ id, label, value, onChange, placeholder, unit, min, max, step = '1' }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  placeholder: string; unit: string; min?: number; max?: number; step?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-semibold">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className="pr-12 h-12 rounded-xl text-base"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">{unit}</span>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const { user, refreshProfile } = useAuth();
  const { t, language } = useTranslation();
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

  const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, TOTAL_STEPS - 1)); };
  const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)); };

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
    fireCenterBurst();
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

  // Calculate nutrition preview for summary
  const nutritionPreview = (age && height && currentWeight) ? calculateNutrition({
    sex,
    age: Number(age),
    height_cm: Number(height),
    current_weight_kg: Number(currentWeight),
    activity_level: activityLevel,
    goal_type: goalType,
  }) : null;

  const stepTitles = [
    { title: t('onboarding.bodyInfo'), subtitle: language === 'de' ? 'Erzähl uns von dir' : 'Tell us about yourself' },
    { title: t('onboarding.goals'), subtitle: language === 'de' ? 'Was möchtest du erreichen?' : 'What do you want to achieve?' },
    { title: t('onboarding.activity'), subtitle: language === 'de' ? 'Wie aktiv bist du?' : 'How active are you?' },
    { title: language === 'de' ? 'Dein Plan' : 'Your Plan', subtitle: language === 'de' ? 'Alles bereit – los gehts!' : "All set — let's go!" },
  ];

  const activityLabelMap: Record<string, string> = {
    sedentary: t('onboarding.sedentary'),
    lightly_active: t('onboarding.lightlyActive'),
    moderately_active: t('onboarding.moderatelyActive'),
    very_active: t('onboarding.veryActive'),
    extremely_active: t('onboarding.extremelyActive'),
  };

  const goalLabelMap: Record<string, string> = {
    lose: t('onboarding.lose'),
    maintain: t('onboarding.maintain'),
    gain: t('onboarding.gain'),
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <motion.div
        className="px-6 pt-6 pb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <img src={logo} alt="NutrioTrack" className="h-8" />
          <span className="font-bold text-base tracking-tight">NutrioTrack</span>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div
        className="pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ProgressBar step={step} />
      </motion.div>

      {/* Step content */}
      <div className="flex-1 px-6 pb-4 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-4"
          >
            <StepIllustration step={step} />

            <div className="text-center mb-2">
              <h2 className="text-xl font-extrabold tracking-tight">{stepTitles[step].title}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{stepTitles[step].subtitle}</p>
            </div>

            {/* Step 0: Body Info */}
            {step === 0 && (
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">{t('onboarding.sex')}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {sexOptions.map(opt => (
                      <SelectionCard
                        key={opt.value}
                        selected={sex === opt.value}
                        onClick={() => setSex(opt.value)}
                        emoji={opt.emoji}
                        label={opt.label}
                        className="flex-col items-center text-center gap-1 py-3"
                      />
                    ))}
                  </div>
                </div>
                <UnitInput id="age" label={t('onboarding.age')} value={age} onChange={setAge} placeholder="25" unit={language === 'de' ? 'Jahre' : 'yrs'} min={10} max={120} />
                <UnitInput id="height" label={t('onboarding.height')} value={height} onChange={setHeight} placeholder="175" unit="cm" min={100} max={250} />
                <UnitInput id="currentWeight" label={t('onboarding.currentWeight')} value={currentWeight} onChange={setCurrentWeight} placeholder="80" unit="kg" min={30} max={300} step="0.1" />
                <UnitInput id="startWeight" label={t('onboarding.startWeight')} value={startWeight} onChange={setStartWeight} placeholder={currentWeight || '80'} unit="kg" min={30} max={300} step="0.1" />
              </motion.div>
            )}

            {/* Step 1: Goals */}
            {step === 1 && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <UnitInput id="goalWeight" label={t('onboarding.goalWeight')} value={goalWeight} onChange={setGoalWeight} placeholder="70" unit="kg" min={30} max={300} step="0.1" />
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">{t('onboarding.goalType')}</Label>
                  <div className="space-y-2">
                    {goalOptions.map((opt, i) => (
                      <motion.div
                        key={opt.value}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.06 }}
                      >
                        <SelectionCard
                          selected={goalType === opt.value}
                          onClick={() => setGoalType(opt.value)}
                          emoji={opt.emoji}
                          label={opt.label}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Activity */}
            {step === 2 && (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                {activityOptions.map((opt, i) => (
                  <motion.div
                    key={opt.value}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <SelectionCard
                      selected={activityLevel === opt.value}
                      onClick={() => setActivityLevel(opt.value)}
                      emoji={opt.emoji}
                      label={opt.label}
                      description={opt.desc}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Step 3: Summary */}
            {step === 3 && nutritionPreview && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                {/* Personal summary */}
                <div className="nutri-card space-y-2.5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <User className="h-4 w-4" />
                    {language === 'de' ? 'Deine Daten' : 'Your Data'}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <span className="text-muted-foreground">{t('onboarding.age')}</span>
                    <span className="font-semibold text-right">{age} {language === 'de' ? 'Jahre' : 'yrs'}</span>
                    <span className="text-muted-foreground">{t('onboarding.height')}</span>
                    <span className="font-semibold text-right">{height} cm</span>
                    <span className="text-muted-foreground">{t('onboarding.currentWeight')}</span>
                    <span className="font-semibold text-right">{currentWeight} kg</span>
                    <span className="text-muted-foreground">{t('onboarding.goalWeight')}</span>
                    <span className="font-semibold text-right">{goalWeight} kg</span>
                    <span className="text-muted-foreground">{t('onboarding.goalType')}</span>
                    <span className="font-semibold text-right">{goalLabelMap[goalType]}</span>
                    <span className="text-muted-foreground">{t('onboarding.activityLevel')}</span>
                    <span className="font-semibold text-right">{activityLabelMap[activityLevel]}</span>
                  </div>
                </div>

                {/* Nutrition targets */}
                <div className="nutri-card-highlight">
                  <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {language === 'de' ? 'Dein tägliches Ziel' : 'Your Daily Target'}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      className="flex items-center gap-2 p-3 rounded-xl bg-muted/50"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--energy) / 0.15)' }}>
                        <Flame className="h-4 w-4 text-energy" />
                      </div>
                      <div>
                        <p className="text-lg font-black tabular-nums">{nutritionPreview.calorieTarget}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">kcal</p>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-2 p-3 rounded-xl bg-muted/50"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--protein) / 0.15)' }}>
                        <Dumbbell className="h-4 w-4 text-protein" />
                      </div>
                      <div>
                        <p className="text-lg font-black tabular-nums">{nutritionPreview.proteinTarget}g</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{t('dashboard.protein')}</p>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-2 p-3 rounded-xl bg-muted/50"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--fat) / 0.15)' }}>
                        <Droplets className="h-4 w-4 text-fat" />
                      </div>
                      <div>
                        <p className="text-lg font-black tabular-nums">{nutritionPreview.fatTarget}g</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{t('dashboard.fat')}</p>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-2 p-3 rounded-xl bg-muted/50"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--carbs) / 0.15)' }}>
                        <Zap className="h-4 w-4 text-carbs" />
                      </div>
                      <div>
                        <p className="text-lg font-black tabular-nums">{nutritionPreview.carbsTarget}g</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{t('dashboard.carbs')}</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
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
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button variant="outline" onClick={goBack} className="rounded-xl h-12 px-4">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
        <motion.div className="flex-1" whileTap={{ scale: 0.97 }}>
          {step < TOTAL_STEPS - 1 ? (
            <Button onClick={goNext} disabled={!canNext()} className="w-full rounded-xl h-12 text-base font-bold">
              {t('onboarding.next')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={loading || !canNext()}
              className="w-full rounded-xl h-12 text-base font-bold"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--gradient-end)))' }}
            >
              {loading ? t('common.loading') : (language === 'de' ? '🚀 Los gehts!' : "🚀 Let's go!")}
            </Button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
