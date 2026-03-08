/**
 * Micronutrient estimation engine
 * Estimates Vitamin C, Vitamin D, Iron, Calcium, Magnesium, Zinc
 * based on meal food items. Values are approximate and based on
 * USDA/BLS reference data for common foods.
 * 
 * All values are per the food's default portion in the database.
 */

export interface MicronutrientEstimate {
  vitaminC_mg: number;
  vitaminD_ug: number;
  iron_mg: number;
  calcium_mg: number;
  magnesium_mg: number;
  zinc_mg: number;
}

// Daily recommended intake (adult average)
export const DAILY_TARGETS: MicronutrientEstimate = {
  vitaminC_mg: 90,
  vitaminD_ug: 20,
  iron_mg: 14,
  calcium_mg: 1000,
  magnesium_mg: 375,
  zinc_mg: 10,
};

export const MICRO_LABELS = {
  vitaminC_mg: { de: 'Vitamin C', en: 'Vitamin C', unit: 'mg' },
  vitaminD_ug: { de: 'Vitamin D', en: 'Vitamin D', unit: 'µg' },
  iron_mg: { de: 'Eisen', en: 'Iron', unit: 'mg' },
  calcium_mg: { de: 'Kalzium', en: 'Calcium', unit: 'mg' },
  magnesium_mg: { de: 'Magnesium', en: 'Magnesium', unit: 'mg' },
  zinc_mg: { de: 'Zink', en: 'Zinc', unit: 'mg' },
};

// Micronutrient data per 100g/100ml for food name keywords
// Values approximate from USDA / DGE references
const microDB: Record<string, MicronutrientEstimate> = {
  // Fruits
  'orange': { vitaminC_mg: 53, vitaminD_ug: 0, iron_mg: 0.1, calcium_mg: 40, magnesium_mg: 10, zinc_mg: 0.1 },
  'orangensaft': { vitaminC_mg: 50, vitaminD_ug: 0, iron_mg: 0.2, calcium_mg: 11, magnesium_mg: 11, zinc_mg: 0.1 },
  'apfel': { vitaminC_mg: 5, vitaminD_ug: 0, iron_mg: 0.1, calcium_mg: 6, magnesium_mg: 5, zinc_mg: 0 },
  'banane': { vitaminC_mg: 9, vitaminD_ug: 0, iron_mg: 0.3, calcium_mg: 5, magnesium_mg: 27, zinc_mg: 0.2 },
  'erdbeere': { vitaminC_mg: 59, vitaminD_ug: 0, iron_mg: 0.4, calcium_mg: 16, magnesium_mg: 13, zinc_mg: 0.1 },
  'blaubeere': { vitaminC_mg: 10, vitaminD_ug: 0, iron_mg: 0.3, calcium_mg: 6, magnesium_mg: 6, zinc_mg: 0.2 },
  'kiwi': { vitaminC_mg: 93, vitaminD_ug: 0, iron_mg: 0.3, calcium_mg: 34, magnesium_mg: 17, zinc_mg: 0.1 },
  'mango': { vitaminC_mg: 36, vitaminD_ug: 0, iron_mg: 0.2, calcium_mg: 11, magnesium_mg: 10, zinc_mg: 0.1 },
  'wassermelone': { vitaminC_mg: 8, vitaminD_ug: 0, iron_mg: 0.2, calcium_mg: 7, magnesium_mg: 10, zinc_mg: 0.1 },
  'traube': { vitaminC_mg: 4, vitaminD_ug: 0, iron_mg: 0.4, calcium_mg: 10, magnesium_mg: 7, zinc_mg: 0.1 },
  'birne': { vitaminC_mg: 4, vitaminD_ug: 0, iron_mg: 0.2, calcium_mg: 9, magnesium_mg: 7, zinc_mg: 0.1 },
  'ananas': { vitaminC_mg: 48, vitaminD_ug: 0, iron_mg: 0.3, calcium_mg: 13, magnesium_mg: 12, zinc_mg: 0.1 },

  // Vegetables
  'brokkoli': { vitaminC_mg: 89, vitaminD_ug: 0, iron_mg: 0.7, calcium_mg: 47, magnesium_mg: 21, zinc_mg: 0.4 },
  'broccoli': { vitaminC_mg: 89, vitaminD_ug: 0, iron_mg: 0.7, calcium_mg: 47, magnesium_mg: 21, zinc_mg: 0.4 },
  'spinat': { vitaminC_mg: 28, vitaminD_ug: 0, iron_mg: 2.7, calcium_mg: 99, magnesium_mg: 79, zinc_mg: 0.5 },
  'tomate': { vitaminC_mg: 14, vitaminD_ug: 0, iron_mg: 0.3, calcium_mg: 10, magnesium_mg: 11, zinc_mg: 0.2 },
  'karotte': { vitaminC_mg: 6, vitaminD_ug: 0, iron_mg: 0.3, calcium_mg: 33, magnesium_mg: 12, zinc_mg: 0.2 },
  'möhre': { vitaminC_mg: 6, vitaminD_ug: 0, iron_mg: 0.3, calcium_mg: 33, magnesium_mg: 12, zinc_mg: 0.2 },
  'paprika': { vitaminC_mg: 128, vitaminD_ug: 0, iron_mg: 0.4, calcium_mg: 7, magnesium_mg: 12, zinc_mg: 0.3 },
  'gurke': { vitaminC_mg: 3, vitaminD_ug: 0, iron_mg: 0.3, calcium_mg: 16, magnesium_mg: 13, zinc_mg: 0.2 },
  'salat': { vitaminC_mg: 9, vitaminD_ug: 0, iron_mg: 0.9, calcium_mg: 36, magnesium_mg: 13, zinc_mg: 0.2 },
  'zucchini': { vitaminC_mg: 18, vitaminD_ug: 0, iron_mg: 0.4, calcium_mg: 16, magnesium_mg: 18, zinc_mg: 0.3 },
  'champignon': { vitaminC_mg: 2, vitaminD_ug: 0.2, iron_mg: 0.5, calcium_mg: 3, magnesium_mg: 9, zinc_mg: 0.5 },
  'pilz': { vitaminC_mg: 2, vitaminD_ug: 0.2, iron_mg: 0.5, calcium_mg: 3, magnesium_mg: 9, zinc_mg: 0.5 },
  'zwiebel': { vitaminC_mg: 7, vitaminD_ug: 0, iron_mg: 0.2, calcium_mg: 23, magnesium_mg: 10, zinc_mg: 0.2 },
  'knoblauch': { vitaminC_mg: 31, vitaminD_ug: 0, iron_mg: 1.7, calcium_mg: 181, magnesium_mg: 25, zinc_mg: 1.2 },
  'avocado': { vitaminC_mg: 10, vitaminD_ug: 0, iron_mg: 0.6, calcium_mg: 12, magnesium_mg: 29, zinc_mg: 0.6 },
  'süßkartoffel': { vitaminC_mg: 2, vitaminD_ug: 0, iron_mg: 0.6, calcium_mg: 30, magnesium_mg: 25, zinc_mg: 0.3 },
  'kartoffel': { vitaminC_mg: 20, vitaminD_ug: 0, iron_mg: 0.8, calcium_mg: 12, magnesium_mg: 23, zinc_mg: 0.3 },

  // Protein sources
  'hähnchen': { vitaminC_mg: 0, vitaminD_ug: 0.1, iron_mg: 0.7, calcium_mg: 11, magnesium_mg: 25, zinc_mg: 1.0 },
  'hühnchen': { vitaminC_mg: 0, vitaminD_ug: 0.1, iron_mg: 0.7, calcium_mg: 11, magnesium_mg: 25, zinc_mg: 1.0 },
  'chicken': { vitaminC_mg: 0, vitaminD_ug: 0.1, iron_mg: 0.7, calcium_mg: 11, magnesium_mg: 25, zinc_mg: 1.0 },
  'putenbrust': { vitaminC_mg: 0, vitaminD_ug: 0.1, iron_mg: 0.7, calcium_mg: 10, magnesium_mg: 27, zinc_mg: 1.3 },
  'rind': { vitaminC_mg: 0, vitaminD_ug: 0.1, iron_mg: 2.6, calcium_mg: 12, magnesium_mg: 21, zinc_mg: 4.8 },
  'steak': { vitaminC_mg: 0, vitaminD_ug: 0.1, iron_mg: 2.6, calcium_mg: 12, magnesium_mg: 21, zinc_mg: 4.8 },
  'schwein': { vitaminC_mg: 0, vitaminD_ug: 0.1, iron_mg: 0.9, calcium_mg: 6, magnesium_mg: 22, zinc_mg: 2.0 },
  'lachs': { vitaminC_mg: 0, vitaminD_ug: 11, iron_mg: 0.3, calcium_mg: 12, magnesium_mg: 27, zinc_mg: 0.4 },
  'salmon': { vitaminC_mg: 0, vitaminD_ug: 11, iron_mg: 0.3, calcium_mg: 12, magnesium_mg: 27, zinc_mg: 0.4 },
  'thunfisch': { vitaminC_mg: 0, vitaminD_ug: 4.5, iron_mg: 1.0, calcium_mg: 12, magnesium_mg: 50, zinc_mg: 0.6 },
  'tuna': { vitaminC_mg: 0, vitaminD_ug: 4.5, iron_mg: 1.0, calcium_mg: 12, magnesium_mg: 50, zinc_mg: 0.6 },
  'forelle': { vitaminC_mg: 0, vitaminD_ug: 5, iron_mg: 0.3, calcium_mg: 67, magnesium_mg: 28, zinc_mg: 0.5 },
  'garnele': { vitaminC_mg: 0, vitaminD_ug: 0.2, iron_mg: 0.5, calcium_mg: 52, magnesium_mg: 37, zinc_mg: 1.1 },
  'shrimp': { vitaminC_mg: 0, vitaminD_ug: 0.2, iron_mg: 0.5, calcium_mg: 52, magnesium_mg: 37, zinc_mg: 1.1 },
  'tofu': { vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 5.4, calcium_mg: 350, magnesium_mg: 58, zinc_mg: 1.0 },
  'ei': { vitaminC_mg: 0, vitaminD_ug: 2.0, iron_mg: 1.8, calcium_mg: 56, magnesium_mg: 12, zinc_mg: 1.3 },
  'egg': { vitaminC_mg: 0, vitaminD_ug: 2.0, iron_mg: 1.8, calcium_mg: 56, magnesium_mg: 12, zinc_mg: 1.3 },
  'spiegelei': { vitaminC_mg: 0, vitaminD_ug: 2.0, iron_mg: 1.8, calcium_mg: 56, magnesium_mg: 12, zinc_mg: 1.3 },
  'rührei': { vitaminC_mg: 0, vitaminD_ug: 1.6, iron_mg: 1.5, calcium_mg: 50, magnesium_mg: 10, zinc_mg: 1.1 },

  // Dairy
  'milch': { vitaminC_mg: 1, vitaminD_ug: 0.1, iron_mg: 0, calcium_mg: 120, magnesium_mg: 12, zinc_mg: 0.4 },
  'joghurt': { vitaminC_mg: 1, vitaminD_ug: 0.1, iron_mg: 0.1, calcium_mg: 120, magnesium_mg: 12, zinc_mg: 0.6 },
  'yogurt': { vitaminC_mg: 1, vitaminD_ug: 0.1, iron_mg: 0.1, calcium_mg: 120, magnesium_mg: 12, zinc_mg: 0.6 },
  'skyr': { vitaminC_mg: 0, vitaminD_ug: 0.1, iron_mg: 0.1, calcium_mg: 150, magnesium_mg: 11, zinc_mg: 0.7 },
  'quark': { vitaminC_mg: 0, vitaminD_ug: 0.1, iron_mg: 0.1, calcium_mg: 90, magnesium_mg: 10, zinc_mg: 0.4 },
  'magerquark': { vitaminC_mg: 0, vitaminD_ug: 0.1, iron_mg: 0.1, calcium_mg: 90, magnesium_mg: 10, zinc_mg: 0.4 },
  'käse': { vitaminC_mg: 0, vitaminD_ug: 0.3, iron_mg: 0.3, calcium_mg: 700, magnesium_mg: 28, zinc_mg: 3.5 },
  'cheese': { vitaminC_mg: 0, vitaminD_ug: 0.3, iron_mg: 0.3, calcium_mg: 700, magnesium_mg: 28, zinc_mg: 3.5 },
  'gouda': { vitaminC_mg: 0, vitaminD_ug: 0.3, iron_mg: 0.3, calcium_mg: 700, magnesium_mg: 28, zinc_mg: 3.5 },
  'mozzarella': { vitaminC_mg: 0, vitaminD_ug: 0.4, iron_mg: 0.4, calcium_mg: 505, magnesium_mg: 20, zinc_mg: 2.8 },
  'parmesan': { vitaminC_mg: 0, vitaminD_ug: 0.5, iron_mg: 0.8, calcium_mg: 1180, magnesium_mg: 44, zinc_mg: 2.8 },
  'feta': { vitaminC_mg: 0, vitaminD_ug: 0.4, iron_mg: 0.7, calcium_mg: 493, magnesium_mg: 19, zinc_mg: 2.9 },
  'frischkäse': { vitaminC_mg: 0, vitaminD_ug: 0.1, iron_mg: 0.1, calcium_mg: 80, magnesium_mg: 6, zinc_mg: 0.2 },
  'butter': { vitaminC_mg: 0, vitaminD_ug: 1.5, iron_mg: 0, calcium_mg: 24, magnesium_mg: 2, zinc_mg: 0.1 },

  // Grains & Carbs
  'reis': { vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 0.4, calcium_mg: 10, magnesium_mg: 12, zinc_mg: 0.5 },
  'rice': { vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 0.4, calcium_mg: 10, magnesium_mg: 12, zinc_mg: 0.5 },
  'nudel': { vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 1.3, calcium_mg: 18, magnesium_mg: 30, zinc_mg: 0.7 },
  'pasta': { vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 1.3, calcium_mg: 18, magnesium_mg: 30, zinc_mg: 0.7 },
  'spaghetti': { vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 1.3, calcium_mg: 18, magnesium_mg: 30, zinc_mg: 0.7 },
  'brot': { vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 1.5, calcium_mg: 50, magnesium_mg: 40, zinc_mg: 1.0 },
  'bread': { vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 1.5, calcium_mg: 50, magnesium_mg: 40, zinc_mg: 1.0 },
  'vollkorn': { vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 2.5, calcium_mg: 50, magnesium_mg: 76, zinc_mg: 1.5 },
  'haferflocken': { vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 4.7, calcium_mg: 54, magnesium_mg: 130, zinc_mg: 3.6 },
  'oatmeal': { vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 4.7, calcium_mg: 54, magnesium_mg: 130, zinc_mg: 3.6 },
  'porridge': { vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 4.7, calcium_mg: 54, magnesium_mg: 130, zinc_mg: 3.6 },
  'müsli': { vitaminC_mg: 1, vitaminD_ug: 0, iron_mg: 3.0, calcium_mg: 50, magnesium_mg: 100, zinc_mg: 2.5 },

  // Legumes & Nuts
  'linsen': { vitaminC_mg: 2, vitaminD_ug: 0, iron_mg: 3.3, calcium_mg: 19, magnesium_mg: 36, zinc_mg: 1.3 },
  'kichererbse': { vitaminC_mg: 1, vitaminD_ug: 0, iron_mg: 2.9, calcium_mg: 49, magnesium_mg: 48, zinc_mg: 1.5 },
  'bohne': { vitaminC_mg: 1, vitaminD_ug: 0, iron_mg: 2.0, calcium_mg: 25, magnesium_mg: 45, zinc_mg: 1.0 },
  'mandel': { vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 3.7, calcium_mg: 269, magnesium_mg: 270, zinc_mg: 3.1 },
  'walnuss': { vitaminC_mg: 1, vitaminD_ug: 0, iron_mg: 2.9, calcium_mg: 98, magnesium_mg: 158, zinc_mg: 3.1 },
  'erdnuss': { vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 2.5, calcium_mg: 58, magnesium_mg: 160, zinc_mg: 3.3 },
  'nuss': { vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 3.0, calcium_mg: 150, magnesium_mg: 200, zinc_mg: 3.0 },

  // Misc
  'schokolade': { vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 3.0, calcium_mg: 30, magnesium_mg: 100, zinc_mg: 1.5 },
  'honig': { vitaminC_mg: 0.5, vitaminD_ug: 0, iron_mg: 0.4, calcium_mg: 6, magnesium_mg: 2, zinc_mg: 0.2 },
  'proteinshake': { vitaminC_mg: 15, vitaminD_ug: 2.5, iron_mg: 2.0, calcium_mg: 200, magnesium_mg: 60, zinc_mg: 2.0 },
  'protein': { vitaminC_mg: 10, vitaminD_ug: 2.0, iron_mg: 2.0, calcium_mg: 200, magnesium_mg: 50, zinc_mg: 1.5 },
};

// Default estimate for unknown foods (based on average mixed meal per 100g)
const DEFAULT_MICRO: MicronutrientEstimate = {
  vitaminC_mg: 5,
  vitaminD_ug: 0.2,
  iron_mg: 0.8,
  calcium_mg: 30,
  magnesium_mg: 15,
  zinc_mg: 0.5,
};

/**
 * Estimate micronutrients for a single food item.
 * @param foodName - name of the food
 * @param quantityG - approximate weight in grams (for scaling)
 */
export function estimateMicronutrients(foodName: string, quantityG: number): MicronutrientEstimate {
  const name = foodName.toLowerCase();
  
  // Find best match from microDB
  let match: MicronutrientEstimate | null = null;
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
    vitaminC_mg: +(base.vitaminC_mg * factor).toFixed(1),
    vitaminD_ug: +(base.vitaminD_ug * factor).toFixed(1),
    iron_mg: +(base.iron_mg * factor).toFixed(1),
    calcium_mg: +(base.calcium_mg * factor).toFixed(0),
    magnesium_mg: +(base.magnesium_mg * factor).toFixed(0),
    zinc_mg: +(base.zinc_mg * factor).toFixed(1),
  };
}

/**
 * Estimate daily micronutrient totals from an array of food items.
 */
export function estimateDailyMicros(
  foodItems: { food_name: string; quantity: number; unit: string }[]
): MicronutrientEstimate {
  const totals: MicronutrientEstimate = {
    vitaminC_mg: 0, vitaminD_ug: 0, iron_mg: 0,
    calcium_mg: 0, magnesium_mg: 0, zinc_mg: 0,
  };

  for (const item of foodItems) {
    // Approximate grams from quantity & unit
    let grams = item.quantity || 100;
    const unit = (item.unit || '').toLowerCase();
    if (unit === 'ml') grams = item.quantity; // 1ml ≈ 1g for most foods
    else if (unit === 'stück' || unit === 'portion' || unit === 'piece') grams = item.quantity * 100;
    else if (unit === 'scheibe' || unit === 'slice') grams = item.quantity * 40;
    else if (unit === 'tl' || unit === 'teaspoon') grams = item.quantity * 5;
    else if (unit === 'el' || unit === 'tablespoon') grams = item.quantity * 15;

    const est = estimateMicronutrients(item.food_name, grams);
    totals.vitaminC_mg += est.vitaminC_mg;
    totals.vitaminD_ug += est.vitaminD_ug;
    totals.iron_mg += est.iron_mg;
    totals.calcium_mg += est.calcium_mg;
    totals.magnesium_mg += est.magnesium_mg;
    totals.zinc_mg += est.zinc_mg;
  }

  return {
    vitaminC_mg: +totals.vitaminC_mg.toFixed(1),
    vitaminD_ug: +totals.vitaminD_ug.toFixed(1),
    iron_mg: +totals.iron_mg.toFixed(1),
    calcium_mg: +totals.calcium_mg.toFixed(0),
    magnesium_mg: +totals.magnesium_mg.toFixed(0),
    zinc_mg: +totals.zinc_mg.toFixed(1),
  };
}
