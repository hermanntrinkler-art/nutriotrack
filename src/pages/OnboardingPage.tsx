import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { calculateNutrition } from '@/lib/nutrition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '@/assets/logo.png';

type Sex = 'male' | 'female' | 'other';
type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
type GoalType = 'lose' | 'maintain' | 'gain';

export default function OnboardingPage() {
  const { user, refreshProfile } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [startWeight, setStartWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active');
  const [goalType, setGoalType] = useState<GoalType>('lose');

  const steps = [
    { title: t('onboarding.bodyInfo'), key: 'body' },
    { title: t('onboarding.goals'), key: 'goals' },
    { title: t('onboarding.activity'), key: 'activity' },
  ];

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

    // Also log initial weight
    await supabase.from('weight_entries').insert({
      user_id: user.id,
      weight_kg: Number(currentWeight),
    } as any);

    await supabase.from('profiles').update({ onboarding_completed: true } as any).eq('user_id', user.id);

    await refreshProfile();
    setLoading(false);
    navigate('/');
  };

  const canNext = () => {
    if (step === 0) return age && height && currentWeight;
    if (step === 1) return goalWeight;
    return true;
  };

  const sexOptions: { value: Sex; label: string }[] = [
    { value: 'male', label: t('onboarding.male') },
    { value: 'female', label: t('onboarding.female') },
    { value: 'other', label: t('onboarding.other') },
  ];

  const activityOptions: { value: ActivityLevel; label: string }[] = [
    { value: 'sedentary', label: t('onboarding.sedentary') },
    { value: 'lightly_active', label: t('onboarding.lightlyActive') },
    { value: 'moderately_active', label: t('onboarding.moderatelyActive') },
    { value: 'very_active', label: t('onboarding.veryActive') },
    { value: 'extremely_active', label: t('onboarding.extremelyActive') },
  ];

  const goalOptions: { value: GoalType; label: string }[] = [
    { value: 'lose', label: t('onboarding.lose') },
    { value: 'maintain', label: t('onboarding.maintain') },
    { value: 'gain', label: t('onboarding.gain') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 mb-6">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Snap2Fit</span>
        </div>
        <h1 className="text-2xl font-bold">{t('onboarding.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('onboarding.subtitle')}</p>
      </div>

      {/* Step indicator */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 flex-1">
              <div className={`h-1.5 rounded-full flex-1 transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {t('onboarding.step')} {step + 1} {t('onboarding.of')} {steps.length} – {steps[step].title}
        </p>
      </div>

      {/* Step content */}
      <div className="flex-1 px-6 pb-6 animate-fade-in">
        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('onboarding.sex')}</Label>
              <div className="grid grid-cols-3 gap-2">
                {sexOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSex(opt.value)}
                    className={`py-3 px-2 rounded-xl text-sm font-medium transition-colors border ${
                      sex === opt.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border text-foreground hover:bg-accent'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">{t('onboarding.age')}</Label>
              <Input id="age" type="number" value={age} onChange={e => setAge(e.target.value)} min={10} max={120} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">{t('onboarding.height')}</Label>
              <Input id="height" type="number" value={height} onChange={e => setHeight(e.target.value)} min={100} max={250} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentWeight">{t('onboarding.currentWeight')}</Label>
              <Input id="currentWeight" type="number" step="0.1" value={currentWeight} onChange={e => setCurrentWeight(e.target.value)} min={30} max={300} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startWeight">{t('onboarding.startWeight')}</Label>
              <Input id="startWeight" type="number" step="0.1" value={startWeight} onChange={e => setStartWeight(e.target.value)} placeholder={currentWeight || ''} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goalWeight">{t('onboarding.goalWeight')}</Label>
              <Input id="goalWeight" type="number" step="0.1" value={goalWeight} onChange={e => setGoalWeight(e.target.value)} min={30} max={300} />
            </div>
            <div className="space-y-2">
              <Label>{t('onboarding.goalType')}</Label>
              <div className="grid grid-cols-3 gap-2">
                {goalOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setGoalType(opt.value)}
                    className={`py-3 px-2 rounded-xl text-sm font-medium transition-colors border ${
                      goalType === opt.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border text-foreground hover:bg-accent'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('onboarding.activityLevel')}</Label>
              <div className="space-y-2">
                {activityOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setActivityLevel(opt.value)}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-colors border text-left ${
                      activityLevel === opt.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border text-foreground hover:bg-accent'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8 flex gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('onboarding.back')}
          </Button>
        )}
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="flex-1">
            {t('onboarding.next')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={loading || !canNext()} className="flex-1">
            {loading ? t('common.loading') : t('onboarding.finish')}
          </Button>
        )}
      </div>
    </div>
  );
}
