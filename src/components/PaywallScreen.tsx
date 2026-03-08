import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaywallScreenProps {
  onClose: () => void;
  onUpgrade?: (plan: 'monthly' | 'yearly' | 'lifetime') => void;
  trigger?: 'scan_limit' | 'premium_feature';
}

export default function PaywallScreen({ onClose, onUpgrade, trigger }: PaywallScreenProps) {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    t('paywall.featureUnlimitedScans'),
    t('paywall.featureWeeklyStats'),
    t('paywall.featureMonthlyStats'),
    t('paywall.featureMacroCharts'),
    t('paywall.featureProgressCharts'),
    t('paywall.featureNutritionTips'),
  ];

  const plans = [
    { id: 'monthly' as const, label: t('paywall.monthly'), price: '7,99 €', sub: t('paywall.perMonth'), trial: '7 Tage kostenlos testen' },
    { id: 'yearly' as const, label: t('paywall.yearly'), price: '49 €', sub: t('paywall.perYear'), badge: t('paywall.savePercent') },
    { id: 'lifetime' as const, label: t('paywall.lifetime'), price: '79 €', sub: t('paywall.oneTime'), badge: t('paywall.founderDeal') },
  ];

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: selectedPlan },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
      onUpgrade?.(selectedPlan);
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error('Fehler beim Starten des Checkouts');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col overflow-y-auto">
      <div className="flex-1 px-5 py-6 pb-24 max-w-md mx-auto w-full">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent z-10">
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Crown className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">{t('paywall.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('paywall.subtitle')}</p>
        </div>

        {/* Features */}
        <div className="nutri-card space-y-3 mb-6">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Check className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-medium">{feature}</span>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="space-y-3 mb-6">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full nutri-card flex items-center justify-between py-4 transition-all ${
                selectedPlan === plan.id
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === plan.id ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                }`}>
                  {selectedPlan === plan.id && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{plan.label}</span>
                    {plan.badge && (
                      <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {plan.badge}
                      </span>
                    )}
                    {plan.trial && (
                      <span className="text-[10px] font-bold bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                        {plan.trial}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {plan.trial ? `${plan.trial}, danach ${plan.price}/${t('paywall.perMonth').toLowerCase()}` : plan.sub}
                  </span>
                </div>
              </div>
              <span className="font-bold text-lg">{plan.price}</span>
            </button>
          ))}
        </div>

        {/* CTA */}
        <Button onClick={handleUpgrade} disabled={isLoading} className="w-full h-12 text-base font-bold">
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {t('paywall.upgradeCta')}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-3">
          {t('paywall.cancelAnytime')}
        </p>
      </div>
    </div>
  );
}
