
-- Add subscription fields to profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_start_date timestamptz,
  ADD COLUMN IF NOT EXISTS subscription_end_date timestamptz,
  ADD COLUMN IF NOT EXISTS daily_photo_scans integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS daily_scans_reset_date date NOT NULL DEFAULT CURRENT_DATE;
