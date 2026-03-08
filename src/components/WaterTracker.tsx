import { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Plus, Minus } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { hapticFeedback } from '@/lib/haptics';

const WATER_GOAL = 2500; // ml
const GLASS_SIZE = 250; // ml

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

export default function WaterTracker() {
  const { t } = useTranslation();
  const [waterMl, setWaterMl] = useState(() => {
    const stored = localStorage.getItem('nutrio-water-' + new Date().toISOString().split('T')[0]);
    return stored ? parseInt(stored) : 0;
  });

  const saveWater = (ml: number) => {
    const newVal = Math.max(0, ml);
    setWaterMl(newVal);
    localStorage.setItem('nutrio-water-' + new Date().toISOString().split('T')[0], String(newVal));
  };

  const addWater = () => {
    hapticFeedback('light');
    saveWater(waterMl + GLASS_SIZE);
  };

  const removeWater = () => {
    hapticFeedback('light');
    saveWater(waterMl - GLASS_SIZE);
  };

  const pct = Math.min((waterMl / WATER_GOAL) * 100, 100);
  const glasses = Math.round(waterMl / GLASS_SIZE);

  return (
    <motion.div
      className="nutri-card shadow-md hover:shadow-lg transition-shadow duration-300"
      variants={fadeUp}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-info" />
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
            {t('dashboard.water')}
          </h3>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {waterMl} / {WATER_GOAL} {t('dashboard.waterMl')}
        </span>
      </div>

      {/* Water bar */}
      <div className="relative h-10 rounded-xl bg-muted/50 overflow-hidden mb-3">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-xl"
          style={{ background: 'linear-gradient(90deg, hsl(var(--info)), hsl(210 90% 65%))' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-foreground mix-blend-difference">
            {t('dashboard.waterGlasses', { count: glasses })} 💧
          </span>
        </div>
      </div>

      {/* Quick buttons */}
      <div className="flex items-center justify-center gap-3">
        <motion.button
          onClick={removeWater}
          className="w-10 h-10 rounded-xl bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
          whileTap={{ scale: 0.9 }}
          disabled={waterMl <= 0}
        >
          <Minus className="h-4 w-4 text-muted-foreground" />
        </motion.button>
        <motion.button
          onClick={addWater}
          className="flex-1 h-10 rounded-xl bg-info/10 hover:bg-info/20 text-info font-bold text-sm flex items-center justify-center gap-1.5 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="h-4 w-4" />
          +{GLASS_SIZE}{t('dashboard.waterMl')}
        </motion.button>
        <motion.button
          onClick={removeWater}
          className="w-10 h-10 rounded-xl bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors invisible"
        >
          <Minus className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
