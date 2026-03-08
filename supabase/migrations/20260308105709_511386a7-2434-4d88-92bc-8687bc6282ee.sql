
-- Drop all RESTRICTIVE policies and recreate as PERMISSIVE for meal_entries
DROP POLICY IF EXISTS "Users can delete own meals" ON public.meal_entries;
DROP POLICY IF EXISTS "Users can insert own meals" ON public.meal_entries;
DROP POLICY IF EXISTS "Users can update own meals" ON public.meal_entries;
DROP POLICY IF EXISTS "Users can view own meals" ON public.meal_entries;

CREATE POLICY "Users can view own meals" ON public.meal_entries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meals" ON public.meal_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meals" ON public.meal_entries FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meals" ON public.meal_entries FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Drop all RESTRICTIVE policies and recreate as PERMISSIVE for meal_food_items
DROP POLICY IF EXISTS "Users can delete own food items" ON public.meal_food_items;
DROP POLICY IF EXISTS "Users can insert own food items" ON public.meal_food_items;
DROP POLICY IF EXISTS "Users can update own food items" ON public.meal_food_items;
DROP POLICY IF EXISTS "Users can view own food items" ON public.meal_food_items;

CREATE POLICY "Users can view own food items" ON public.meal_food_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM meal_entries WHERE meal_entries.id = meal_food_items.meal_entry_id AND meal_entries.user_id = auth.uid()));
CREATE POLICY "Users can insert own food items" ON public.meal_food_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM meal_entries WHERE meal_entries.id = meal_food_items.meal_entry_id AND meal_entries.user_id = auth.uid()));
CREATE POLICY "Users can update own food items" ON public.meal_food_items FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM meal_entries WHERE meal_entries.id = meal_food_items.meal_entry_id AND meal_entries.user_id = auth.uid()));
CREATE POLICY "Users can delete own food items" ON public.meal_food_items FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM meal_entries WHERE meal_entries.id = meal_food_items.meal_entry_id AND meal_entries.user_id = auth.uid()));

-- Fix profiles policies
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix user_goals policies
DROP POLICY IF EXISTS "Users can insert own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can update own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can view own goals" ON public.user_goals;

CREATE POLICY "Users can view own goals" ON public.user_goals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.user_goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.user_goals FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix weight_entries policies
DROP POLICY IF EXISTS "Users can delete own weight" ON public.weight_entries;
DROP POLICY IF EXISTS "Users can insert own weight" ON public.weight_entries;
DROP POLICY IF EXISTS "Users can update own weight" ON public.weight_entries;
DROP POLICY IF EXISTS "Users can view own weight" ON public.weight_entries;

CREATE POLICY "Users can view own weight" ON public.weight_entries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weight" ON public.weight_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own weight" ON public.weight_entries FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own weight" ON public.weight_entries FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix nutrition_daily_summaries policies
DROP POLICY IF EXISTS "Users can insert own summaries" ON public.nutrition_daily_summaries;
DROP POLICY IF EXISTS "Users can update own summaries" ON public.nutrition_daily_summaries;
DROP POLICY IF EXISTS "Users can view own summaries" ON public.nutrition_daily_summaries;

CREATE POLICY "Users can view own summaries" ON public.nutrition_daily_summaries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own summaries" ON public.nutrition_daily_summaries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own summaries" ON public.nutrition_daily_summaries FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix user_roles policies
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
