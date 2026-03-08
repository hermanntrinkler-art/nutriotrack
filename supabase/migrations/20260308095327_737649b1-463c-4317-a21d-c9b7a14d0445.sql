
-- Create enums
CREATE TYPE public.activity_level AS ENUM ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active');
CREATE TYPE public.goal_type AS ENUM ('lose', 'maintain', 'gain');
CREATE TYPE public.meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
CREATE TYPE public.ai_analysis_status AS ENUM ('pending', 'analyzing', 'completed', 'failed', 'manual');
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  language TEXT DEFAULT 'auto',
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- User goals table
CREATE TABLE public.user_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  age INTEGER,
  sex TEXT CHECK (sex IN ('male', 'female', 'other')),
  height_cm NUMERIC,
  start_weight_kg NUMERIC,
  current_weight_kg NUMERIC,
  goal_weight_kg NUMERIC,
  activity_level activity_level DEFAULT 'moderately_active',
  goal_type goal_type DEFAULT 'lose',
  calorie_target INTEGER,
  protein_target_g INTEGER,
  fat_target_g INTEGER,
  carbs_target_g INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own goals" ON public.user_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.user_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.user_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_user_goals_updated_at BEFORE UPDATE ON public.user_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Weight entries table
CREATE TABLE public.weight_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own weight" ON public.weight_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weight" ON public.weight_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own weight" ON public.weight_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own weight" ON public.weight_entries FOR DELETE USING (auth.uid() = user_id);

-- Meal entries table
CREATE TABLE public.meal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  entry_time TIME,
  meal_type meal_type NOT NULL DEFAULT 'snack',
  image_url TEXT,
  notes TEXT,
  total_calories NUMERIC DEFAULT 0,
  total_protein_g NUMERIC DEFAULT 0,
  total_fat_g NUMERIC DEFAULT 0,
  total_carbs_g NUMERIC DEFAULT 0,
  ai_analysis_status ai_analysis_status DEFAULT 'manual',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.meal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own meals" ON public.meal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meals" ON public.meal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meals" ON public.meal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meals" ON public.meal_entries FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_meal_entries_updated_at BEFORE UPDATE ON public.meal_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Meal food items table
CREATE TABLE public.meal_food_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_entry_id UUID NOT NULL REFERENCES public.meal_entries(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1,
  unit TEXT DEFAULT 'portion',
  calories NUMERIC DEFAULT 0,
  protein_g NUMERIC DEFAULT 0,
  fat_g NUMERIC DEFAULT 0,
  carbs_g NUMERIC DEFAULT 0,
  confidence_score NUMERIC,
  was_user_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.meal_food_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own food items" ON public.meal_food_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.meal_entries WHERE id = meal_entry_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own food items" ON public.meal_food_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.meal_entries WHERE id = meal_entry_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update own food items" ON public.meal_food_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.meal_entries WHERE id = meal_entry_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete own food items" ON public.meal_food_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.meal_entries WHERE id = meal_entry_id AND user_id = auth.uid())
);

-- Nutrition daily summaries table
CREATE TABLE public.nutrition_daily_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  summary_date DATE NOT NULL DEFAULT CURRENT_DATE,
  calories_total NUMERIC DEFAULT 0,
  protein_total_g NUMERIC DEFAULT 0,
  fat_total_g NUMERIC DEFAULT 0,
  carbs_total_g NUMERIC DEFAULT 0,
  calories_remaining NUMERIC DEFAULT 0,
  protein_remaining_g NUMERIC DEFAULT 0,
  fat_remaining_g NUMERIC DEFAULT 0,
  carbs_remaining_g NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, summary_date)
);
ALTER TABLE public.nutrition_daily_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own summaries" ON public.nutrition_daily_summaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own summaries" ON public.nutrition_daily_summaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own summaries" ON public.nutrition_daily_summaries FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_summaries_updated_at BEFORE UPDATE ON public.nutrition_daily_summaries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for meal images
INSERT INTO storage.buckets (id, name, public) VALUES ('meal-images', 'meal-images', true);
CREATE POLICY "Users can upload meal images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'meal-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Meal images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'meal-images');
CREATE POLICY "Users can delete own meal images" ON storage.objects FOR DELETE USING (bucket_id = 'meal-images' AND auth.uid()::text = (storage.foldername(name))[1]);
