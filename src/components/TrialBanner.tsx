import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useTranslation } from '@/lib/i18n';
import { Crown, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import PaywallScreen from '@/components/PaywallScreen';

const TRIAL_DAYS = 7;

export default function TrialBanner() {
  const { profile } = useAuth();
  const { isPro, loading } = useSubscription();
  const { language } = useTranslation();
  const [showPaywall, setShowPaywall] = useState(false);

  if (loading || isPro || !profile) return null;

  const createdAt = new Date(profile.created_at);
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const daysPassed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, TRIAL_DAYS - daysPassed);
  const trialExpired = daysLeft === 0;
  const progressPct = Math.min((daysPassed / TRIAL_DAYS) * 100, 100);

  // Don't show if trial expired (paywall handles that)
  if (trialExpired) return null;

  const isUrgent = daysLeft <= 2;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-xl border px-4 py-3 ${
          isUrgent
            ? 'border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30'
            : 'border-primary/20 bg-primary/5'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`flex-shrink-0 rounded-full p-1.5 ${
              isUrgent ? 'bg-orange-100 dark:bg-orange-900/50' : 'bg-primary/10'
            }`}>
              {isUrgent ? (
                <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              ) : (
                <Crown className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {language === 'de'
                  ? `Noch ${daysLeft} ${daysLeft === 1 ? 'Tag' : 'Tage'} gratis`
                  : `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left free`
                }
              </p>
              <div className="mt-1 h-1 w-24 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${isUrgent ? 'bg-orange-500' : 'bg-primary'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant={isUrgent ? 'default' : 'outline'}
            className="flex-shrink-0 text-xs h-8 px-3"
            onClick={() => setShowPaywall(true)}
          >
            <Crown className="h-3 w-3 mr-1" />
            Upgrade
          </Button>
        </div>
      </motion.div>

      {showPaywall && (
        <PaywallScreen
          onClose={() => setShowPaywall(false)}
          trigger="premium_feature"
        />
      )}
    </>
  );
}
