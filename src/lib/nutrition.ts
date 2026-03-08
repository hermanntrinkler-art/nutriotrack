import type { NutritionCalculation } from './types';

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
} as const;

// Deficit intensity: 1 = moderate/healthy (~300 kcal), 2 = normal (~500), 3 = aggressive (~750), 4 = very aggressive (~1000), 5 = extreme/unhealthy (~1250)
const DEFICIT_MAP: Record<number, number> = {
  1: 300,
  2: 500,
  3: 750,
  4: 1000,
  5: 1250,
};

const SURPLUS_MAP: Record<number, number> = {
  1: 200,
  2: 300,
  3: 450,
  4: 600,
  5: 800,
};

export function calculateNutrition(params: {
  sex: 'male' | 'female' | 'other';
  age: number;
  height_cm: number;
  current_weight_kg: number;
  activity_level: keyof typeof ACTIVITY_MULTIPLIERS;
  goal_type: 'lose' | 'maintain' | 'gain';
  deficit_intensity?: number; // 1-5, default 2
}): NutritionCalculation {
  // Mifflin-St Jeor
  let bmr: number;
  if (params.sex === 'male') {
    bmr = 10 * params.current_weight_kg + 6.25 * params.height_cm - 5 * params.age + 5;
  } else {
    bmr = 10 * params.current_weight_kg + 6.25 * params.height_cm - 5 * params.age - 161;
  }

  const tdee = bmr * ACTIVITY_MULTIPLIERS[params.activity_level];
  const intensity = Math.max(1, Math.min(5, params.deficit_intensity || 2));

  let calorieTarget: number;
  if (params.goal_type === 'lose') {
    calorieTarget = Math.round(tdee - (DEFICIT_MAP[intensity] || 500));
  } else if (params.goal_type === 'gain') {
    calorieTarget = Math.round(tdee + (SURPLUS_MAP[intensity] || 300));
  } else {
    calorieTarget = Math.round(tdee);
  }

  // Ensure minimum safe calories
  const minCalories = params.sex === 'male' ? 1200 : 1000;
  calorieTarget = Math.max(calorieTarget, minCalories);

  // Macro split: 30% protein, 25% fat, 45% carbs for lose; 25/30/45 for maintain/gain
  const proteinPct = params.goal_type === 'lose' ? 0.30 : 0.25;
  const fatPct = params.goal_type === 'lose' ? 0.25 : 0.30;
  const carbsPct = 1 - proteinPct - fatPct;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieTarget,
    proteinTarget: Math.round((calorieTarget * proteinPct) / 4),
    fatTarget: Math.round((calorieTarget * fatPct) / 9),
    carbsTarget: Math.round((calorieTarget * carbsPct) / 4),
  };
}
