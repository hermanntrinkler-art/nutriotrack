
CREATE TABLE public.food_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL,
  food_name text NOT NULL,
  food_source text NOT NULL DEFAULT 'database',
  community_product_id uuid REFERENCES public.community_products(id) ON DELETE SET NULL,
  reason text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid
);

ALTER TABLE public.food_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own reports" ON public.food_reports
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports" ON public.food_reports
  FOR SELECT TO authenticated USING (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all reports" ON public.food_reports
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reports" ON public.food_reports
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reports" ON public.food_reports
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
