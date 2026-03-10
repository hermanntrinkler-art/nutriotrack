
-- Add micronutrient columns to meal_food_items
ALTER TABLE public.meal_food_items
  ADD COLUMN IF NOT EXISTS vitamin_a_ug numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_b1_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_b2_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_b6_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_b12_ug numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_c_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_d_ug numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_e_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_k_ug numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS folate_ug numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS iron_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS potassium_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS calcium_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS magnesium_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sodium_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS phosphorus_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS zinc_mg numeric DEFAULT 0;

-- Add micronutrient columns to community_products
ALTER TABLE public.community_products
  ADD COLUMN IF NOT EXISTS vitamin_a_ug numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_b1_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_b2_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_b6_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_b12_ug numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_c_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_d_ug numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_e_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_k_ug numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS folate_ug numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS iron_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS potassium_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS calcium_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS magnesium_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sodium_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS phosphorus_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS zinc_mg numeric DEFAULT 0;

-- Add micronutrient columns to custom_products
ALTER TABLE public.custom_products
  ADD COLUMN IF NOT EXISTS vitamin_a_ug numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_b1_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_b2_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_b6_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_b12_ug numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_c_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_d_ug numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_e_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_k_ug numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS folate_ug numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS iron_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS potassium_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS calcium_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS magnesium_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sodium_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS phosphorus_mg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS zinc_mg numeric DEFAULT 0;
