import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import type { MealEntry, WeightEntry, UserGoals } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DailyView from '@/components/history/DailyView';
import WeeklyView from '@/components/history/WeeklyView';
import MonthlyView from '@/components/history/MonthlyView';

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [goals, setGoals] = useState<UserGoals | null>(null);

  // Navigation states
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [monthDate, setMonthDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    if (!user) return;

    supabase.from('meal_entries').select('*').eq('user_id', user.id)
      .order('entry_date', { ascending: false }).order('created_at', { ascending: false })
      .then(({ data }) => setMeals((data || []) as any));

    supabase.from('weight_entries').select('*').eq('user_id', user.id)
      .order('entry_date', { ascending: true })
      .then(({ data }) => setWeightEntries((data || []) as any));

    supabase.from('user_goals').select('*').eq('user_id', user.id).single()
      .then(({ data }) => { if (data) setGoals(data as any); });
  }, [user]);

  // Date navigation helpers
  const navigateDay = (offset: number) => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const navigateWeek = (offset: number) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + offset * 7);
    setWeekStart(d);
  };

  const navigateMonth = (offset: number) => {
    const d = new Date(monthDate);
    d.setMonth(d.getMonth() + offset);
    setMonthDate(d);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const isCurrentWeek = getMonday(new Date()).getTime() === weekStart.getTime();
  const isCurrentMonth = monthDate.getMonth() === new Date().getMonth() && monthDate.getFullYear() === new Date().getFullYear();

  const dayLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  const weekEndDate = new Date(weekStart);
  weekEndDate.setDate(weekEndDate.getDate() + 6);
  const weekLabel = `${weekStart.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} – ${weekEndDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`;
  const monthLabel = monthDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="page-container space-y-4">
      <h1 className="text-xl font-bold">{t('history.title')}</h1>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="daily" className="flex-1">{t('history.daily')}</TabsTrigger>
          <TabsTrigger value="weekly" className="flex-1">{t('history.weekly')}</TabsTrigger>
          <TabsTrigger value="monthly" className="flex-1">{t('history.monthly')}</TabsTrigger>
        </TabsList>

        {/* Daily tab */}
        <TabsContent value="daily" className="mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigateDay(-1)} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${isToday ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
            >
              {dayLabel}
            </button>
            <Button variant="ghost" size="icon" onClick={() => navigateDay(1)} className="h-8 w-8" disabled={isToday}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <DailyView meals={meals} selectedDate={selectedDate} goals={goals} />
        </TabsContent>

        {/* Weekly tab */}
        <TabsContent value="weekly" className="mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigateWeek(-1)} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <button
              onClick={() => setWeekStart(getMonday(new Date()))}
              className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors ${isCurrentWeek ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
            >
              {weekLabel}
            </button>
            <Button variant="ghost" size="icon" onClick={() => navigateWeek(1)} className="h-8 w-8" disabled={isCurrentWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <WeeklyView meals={meals} weightEntries={weightEntries} goals={goals} weekStart={weekStart} />
        </TabsContent>

        {/* Monthly tab */}
        <TabsContent value="monthly" className="mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <button
              onClick={() => {
                const now = new Date();
                setMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
              }}
              className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors capitalize ${isCurrentMonth ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
            >
              {monthLabel}
            </button>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)} className="h-8 w-8" disabled={isCurrentMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <MonthlyView meals={meals} weightEntries={weightEntries} goals={goals} month={monthDate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
