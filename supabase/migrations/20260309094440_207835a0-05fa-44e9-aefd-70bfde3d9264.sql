
CREATE TABLE public.badge_share_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_id text NOT NULL,
  language text NOT NULL,
  translated_text text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (badge_id, language)
);

ALTER TABLE public.badge_share_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badge translations"
  ON public.badge_share_translations
  FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage translations"
  ON public.badge_share_translations
  FOR ALL
  USING (true)
  WITH CHECK (true);
