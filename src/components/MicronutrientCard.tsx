import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { estimateDailyMicros, DAILY_TARGETS, MICRO_LABELS, type MicronutrientEstimate } from '@/lib/micronutrients';
import { motion } from 'framer-motion';
import { Pill, Info } from 'lucide-react';

export default function MicronutrientCard() {
  const { user } = useAuth();
  const { language } = useTranslation();
  const [foodItems, setFoodItems] = useState<{ food_name: string; quantity: number; unit: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];

    // Get today's meal IDs then food items
    supabase
      .from('meal_entries')
      .select('id')
      .eq('user_id', user.id)
      .eq('entry_date', today)
      .then(({ data: meals }) => {
        if (!meals?.length) return;
        const ids = meals.map(m => m.id);
        supabase
          .from('meal_food_items')
          .select('food_name, quantity, unit')
          .in('meal_entry_id', ids)
          .then(({ data }) => {
            if (data) setFoodItems(data as any);
          });
      });
  }, [user]);

  const micros = useMemo(() => estimateDailyMicros(foodItems), [foodItems]);

  if (foodItems.length === 0) return null;

  const keys = Object.keys(DAILY_TARGETS) as (keyof MicronutrientEstimate)[];

  const getBarColor = (pct: number) => {
    if (pct >= 90) return 'bg-primary';
    if (pct >= 50) return 'bg-primary/60';
    return 'bg-primary/30';
  };

  return (
    <motion.div
      className="nutri-card shadow-md hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Pill className="h-4 w-4 text-primary" />
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
          {language === 'de' ? 'Mikronährstoffe' : 'Micronutrients'}
        </h3>
      </div>

      <div className="space-y-2.5">
        {keys.map((key, i) => {
          const value = micros[key];
          const target = DAILY_TARGETS[key];
          const pct = Math.min((value / target) * 100, 100);
          const label = MICRO_LABELS[key];

          return (
            <motion.div
              key={key}
              className="space-y-0.5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">
                  {language === 'de' ? label.de : label.en}
                </span>
                <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
                  {value}{label.unit} <span className="text-muted-foreground/60">/ {target}{label.unit}</span>
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${getBarColor(pct)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.06 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-1.5 mt-3 p-2 rounded-lg bg-muted/30">
        <Info className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-[9px] text-muted-foreground leading-tight">
          {language === 'de'
            ? 'Geschätzte Werte basierend auf typischen Nährstoffgehalten. Keine exakten Laborwerte – dient nur als Orientierung.'
            : 'Estimated values based on typical nutrient content. Not exact lab values – for guidance only.'}
        </p>
      </div>
    </motion.div>
  );
}
