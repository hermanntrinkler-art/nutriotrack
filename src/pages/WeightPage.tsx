import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import type { WeightEntry, UserGoals } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'sonner';

export default function WeightPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
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
    // Update current weight in goals
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

  const chartData = entries.slice(-30).map(e => ({
    date: new Date(e.entry_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: Number(e.weight_kg),
  }));

  return (
    <div className="page-container space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('weight.title')}</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> {t('weight.addEntry')}
        </Button>
      </div>

      {/* Add weight form */}
      {showForm && (
        <div className="nutri-card space-y-3 animate-fade-in">
          <div className="space-y-2">
            <Label>{t('weight.kg')}</Label>
            <Input type="number" step="0.1" value={newWeight} onChange={e => setNewWeight(e.target.value)} placeholder="75.0" autoFocus />
          </div>
          <div className="space-y-2">
            <Label>{t('weight.note')}</Label>
            <Input value={newNote} onChange={e => setNewNote(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">{t('common.cancel')}</Button>
            <Button onClick={handleSave} disabled={!newWeight} className="flex-1">{t('common.save')}</Button>
          </div>
        </div>
      )}

      {/* Weight stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="nutri-card text-center">
          <p className="text-xs text-muted-foreground">{t('weight.start')}</p>
          <p className="text-lg font-bold">{startWeight ?? '–'}</p>
          <p className="text-xs text-muted-foreground">{t('weight.kg')}</p>
        </div>
        <div className="nutri-card-highlight text-center">
          <p className="text-xs text-muted-foreground">{t('weight.current')}</p>
          <p className="text-lg font-bold">{currentWeight?.toFixed(1) ?? '–'}</p>
          <p className="text-xs text-muted-foreground">{t('weight.kg')}</p>
        </div>
        <div className="nutri-card text-center">
          <p className="text-xs text-muted-foreground">{t('weight.goalLabel')}</p>
          <p className="text-lg font-bold">{goalWeight ?? '–'}</p>
          <p className="text-xs text-muted-foreground">{t('weight.kg')}</p>
        </div>
      </div>

      {diff !== null && (
        <div className="nutri-card flex items-center justify-center gap-2">
          {diff < 0 ? <TrendingDown className="h-5 w-5 text-primary" /> : diff > 0 ? <TrendingUp className="h-5 w-5 text-destructive" /> : <Minus className="h-5 w-5" />}
          <span className="font-semibold">
            {t('weight.difference')}: {diff > 0 ? '+' : ''}{diff.toFixed(1)} {t('weight.kg')}
          </span>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="nutri-card">
          <h3 className="font-semibold text-sm mb-3">{t('weight.history')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} className="text-muted-foreground" />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 10 }} className="text-muted-foreground" width={35} />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="hsl(165, 60%, 40%)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent entries */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">{t('weight.history')}</h3>
        {entries.slice().reverse().slice(0, 10).map(entry => (
          <div key={entry.id} className="nutri-card flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{Number(entry.weight_kg).toFixed(1)} {t('weight.kg')}</p>
              {entry.note && <p className="text-xs text-muted-foreground">{entry.note}</p>}
            </div>
            <p className="text-xs text-muted-foreground">{new Date(entry.entry_date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
