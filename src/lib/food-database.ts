export interface FoodEntry {
  name: string;
  name_en: string;
  quantity: number;
  unit: string;
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  category: string;
}

// Common foods with typical portion sizes and nutritional values
export const foodDatabase: FoodEntry[] = [
  // Getränke / Drinks
  { name: 'Kaffee schwarz', name_en: 'Black Coffee', quantity: 200, unit: 'ml', calories: 4, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'drinks' },
  { name: 'Kaffee mit Milch', name_en: 'Coffee with Milk', quantity: 200, unit: 'ml', calories: 30, protein_g: 2, fat_g: 1, carbs_g: 3, category: 'drinks' },
  { name: 'Kaffee mit Sahne', name_en: 'Coffee with Cream', quantity: 200, unit: 'ml', calories: 50, protein_g: 1, fat_g: 4, carbs_g: 1, category: 'drinks' },
  { name: 'Cappuccino', name_en: 'Cappuccino', quantity: 200, unit: 'ml', calories: 80, protein_g: 4, fat_g: 4, carbs_g: 6, category: 'drinks' },
  { name: 'Latte Macchiato', name_en: 'Latte Macchiato', quantity: 300, unit: 'ml', calories: 120, protein_g: 6, fat_g: 5, carbs_g: 10, category: 'drinks' },
  { name: 'Espresso', name_en: 'Espresso', quantity: 30, unit: 'ml', calories: 2, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'drinks' },
  { name: 'Tee', name_en: 'Tea', quantity: 250, unit: 'ml', calories: 2, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'drinks' },
  { name: 'Orangensaft', name_en: 'Orange Juice', quantity: 200, unit: 'ml', calories: 90, protein_g: 1, fat_g: 0, carbs_g: 21, category: 'drinks' },
  { name: 'Apfelsaft', name_en: 'Apple Juice', quantity: 200, unit: 'ml', calories: 92, protein_g: 0, fat_g: 0, carbs_g: 22, category: 'drinks' },
  { name: 'Cola', name_en: 'Cola', quantity: 330, unit: 'ml', calories: 139, protein_g: 0, fat_g: 0, carbs_g: 35, category: 'drinks' },
  { name: 'Wasser', name_en: 'Water', quantity: 250, unit: 'ml', calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'drinks' },
  { name: 'Proteinshake', name_en: 'Protein Shake', quantity: 300, unit: 'ml', calories: 150, protein_g: 25, fat_g: 2, carbs_g: 8, category: 'drinks' },

  // Alkoholische Getränke / Alcoholic Drinks
  { name: 'Prosecco', name_en: 'Prosecco', quantity: 100, unit: 'ml', calories: 75, protein_g: 0, fat_g: 0, carbs_g: 1, category: 'drinks' },
  { name: 'Sekt', name_en: 'Sparkling Wine', quantity: 100, unit: 'ml', calories: 78, protein_g: 0, fat_g: 0, carbs_g: 2, category: 'drinks' },
  { name: 'Weißwein', name_en: 'White Wine', quantity: 150, unit: 'ml', calories: 110, protein_g: 0, fat_g: 0, carbs_g: 3, category: 'drinks' },
  { name: 'Rotwein', name_en: 'Red Wine', quantity: 150, unit: 'ml', calories: 125, protein_g: 0, fat_g: 0, carbs_g: 4, category: 'drinks' },
  { name: 'Rosé', name_en: 'Rosé Wine', quantity: 150, unit: 'ml', calories: 105, protein_g: 0, fat_g: 0, carbs_g: 3, category: 'drinks' },
  { name: 'Bier (Pils)', name_en: 'Beer (Pilsner)', quantity: 330, unit: 'ml', calories: 140, protein_g: 1, fat_g: 0, carbs_g: 10, category: 'drinks' },
  { name: 'Bier (Weizen)', name_en: 'Wheat Beer', quantity: 500, unit: 'ml', calories: 230, protein_g: 2, fat_g: 0, carbs_g: 18, category: 'drinks' },
  { name: 'Radler', name_en: 'Shandy', quantity: 330, unit: 'ml', calories: 130, protein_g: 0, fat_g: 0, carbs_g: 18, category: 'drinks' },
  { name: 'Aperol Spritz', name_en: 'Aperol Spritz', quantity: 200, unit: 'ml', calories: 140, protein_g: 0, fat_g: 0, carbs_g: 12, category: 'drinks' },
  { name: 'Hugo', name_en: 'Hugo Cocktail', quantity: 200, unit: 'ml', calories: 130, protein_g: 0, fat_g: 0, carbs_g: 14, category: 'drinks' },
  { name: 'Gin Tonic', name_en: 'Gin & Tonic', quantity: 250, unit: 'ml', calories: 170, protein_g: 0, fat_g: 0, carbs_g: 14, category: 'drinks' },
  { name: 'Wodka', name_en: 'Vodka', quantity: 40, unit: 'ml', calories: 90, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'drinks' },

  // Brot / Bread
  { name: 'Vollkornbrot', name_en: 'Whole Grain Bread', quantity: 1, unit: 'Scheibe', calories: 110, protein_g: 4, fat_g: 1, carbs_g: 20, category: 'bread' },
  { name: 'Weißbrot', name_en: 'White Bread', quantity: 1, unit: 'Scheibe', calories: 75, protein_g: 2, fat_g: 1, carbs_g: 14, category: 'bread' },
  { name: 'Brötchen', name_en: 'Roll', quantity: 1, unit: 'Stück', calories: 150, protein_g: 5, fat_g: 1, carbs_g: 28, category: 'bread' },
  { name: 'Croissant', name_en: 'Croissant', quantity: 1, unit: 'Stück', calories: 230, protein_g: 5, fat_g: 12, carbs_g: 26, category: 'bread' },
  { name: 'Toast', name_en: 'Toast', quantity: 1, unit: 'Scheibe', calories: 65, protein_g: 2, fat_g: 1, carbs_g: 12, category: 'bread' },

  // Aufschnitt / Toppings
  { name: 'Butter', name_en: 'Butter', quantity: 10, unit: 'g', calories: 74, protein_g: 0, fat_g: 8, carbs_g: 0, category: 'toppings' },
  { name: 'Marmelade', name_en: 'Jam', quantity: 20, unit: 'g', calories: 52, protein_g: 0, fat_g: 0, carbs_g: 13, category: 'toppings' },
  { name: 'Nutella', name_en: 'Nutella', quantity: 15, unit: 'g', calories: 81, protein_g: 1, fat_g: 5, carbs_g: 8, category: 'toppings' },
  { name: 'Honig', name_en: 'Honey', quantity: 15, unit: 'g', calories: 46, protein_g: 0, fat_g: 0, carbs_g: 12, category: 'toppings' },
  { name: 'Frischkäse', name_en: 'Cream Cheese', quantity: 30, unit: 'g', calories: 75, protein_g: 2, fat_g: 7, carbs_g: 1, category: 'toppings' },
  { name: 'Käse (Gouda)', name_en: 'Gouda Cheese', quantity: 30, unit: 'g', calories: 105, protein_g: 7, fat_g: 8, carbs_g: 0, category: 'toppings' },
  { name: 'Schinken', name_en: 'Ham', quantity: 30, unit: 'g', calories: 35, protein_g: 6, fat_g: 1, carbs_g: 0, category: 'toppings' },
  { name: 'Salami', name_en: 'Salami', quantity: 30, unit: 'g', calories: 120, protein_g: 7, fat_g: 10, carbs_g: 0, category: 'toppings' },
  { name: 'Avocado', name_en: 'Avocado', quantity: 80, unit: 'g', calories: 128, protein_g: 2, fat_g: 12, carbs_g: 1, category: 'toppings' },

  // Eier / Eggs
  { name: 'Ei gekocht', name_en: 'Boiled Egg', quantity: 1, unit: 'Stück', calories: 78, protein_g: 6, fat_g: 5, carbs_g: 1, category: 'eggs' },
  { name: 'Spiegelei', name_en: 'Fried Egg', quantity: 1, unit: 'Stück', calories: 95, protein_g: 6, fat_g: 7, carbs_g: 1, category: 'eggs' },
  { name: 'Rührei (2 Eier)', name_en: 'Scrambled Eggs (2)', quantity: 2, unit: 'Stück', calories: 200, protein_g: 14, fat_g: 15, carbs_g: 2, category: 'eggs' },
  { name: 'Omelette', name_en: 'Omelette', quantity: 1, unit: 'Stück', calories: 180, protein_g: 12, fat_g: 14, carbs_g: 1, category: 'eggs' },

  // Obst / Fruit
  { name: 'Apfel', name_en: 'Apple', quantity: 1, unit: 'Stück', calories: 72, protein_g: 0, fat_g: 0, carbs_g: 19, category: 'fruit' },
  { name: 'Banane', name_en: 'Banana', quantity: 1, unit: 'Stück', calories: 105, protein_g: 1, fat_g: 0, carbs_g: 27, category: 'fruit' },
  { name: 'Orange', name_en: 'Orange', quantity: 1, unit: 'Stück', calories: 62, protein_g: 1, fat_g: 0, carbs_g: 15, category: 'fruit' },
  { name: 'Erdbeeren', name_en: 'Strawberries', quantity: 150, unit: 'g', calories: 48, protein_g: 1, fat_g: 0, carbs_g: 11, category: 'fruit' },
  { name: 'Weintrauben', name_en: 'Grapes', quantity: 100, unit: 'g', calories: 67, protein_g: 1, fat_g: 0, carbs_g: 17, category: 'fruit' },
  { name: 'Blaubeeren', name_en: 'Blueberries', quantity: 100, unit: 'g', calories: 57, protein_g: 1, fat_g: 0, carbs_g: 14, category: 'fruit' },

  // Milchprodukte / Dairy
  { name: 'Joghurt natur', name_en: 'Plain Yogurt', quantity: 150, unit: 'g', calories: 92, protein_g: 5, fat_g: 5, carbs_g: 7, category: 'dairy' },
  { name: 'Griechischer Joghurt', name_en: 'Greek Yogurt', quantity: 150, unit: 'g', calories: 145, protein_g: 13, fat_g: 8, carbs_g: 5, category: 'dairy' },
  { name: 'Skyr', name_en: 'Skyr', quantity: 150, unit: 'g', calories: 100, protein_g: 17, fat_g: 0, carbs_g: 6, category: 'dairy' },
  { name: 'Magerquark', name_en: 'Low-fat Quark', quantity: 150, unit: 'g', calories: 100, protein_g: 18, fat_g: 0, carbs_g: 6, category: 'dairy' },
  { name: 'Milch', name_en: 'Milk', quantity: 200, unit: 'ml', calories: 96, protein_g: 6, fat_g: 4, carbs_g: 10, category: 'dairy' },

  // Müsli / Cereal
  { name: 'Haferflocken', name_en: 'Oats', quantity: 50, unit: 'g', calories: 190, protein_g: 7, fat_g: 3, carbs_g: 33, category: 'cereal' },
  { name: 'Müsli', name_en: 'Muesli', quantity: 60, unit: 'g', calories: 220, protein_g: 6, fat_g: 5, carbs_g: 38, category: 'cereal' },
  { name: 'Granola', name_en: 'Granola', quantity: 50, unit: 'g', calories: 230, protein_g: 5, fat_g: 9, carbs_g: 32, category: 'cereal' },

  // Fleisch / Meat
  { name: 'Hähnchenbrust', name_en: 'Chicken Breast', quantity: 150, unit: 'g', calories: 165, protein_g: 31, fat_g: 4, carbs_g: 0, category: 'meat' },
  { name: 'Rindfleisch', name_en: 'Beef', quantity: 150, unit: 'g', calories: 250, protein_g: 26, fat_g: 15, carbs_g: 0, category: 'meat' },
  { name: 'Hackfleisch (gemischt)', name_en: 'Mixed Ground Meat', quantity: 150, unit: 'g', calories: 340, protein_g: 23, fat_g: 27, carbs_g: 0, category: 'meat' },
  { name: 'Schweinefilet', name_en: 'Pork Tenderloin', quantity: 150, unit: 'g', calories: 185, protein_g: 30, fat_g: 6, carbs_g: 0, category: 'meat' },
  { name: 'Bratwurst', name_en: 'Bratwurst', quantity: 1, unit: 'Stück', calories: 310, protein_g: 14, fat_g: 27, carbs_g: 2, category: 'meat' },
  { name: 'Frikadelle', name_en: 'Meatball', quantity: 1, unit: 'Stück', calories: 220, protein_g: 15, fat_g: 15, carbs_g: 8, category: 'meat' },

  // Fisch / Fish
  { name: 'Lachs', name_en: 'Salmon', quantity: 150, unit: 'g', calories: 310, protein_g: 30, fat_g: 20, carbs_g: 0, category: 'fish' },
  { name: 'Thunfisch (Dose)', name_en: 'Canned Tuna', quantity: 100, unit: 'g', calories: 110, protein_g: 25, fat_g: 1, carbs_g: 0, category: 'fish' },
  { name: 'Garnelen', name_en: 'Shrimp', quantity: 100, unit: 'g', calories: 85, protein_g: 18, fat_g: 1, carbs_g: 0, category: 'fish' },

  // Beilagen / Sides
  { name: 'Reis (gekocht)', name_en: 'Cooked Rice', quantity: 200, unit: 'g', calories: 260, protein_g: 5, fat_g: 1, carbs_g: 57, category: 'sides' },
  { name: 'Nudeln (gekocht)', name_en: 'Cooked Pasta', quantity: 200, unit: 'g', calories: 280, protein_g: 10, fat_g: 2, carbs_g: 55, category: 'sides' },
  { name: 'Kartoffeln (gekocht)', name_en: 'Boiled Potatoes', quantity: 200, unit: 'g', calories: 154, protein_g: 4, fat_g: 0, carbs_g: 35, category: 'sides' },
  { name: 'Pommes frites', name_en: 'French Fries', quantity: 150, unit: 'g', calories: 470, protein_g: 5, fat_g: 24, carbs_g: 58, category: 'sides' },
  { name: 'Süßkartoffel', name_en: 'Sweet Potato', quantity: 200, unit: 'g', calories: 172, protein_g: 3, fat_g: 0, carbs_g: 40, category: 'sides' },

  // Gemüse / Vegetables
  { name: 'Gemischter Salat', name_en: 'Mixed Salad', quantity: 150, unit: 'g', calories: 25, protein_g: 2, fat_g: 0, carbs_g: 4, category: 'vegetables' },
  { name: 'Brokkoli', name_en: 'Broccoli', quantity: 150, unit: 'g', calories: 51, protein_g: 4, fat_g: 1, carbs_g: 7, category: 'vegetables' },
  { name: 'Tomaten', name_en: 'Tomatoes', quantity: 150, unit: 'g', calories: 27, protein_g: 1, fat_g: 0, carbs_g: 6, category: 'vegetables' },
  { name: 'Gurke', name_en: 'Cucumber', quantity: 100, unit: 'g', calories: 12, protein_g: 1, fat_g: 0, carbs_g: 2, category: 'vegetables' },
  { name: 'Paprika', name_en: 'Bell Pepper', quantity: 150, unit: 'g', calories: 42, protein_g: 1, fat_g: 0, carbs_g: 9, category: 'vegetables' },
  { name: 'Spinat', name_en: 'Spinach', quantity: 100, unit: 'g', calories: 23, protein_g: 3, fat_g: 0, carbs_g: 4, category: 'vegetables' },

  // Fertiggerichte / Prepared meals
  { name: 'Pizza Margherita', name_en: 'Pizza Margherita', quantity: 1, unit: 'Stück', calories: 800, protein_g: 30, fat_g: 28, carbs_g: 100, category: 'prepared' },
  { name: 'Döner Kebab', name_en: 'Döner Kebab', quantity: 1, unit: 'Stück', calories: 650, protein_g: 30, fat_g: 30, carbs_g: 60, category: 'prepared' },
  { name: 'Burger', name_en: 'Burger', quantity: 1, unit: 'Stück', calories: 550, protein_g: 25, fat_g: 30, carbs_g: 40, category: 'prepared' },
  { name: 'Schnitzel', name_en: 'Schnitzel', quantity: 1, unit: 'Stück', calories: 400, protein_g: 30, fat_g: 20, carbs_g: 20, category: 'prepared' },
  { name: 'Sushi (8 Stück)', name_en: 'Sushi (8 pcs)', quantity: 8, unit: 'Stück', calories: 320, protein_g: 14, fat_g: 4, carbs_g: 56, category: 'prepared' },
  { name: 'Wrap', name_en: 'Wrap', quantity: 1, unit: 'Stück', calories: 350, protein_g: 18, fat_g: 12, carbs_g: 40, category: 'prepared' },

  // Snacks / Sweets
  { name: 'Schokolade (Milch)', name_en: 'Milk Chocolate', quantity: 25, unit: 'g', calories: 135, protein_g: 2, fat_g: 8, carbs_g: 14, category: 'snacks' },
  { name: 'Schokolade (dunkel)', name_en: 'Dark Chocolate', quantity: 25, unit: 'g', calories: 130, protein_g: 2, fat_g: 9, carbs_g: 11, category: 'snacks' },
  { name: 'Chips', name_en: 'Chips', quantity: 30, unit: 'g', calories: 160, protein_g: 2, fat_g: 10, carbs_g: 15, category: 'snacks' },
  { name: 'Nüsse (gemischt)', name_en: 'Mixed Nuts', quantity: 30, unit: 'g', calories: 180, protein_g: 5, fat_g: 16, carbs_g: 5, category: 'snacks' },
  { name: 'Mandeln', name_en: 'Almonds', quantity: 30, unit: 'g', calories: 175, protein_g: 6, fat_g: 15, carbs_g: 2, category: 'snacks' },
  { name: 'Müsliriegel', name_en: 'Granola Bar', quantity: 1, unit: 'Stück', calories: 140, protein_g: 3, fat_g: 5, carbs_g: 21, category: 'snacks' },
  { name: 'Keks', name_en: 'Cookie', quantity: 1, unit: 'Stück', calories: 80, protein_g: 1, fat_g: 3, carbs_g: 12, category: 'snacks' },
  { name: 'Eis (Kugel)', name_en: 'Ice Cream (scoop)', quantity: 1, unit: 'Kugel', calories: 130, protein_g: 2, fat_g: 6, carbs_g: 17, category: 'snacks' },
  { name: 'Kuchen', name_en: 'Cake', quantity: 1, unit: 'Stück', calories: 350, protein_g: 5, fat_g: 15, carbs_g: 48, category: 'snacks' },

  // Soßen / Sauces
  { name: 'Ketchup', name_en: 'Ketchup', quantity: 15, unit: 'g', calories: 17, protein_g: 0, fat_g: 0, carbs_g: 4, category: 'sauces' },
  { name: 'Mayonnaise', name_en: 'Mayonnaise', quantity: 15, unit: 'g', calories: 100, protein_g: 0, fat_g: 11, carbs_g: 0, category: 'sauces' },
  { name: 'Olivenöl', name_en: 'Olive Oil', quantity: 10, unit: 'ml', calories: 88, protein_g: 0, fat_g: 10, carbs_g: 0, category: 'sauces' },
  { name: 'Salatdressing', name_en: 'Salad Dressing', quantity: 30, unit: 'ml', calories: 70, protein_g: 0, fat_g: 6, carbs_g: 3, category: 'sauces' },
];

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function searchFoods(query: string, language: 'de' | 'en'): FoodEntry[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const scored = foodDatabase
    .map((entry) => {
      const primaryName = language === 'de' ? entry.name : entry.name_en;
      const primary = normalizeSearchText(primaryName);
      const secondary = normalizeSearchText(language === 'de' ? entry.name_en : entry.name);

      if (primary.startsWith(normalizedQuery) || secondary.startsWith(normalizedQuery)) {
        return { entry, score: 3 };
      }

      if (primary.includes(normalizedQuery) || secondary.includes(normalizedQuery)) {
        return { entry, score: 2 };
      }

      const words = `${primary} ${secondary}`.split(' ');
      if (words.some((word) => word.startsWith(normalizedQuery))) {
        return { entry, score: 1 };
      }

      return null;
    })
    .filter((result): result is { entry: FoodEntry; score: number } => result !== null)
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name));

  return scored.slice(0, 8).map((result) => result.entry);
}
