
-- Add display_name, avatar_emoji, avatar_url to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS avatar_emoji text DEFAULT '😊',
  ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create community_products table
CREATE TABLE public.community_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id uuid NOT NULL,
  contributor_display_name text NOT NULL DEFAULT 'Anonym',
  contributor_avatar_emoji text DEFAULT '😊',
  food_name text NOT NULL,
  barcode text,
  brand text,
  store text,
  quantity numeric NOT NULL DEFAULT 100,
  unit text NOT NULL DEFAULT 'g',
  calories numeric NOT NULL DEFAULT 0,
  protein_g numeric NOT NULL DEFAULT 0,
  fat_g numeric NOT NULL DEFAULT 0,
  carbs_g numeric NOT NULL DEFAULT 0,
  verified_count integer NOT NULL DEFAULT 0,
  reported_count integer NOT NULL DEFAULT 0,
  is_hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_products ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read non-hidden community products
CREATE POLICY "Anyone can view community products"
  ON public.community_products FOR SELECT
  TO authenticated
  USING (is_hidden = false);

-- Users can insert their own community products
CREATE POLICY "Users can insert community products"
  ON public.community_products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = contributor_id);

-- Users can update their own community products
CREATE POLICY "Users can update own community products"
  ON public.community_products FOR UPDATE
  TO authenticated
  USING (auth.uid() = contributor_id);

-- Users can delete their own community products
CREATE POLICY "Users can delete own community products"
  ON public.community_products FOR DELETE
  TO authenticated
  USING (auth.uid() = contributor_id);

-- Admins can manage all community products
CREATE POLICY "Admins can manage community products"
  ON public.community_products FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

-- Trigger for updated_at on community_products
CREATE TRIGGER update_community_products_updated_at
  BEFORE UPDATE ON public.community_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
