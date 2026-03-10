
-- Create activity_entries table
CREATE TABLE public.activity_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  activity_name text NOT NULL,
  duration_minutes integer,
  calories_burned numeric NOT NULL DEFAULT 0,
  emoji text DEFAULT '🏃',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own activities" ON public.activity_entries
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON public.activity_entries
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities" ON public.activity_entries
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities" ON public.activity_entries
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
