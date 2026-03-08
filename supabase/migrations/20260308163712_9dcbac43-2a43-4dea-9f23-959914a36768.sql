
-- Saved recipes table
CREATE TABLE public.saved_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  emoji text DEFAULT '🍽️',
  meal_type text DEFAULT 'snack',
  total_calories numeric DEFAULT 0,
  total_protein_g numeric DEFAULT 0,
  total_fat_g numeric DEFAULT 0,
  total_carbs_g numeric DEFAULT 0,
  use_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Recipe items table
CREATE TABLE public.saved_recipe_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES public.saved_recipes(id) ON DELETE CASCADE,
  food_name text NOT NULL,
  quantity numeric DEFAULT 100,
  unit text DEFAULT 'g',
  calories numeric DEFAULT 0,
  protein_g numeric DEFAULT 0,
  fat_g numeric DEFAULT 0,
  carbs_g numeric DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_recipe_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for saved_recipes
CREATE POLICY "Users can view own recipes" ON public.saved_recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recipes" ON public.saved_recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recipes" ON public.saved_recipes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recipes" ON public.saved_recipes FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for saved_recipe_items
CREATE POLICY "Users can view own recipe items" ON public.saved_recipe_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.saved_recipes WHERE saved_recipes.id = saved_recipe_items.recipe_id AND saved_recipes.user_id = auth.uid()));
CREATE POLICY "Users can insert own recipe items" ON public.saved_recipe_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.saved_recipes WHERE saved_recipes.id = saved_recipe_items.recipe_id AND saved_recipes.user_id = auth.uid()));
CREATE POLICY "Users can update own recipe items" ON public.saved_recipe_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.saved_recipes WHERE saved_recipes.id = saved_recipe_items.recipe_id AND saved_recipes.user_id = auth.uid()));
CREATE POLICY "Users can delete own recipe items" ON public.saved_recipe_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.saved_recipes WHERE saved_recipes.id = saved_recipe_items.recipe_id AND saved_recipes.user_id = auth.uid()));

-- Update trigger
CREATE TRIGGER update_saved_recipes_updated_at
  BEFORE UPDATE ON public.saved_recipes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
