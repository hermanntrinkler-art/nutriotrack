
DROP POLICY "Service role can manage translations" ON public.badge_share_translations;

CREATE POLICY "Admins can manage translations"
  ON public.badge_share_translations
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
