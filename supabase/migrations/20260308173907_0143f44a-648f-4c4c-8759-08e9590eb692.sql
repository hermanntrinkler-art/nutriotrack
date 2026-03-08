
INSERT INTO storage.buckets (id, name, public) VALUES ('badge-images', 'badge-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can upload badge images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'badge-images' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update badge images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'badge-images' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete badge images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'badge-images' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Anyone can view badge images"
ON storage.objects FOR SELECT
USING (bucket_id = 'badge-images');

CREATE TABLE public.badge_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_id text NOT NULL UNIQUE,
  image_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.badge_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badge image config"
ON public.badge_images FOR SELECT
USING (true);

CREATE POLICY "Admins can insert badge images"
ON public.badge_images FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update badge images"
ON public.badge_images FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete badge images"
ON public.badge_images FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_badge_images_updated_at
  BEFORE UPDATE ON public.badge_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all meal entries"
ON public.meal_entries FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
