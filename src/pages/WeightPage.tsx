import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import type { WeightEntry, UserGoals } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, TrendingDown, TrendingUp, Minus, Trophy, Target, Flame, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

// Custom tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-bold text-foreground">{payload[0].value?.toFixed(1)} kg</p>
    </div>
  );
}

// Custom animated dot
function AnimatedDot(props: any) {
  const { cx, cy, index, dataLength } = props;
  const isLast = index === dataLength - 1;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isLast ? 5 : 3}
      fill={isLast ? 'hsl(153, 58%, 45%)' : 'hsl(153, 58%, 45%)'}
      stroke={isLast ? 'hsl(153, 58%, 45%)' : 'none'}
      strokeWidth={isLast ? 3 : 0}
      strokeOpacity={isLast ? 0.3 : 0}
    />
  );
}

// Milestone badge component
function MilestoneBadge({ icon: Icon, text, color }: { icon: React.ElementType; text: string; color: string }) {
  return (
    <motion.div
      className={`flex items-center gap-2 rounded-xl px-3 py-2 border ${color}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="text-xs font-medium">{text}</span>
    </motion.div>
  );
}

export default function WeightPage() {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [goals, setGoals] = useState<UserGoals | null>(null);
  const [newWeight, setNewWeight] = useState('');
  const [newNote, setNewNote] = useState('');
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    if (!user) return;
    const { data: w } = await supabase.from('weight_entries').select('*').eq('user_id', user.id).order('entry_date', { ascending: true });
    setEntries((w || []) as any);
    const { data: g } = await supabase.from('user_goals').select('*').eq('user_id', user.id).single();
    if (g) setGoals(g as any);
  };

  useEffect(() => { loadData(); }, [user]);

  const handleSave = async () => {
    if (!user || !newWeight) return;
    await supabase.from('weight_entries').insert({
      user_id: user.id,
      weight_kg: Number(newWeight),
      note: newNote || null,
    } as any);
    if (goals) {
      await supabase.from('user_goals').update({ current_weight_kg: Number(newWeight) } as any).eq('user_id', user.id);
    }
    toast.success(t('common.success'));
    setNewWeight('');
    setNewNote('');
    setShowForm(false);
    loadData();
  };

  const currentWeight = entries.length > 0 ? Number(entries[entries.length - 1].weight_kg) : null;
  const startWeight = goals?.start_weight_kg ? Number(goals.start_weight_kg) : null;
  const goalWeight = goals?.goal_weight_kg ? Number(goals.goal_weight_kg) : null;
  const diff = currentWeight && startWeight ? currentWeight - startWeight : null;

  // Calculate trend line data
  const chartData = useMemo(() => {
    const raw = entries.slice(-30).map(e => ({
      date: new Date(e.entry_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      weight: Number(e.weight_kg),
    }));

    if (raw.length < 2) return raw.map(d => ({ ...d, trend: d.weight }));

    // Simple linear regression for trend
    const n = raw.length;
    const sumX = raw.reduce((s, _, i) => s + i, 0);
    const sumY = raw.reduce((s, d) => s + d.weight, 0);
    const sumXY = raw.reduce((s, d, i) => s + i * d.weight, 0);
    const sumX2 = raw.reduce((s, _, i) => s + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return raw.map((d, i) => ({
      ...d,
      trend: Math.round((intercept + slope * i) * 10) / 10,
    }));
  }, [entries]);

  // Progress to goal
  const progressToGoal = useMemo(() => {
    if (!startWeight || !goalWeight || !currentWeight) return null;
    const totalDiff = Math.abs(goalWeight - startWeight);
    if (totalDiff === 0) return 100;
    const currentDiff = Math.abs(currentWeight - startWeight);
    const isCorrectDirection = goals?.goal_type === 'gain'
      ? currentWeight >= startWeight
      : currentWeight <= startWeight;
    if (!isCorrectDirection) return 0;
    return Math.min(Math.round((currentDiff / totalDiff) * 100), 100);
  }, [startWeight, goalWeight, currentWeight, goals]);

  // Milestones
  const milestones = useMemo(() => {
    const badges: { icon: React.ElementType; text: string; color: string }[] = [];
    if (!startWeight || !currentWeight || !goalWeight) return badges;

    const lost = startWeight - currentWeight;
    const isLosing = goals?.goal_type === 'lose';

    if (isLosing && lost >= 1) {
      badges.push({
        icon: Flame,
        text: language === 'de' ? `${lost.toFixed(1)} kg verloren!` : `${lost.toFixed(1)} kg lost!`,
        color: 'border-primary/30 bg-primary/5 text-primary',
      });
    }

    if (isLosing && lost >= 5) {
      badges.push({
        icon: Award,
        text: language === 'de' ? '5 kg Meilenstein! 🎉' : '5 kg milestone! 🎉',
        color: 'border-warning/30 bg-warning/5 text-warning',
      });
    }

    if (progressToGoal !== null && progressToGoal >= 50 && progressToGoal < 100) {
      badges.push({
        icon: Target,
        text: language === 'de' ? 'Halbzeit erreicht!' : 'Halfway there!',
        color: 'border-info/30 bg-info/5 text-info',
      });
    }

    if (progressToGoal === 100) {
      badges.push({
        icon: Trophy,
        text: language === 'de' ? 'Ziel erreicht! 🏆' : 'Goal reached! 🏆',
        color: 'border-primary/30 bg-primary/5 text-primary',
      });
    }

    return badges;
  }, [startWeight, currentWeight, goalWeight, progressToGoal, goals, language]);

  return (
    <motion.div
      className="page-container space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div className="flex items-center justify-between" variants={fadeUp}>
        <h1 className="text-xl font-bold">{t('weight.title')}</h1>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-1" /> {t('weight.addEntry')}
          </Button>
        </motion.div>
      </motion.div>

      {/* Add weight form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="nutri-card space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2">
              <Label>{t('weight.kg')}</Label>
              <Input type="number" step="0.1" value={newWeight} onChange={e => setNewWeight(e.target.value)} placeholder="75.0" autoFocus />
            </div>
            <div className="space-y-2">
              <Label>{t('weight.note')}</Label>
              <Input value={newNote} onChange={e => setNewNote(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 rounded-xl">{t('common.cancel')}</Button>
              <Button onClick={handleSave} disabled={!newWeight} className="flex-1 rounded-xl">{t('common.save')}</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weight stats */}
      <motion.div className="grid grid-cols-3 gap-3" variants={fadeUp}>
        <motion.div className="nutri-card text-center shadow-sm" whileHover={{ y: -2 }}>
          <p className="text-xs text-muted-foreground">{t('weight.start')}</p>
          <p className="text-lg font-bold tabular-nums">{startWeight ?? '–'}</p>
          <p className="text-xs text-muted-foreground">{t('weight.kg')}</p>
        </motion.div>
        <motion.div className="nutri-card-highlight text-center shadow-md" whileHover={{ y: -2 }}>
          <p className="text-xs text-muted-foreground">{t('weight.current')}</p>
          <p className="text-lg font-bold tabular-nums">{currentWeight?.toFixed(1) ?? '–'}</p>
          <p className="text-xs text-muted-foreground">{t('weight.kg')}</p>
        </motion.div>
        <motion.div className="nutri-card text-center shadow-sm" whileHover={{ y: -2 }}>
          <p className="text-xs text-muted-foreground">{t('weight.goalLabel')}</p>
          <p className="text-lg font-bold tabular-nums">{goalWeight ?? '–'}</p>
          <p className="text-xs text-muted-foreground">{t('weight.kg')}</p>
        </motion.div>
      </motion.div>

      {/* Progress to goal */}
      {progressToGoal !== null && (
        <motion.div className="nutri-card space-y-2 shadow-sm" variants={fadeUp}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {language === 'de' ? 'Fortschritt zum Ziel' : 'Progress to goal'}
            </span>
            <span className="text-xs font-bold text-primary tabular-nums">{progressToGoal}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
              initial={{ width: '0%' }}
              animate={{ width: `${progressToGoal}%` }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' as const }}
            />
          </div>
        </motion.div>
      )}

      {/* Difference */}
      {diff !== null && (
        <motion.div className="nutri-card flex items-center justify-center gap-2 shadow-sm" variants={fadeUp}>
          {diff < 0 ? <TrendingDown className="h-5 w-5 text-primary" /> : diff > 0 ? <TrendingUp className="h-5 w-5 text-destructive" /> : <Minus className="h-5 w-5" />}
          <span className="font-semibold">
            {t('weight.difference')}: {diff > 0 ? '+' : ''}{diff.toFixed(1)} {t('weight.kg')}
          </span>
        </motion.div>
      )}

      {/* Milestones */}
      {milestones.length > 0 && (
        <motion.div className="flex flex-wrap gap-2" variants={fadeUp}>
          {milestones.map((m, i) => (
            <MilestoneBadge key={i} icon={m.icon} text={m.text} color={m.color} />
          ))}
        </motion.div>
      )}

      {/* Chart */}
      {chartData.length > 1 && (
        <motion.div className="nutri-card shadow-md" variants={fadeUp}>
          <h3 className="font-semibold text-sm mb-3">{t('weight.history')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }}
                axisLine={{ stroke: 'hsl(220, 12%, 90%)' }}
                tickLine={false}
              />
              <YAxis
                domain={['dataMin - 1', 'dataMax + 1']}
                tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(153, 58%, 45%)', strokeWidth: 1, strokeDasharray: '4 4' }} />
              {goalWeight && (
                <ReferenceLine
                  y={goalWeight}
                  stroke="hsl(38, 92%, 55%)"
                  strokeDasharray="6 4"
                  strokeWidth={1.5}
                  label={{
                    value: language === 'de' ? 'Ziel' : 'Goal',
                    position: 'right',
                    fontSize: 10,
                    fill: 'hsl(38, 92%, 55%)',
                    fontWeight: 600,
                  }}
                />
              )}
              {/* Trend line */}
              <Line
                type="monotone"
                dataKey="trend"
                stroke="hsl(210, 80%, 55%)"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                dot={false}
                activeDot={false}
              />
              {/* Actual weight line */}
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(153, 58%, 45%)"
                strokeWidth={2.5}
                dot={<AnimatedDot dataLength={chartData.length} />}
                activeDot={{ r: 6, stroke: 'hsl(153, 58%, 45%)', strokeWidth: 2, fill: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-primary rounded" />
              <span className="text-[10px] text-muted-foreground">{language === 'de' ? 'Gewicht' : 'Weight'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-info rounded" style={{ borderTop: '1.5px dashed hsl(210, 80%, 55%)' }} />
              <span className="text-[10px] text-muted-foreground">{language === 'de' ? 'Trend' : 'Trend'}</span>
            </div>
            {goalWeight && (
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 rounded" style={{ borderTop: '1.5px dashed hsl(38, 92%, 55%)' }} />
                <span className="text-[10px] text-muted-foreground">{language === 'de' ? 'Ziel' : 'Goal'}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Recent entries */}
      <motion.div className="space-y-2" variants={fadeUp}>
        <h3 className="font-semibold text-sm">{t('weight.history')}</h3>
        {entries.slice().reverse().slice(0, 10).map((entry, i) => (
          <motion.div
            key={entry.id}
            className="nutri-card flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            whileHover={{ y: -1 }}
          >
            <div>
              <p className="font-medium text-sm tabular-nums">{Number(entry.weight_kg).toFixed(1)} {t('weight.kg')}</p>
              {entry.note && <p className="text-xs text-muted-foreground">{entry.note}</p>}
            </div>
            <p className="text-xs text-muted-foreground">{new Date(entry.entry_date).toLocaleDateString()}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
