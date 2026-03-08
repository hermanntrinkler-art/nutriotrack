import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect, useCallback } from 'react';

export type SubscriptionStatus = 'free' | 'pro' | 'lifetime';

interface SubscriptionInfo {
  status: SubscriptionStatus;
  startDate: string | null;
  endDate: string | null;
  dailyPhotoScans: number;
  scansResetDate: string | null;
  loading: boolean;
  isPro: boolean;
  canScanPhoto: boolean;
  remainingScans: number;
  incrementScanCount: () => Promise<void>;
  refresh: () => Promise<void>;
  checkStripeSubscription: () => Promise<void>;
}

const FREE_DAILY_SCAN_LIMIT = 3;

export function useSubscription(): SubscriptionInfo {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>('free');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [dailyPhotoScans, setDailyPhotoScans] = useState(0);
  const [scansResetDate, setScansResetDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkStripeSubscription = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }
      if (data?.subscribed) {
        setStatus(data.status as SubscriptionStatus);
        if (data.subscription_end) setEndDate(data.subscription_end);
      } else {
        setStatus('free');
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
    }
  }, [user]);

  const fetchSubscription = useCallback(async () => {
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_start_date, subscription_end_date, daily_photo_scans, daily_scans_reset_date')
      .eq('user_id', user.id)
      .single();

    if (data) {
      const d = data as any;
      const today = new Date().toISOString().split('T')[0];

      let currentStatus = (d.subscription_status || 'free') as SubscriptionStatus;

      // Reset daily scans if new day
      let scans = d.daily_photo_scans || 0;
      if (d.daily_scans_reset_date !== today) {
        scans = 0;
        await supabase.from('profiles').update({
          daily_photo_scans: 0,
          daily_scans_reset_date: today,
        } as any).eq('user_id', user.id);
      }

      setStatus(currentStatus);
      setStartDate(d.subscription_start_date);
      setEndDate(d.subscription_end_date);
      setDailyPhotoScans(scans);
      setScansResetDate(d.daily_scans_reset_date);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { 
    fetchSubscription(); 
  }, [fetchSubscription]);

  // Check Stripe subscription on load and periodically
  useEffect(() => {
    if (!user) return;
    checkStripeSubscription();
    const interval = setInterval(checkStripeSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkStripeSubscription]);

  // Check after returning from checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      // Small delay for Stripe to process
      setTimeout(() => {
        checkStripeSubscription().then(fetchSubscription);
      }, 2000);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [checkStripeSubscription, fetchSubscription]);

  const isPro = status === 'pro' || status === 'lifetime';
  const canScanPhoto = isPro || dailyPhotoScans < FREE_DAILY_SCAN_LIMIT;
  const remainingScans = isPro ? Infinity : Math.max(0, FREE_DAILY_SCAN_LIMIT - dailyPhotoScans);

  const incrementScanCount = useCallback(async () => {
    if (!user || isPro) return;
    const newCount = dailyPhotoScans + 1;
    setDailyPhotoScans(newCount);
    await supabase.from('profiles').update({
      daily_photo_scans: newCount,
    } as any).eq('user_id', user.id);
  }, [user, isPro, dailyPhotoScans]);

  return {
    status,
    startDate,
    endDate,
    dailyPhotoScans,
    scansResetDate,
    loading,
    isPro,
    canScanPhoto,
    remainingScans,
    incrementScanCount,
    refresh: fetchSubscription,
    checkStripeSubscription,
  };
}
