
CREATE TABLE public.custom_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  barcode TEXT NOT NULL,
  food_name TEXT NOT NULL,
  calories NUMERIC NOT NULL DEFAULT 0,
  protein_g NUMERIC NOT NULL DEFAULT 0,
  fat_g NUMERIC NOT NULL DEFAULT 0,
  carbs_g NUMERIC NOT NULL DEFAULT 0,
  default_quantity NUMERIC NOT NULL DEFAULT 100,
  default_unit TEXT NOT NULL DEFAULT 'g',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, barcode)
);

ALTER TABLE public.custom_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own products" ON public.custom_products FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own products" ON public.custom_products FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own products" ON public.custom_products FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own products" ON public.custom_products FOR DELETE TO authenticated USING (auth.uid() = user_id);
