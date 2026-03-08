import type { AnalyzedFoodItem } from './types';

// Mock food database for AI simulation
const MOCK_FOODS: AnalyzedFoodItem[][] = [
  [
    { food_name: 'Hähnchenbrust', quantity: 150, unit: 'g', calories: 248, protein_g: 46, fat_g: 5, carbs_g: 0, confidence_score: 0.92 },
    { food_name: 'Reis', quantity: 200, unit: 'g', calories: 260, protein_g: 5, fat_g: 1, carbs_g: 58, confidence_score: 0.88 },
    { food_name: 'Brokkoli', quantity: 100, unit: 'g', calories: 34, protein_g: 3, fat_g: 0, carbs_g: 7, confidence_score: 0.85 },
  ],
  [
    { food_name: 'Vollkornbrot', quantity: 2, unit: 'Scheiben', calories: 180, protein_g: 8, fat_g: 2, carbs_g: 34, confidence_score: 0.90 },
    { food_name: 'Avocado', quantity: 0.5, unit: 'Stück', calories: 160, protein_g: 2, fat_g: 15, carbs_g: 9, confidence_score: 0.87 },
    { food_name: 'Ei', quantity: 2, unit: 'Stück', calories: 156, protein_g: 12, fat_g: 11, carbs_g: 1, confidence_score: 0.95 },
  ],
  [
    { food_name: 'Lachs', quantity: 180, unit: 'g', calories: 367, protein_g: 36, fat_g: 24, carbs_g: 0, confidence_score: 0.91 },
    { food_name: 'Kartoffeln', quantity: 200, unit: 'g', calories: 154, protein_g: 4, fat_g: 0, carbs_g: 36, confidence_score: 0.86 },
    { food_name: 'Gemischter Salat', quantity: 150, unit: 'g', calories: 25, protein_g: 2, fat_g: 0, carbs_g: 5, confidence_score: 0.80 },
  ],
  [
    { food_name: 'Müsli', quantity: 60, unit: 'g', calories: 228, protein_g: 6, fat_g: 4, carbs_g: 42, confidence_score: 0.88 },
    { food_name: 'Milch', quantity: 200, unit: 'ml', calories: 96, protein_g: 6, fat_g: 4, carbs_g: 10, confidence_score: 0.92 },
    { food_name: 'Banane', quantity: 1, unit: 'Stück', calories: 89, protein_g: 1, fat_g: 0, carbs_g: 23, confidence_score: 0.95 },
  ],
  [
    { food_name: 'Pasta', quantity: 250, unit: 'g', calories: 393, protein_g: 14, fat_g: 2, carbs_g: 78, confidence_score: 0.90 },
    { food_name: 'Tomatensoße', quantity: 100, unit: 'g', calories: 45, protein_g: 1, fat_g: 1, carbs_g: 8, confidence_score: 0.82 },
    { food_name: 'Parmesan', quantity: 20, unit: 'g', calories: 78, protein_g: 7, fat_g: 5, carbs_g: 1, confidence_score: 0.88 },
  ],
];

export async function analyzeFoodImage(_imageUrl?: string): Promise<AnalyzedFoodItem[]> {
  // Simulate AI analysis delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  const randomIndex = Math.floor(Math.random() * MOCK_FOODS.length);
  return MOCK_FOODS[randomIndex].map(item => ({ ...item }));
}
