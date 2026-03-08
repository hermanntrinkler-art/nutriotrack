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
  { name: 'Philadelphia Original', name_en: 'Philadelphia Original', quantity: 30, unit: 'g', calories: 75, protein_g: 2, fat_g: 7, carbs_g: 1, category: 'toppings' },
  { name: 'Philadelphia Light', name_en: 'Philadelphia Light', quantity: 30, unit: 'g', calories: 44, protein_g: 3, fat_g: 3, carbs_g: 2, category: 'toppings' },
  { name: 'Käse (Gouda)', name_en: 'Gouda Cheese', quantity: 30, unit: 'g', calories: 105, protein_g: 7, fat_g: 8, carbs_g: 0, category: 'toppings' },
  { name: 'Käse (Emmentaler)', name_en: 'Emmental Cheese', quantity: 30, unit: 'g', calories: 110, protein_g: 8, fat_g: 9, carbs_g: 0, category: 'toppings' },
  { name: 'Käse (Mozzarella)', name_en: 'Mozzarella', quantity: 30, unit: 'g', calories: 85, protein_g: 6, fat_g: 6, carbs_g: 1, category: 'toppings' },
  { name: 'Leerdammer', name_en: 'Leerdammer Cheese', quantity: 30, unit: 'g', calories: 104, protein_g: 8, fat_g: 8, carbs_g: 0, category: 'toppings' },
  { name: 'Schinken', name_en: 'Ham', quantity: 30, unit: 'g', calories: 35, protein_g: 6, fat_g: 1, carbs_g: 0, category: 'toppings' },
  { name: 'Salami', name_en: 'Salami', quantity: 30, unit: 'g', calories: 120, protein_g: 7, fat_g: 10, carbs_g: 0, category: 'toppings' },
  { name: 'Avocado', name_en: 'Avocado', quantity: 80, unit: 'g', calories: 128, protein_g: 2, fat_g: 12, carbs_g: 1, category: 'toppings' },
  { name: 'Erdnussbutter', name_en: 'Peanut Butter', quantity: 15, unit: 'g', calories: 94, protein_g: 4, fat_g: 8, carbs_g: 2, category: 'toppings' },

  // Markenprodukte / Brand Products
  { name: 'Milbona Skyr Natur', name_en: 'Milbona Skyr Plain', quantity: 150, unit: 'g', calories: 100, protein_g: 17, fat_g: 0, carbs_g: 6, category: 'brands' },
  { name: 'Milbona Joghurt Natur', name_en: 'Milbona Plain Yogurt', quantity: 150, unit: 'g', calories: 92, protein_g: 5, fat_g: 5, carbs_g: 7, category: 'brands' },
  { name: 'Gut & Günstig Magerquark', name_en: 'Gut & Günstig Low-fat Quark', quantity: 250, unit: 'g', calories: 167, protein_g: 30, fat_g: 0, carbs_g: 10, category: 'brands' },
  { name: 'Exquisa Frischkäse', name_en: 'Exquisa Cream Cheese', quantity: 30, unit: 'g', calories: 72, protein_g: 2, fat_g: 7, carbs_g: 1, category: 'brands' },
  { name: 'Almette Frischkäse', name_en: 'Almette Cream Cheese', quantity: 30, unit: 'g', calories: 80, protein_g: 2, fat_g: 7, carbs_g: 2, category: 'brands' },
  { name: 'Barilla Spaghetti (gekocht)', name_en: 'Barilla Spaghetti (cooked)', quantity: 200, unit: 'g', calories: 280, protein_g: 10, fat_g: 2, carbs_g: 55, category: 'brands' },
  { name: 'Dr. Oetker Ristorante Pizza', name_en: 'Dr. Oetker Ristorante Pizza', quantity: 1, unit: 'Stück', calories: 780, protein_g: 28, fat_g: 26, carbs_g: 96, category: 'brands' },
  { name: 'Wagner Pizza', name_en: 'Wagner Pizza', quantity: 1, unit: 'Stück', calories: 820, protein_g: 30, fat_g: 30, carbs_g: 95, category: 'brands' },
  { name: 'Haribo Goldbären', name_en: 'Haribo Gummy Bears', quantity: 25, unit: 'g', calories: 85, protein_g: 2, fat_g: 0, carbs_g: 20, category: 'brands' },
  { name: 'Kinder Bueno', name_en: 'Kinder Bueno', quantity: 1, unit: 'Stück', calories: 122, protein_g: 2, fat_g: 8, carbs_g: 10, category: 'brands' },
  { name: 'Knoppers', name_en: 'Knoppers', quantity: 1, unit: 'Stück', calories: 137, protein_g: 2, fat_g: 8, carbs_g: 14, category: 'brands' },
  { name: 'Milka Schokolade', name_en: 'Milka Chocolate', quantity: 25, unit: 'g', calories: 134, protein_g: 2, fat_g: 8, carbs_g: 14, category: 'brands' },
  { name: 'Ritter Sport', name_en: 'Ritter Sport', quantity: 25, unit: 'g', calories: 138, protein_g: 2, fat_g: 8, carbs_g: 14, category: 'brands' },
  { name: 'Alpro Sojajoghurt', name_en: 'Alpro Soy Yogurt', quantity: 150, unit: 'g', calories: 65, protein_g: 6, fat_g: 3, carbs_g: 2, category: 'brands' },
  { name: 'Alpro Hafermilch', name_en: 'Alpro Oat Milk', quantity: 200, unit: 'ml', calories: 92, protein_g: 1, fat_g: 3, carbs_g: 14, category: 'brands' },
  { name: 'Oatly Hafermilch', name_en: 'Oatly Oat Milk', quantity: 200, unit: 'ml', calories: 96, protein_g: 1, fat_g: 3, carbs_g: 14, category: 'brands' },
  { name: 'Activia Joghurt', name_en: 'Activia Yogurt', quantity: 150, unit: 'g', calories: 108, protein_g: 5, fat_g: 3, carbs_g: 15, category: 'brands' },
  { name: 'Müller Milchreis', name_en: 'Müller Rice Pudding', quantity: 200, unit: 'g', calories: 220, protein_g: 6, fat_g: 5, carbs_g: 38, category: 'brands' },
  { name: 'Iglo Fischstäbchen', name_en: 'Iglo Fish Fingers', quantity: 4, unit: 'Stück', calories: 220, protein_g: 12, fat_g: 10, carbs_g: 20, category: 'brands' },
  { name: 'McCain Pommes', name_en: 'McCain French Fries', quantity: 150, unit: 'g', calories: 230, protein_g: 3, fat_g: 8, carbs_g: 36, category: 'brands' },

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

// Synonym / slang map: keys are normalized aliases, values are normalized canonical names
// When a user types a brand name or slang term, it also matches the generic food entry
const SYNONYMS: Record<string, string[]> = {
  // === Österreichisch / Austrian ===
  'paradeiser': ['tomaten', 'tomatoes'],
  'paradeis': ['tomaten', 'tomatoes'],
  'erdaepfel': ['kartoffeln (gekocht)', 'boiled potatoes'],
  'erdapfel': ['kartoffeln (gekocht)', 'boiled potatoes'],
  'obers': ['sahne', 'cream', 'kaffee mit sahne', 'coffee with cream'],
  'schlagobers': ['sahne', 'cream'],
  'topfen': ['magerquark', 'low-fat quark'],
  'palatschinken': ['wrap', 'crepe'],
  'faschiertes': ['hackfleisch (gemischt)', 'mixed ground meat'],
  'weckerl': ['broetchen', 'roll'],
  'semmel': ['broetchen', 'roll'],
  'kaisersemmel': ['broetchen', 'roll'],
  'kipferl': ['croissant'],
  'marille': ['aprikose', 'apricot'],
  'ribisel': ['johannisbeere', 'currant'],
  'zwetschke': ['pflaume', 'plum'],
  'fisolen': ['bohnen', 'green beans'],
  'karfiol': ['blumenkohl', 'cauliflower'],
  'kukuruz': ['mais', 'corn'],
  'schwammerl': ['pilze', 'mushrooms'],
  'hendl': ['haehnchenbrust', 'chicken breast'],
  'backhendl': ['schnitzel'],
  'leberkaesebroetchen': ['fleischkaese', 'leberkäse'],
  'leberkaese': ['fleischkaese', 'leberkäse'],
  'fleischlaberl': ['frikadelle', 'meatball'],
  'nockerl': ['nudeln (gekocht)', 'cooked pasta'],
  'knodel': ['knoedel', 'dumpling'],
  'knoedel': ['kartoffeln (gekocht)', 'boiled potatoes'],
  'powidl': ['marmelade', 'jam'],
  'punschkrapfen': ['kuchen', 'cake'],
  'sachertorte': ['kuchen', 'cake'],
  'strudel': ['kuchen', 'cake'],
  'germknoedel': ['kuchen', 'cake'],

  // === Schweizerdeutsch / Swiss German ===
  'poulet': ['haehnchenbrust', 'chicken breast'],
  'rueebli': ['karotten', 'carrots'],
  'ruebli': ['karotten', 'carrots'],
  'nuesslisalat': ['gemischter salat', 'mixed salad'],
  'zopf': ['weissbrot', 'white bread'],
  'weggli': ['broetchen', 'roll'],
  'mutschli': ['broetchen', 'roll'],
  'cervelat': ['bratwurst'],
  'schuebling': ['bratwurst'],
  'raclette': ['kaese (gouda)', 'gouda cheese'],
  'rosti': ['kartoffeln (gekocht)', 'boiled potatoes'],
  'roesti': ['kartoffeln (gekocht)', 'boiled potatoes'],
  'birchermuesli': ['muesli'],
  'birchermüesli': ['muesli'],
  'rivella': ['cola'],
  'kaegi': ['keks', 'cookie'],
  'toblerone': ['schokolade (milch)', 'milk chocolate'],
  'ovomaltine': ['proteinshake', 'protein shake'],
  'rahm': ['sahne', 'cream', 'kaffee mit sahne'],
  'anke': ['butter'],
  'ziger': ['frischkaese', 'cream cheese'],
  'fondue': ['kaese (gouda)', 'gouda cheese'],
  'alpkaese': ['kaese (gouda)', 'gouda cheese'],
  'emmentaler': ['kaese (emmentaler)', 'emmental cheese'],
  'gruyere': ['kaese (gouda)', 'gouda cheese'],
  'appenzeller': ['kaese (gouda)', 'gouda cheese'],

  // === Frischkäse / Cream Cheese brands ===
  'philadelphia': ['frischkaese', 'cream cheese', 'philadelphia'],
  'buko': ['frischkaese', 'cream cheese'],
  'exquisa': ['frischkaese', 'cream cheese'],
  'almette': ['frischkaese', 'cream cheese'],

  // === Schokolade & Süßes ===
  'nutella': ['nutella'],
  'nuss nougat creme': ['nutella'],
  'schoki': ['schokolade (milch)', 'milk chocolate'],
  'schoko': ['schokolade (milch)', 'milk chocolate'],
  'gummibaerchen': ['haribo goldbaeren', 'haribo gummy bears'],

  // === Joghurt & Milch brands ===
  'activia': ['joghurt natur', 'plain yogurt'],
  'alpro': ['joghurt natur', 'plain yogurt'],
  'arla': ['skyr'],
  'milbona': ['skyr', 'joghurt natur', 'milch'],
  'quark': ['magerquark', 'low-fat quark'],

  // === Käse brands ===
  'leerdammer': ['kaese (gouda)', 'gouda cheese', 'leerdammer'],
  'babybel': ['kaese (gouda)', 'gouda cheese'],
  'tilsiter': ['kaese (gouda)', 'gouda cheese'],
  'edamer': ['kaese (gouda)', 'gouda cheese'],
  'cheddar': ['kaese (gouda)', 'gouda cheese'],
  'parmesan': ['kaese (gouda)', 'gouda cheese'],
  'feta': ['kaese (gouda)', 'gouda cheese'],
  'camembert': ['kaese (gouda)', 'gouda cheese'],
  'brie': ['kaese (gouda)', 'gouda cheese'],

  // === Wurst / Aufschnitt ===
  'fleischwurst': ['salami'],
  'mortadella': ['salami'],
  'putenbrust': ['schinken', 'ham'],
  'truthahn': ['schinken', 'ham'],
  'lyoner': ['salami'],
  'leberwurst': ['salami'],
  'extrawurst': ['schinken', 'ham'],

  // === Brot ===
  'toastbrot': ['toast'],
  'schrippe': ['broetchen', 'roll'],
  'stulle': ['vollkornbrot', 'whole grain bread'],
  'baguette': ['weissbrot', 'white bread'],
  'ciabatta': ['weissbrot', 'white bread'],
  'laugenstange': ['broetchen', 'roll'],
  'laugenbrezel': ['broetchen', 'roll'],
  'brezel': ['broetchen', 'roll'],

  // === Getränke ===
  'cola zero': ['cola'],
  'pepsi': ['cola'],
  'fanta': ['orangensaft', 'orange juice'],
  'eistee': ['tee', 'tea'],
  'ice tea': ['tee', 'tea'],
  'spezi': ['cola'],
  'almdudler': ['cola'],
  'schorle': ['apfelsaft', 'apple juice'],
  'apfelschorle': ['apfelsaft', 'apple juice'],
  'limo': ['cola'],
  'limonade': ['cola'],
  'kakao': ['milch', 'milk'],
  'heisse schokolade': ['milch', 'milk'],

  // === Fleisch ===
  'haehnchen': ['haehnchenbrust', 'chicken breast'],
  'chicken': ['haehnchenbrust', 'chicken breast'],
  'huhn': ['haehnchenbrust', 'chicken breast'],
  'rind': ['rindfleisch', 'beef'],
  'steak': ['rindfleisch', 'beef'],
  'hackfleisch': ['hackfleisch (gemischt)', 'mixed ground meat'],
  'gehacktes': ['hackfleisch (gemischt)', 'mixed ground meat'],
  'bulette': ['frikadelle', 'meatball'],
  'pflanzerl': ['frikadelle', 'meatball'],

  // === Fisch ===
  'thunfisch': ['thunfisch (dose)', 'canned tuna'],
  'tuna': ['thunfisch (dose)', 'canned tuna'],
  'fischstaebchen': ['iglo fischstaebchen', 'iglo fish fingers'],

  // === Beilagen ===
  'spaghetti': ['nudeln (gekocht)', 'cooked pasta'],
  'penne': ['nudeln (gekocht)', 'cooked pasta'],
  'pasta': ['nudeln (gekocht)', 'cooked pasta'],
  'kartoffel': ['kartoffeln (gekocht)', 'boiled potatoes'],
  'fritten': ['pommes frites', 'french fries'],
  'pommes': ['pommes frites', 'french fries'],
  'bratkartoffeln': ['kartoffeln (gekocht)', 'boiled potatoes'],
  'puree': ['kartoffeln (gekocht)', 'boiled potatoes'],
  'kartoffelpueree': ['kartoffeln (gekocht)', 'boiled potatoes'],
  'couscous': ['reis (gekocht)', 'cooked rice'],
  'bulgur': ['reis (gekocht)', 'cooked rice'],

  // === Gemüse ===
  'tomate': ['tomaten', 'tomatoes'],
  'karotten': ['karotten', 'carrots'],
  'moehren': ['karotten', 'carrots'],
  'zucchini': ['gurke', 'cucumber'],
  'aubergine': ['paprika', 'bell pepper'],
  'zwiebel': ['tomaten', 'tomatoes'],
  'knoblauch': ['tomaten', 'tomatoes'],
  'champignons': ['spinat', 'spinach'],
  'pilze': ['spinat', 'spinach'],

  // === Obst ===
  'birne': ['apfel', 'apple'],
  'mandarine': ['orange'],
  'clementine': ['orange'],
  'kiwi': ['apfel', 'apple'],
  'mango': ['banane', 'banana'],
  'ananas': ['banane', 'banana'],
  'himbeeren': ['erdbeeren', 'strawberries'],
  'brombeeren': ['blaubeeren', 'blueberries'],

  // === Eier ===
  'ei': ['ei gekocht', 'boiled egg'],
  'eier': ['ei gekocht', 'boiled egg'],
  'ruehrei': ['ruehrei (2 eier)', 'scrambled eggs (2)'],

  // === Fertiggerichte ===
  'kebab': ['doener kebab'],
  'doener': ['doener kebab'],
  'gyros': ['doener kebab'],
  'currywurst': ['bratwurst'],
  'cordon bleu': ['schnitzel'],
  'wiener schnitzel': ['schnitzel'],

  // === Müsli / Cereal ===
  'porridge': ['haferflocken', 'oats'],
  'overnight oats': ['haferflocken', 'oats'],
  'cornflakes': ['muesli'],
  'muesli': ['muesli'],
};

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

function findSynonymTargets(query: string): string[] {
  const normalized = normalizeSearchText(query);
  const targets: string[] = [];
  for (const [alias, canonicals] of Object.entries(SYNONYMS)) {
    if (normalized.includes(alias) || alias.includes(normalized)) {
      targets.push(...canonicals.map(normalizeSearchText));
    }
  }
  return targets;
}

function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

function tokenize(value: string): string[] {
  return normalizeSearchText(value)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 2);
}

export function searchFoods(query: string, language: 'de' | 'en'): FoodEntry[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const queryTokens = tokenize(normalizedQuery);
  const synonymTargets = findSynonymTargets(normalizedQuery);

  const scored = foodDatabase
    .map((entry) => {
      const primaryName = language === 'de' ? entry.name : entry.name_en;
      const secondaryName = language === 'de' ? entry.name_en : entry.name;

      const primary = normalizeSearchText(primaryName);
      const secondary = normalizeSearchText(secondaryName);
      const primaryTokens = tokenize(primaryName);
      const secondaryTokens = tokenize(secondaryName);

      let score = 0;

      // Check synonym matches
      if (synonymTargets.length > 0) {
        for (const target of synonymTargets) {
          if (primary.includes(target) || secondary.includes(target)) {
            score = Math.max(score, 70);
            break;
          }
        }
      }

      if (primary === normalizedQuery || secondary === normalizedQuery) score = Math.max(score, 100);
      if (primary.startsWith(normalizedQuery) || secondary.startsWith(normalizedQuery)) score = Math.max(score, 80);
      if (primary.includes(normalizedQuery) || secondary.includes(normalizedQuery)) score = Math.max(score, 60);

      for (const token of queryTokens) {
        if (token.length < 3) continue;

        if (
          primaryTokens.some((word) => word.startsWith(token) || word.includes(token)) ||
          secondaryTokens.some((word) => word.startsWith(token) || word.includes(token))
        ) {
          score = Math.max(score, 50);
          continue;
        }

        if (token.length >= 5) {
          const fuzzyMatch = [...primaryTokens, ...secondaryTokens].some((word) => {
            const maxDistance = token.length >= 8 ? 2 : 1;
            return levenshteinDistance(word, token) <= maxDistance;
          });

          if (fuzzyMatch) score = Math.max(score, 40);
        }
      }

      return score > 0 ? { entry, score } : null;
    })
    .filter((result): result is { entry: FoodEntry; score: number } => result !== null)
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name));

  return scored.slice(0, 8).map((result) => result.entry);
}
