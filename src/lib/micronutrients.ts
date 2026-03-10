/**
 * Micronutrient estimation engine
 * Estimates vitamins and minerals based on meal food items.
 * Values are approximate and based on USDA/BLS/DGE reference data.
 * All values are per 100g in the database.
 */

export interface MicronutrientEstimate {
  // Vitamins
  vitaminA_ug: number;
  vitaminB1_mg: number;
  vitaminB2_mg: number;
  vitaminB6_mg: number;
  vitaminB12_ug: number;
  vitaminC_mg: number;
  vitaminD_ug: number;
  vitaminE_mg: number;
  vitaminK_ug: number;
  folate_ug: number;
  // Minerals
  iron_mg: number;
  calcium_mg: number;
  magnesium_mg: number;
  zinc_mg: number;
  potassium_mg: number;
  sodium_mg: number;
  phosphorus_mg: number;
}

// Daily recommended intake (adult average, DGE/EFSA)
export const DAILY_TARGETS: MicronutrientEstimate = {
  vitaminA_ug: 800,
  vitaminB1_mg: 1.1,
  vitaminB2_mg: 1.4,
  vitaminB6_mg: 1.4,
  vitaminB12_ug: 4,
  vitaminC_mg: 90,
  vitaminD_ug: 20,
  vitaminE_mg: 12,
  vitaminK_ug: 75,
  folate_ug: 300,
  iron_mg: 14,
  calcium_mg: 1000,
  magnesium_mg: 375,
  zinc_mg: 10,
  potassium_mg: 2000,
  sodium_mg: 1500,
  phosphorus_mg: 700,
};

export const MICRO_LABELS = {
  // Vitamins
  vitaminA_ug: { de: 'Vitamin A', en: 'Vitamin A', unit: 'µg' },
  vitaminB1_mg: { de: 'Vitamin B1', en: 'Vitamin B1', unit: 'mg' },
  vitaminB2_mg: { de: 'Vitamin B2', en: 'Vitamin B2', unit: 'mg' },
  vitaminB6_mg: { de: 'Vitamin B6', en: 'Vitamin B6', unit: 'mg' },
  vitaminB12_ug: { de: 'Vitamin B12', en: 'Vitamin B12', unit: 'µg' },
  vitaminC_mg: { de: 'Vitamin C', en: 'Vitamin C', unit: 'mg' },
  vitaminD_ug: { de: 'Vitamin D', en: 'Vitamin D', unit: 'µg' },
  vitaminE_mg: { de: 'Vitamin E', en: 'Vitamin E', unit: 'mg' },
  vitaminK_ug: { de: 'Vitamin K', en: 'Vitamin K', unit: 'µg' },
  folate_ug: { de: 'Folsäure', en: 'Folate', unit: 'µg' },
  // Minerals
  iron_mg: { de: 'Eisen', en: 'Iron', unit: 'mg' },
  calcium_mg: { de: 'Kalzium', en: 'Calcium', unit: 'mg' },
  magnesium_mg: { de: 'Magnesium', en: 'Magnesium', unit: 'mg' },
  zinc_mg: { de: 'Zink', en: 'Zinc', unit: 'mg' },
  potassium_mg: { de: 'Kalium', en: 'Potassium', unit: 'mg' },
  sodium_mg: { de: 'Natrium', en: 'Sodium', unit: 'mg' },
  phosphorus_mg: { de: 'Phosphor', en: 'Phosphorus', unit: 'mg' },
};

type MicroData = MicronutrientEstimate;

// Helper to create a full entry with defaults
function m(data: Partial<MicroData>): MicroData {
  return {
    vitaminA_ug: 0, vitaminB1_mg: 0, vitaminB2_mg: 0, vitaminB6_mg: 0, vitaminB12_ug: 0,
    vitaminC_mg: 0, vitaminD_ug: 0, vitaminE_mg: 0, vitaminK_ug: 0, folate_ug: 0,
    iron_mg: 0, calcium_mg: 0, magnesium_mg: 0, zinc_mg: 0,
    potassium_mg: 0, sodium_mg: 0, phosphorus_mg: 0,
    ...data,
  };
}

// Micronutrient data per 100g/100ml for food name keywords
// Values approximate from USDA / DGE / BLS references
const microDB: Record<string, MicroData> = {
  // Fruits
  'orange': m({ vitaminA_ug: 11, vitaminB1_mg: 0.09, vitaminB2_mg: 0.04, vitaminB6_mg: 0.06, vitaminC_mg: 53, vitaminE_mg: 0.2, vitaminK_ug: 0, folate_ug: 30, iron_mg: 0.1, calcium_mg: 40, magnesium_mg: 10, zinc_mg: 0.1, potassium_mg: 181, sodium_mg: 0, phosphorus_mg: 14 }),
  'orangensaft': m({ vitaminA_ug: 10, vitaminB1_mg: 0.09, vitaminB2_mg: 0.03, vitaminB6_mg: 0.04, vitaminC_mg: 50, folate_ug: 30, iron_mg: 0.2, calcium_mg: 11, magnesium_mg: 11, zinc_mg: 0.1, potassium_mg: 200, sodium_mg: 1, phosphorus_mg: 17 }),
  'apfel': m({ vitaminA_ug: 3, vitaminB1_mg: 0.02, vitaminB2_mg: 0.03, vitaminB6_mg: 0.04, vitaminC_mg: 5, vitaminE_mg: 0.2, vitaminK_ug: 2.2, folate_ug: 3, iron_mg: 0.1, calcium_mg: 6, magnesium_mg: 5, zinc_mg: 0, potassium_mg: 107, sodium_mg: 1, phosphorus_mg: 11 }),
  'banane': m({ vitaminA_ug: 3, vitaminB1_mg: 0.03, vitaminB2_mg: 0.07, vitaminB6_mg: 0.37, vitaminC_mg: 9, vitaminE_mg: 0.1, vitaminK_ug: 0.5, folate_ug: 20, iron_mg: 0.3, calcium_mg: 5, magnesium_mg: 27, zinc_mg: 0.2, potassium_mg: 358, sodium_mg: 1, phosphorus_mg: 22 }),
  'erdbeere': m({ vitaminA_ug: 1, vitaminB1_mg: 0.02, vitaminB2_mg: 0.02, vitaminB6_mg: 0.05, vitaminC_mg: 59, vitaminE_mg: 0.3, vitaminK_ug: 2.2, folate_ug: 24, iron_mg: 0.4, calcium_mg: 16, magnesium_mg: 13, zinc_mg: 0.1, potassium_mg: 153, sodium_mg: 1, phosphorus_mg: 24 }),
  'blaubeere': m({ vitaminA_ug: 3, vitaminB1_mg: 0.04, vitaminB2_mg: 0.04, vitaminB6_mg: 0.05, vitaminC_mg: 10, vitaminE_mg: 0.6, vitaminK_ug: 19, folate_ug: 6, iron_mg: 0.3, calcium_mg: 6, magnesium_mg: 6, zinc_mg: 0.2, potassium_mg: 77, sodium_mg: 1, phosphorus_mg: 12 }),
  'kiwi': m({ vitaminA_ug: 4, vitaminB1_mg: 0.03, vitaminB2_mg: 0.03, vitaminB6_mg: 0.06, vitaminC_mg: 93, vitaminE_mg: 1.5, vitaminK_ug: 40, folate_ug: 25, iron_mg: 0.3, calcium_mg: 34, magnesium_mg: 17, zinc_mg: 0.1, potassium_mg: 312, sodium_mg: 3, phosphorus_mg: 34 }),
  'mango': m({ vitaminA_ug: 54, vitaminB1_mg: 0.03, vitaminB2_mg: 0.04, vitaminB6_mg: 0.12, vitaminC_mg: 36, vitaminE_mg: 0.9, folate_ug: 43, iron_mg: 0.2, calcium_mg: 11, magnesium_mg: 10, zinc_mg: 0.1, potassium_mg: 168, sodium_mg: 1, phosphorus_mg: 14 }),
  'wassermelone': m({ vitaminA_ug: 28, vitaminB1_mg: 0.03, vitaminB6_mg: 0.05, vitaminC_mg: 8, folate_ug: 3, iron_mg: 0.2, calcium_mg: 7, magnesium_mg: 10, zinc_mg: 0.1, potassium_mg: 112, sodium_mg: 1, phosphorus_mg: 11 }),
  'traube': m({ vitaminA_ug: 3, vitaminB1_mg: 0.07, vitaminB2_mg: 0.07, vitaminB6_mg: 0.09, vitaminC_mg: 4, vitaminE_mg: 0.2, vitaminK_ug: 15, folate_ug: 2, iron_mg: 0.4, calcium_mg: 10, magnesium_mg: 7, zinc_mg: 0.1, potassium_mg: 191, sodium_mg: 2, phosphorus_mg: 20 }),
  'birne': m({ vitaminA_ug: 1, vitaminB1_mg: 0.01, vitaminB2_mg: 0.03, vitaminB6_mg: 0.03, vitaminC_mg: 4, vitaminE_mg: 0.1, vitaminK_ug: 4.4, folate_ug: 7, iron_mg: 0.2, calcium_mg: 9, magnesium_mg: 7, zinc_mg: 0.1, potassium_mg: 116, sodium_mg: 1, phosphorus_mg: 12 }),
  'ananas': m({ vitaminA_ug: 3, vitaminB1_mg: 0.08, vitaminB2_mg: 0.03, vitaminB6_mg: 0.11, vitaminC_mg: 48, vitaminE_mg: 0, folate_ug: 18, iron_mg: 0.3, calcium_mg: 13, magnesium_mg: 12, zinc_mg: 0.1, potassium_mg: 109, sodium_mg: 1, phosphorus_mg: 8 }),

  // Vegetables
  'brokkoli': m({ vitaminA_ug: 31, vitaminB1_mg: 0.07, vitaminB2_mg: 0.12, vitaminB6_mg: 0.17, vitaminC_mg: 89, vitaminE_mg: 0.8, vitaminK_ug: 102, folate_ug: 63, iron_mg: 0.7, calcium_mg: 47, magnesium_mg: 21, zinc_mg: 0.4, potassium_mg: 316, sodium_mg: 33, phosphorus_mg: 66 }),
  'broccoli': m({ vitaminA_ug: 31, vitaminB1_mg: 0.07, vitaminB2_mg: 0.12, vitaminB6_mg: 0.17, vitaminC_mg: 89, vitaminE_mg: 0.8, vitaminK_ug: 102, folate_ug: 63, iron_mg: 0.7, calcium_mg: 47, magnesium_mg: 21, zinc_mg: 0.4, potassium_mg: 316, sodium_mg: 33, phosphorus_mg: 66 }),
  'spinat': m({ vitaminA_ug: 469, vitaminB1_mg: 0.08, vitaminB2_mg: 0.19, vitaminB6_mg: 0.2, vitaminC_mg: 28, vitaminE_mg: 2.0, vitaminK_ug: 483, folate_ug: 194, iron_mg: 2.7, calcium_mg: 99, magnesium_mg: 79, zinc_mg: 0.5, potassium_mg: 558, sodium_mg: 79, phosphorus_mg: 49 }),
  'tomate': m({ vitaminA_ug: 42, vitaminB1_mg: 0.04, vitaminB2_mg: 0.02, vitaminB6_mg: 0.08, vitaminC_mg: 14, vitaminE_mg: 0.5, vitaminK_ug: 8, folate_ug: 15, iron_mg: 0.3, calcium_mg: 10, magnesium_mg: 11, zinc_mg: 0.2, potassium_mg: 237, sodium_mg: 5, phosphorus_mg: 24 }),
  'karotte': m({ vitaminA_ug: 835, vitaminB1_mg: 0.07, vitaminB2_mg: 0.06, vitaminB6_mg: 0.14, vitaminC_mg: 6, vitaminE_mg: 0.7, vitaminK_ug: 13, folate_ug: 19, iron_mg: 0.3, calcium_mg: 33, magnesium_mg: 12, zinc_mg: 0.2, potassium_mg: 320, sodium_mg: 69, phosphorus_mg: 35 }),
  'möhre': m({ vitaminA_ug: 835, vitaminB1_mg: 0.07, vitaminB2_mg: 0.06, vitaminB6_mg: 0.14, vitaminC_mg: 6, vitaminE_mg: 0.7, vitaminK_ug: 13, folate_ug: 19, iron_mg: 0.3, calcium_mg: 33, magnesium_mg: 12, zinc_mg: 0.2, potassium_mg: 320, sodium_mg: 69, phosphorus_mg: 35 }),
  'paprika': m({ vitaminA_ug: 157, vitaminB1_mg: 0.05, vitaminB2_mg: 0.08, vitaminB6_mg: 0.29, vitaminC_mg: 128, vitaminE_mg: 1.6, vitaminK_ug: 5, folate_ug: 46, iron_mg: 0.4, calcium_mg: 7, magnesium_mg: 12, zinc_mg: 0.3, potassium_mg: 211, sodium_mg: 4, phosphorus_mg: 26 }),
  'gurke': m({ vitaminA_ug: 5, vitaminB1_mg: 0.03, vitaminB2_mg: 0.03, vitaminB6_mg: 0.04, vitaminC_mg: 3, vitaminE_mg: 0, vitaminK_ug: 16, folate_ug: 7, iron_mg: 0.3, calcium_mg: 16, magnesium_mg: 13, zinc_mg: 0.2, potassium_mg: 147, sodium_mg: 2, phosphorus_mg: 24 }),
  'salat': m({ vitaminA_ug: 370, vitaminB1_mg: 0.07, vitaminB2_mg: 0.08, vitaminB6_mg: 0.09, vitaminC_mg: 9, vitaminE_mg: 0.3, vitaminK_ug: 126, folate_ug: 38, iron_mg: 0.9, calcium_mg: 36, magnesium_mg: 13, zinc_mg: 0.2, potassium_mg: 194, sodium_mg: 28, phosphorus_mg: 29 }),
  'zucchini': m({ vitaminA_ug: 10, vitaminB1_mg: 0.05, vitaminB2_mg: 0.04, vitaminB6_mg: 0.16, vitaminC_mg: 18, vitaminE_mg: 0.1, vitaminK_ug: 4, folate_ug: 24, iron_mg: 0.4, calcium_mg: 16, magnesium_mg: 18, zinc_mg: 0.3, potassium_mg: 261, sodium_mg: 8, phosphorus_mg: 38 }),
  'champignon': m({ vitaminB1_mg: 0.1, vitaminB2_mg: 0.4, vitaminB6_mg: 0.1, vitaminC_mg: 2, vitaminD_ug: 0.2, folate_ug: 17, iron_mg: 0.5, calcium_mg: 3, magnesium_mg: 9, zinc_mg: 0.5, potassium_mg: 318, sodium_mg: 5, phosphorus_mg: 86 }),
  'pilz': m({ vitaminB1_mg: 0.1, vitaminB2_mg: 0.4, vitaminB6_mg: 0.1, vitaminC_mg: 2, vitaminD_ug: 0.2, folate_ug: 17, iron_mg: 0.5, calcium_mg: 3, magnesium_mg: 9, zinc_mg: 0.5, potassium_mg: 318, sodium_mg: 5, phosphorus_mg: 86 }),
  'zwiebel': m({ vitaminB1_mg: 0.05, vitaminB6_mg: 0.12, vitaminC_mg: 7, folate_ug: 19, iron_mg: 0.2, calcium_mg: 23, magnesium_mg: 10, zinc_mg: 0.2, potassium_mg: 146, sodium_mg: 4, phosphorus_mg: 29 }),
  'knoblauch': m({ vitaminB1_mg: 0.2, vitaminB6_mg: 1.24, vitaminC_mg: 31, folate_ug: 3, iron_mg: 1.7, calcium_mg: 181, magnesium_mg: 25, zinc_mg: 1.2, potassium_mg: 401, sodium_mg: 17, phosphorus_mg: 153 }),
  'avocado': m({ vitaminA_ug: 7, vitaminB1_mg: 0.07, vitaminB2_mg: 0.13, vitaminB6_mg: 0.26, vitaminC_mg: 10, vitaminE_mg: 2.1, vitaminK_ug: 21, folate_ug: 81, iron_mg: 0.6, calcium_mg: 12, magnesium_mg: 29, zinc_mg: 0.6, potassium_mg: 485, sodium_mg: 7, phosphorus_mg: 52 }),
  'süßkartoffel': m({ vitaminA_ug: 709, vitaminB1_mg: 0.08, vitaminB6_mg: 0.21, vitaminC_mg: 2, vitaminE_mg: 0.3, folate_ug: 11, iron_mg: 0.6, calcium_mg: 30, magnesium_mg: 25, zinc_mg: 0.3, potassium_mg: 337, sodium_mg: 55, phosphorus_mg: 47 }),
  'kartoffel': m({ vitaminB1_mg: 0.08, vitaminB2_mg: 0.03, vitaminB6_mg: 0.3, vitaminC_mg: 20, folate_ug: 15, iron_mg: 0.8, calcium_mg: 12, magnesium_mg: 23, zinc_mg: 0.3, potassium_mg: 421, sodium_mg: 6, phosphorus_mg: 57 }),

  // Protein sources
  'hähnchen': m({ vitaminA_ug: 6, vitaminB1_mg: 0.07, vitaminB2_mg: 0.1, vitaminB6_mg: 0.5, vitaminB12_ug: 0.3, vitaminD_ug: 0.1, folate_ug: 4, iron_mg: 0.7, calcium_mg: 11, magnesium_mg: 25, zinc_mg: 1.0, potassium_mg: 256, sodium_mg: 74, phosphorus_mg: 200 }),
  'hühnchen': m({ vitaminA_ug: 6, vitaminB1_mg: 0.07, vitaminB2_mg: 0.1, vitaminB6_mg: 0.5, vitaminB12_ug: 0.3, vitaminD_ug: 0.1, folate_ug: 4, iron_mg: 0.7, calcium_mg: 11, magnesium_mg: 25, zinc_mg: 1.0, potassium_mg: 256, sodium_mg: 74, phosphorus_mg: 200 }),
  'chicken': m({ vitaminA_ug: 6, vitaminB1_mg: 0.07, vitaminB2_mg: 0.1, vitaminB6_mg: 0.5, vitaminB12_ug: 0.3, vitaminD_ug: 0.1, folate_ug: 4, iron_mg: 0.7, calcium_mg: 11, magnesium_mg: 25, zinc_mg: 1.0, potassium_mg: 256, sodium_mg: 74, phosphorus_mg: 200 }),
  'putenbrust': m({ vitaminB1_mg: 0.06, vitaminB2_mg: 0.12, vitaminB6_mg: 0.6, vitaminB12_ug: 0.4, vitaminD_ug: 0.1, folate_ug: 8, iron_mg: 0.7, calcium_mg: 10, magnesium_mg: 27, zinc_mg: 1.3, potassium_mg: 293, sodium_mg: 63, phosphorus_mg: 213 }),
  'rind': m({ vitaminA_ug: 2, vitaminB1_mg: 0.07, vitaminB2_mg: 0.15, vitaminB6_mg: 0.37, vitaminB12_ug: 2.6, vitaminD_ug: 0.1, folate_ug: 6, iron_mg: 2.6, calcium_mg: 12, magnesium_mg: 21, zinc_mg: 4.8, potassium_mg: 318, sodium_mg: 66, phosphorus_mg: 198 }),
  'steak': m({ vitaminA_ug: 2, vitaminB1_mg: 0.07, vitaminB2_mg: 0.15, vitaminB6_mg: 0.37, vitaminB12_ug: 2.6, vitaminD_ug: 0.1, folate_ug: 6, iron_mg: 2.6, calcium_mg: 12, magnesium_mg: 21, zinc_mg: 4.8, potassium_mg: 318, sodium_mg: 66, phosphorus_mg: 198 }),
  'schwein': m({ vitaminB1_mg: 0.8, vitaminB2_mg: 0.15, vitaminB6_mg: 0.4, vitaminB12_ug: 0.7, vitaminD_ug: 0.1, folate_ug: 5, iron_mg: 0.9, calcium_mg: 6, magnesium_mg: 22, zinc_mg: 2.0, potassium_mg: 350, sodium_mg: 62, phosphorus_mg: 190 }),
  'lachs': m({ vitaminA_ug: 12, vitaminB1_mg: 0.23, vitaminB2_mg: 0.13, vitaminB6_mg: 0.64, vitaminB12_ug: 3.2, vitaminD_ug: 11, vitaminE_mg: 1.8, folate_ug: 25, iron_mg: 0.3, calcium_mg: 12, magnesium_mg: 27, zinc_mg: 0.4, potassium_mg: 363, sodium_mg: 59, phosphorus_mg: 240 }),
  'salmon': m({ vitaminA_ug: 12, vitaminB1_mg: 0.23, vitaminB2_mg: 0.13, vitaminB6_mg: 0.64, vitaminB12_ug: 3.2, vitaminD_ug: 11, vitaminE_mg: 1.8, folate_ug: 25, iron_mg: 0.3, calcium_mg: 12, magnesium_mg: 27, zinc_mg: 0.4, potassium_mg: 363, sodium_mg: 59, phosphorus_mg: 240 }),
  'thunfisch': m({ vitaminA_ug: 20, vitaminB1_mg: 0.24, vitaminB2_mg: 0.25, vitaminB6_mg: 0.46, vitaminB12_ug: 9.4, vitaminD_ug: 4.5, folate_ug: 2, iron_mg: 1.0, calcium_mg: 12, magnesium_mg: 50, zinc_mg: 0.6, potassium_mg: 252, sodium_mg: 39, phosphorus_mg: 254 }),
  'tuna': m({ vitaminA_ug: 20, vitaminB1_mg: 0.24, vitaminB2_mg: 0.25, vitaminB6_mg: 0.46, vitaminB12_ug: 9.4, vitaminD_ug: 4.5, folate_ug: 2, iron_mg: 1.0, calcium_mg: 12, magnesium_mg: 50, zinc_mg: 0.6, potassium_mg: 252, sodium_mg: 39, phosphorus_mg: 254 }),
  'forelle': m({ vitaminB6_mg: 0.4, vitaminB12_ug: 5, vitaminD_ug: 5, iron_mg: 0.3, calcium_mg: 67, magnesium_mg: 28, zinc_mg: 0.5, potassium_mg: 414, sodium_mg: 52, phosphorus_mg: 245 }),
  'garnele': m({ vitaminB12_ug: 1.1, vitaminD_ug: 0.2, vitaminE_mg: 1.3, iron_mg: 0.5, calcium_mg: 52, magnesium_mg: 37, zinc_mg: 1.1, potassium_mg: 185, sodium_mg: 148, phosphorus_mg: 201 }),
  'shrimp': m({ vitaminB12_ug: 1.1, vitaminD_ug: 0.2, vitaminE_mg: 1.3, iron_mg: 0.5, calcium_mg: 52, magnesium_mg: 37, zinc_mg: 1.1, potassium_mg: 185, sodium_mg: 148, phosphorus_mg: 201 }),
  'tofu': m({ vitaminB1_mg: 0.06, vitaminB2_mg: 0.06, vitaminB6_mg: 0.05, folate_ug: 15, iron_mg: 5.4, calcium_mg: 350, magnesium_mg: 58, zinc_mg: 1.0, potassium_mg: 121, sodium_mg: 7, phosphorus_mg: 97 }),
  'ei': m({ vitaminA_ug: 160, vitaminB1_mg: 0.04, vitaminB2_mg: 0.46, vitaminB6_mg: 0.12, vitaminB12_ug: 0.9, vitaminD_ug: 2.0, vitaminE_mg: 1.1, vitaminK_ug: 0.3, folate_ug: 47, iron_mg: 1.8, calcium_mg: 56, magnesium_mg: 12, zinc_mg: 1.3, potassium_mg: 138, sodium_mg: 142, phosphorus_mg: 198 }),
  'egg': m({ vitaminA_ug: 160, vitaminB1_mg: 0.04, vitaminB2_mg: 0.46, vitaminB6_mg: 0.12, vitaminB12_ug: 0.9, vitaminD_ug: 2.0, vitaminE_mg: 1.1, vitaminK_ug: 0.3, folate_ug: 47, iron_mg: 1.8, calcium_mg: 56, magnesium_mg: 12, zinc_mg: 1.3, potassium_mg: 138, sodium_mg: 142, phosphorus_mg: 198 }),
  'spiegelei': m({ vitaminA_ug: 160, vitaminB2_mg: 0.44, vitaminB12_ug: 0.9, vitaminD_ug: 2.0, vitaminE_mg: 1.1, folate_ug: 44, iron_mg: 1.8, calcium_mg: 56, magnesium_mg: 12, zinc_mg: 1.3, potassium_mg: 138, sodium_mg: 142, phosphorus_mg: 198 }),
  'rührei': m({ vitaminA_ug: 140, vitaminB2_mg: 0.38, vitaminB12_ug: 0.8, vitaminD_ug: 1.6, folate_ug: 40, iron_mg: 1.5, calcium_mg: 50, magnesium_mg: 10, zinc_mg: 1.1, potassium_mg: 120, sodium_mg: 155, phosphorus_mg: 170 }),

  // Dairy
  'milch': m({ vitaminA_ug: 46, vitaminB1_mg: 0.04, vitaminB2_mg: 0.18, vitaminB6_mg: 0.04, vitaminB12_ug: 0.4, vitaminD_ug: 0.1, folate_ug: 5, vitaminC_mg: 1, iron_mg: 0, calcium_mg: 120, magnesium_mg: 12, zinc_mg: 0.4, potassium_mg: 151, sodium_mg: 49, phosphorus_mg: 93 }),
  'joghurt': m({ vitaminA_ug: 27, vitaminB1_mg: 0.04, vitaminB2_mg: 0.14, vitaminB12_ug: 0.4, vitaminD_ug: 0.1, folate_ug: 12, vitaminC_mg: 1, iron_mg: 0.1, calcium_mg: 120, magnesium_mg: 12, zinc_mg: 0.6, potassium_mg: 155, sodium_mg: 46, phosphorus_mg: 95 }),
  'yogurt': m({ vitaminA_ug: 27, vitaminB2_mg: 0.14, vitaminB12_ug: 0.4, vitaminD_ug: 0.1, folate_ug: 12, vitaminC_mg: 1, iron_mg: 0.1, calcium_mg: 120, magnesium_mg: 12, zinc_mg: 0.6, potassium_mg: 155, sodium_mg: 46, phosphorus_mg: 95 }),
  'skyr': m({ vitaminB2_mg: 0.2, vitaminB12_ug: 0.6, vitaminD_ug: 0.1, iron_mg: 0.1, calcium_mg: 150, magnesium_mg: 11, zinc_mg: 0.7, potassium_mg: 160, sodium_mg: 36, phosphorus_mg: 135 }),
  'quark': m({ vitaminA_ug: 5, vitaminB2_mg: 0.17, vitaminB12_ug: 0.5, vitaminD_ug: 0.1, folate_ug: 18, iron_mg: 0.1, calcium_mg: 90, magnesium_mg: 10, zinc_mg: 0.4, potassium_mg: 100, sodium_mg: 40, phosphorus_mg: 160 }),
  'magerquark': m({ vitaminB2_mg: 0.17, vitaminB12_ug: 0.5, vitaminD_ug: 0.1, folate_ug: 18, iron_mg: 0.1, calcium_mg: 90, magnesium_mg: 10, zinc_mg: 0.4, potassium_mg: 100, sodium_mg: 40, phosphorus_mg: 160 }),
  'käse': m({ vitaminA_ug: 265, vitaminB2_mg: 0.3, vitaminB12_ug: 2.0, vitaminD_ug: 0.3, vitaminK_ug: 2.3, iron_mg: 0.3, calcium_mg: 700, magnesium_mg: 28, zinc_mg: 3.5, potassium_mg: 100, sodium_mg: 620, phosphorus_mg: 500 }),
  'cheese': m({ vitaminA_ug: 265, vitaminB2_mg: 0.3, vitaminB12_ug: 2.0, vitaminD_ug: 0.3, iron_mg: 0.3, calcium_mg: 700, magnesium_mg: 28, zinc_mg: 3.5, potassium_mg: 100, sodium_mg: 620, phosphorus_mg: 500 }),
  'gouda': m({ vitaminA_ug: 265, vitaminB2_mg: 0.33, vitaminB12_ug: 1.5, vitaminD_ug: 0.3, iron_mg: 0.3, calcium_mg: 700, magnesium_mg: 28, zinc_mg: 3.5, potassium_mg: 100, sodium_mg: 620, phosphorus_mg: 500 }),
  'mozzarella': m({ vitaminA_ug: 174, vitaminB2_mg: 0.28, vitaminB12_ug: 2.3, vitaminD_ug: 0.4, iron_mg: 0.4, calcium_mg: 505, magnesium_mg: 20, zinc_mg: 2.8, potassium_mg: 76, sodium_mg: 627, phosphorus_mg: 354 }),
  'parmesan': m({ vitaminA_ug: 207, vitaminB2_mg: 0.33, vitaminB12_ug: 1.2, vitaminD_ug: 0.5, iron_mg: 0.8, calcium_mg: 1180, magnesium_mg: 44, zinc_mg: 2.8, potassium_mg: 92, sodium_mg: 1600, phosphorus_mg: 694 }),
  'feta': m({ vitaminA_ug: 125, vitaminB2_mg: 0.84, vitaminB12_ug: 1.7, vitaminD_ug: 0.4, iron_mg: 0.7, calcium_mg: 493, magnesium_mg: 19, zinc_mg: 2.9, potassium_mg: 62, sodium_mg: 1116, phosphorus_mg: 337 }),
  'frischkäse': m({ vitaminA_ug: 250, vitaminB2_mg: 0.15, vitaminB12_ug: 0.2, vitaminD_ug: 0.1, iron_mg: 0.1, calcium_mg: 80, magnesium_mg: 6, zinc_mg: 0.2, potassium_mg: 75, sodium_mg: 321, phosphorus_mg: 104 }),
  'butter': m({ vitaminA_ug: 684, vitaminD_ug: 1.5, vitaminE_mg: 2.3, vitaminK_ug: 7, iron_mg: 0, calcium_mg: 24, magnesium_mg: 2, zinc_mg: 0.1, potassium_mg: 24, sodium_mg: 11, phosphorus_mg: 24 }),

  // Grains & Carbs
  'reis': m({ vitaminB1_mg: 0.07, vitaminB6_mg: 0.05, folate_ug: 3, iron_mg: 0.4, calcium_mg: 10, magnesium_mg: 12, zinc_mg: 0.5, potassium_mg: 35, sodium_mg: 1, phosphorus_mg: 43 }),
  'rice': m({ vitaminB1_mg: 0.07, vitaminB6_mg: 0.05, folate_ug: 3, iron_mg: 0.4, calcium_mg: 10, magnesium_mg: 12, zinc_mg: 0.5, potassium_mg: 35, sodium_mg: 1, phosphorus_mg: 43 }),
  'nudel': m({ vitaminB1_mg: 0.14, vitaminB2_mg: 0.08, vitaminB6_mg: 0.05, folate_ug: 7, iron_mg: 1.3, calcium_mg: 18, magnesium_mg: 30, zinc_mg: 0.7, potassium_mg: 44, sodium_mg: 1, phosphorus_mg: 81 }),
  'pasta': m({ vitaminB1_mg: 0.14, vitaminB2_mg: 0.08, vitaminB6_mg: 0.05, folate_ug: 7, iron_mg: 1.3, calcium_mg: 18, magnesium_mg: 30, zinc_mg: 0.7, potassium_mg: 44, sodium_mg: 1, phosphorus_mg: 81 }),
  'spaghetti': m({ vitaminB1_mg: 0.14, vitaminB2_mg: 0.08, vitaminB6_mg: 0.05, folate_ug: 7, iron_mg: 1.3, calcium_mg: 18, magnesium_mg: 30, zinc_mg: 0.7, potassium_mg: 44, sodium_mg: 1, phosphorus_mg: 81 }),
  'brot': m({ vitaminB1_mg: 0.2, vitaminB2_mg: 0.1, vitaminB6_mg: 0.1, folate_ug: 30, iron_mg: 1.5, calcium_mg: 50, magnesium_mg: 40, zinc_mg: 1.0, potassium_mg: 200, sodium_mg: 490, phosphorus_mg: 120 }),
  'bread': m({ vitaminB1_mg: 0.2, vitaminB2_mg: 0.1, vitaminB6_mg: 0.1, folate_ug: 30, iron_mg: 1.5, calcium_mg: 50, magnesium_mg: 40, zinc_mg: 1.0, potassium_mg: 200, sodium_mg: 490, phosphorus_mg: 120 }),
  'vollkorn': m({ vitaminB1_mg: 0.34, vitaminB2_mg: 0.12, vitaminB6_mg: 0.15, vitaminE_mg: 0.7, folate_ug: 38, iron_mg: 2.5, calcium_mg: 50, magnesium_mg: 76, zinc_mg: 1.5, potassium_mg: 250, sodium_mg: 450, phosphorus_mg: 185 }),
  'haferflocken': m({ vitaminB1_mg: 0.76, vitaminB2_mg: 0.14, vitaminB6_mg: 0.12, vitaminE_mg: 0.6, vitaminK_ug: 2, folate_ug: 56, iron_mg: 4.7, calcium_mg: 54, magnesium_mg: 130, zinc_mg: 3.6, potassium_mg: 429, sodium_mg: 2, phosphorus_mg: 523 }),
  'oatmeal': m({ vitaminB1_mg: 0.76, vitaminB2_mg: 0.14, vitaminB6_mg: 0.12, vitaminE_mg: 0.6, folate_ug: 56, iron_mg: 4.7, calcium_mg: 54, magnesium_mg: 130, zinc_mg: 3.6, potassium_mg: 429, sodium_mg: 2, phosphorus_mg: 523 }),
  'porridge': m({ vitaminB1_mg: 0.76, vitaminB2_mg: 0.14, vitaminB6_mg: 0.12, folate_ug: 56, iron_mg: 4.7, calcium_mg: 54, magnesium_mg: 130, zinc_mg: 3.6, potassium_mg: 429, sodium_mg: 2, phosphorus_mg: 523 }),
  'müsli': m({ vitaminB1_mg: 0.4, vitaminB2_mg: 0.15, vitaminB6_mg: 0.1, vitaminE_mg: 1.0, folate_ug: 35, vitaminC_mg: 1, iron_mg: 3.0, calcium_mg: 50, magnesium_mg: 100, zinc_mg: 2.5, potassium_mg: 350, sodium_mg: 10, phosphorus_mg: 280 }),

  // Legumes & Nuts
  'linsen': m({ vitaminB1_mg: 0.17, vitaminB2_mg: 0.07, vitaminB6_mg: 0.18, folate_ug: 181, vitaminC_mg: 2, iron_mg: 3.3, calcium_mg: 19, magnesium_mg: 36, zinc_mg: 1.3, potassium_mg: 369, sodium_mg: 2, phosphorus_mg: 180 }),
  'kichererbse': m({ vitaminB1_mg: 0.12, vitaminB6_mg: 0.14, folate_ug: 172, vitaminC_mg: 1, iron_mg: 2.9, calcium_mg: 49, magnesium_mg: 48, zinc_mg: 1.5, potassium_mg: 291, sodium_mg: 7, phosphorus_mg: 168 }),
  'bohne': m({ vitaminB1_mg: 0.1, vitaminB6_mg: 0.1, folate_ug: 130, vitaminC_mg: 1, iron_mg: 2.0, calcium_mg: 25, magnesium_mg: 45, zinc_mg: 1.0, potassium_mg: 403, sodium_mg: 2, phosphorus_mg: 140 }),
  'mandel': m({ vitaminB1_mg: 0.2, vitaminB2_mg: 1.0, vitaminB6_mg: 0.14, vitaminE_mg: 25.6, folate_ug: 44, iron_mg: 3.7, calcium_mg: 269, magnesium_mg: 270, zinc_mg: 3.1, potassium_mg: 733, sodium_mg: 1, phosphorus_mg: 481 }),
  'walnuss': m({ vitaminB1_mg: 0.34, vitaminB6_mg: 0.54, vitaminE_mg: 0.7, folate_ug: 98, vitaminC_mg: 1, iron_mg: 2.9, calcium_mg: 98, magnesium_mg: 158, zinc_mg: 3.1, potassium_mg: 441, sodium_mg: 2, phosphorus_mg: 346 }),
  'erdnuss': m({ vitaminB1_mg: 0.64, vitaminB2_mg: 0.14, vitaminB6_mg: 0.35, vitaminE_mg: 8.3, folate_ug: 240, iron_mg: 2.5, calcium_mg: 58, magnesium_mg: 160, zinc_mg: 3.3, potassium_mg: 705, sodium_mg: 18, phosphorus_mg: 376 }),
  'nuss': m({ vitaminB1_mg: 0.3, vitaminB6_mg: 0.3, vitaminE_mg: 10, folate_ug: 80, iron_mg: 3.0, calcium_mg: 150, magnesium_mg: 200, zinc_mg: 3.0, potassium_mg: 500, sodium_mg: 5, phosphorus_mg: 350 }),

  // Misc
  'schokolade': m({ vitaminB1_mg: 0.03, vitaminB2_mg: 0.1, vitaminE_mg: 0.5, iron_mg: 3.0, calcium_mg: 30, magnesium_mg: 100, zinc_mg: 1.5, potassium_mg: 400, sodium_mg: 20, phosphorus_mg: 200 }),
  'honig': m({ vitaminC_mg: 0.5, iron_mg: 0.4, calcium_mg: 6, magnesium_mg: 2, zinc_mg: 0.2, potassium_mg: 52, sodium_mg: 4, phosphorus_mg: 4 }),
  'proteinshake': m({ vitaminA_ug: 120, vitaminB1_mg: 0.2, vitaminB2_mg: 0.3, vitaminB6_mg: 0.3, vitaminB12_ug: 0.5, vitaminC_mg: 15, vitaminD_ug: 2.5, vitaminE_mg: 2, folate_ug: 50, iron_mg: 2.0, calcium_mg: 200, magnesium_mg: 60, zinc_mg: 2.0, potassium_mg: 400, sodium_mg: 150, phosphorus_mg: 200 }),
  'protein': m({ vitaminB6_mg: 0.2, vitaminB12_ug: 0.4, vitaminC_mg: 10, vitaminD_ug: 2.0, iron_mg: 2.0, calcium_mg: 200, magnesium_mg: 50, zinc_mg: 1.5, potassium_mg: 350, sodium_mg: 120, phosphorus_mg: 180 }),
};

// Default estimate for unknown foods (based on average mixed meal per 100g)
const DEFAULT_MICRO: MicroData = m({
  vitaminA_ug: 20, vitaminB1_mg: 0.05, vitaminB2_mg: 0.05, vitaminB6_mg: 0.05, vitaminB12_ug: 0.1,
  vitaminC_mg: 5, vitaminD_ug: 0.2, vitaminE_mg: 0.3, vitaminK_ug: 5, folate_ug: 10,
  iron_mg: 0.8, calcium_mg: 30, magnesium_mg: 15, zinc_mg: 0.5,
  potassium_mg: 100, sodium_mg: 100, phosphorus_mg: 50,
});

/**
 * Estimate micronutrients for a single food item.
 */
export function estimateMicronutrients(foodName: string, quantityG: number): MicronutrientEstimate {
  const name = foodName.toLowerCase();

  let match: MicroData | null = null;
  let bestLength = 0;

  for (const [keyword, values] of Object.entries(microDB)) {
    if (name.includes(keyword) && keyword.length > bestLength) {
      match = values;
      bestLength = keyword.length;
    }
  }

  const base = match || DEFAULT_MICRO;
  const factor = quantityG / 100;

  return {
    vitaminA_ug: +(base.vitaminA_ug * factor).toFixed(0),
    vitaminB1_mg: +(base.vitaminB1_mg * factor).toFixed(2),
    vitaminB2_mg: +(base.vitaminB2_mg * factor).toFixed(2),
    vitaminB6_mg: +(base.vitaminB6_mg * factor).toFixed(2),
    vitaminB12_ug: +(base.vitaminB12_ug * factor).toFixed(1),
    vitaminC_mg: +(base.vitaminC_mg * factor).toFixed(1),
    vitaminD_ug: +(base.vitaminD_ug * factor).toFixed(1),
    vitaminE_mg: +(base.vitaminE_mg * factor).toFixed(1),
    vitaminK_ug: +(base.vitaminK_ug * factor).toFixed(1),
    folate_ug: +(base.folate_ug * factor).toFixed(0),
    iron_mg: +(base.iron_mg * factor).toFixed(1),
    calcium_mg: +(base.calcium_mg * factor).toFixed(0),
    magnesium_mg: +(base.magnesium_mg * factor).toFixed(0),
    zinc_mg: +(base.zinc_mg * factor).toFixed(1),
    potassium_mg: +(base.potassium_mg * factor).toFixed(0),
    sodium_mg: +(base.sodium_mg * factor).toFixed(0),
    phosphorus_mg: +(base.phosphorus_mg * factor).toFixed(0),
  };
}

/**
 * Estimate daily micronutrient totals from an array of food items.
 */
export function estimateDailyMicros(
  foodItems: { food_name: string; quantity: number; unit: string }[]
): MicronutrientEstimate {
  const totals: MicronutrientEstimate = {
    vitaminA_ug: 0, vitaminB1_mg: 0, vitaminB2_mg: 0, vitaminB6_mg: 0, vitaminB12_ug: 0,
    vitaminC_mg: 0, vitaminD_ug: 0, vitaminE_mg: 0, vitaminK_ug: 0, folate_ug: 0,
    iron_mg: 0, calcium_mg: 0, magnesium_mg: 0, zinc_mg: 0,
    potassium_mg: 0, sodium_mg: 0, phosphorus_mg: 0,
  };

  for (const item of foodItems) {
    let grams = item.quantity || 100;
    const unit = (item.unit || '').toLowerCase();
    if (unit === 'ml') grams = item.quantity;
    else if (unit === 'stück' || unit === 'portion' || unit === 'piece') grams = item.quantity * 100;
    else if (unit === 'scheibe' || unit === 'slice') grams = item.quantity * 40;
    else if (unit === 'tl' || unit === 'teaspoon') grams = item.quantity * 5;
    else if (unit === 'el' || unit === 'tablespoon') grams = item.quantity * 15;

    const est = estimateMicronutrients(item.food_name, grams);
    for (const key of Object.keys(totals) as (keyof MicronutrientEstimate)[]) {
      totals[key] += est[key];
    }
  }

  // Round all values
  return {
    vitaminA_ug: +totals.vitaminA_ug.toFixed(0),
    vitaminB1_mg: +totals.vitaminB1_mg.toFixed(2),
    vitaminB2_mg: +totals.vitaminB2_mg.toFixed(2),
    vitaminB6_mg: +totals.vitaminB6_mg.toFixed(2),
    vitaminB12_ug: +totals.vitaminB12_ug.toFixed(1),
    vitaminC_mg: +totals.vitaminC_mg.toFixed(1),
    vitaminD_ug: +totals.vitaminD_ug.toFixed(1),
    vitaminE_mg: +totals.vitaminE_mg.toFixed(1),
    vitaminK_ug: +totals.vitaminK_ug.toFixed(1),
    folate_ug: +totals.folate_ug.toFixed(0),
    iron_mg: +totals.iron_mg.toFixed(1),
    calcium_mg: +totals.calcium_mg.toFixed(0),
    magnesium_mg: +totals.magnesium_mg.toFixed(0),
    zinc_mg: +totals.zinc_mg.toFixed(1),
    potassium_mg: +totals.potassium_mg.toFixed(0),
    sodium_mg: +totals.sodium_mg.toFixed(0),
    phosphorus_mg: +totals.phosphorus_mg.toFixed(0),
  };
}
