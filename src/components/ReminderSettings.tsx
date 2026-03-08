import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Bell, BellOff, Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { hapticFeedback } from '@/lib/haptics';
import { motion } from 'framer-motion';

const REMINDER_KEY = 'nutri-reminder-settings';

interface ReminderConfig {
  enabled: boolean;
  time: string; // HH:mm
  pushGranted: boolean;
}

function getStoredConfig(): ReminderConfig {
  try {
    const stored = localStorage.getItem(REMINDER_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { enabled: false, time: '19:00', pushGranted: false };
}

function saveConfig(config: ReminderConfig) {
  localStorage.setItem(REMINDER_KEY, JSON.stringify(config));
}

// Schedule a local notification check
function scheduleReminderCheck(config: ReminderConfig) {
  if (!config.enabled) return;

  const checkKey = `nutri-reminder-checked-${new Date().toISOString().split('T')[0]}`;
  if (sessionStorage.getItem(checkKey)) return;

  const now = new Date();
  const [h, m] = config.time.split(':').map(Number);
  const target = new Date(now);
  target.setHours(h, m, 0, 0);

  if (now >= target) {
    // Time has passed, check if we should remind
    const todayMeals = localStorage.getItem('nutri-today-has-meals');
    if (todayMeals !== new Date().toISOString().split('T')[0]) {
      // No meals logged today — trigger notification
      triggerReminder(config);
    }
    sessionStorage.setItem(checkKey, '1');
  } else {
    // Schedule for later
    const delay = target.getTime() - now.getTime();
    setTimeout(() => {
      const todayMeals = localStorage.getItem('nutri-today-has-meals');
      if (todayMeals !== new Date().toISOString().split('T')[0]) {
        triggerReminder(config);
      }
      sessionStorage.setItem(checkKey, '1');
    }, delay);
  }
}

function triggerReminder(config: ReminderConfig) {
  if (config.pushGranted && 'Notification' in window && Notification.permission === 'granted') {
    new Notification('NutrioTrack 🔥', {
      body: navigator.language.startsWith('de')
        ? 'Du hast heute noch nichts geloggt! Schütze deinen Streak.'
        : "You haven't logged anything today! Protect your streak.",
      icon: '/logo.png',
      tag: 'daily-reminder',
    });
  }
}

async function requestPushPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

// Mark today as having meals (called from dashboard)
export function markTodayHasMeals() {
  localStorage.setItem('nutri-today-has-meals', new Date().toISOString().split('T')[0]);
}

// Initialize reminder system
export function initReminders() {
  const config = getStoredConfig();
  if (config.enabled) {
    scheduleReminderCheck(config);
  }
}

export default function ReminderSettings() {
  const { t, language } = useTranslation();
  const [config, setConfig] = useState<ReminderConfig>(getStoredConfig);
  const [notifSupported] = useState(() => 'Notification' in window);

  const updateConfig = (updates: Partial<ReminderConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    saveConfig(newConfig);
    if (newConfig.enabled) {
      scheduleReminderCheck(newConfig);
    }
  };

  const handleToggle = async (enabled: boolean) => {
    hapticFeedback('light');
    if (enabled && notifSupported) {
      const granted = await requestPushPermission();
      updateConfig({ enabled, pushGranted: granted });
      if (granted) {
        toast.success(language === 'de' ? 'Push-Benachrichtigungen aktiviert!' : 'Push notifications enabled!');
      } else {
        toast.info(language === 'de' ? 'Erinnerung aktiv (In-App Banner)' : 'Reminder active (in-app banner)');
      }
    } else {
      updateConfig({ enabled, pushGranted: false });
      if (!enabled) {
        toast.info(language === 'de' ? 'Erinnerungen deaktiviert' : 'Reminders disabled');
      }
    }
  };

  return (
    <div className="nutri-card space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <div>
            <span className="font-medium text-sm">
              {language === 'de' ? 'Tägliche Erinnerung' : 'Daily Reminder'}
            </span>
            <p className="text-[10px] text-muted-foreground">
              {language === 'de' ? 'Schütze deinen Streak' : 'Protect your streak'}
            </p>
          </div>
        </div>
        <Switch checked={config.enabled} onCheckedChange={handleToggle} />
      </div>

      {config.enabled && (
        <motion.div
          className="space-y-2 pl-8"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {language === 'de' ? 'Erinnerungszeit' : 'Reminder time'}
            </span>
            <input
              type="time"
              value={config.time}
              onChange={(e) => updateConfig({ time: e.target.value })}
              className="text-sm font-medium bg-muted/50 rounded-lg px-2 py-1 border border-border"
            />
          </div>

          <div className="flex items-center gap-2 text-[10px]">
            {config.pushGranted ? (
              <span className="text-primary flex items-center gap-1">
                <Bell className="h-3 w-3" />
                {language === 'de' ? 'Push-Benachrichtigungen aktiv' : 'Push notifications active'}
              </span>
            ) : (
              <span className="text-muted-foreground flex items-center gap-1">
                <BellOff className="h-3 w-3" />
                {language === 'de' ? 'Nur In-App Banner' : 'In-app banner only'}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
