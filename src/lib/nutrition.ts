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

/**
 * Evidence-based protein targets (g per kg body weight per day)
 * Sources:
 * - ISSN Position Stand (2017): 1.4–2.0 g/kg for active individuals
 * - Helms et al. (2014): 2.3–3.1 g/kg lean mass during caloric deficit
 * - Morton et al. (2018) meta-analysis: 1.6 g/kg optimal for muscle gain
 */
function getProteinPerKg(goalType: 'lose' | 'maintain' | 'gain', activityLevel: string): number {
  if (goalType === 'lose') {
    // Higher protein preserves lean mass during deficit
    if (activityLevel === 'very_active' || activityLevel === 'extremely_active') return 2.2;
    return 1.8;
  }
  if (goalType === 'gain') {
    if (activityLevel === 'very_active' || activityLevel === 'extremely_active') return 2.0;
    return 1.6;
  }
  // maintain
  if (activityLevel === 'very_active' || activityLevel === 'extremely_active') return 1.8;
  if (activityLevel === 'moderately_active') return 1.4;
  return 1.2;
}

export function calculateNutrition(params: {
  sex: 'male' | 'female' | 'other';
  age: number;
  height_cm: number;
  current_weight_kg: number;
  activity_level: keyof typeof ACTIVITY_MULTIPLIERS;
  goal_type: 'lose' | 'maintain' | 'gain';
  deficit_intensity?: number; // 1-5, default 2
}): NutritionCalculation {
  // Mifflin-St Jeor (2024 research confirms: gold standard, ~73% accuracy within ±10%)
  // Men:   BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5
  // Women: BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161
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

  // Gender-specific minimum safe calories (NIH/ADA guidelines)
  const minCalories = params.sex === 'male' ? 1500 : 1200;
  calorieTarget = Math.max(calorieTarget, minCalories);

  // Evidence-based protein: g/kg body weight (ISSN, Helms, Morton meta-analyses)
  const proteinPerKg = getProteinPerKg(params.goal_type, params.activity_level);
  const proteinGrams = Math.round(proteinPerKg * params.current_weight_kg);
  const proteinCals = proteinGrams * 4;

  // Fat: 25% of calories for deficit (hormonal health floor), 30% otherwise
  const fatPct = params.goal_type === 'lose' ? 0.25 : 0.30;
  const fatCals = calorieTarget * fatPct;
  const fatGrams = Math.round(fatCals / 9);

  // Carbs: remaining calories after protein & fat
  const carbsCals = Math.max(0, calorieTarget - proteinCals - fatCals);
  const carbsGrams = Math.round(carbsCals / 4);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieTarget,
    proteinTarget: proteinGrams,
    fatTarget: fatGrams,
    carbsTarget: carbsGrams,
  };
}
