import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { Bell, X, Plus, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const REMINDER_KEY = 'nutri-reminder-settings';

interface Props {
  hasMealsToday: boolean;
}

export default function ReminderBanner({ hasMealsToday }: Props) {
  const { language } = useTranslation();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(REMINDER_KEY);
      if (!stored) return;
      const config = JSON.parse(stored);
      if (!config.enabled) return;

      const dismissKey = `nutri-reminder-dismissed-${new Date().toISOString().split('T')[0]}`;
      if (sessionStorage.getItem(dismissKey)) return;

      // Check if current time is past reminder time
      const now = new Date();
      const [h, m] = config.time.split(':').map(Number);
      if (now.getHours() > h || (now.getHours() === h && now.getMinutes() >= m)) {
        if (!hasMealsToday) {
          setShowBanner(true);
        }
      }
    } catch {}
  }, [hasMealsToday]);

  const handleDismiss = () => {
    setDismissed(true);
    const dismissKey = `nutri-reminder-dismissed-${new Date().toISOString().split('T')[0]}`;
    sessionStorage.setItem(dismissKey, '1');
  };

  if (!showBanner || dismissed || hasMealsToday) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="rounded-2xl border border-energy/40 p-4 shadow-lg"
        style={{ background: 'linear-gradient(135deg, hsl(var(--energy) / 0.12), hsl(var(--energy) / 0.04))' }}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="flex items-start gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, hsl(var(--energy) / 0.25), hsl(var(--energy) / 0.1))' }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Flame className="h-5 w-5 text-energy" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-foreground">
              {language === 'de' ? '🔥 Streak in Gefahr!' : '🔥 Streak at risk!'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {language === 'de'
                ? 'Du hast heute noch nichts geloggt. Logge jetzt eine Mahlzeit um deinen Streak zu behalten!'
                : "You haven't logged anything today. Log a meal now to keep your streak!"}
            </p>
            <Button
              size="sm"
              className="mt-2 font-bold text-xs"
              onClick={() => navigate('/meals')}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              {language === 'de' ? 'Jetzt loggen' : 'Log now'}
            </Button>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
