export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  name: string | null;
  language: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserGoals {
  id: string;
  user_id: string;
  age: number | null;
  sex: 'male' | 'female' | 'other' | null;
  height_cm: number | null;
  start_weight_kg: number | null;
  current_weight_kg: number | null;
  goal_weight_kg: number | null;
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  goal_type: 'lose' | 'maintain' | 'gain';
  calorie_target: number | null;
  protein_target_g: number | null;
  fat_target_g: number | null;
  carbs_target_g: number | null;
  created_at: string;
  updated_at: string;
}

export interface WeightEntry {
  id: string;
  user_id: string;
  entry_date: string;
  weight_kg: number;
  note: string | null;
  created_at: string;
}

export interface MealEntry {
  id: string;
  user_id: string;
  entry_date: string;
  entry_time: string | null;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  image_url: string | null;
  notes: string | null;
  total_calories: number;
  total_protein_g: number;
  total_fat_g: number;
  total_carbs_g: number;
  ai_analysis_status: 'pending' | 'analyzing' | 'completed' | 'failed' | 'manual';
  created_at: string;
  updated_at: string;
}

export interface MealFoodItem {
  id: string;
  meal_entry_id: string;
  food_name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  confidence_score: number | null;
  was_user_edited: boolean;
  created_at: string;
}

export interface DailySummary {
  id: string;
  user_id: string;
  summary_date: string;
  calories_total: number;
  protein_total_g: number;
  fat_total_g: number;
  carbs_total_g: number;
  calories_remaining: number;
  protein_remaining_g: number;
  fat_remaining_g: number;
  carbs_remaining_g: number;
  created_at: string;
  updated_at: string;
}

// For the mock AI analysis
export interface AnalyzedFoodItem {
  food_name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  confidence_score: number;
}

export interface NutritionCalculation {
  bmr: number;
  tdee: number;
  calorieTarget: number;
  proteinTarget: number;
  fatTarget: number;
  carbsTarget: number;
}
