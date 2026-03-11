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
  gram_per_piece?: number; // grams per Scheibe/Stück for unit conversion
  gram_per_portion?: number; // grams per Portion/Messlöffel for unit conversion
  matchedAlias?: string;
  communityContributor?: string;
  communityBrand?: string;
  communityStore?: string;
  communityProductId?: string;
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
  { name: 'Proteinshake', name_en: 'Protein Shake', quantity: 1, unit: 'Portion', calories: 150, protein_g: 25, fat_g: 2, carbs_g: 8, category: 'drinks', gram_per_portion: 30 },

  // Kaffee-Zutaten / Coffee Add-ins
  { name: 'Instantkaffee (Pulver)', name_en: 'Instant Coffee (Powder)', quantity: 2, unit: 'g', calories: 5, protein_g: 0.2, fat_g: 0, carbs_g: 0.8, category: 'drinks', gram_per_piece: 2 },
  { name: 'Nescafé Gold', name_en: 'Nescafé Gold', quantity: 2, unit: 'g', calories: 5, protein_g: 0.2, fat_g: 0, carbs_g: 0.8, category: 'drinks', gram_per_piece: 2 },
  { name: 'Cappuccino Pulver', name_en: 'Cappuccino Powder', quantity: 18, unit: 'g', calories: 78, protein_g: 1.5, fat_g: 2.5, carbs_g: 12, category: 'drinks', gram_per_piece: 18 },
  { name: 'Kaffee 3in1', name_en: 'Coffee 3in1', quantity: 18, unit: 'g', calories: 80, protein_g: 1, fat_g: 3, carbs_g: 12, category: 'drinks', gram_per_piece: 18 },
  { name: 'Kakaopulver', name_en: 'Cocoa Powder', quantity: 10, unit: 'g', calories: 35, protein_g: 2, fat_g: 1, carbs_g: 4, category: 'drinks' },
  { name: 'Sahne (Kaffee)', name_en: 'Coffee Cream', quantity: 50, unit: 'g', calories: 150, protein_g: 1, fat_g: 15, carbs_g: 2, category: 'drinks' },
  { name: 'Milch (zum Kaffee)', name_en: 'Milk (for coffee)', quantity: 30, unit: 'ml', calories: 19, protein_g: 1, fat_g: 1, carbs_g: 1, category: 'drinks' },
  { name: 'Kondensmilch', name_en: 'Condensed Milk', quantity: 15, unit: 'ml', calories: 20, protein_g: 1, fat_g: 1, carbs_g: 2, category: 'drinks' },
  { name: 'Hafermilch (zum Kaffee)', name_en: 'Oat Milk (for coffee)', quantity: 50, unit: 'ml', calories: 23, protein_g: 0, fat_g: 1, carbs_g: 4, category: 'drinks' },
  { name: 'Zucker (1 TL)', name_en: 'Sugar (1 tsp)', quantity: 5, unit: 'g', calories: 20, protein_g: 0, fat_g: 0, carbs_g: 5, category: 'drinks' },

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
  { name: 'Vollkornbrot', name_en: 'Whole Grain Bread', quantity: 1, unit: 'Scheibe', calories: 110, protein_g: 4, fat_g: 1, carbs_g: 20, category: 'bread', gram_per_piece: 50 },
  { name: 'Weißbrot', name_en: 'White Bread', quantity: 1, unit: 'Scheibe', calories: 75, protein_g: 2, fat_g: 1, carbs_g: 14, category: 'bread', gram_per_piece: 30 },
  { name: 'Leinsamenbrot', name_en: 'Linseed Bread', quantity: 1, unit: 'Scheibe', calories: 120, protein_g: 5, fat_g: 3, carbs_g: 17, category: 'bread', gram_per_piece: 55 },
  { name: 'Roggenbrot', name_en: 'Rye Bread', quantity: 1, unit: 'Scheibe', calories: 95, protein_g: 3, fat_g: 1, carbs_g: 18, category: 'bread', gram_per_piece: 45 },
  { name: 'Dinkelbrot', name_en: 'Spelt Bread', quantity: 1, unit: 'Scheibe', calories: 105, protein_g: 4, fat_g: 1, carbs_g: 19, category: 'bread', gram_per_piece: 50 },
  { name: 'Pumpernickel', name_en: 'Pumpernickel', quantity: 1, unit: 'Scheibe', calories: 80, protein_g: 3, fat_g: 0, carbs_g: 16, category: 'bread', gram_per_piece: 40 },
  { name: 'Eiweißbrot', name_en: 'Protein Bread', quantity: 1, unit: 'Scheibe', calories: 110, protein_g: 11, fat_g: 5, carbs_g: 4, category: 'bread', gram_per_piece: 45 },
  { name: 'Knäckebrot', name_en: 'Crispbread', quantity: 1, unit: 'Scheibe', calories: 40, protein_g: 1, fat_g: 0, carbs_g: 8, category: 'bread', gram_per_piece: 12 },
  { name: 'Ciabatta', name_en: 'Ciabatta', quantity: 1, unit: 'Stück', calories: 180, protein_g: 6, fat_g: 2, carbs_g: 34, category: 'bread', gram_per_piece: 70 },
  { name: 'Mehrkornbrötchen', name_en: 'Multigrain Roll', quantity: 1, unit: 'Stück', calories: 160, protein_g: 6, fat_g: 2, carbs_g: 28, category: 'bread', gram_per_piece: 65 },
  { name: 'Kürbiskernbrot', name_en: 'Pumpkin Seed Bread', quantity: 1, unit: 'Scheibe', calories: 125, protein_g: 5, fat_g: 4, carbs_g: 17, category: 'bread', gram_per_piece: 55 },
  { name: 'Sonnenblumenkernbrot', name_en: 'Sunflower Seed Bread', quantity: 1, unit: 'Scheibe', calories: 120, protein_g: 5, fat_g: 3, carbs_g: 18, category: 'bread', gram_per_piece: 55 },
  { name: 'Brötchen', name_en: 'Roll', quantity: 1, unit: 'Stück', calories: 150, protein_g: 5, fat_g: 1, carbs_g: 28, category: 'bread', gram_per_piece: 55 },
  { name: 'Croissant', name_en: 'Croissant', quantity: 1, unit: 'Stück', calories: 230, protein_g: 5, fat_g: 12, carbs_g: 26, category: 'bread', gram_per_piece: 60 },
  { name: 'Toast', name_en: 'Toast', quantity: 1, unit: 'Scheibe', calories: 65, protein_g: 2, fat_g: 1, carbs_g: 12, category: 'bread', gram_per_piece: 25 },
  { name: 'Laugenstange', name_en: 'Pretzel Stick', quantity: 1, unit: 'Stück', calories: 190, protein_g: 6, fat_g: 2, carbs_g: 35, category: 'bread', gram_per_piece: 75 },
  { name: 'Laugenbrötchen', name_en: 'Pretzel Roll', quantity: 1, unit: 'Stück', calories: 175, protein_g: 6, fat_g: 2, carbs_g: 32, category: 'bread', gram_per_piece: 70 },
  { name: 'Baguette', name_en: 'Baguette', quantity: 100, unit: 'g', calories: 270, protein_g: 9, fat_g: 1, carbs_g: 54, category: 'bread' },
  { name: 'Fladenbrot', name_en: 'Flatbread', quantity: 100, unit: 'g', calories: 275, protein_g: 8, fat_g: 3, carbs_g: 52, category: 'bread' },
  { name: 'Tortilla Wrap', name_en: 'Tortilla Wrap', quantity: 1, unit: 'Stück', calories: 130, protein_g: 3, fat_g: 3, carbs_g: 22, category: 'bread', gram_per_piece: 60 },

  // Aufschnitt / Toppings
  { name: 'Butter', name_en: 'Butter', quantity: 10, unit: 'g', calories: 74, protein_g: 0, fat_g: 8, carbs_g: 0, category: 'toppings' },
  { name: 'Margarine', name_en: 'Margarine', quantity: 10, unit: 'g', calories: 72, protein_g: 0, fat_g: 8, carbs_g: 0.1, category: 'toppings' },
  { name: 'Halbfettmargarine', name_en: 'Low-fat Margarine', quantity: 10, unit: 'g', calories: 36, protein_g: 0, fat_g: 4, carbs_g: 0.1, category: 'toppings' },
  { name: 'Rama Original', name_en: 'Rama Original', quantity: 10, unit: 'g', calories: 62, protein_g: 0, fat_g: 7, carbs_g: 0.1, category: 'toppings' },
  { name: 'Lätta', name_en: 'Lätta', quantity: 10, unit: 'g', calories: 35, protein_g: 0, fat_g: 4, carbs_g: 0.1, category: 'toppings' },
  { name: 'Halbfettbutter', name_en: 'Half-fat Butter', quantity: 10, unit: 'g', calories: 37, protein_g: 0, fat_g: 4, carbs_g: 0, category: 'toppings' },
  { name: 'Butterschmalz / Ghee', name_en: 'Clarified Butter / Ghee', quantity: 10, unit: 'g', calories: 90, protein_g: 0, fat_g: 10, carbs_g: 0, category: 'toppings' },
  { name: 'Kokosöl', name_en: 'Coconut Oil', quantity: 10, unit: 'g', calories: 86, protein_g: 0, fat_g: 10, carbs_g: 0, category: 'toppings' },
  { name: 'Olivenöl', name_en: 'Olive Oil', quantity: 10, unit: 'ml', calories: 82, protein_g: 0, fat_g: 9, carbs_g: 0, category: 'toppings' },
  { name: 'Sonnenblumenöl', name_en: 'Sunflower Oil', quantity: 10, unit: 'ml', calories: 82, protein_g: 0, fat_g: 9, carbs_g: 0, category: 'toppings' },
  { name: 'Rapsöl', name_en: 'Rapeseed Oil', quantity: 10, unit: 'ml', calories: 82, protein_g: 0, fat_g: 9, carbs_g: 0, category: 'toppings' },
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
  { name: 'Dr. Oetker Ristorante Pizza', name_en: 'Dr. Oetker Ristorante Pizza', quantity: 1, unit: 'Stück', calories: 780, protein_g: 28, fat_g: 26, carbs_g: 96, category: 'brands', gram_per_piece: 340 },
  { name: 'Wagner Pizza', name_en: 'Wagner Pizza', quantity: 1, unit: 'Stück', calories: 820, protein_g: 30, fat_g: 30, carbs_g: 95, category: 'brands', gram_per_piece: 350 },
  { name: 'Haribo Goldbären', name_en: 'Haribo Gummy Bears', quantity: 25, unit: 'g', calories: 85, protein_g: 2, fat_g: 0, carbs_g: 20, category: 'brands' },
  { name: 'Kinder Bueno', name_en: 'Kinder Bueno', quantity: 1, unit: 'Stück', calories: 122, protein_g: 2, fat_g: 8, carbs_g: 10, category: 'brands', gram_per_piece: 21.5 },
  { name: 'Knoppers', name_en: 'Knoppers', quantity: 1, unit: 'Stück', calories: 137, protein_g: 2, fat_g: 8, carbs_g: 14, category: 'brands', gram_per_piece: 25 },
  { name: 'Milka Schokolade', name_en: 'Milka Chocolate', quantity: 25, unit: 'g', calories: 134, protein_g: 2, fat_g: 8, carbs_g: 14, category: 'brands' },
  { name: 'Ritter Sport', name_en: 'Ritter Sport', quantity: 25, unit: 'g', calories: 138, protein_g: 2, fat_g: 8, carbs_g: 14, category: 'brands' },
  { name: 'Alpro Sojajoghurt', name_en: 'Alpro Soy Yogurt', quantity: 150, unit: 'g', calories: 65, protein_g: 6, fat_g: 3, carbs_g: 2, category: 'brands' },
  { name: 'Alpro Hafermilch', name_en: 'Alpro Oat Milk', quantity: 200, unit: 'ml', calories: 92, protein_g: 1, fat_g: 3, carbs_g: 14, category: 'brands' },
  { name: 'Oatly Hafermilch', name_en: 'Oatly Oat Milk', quantity: 200, unit: 'ml', calories: 96, protein_g: 1, fat_g: 3, carbs_g: 14, category: 'brands' },
  { name: 'Activia Joghurt', name_en: 'Activia Yogurt', quantity: 150, unit: 'g', calories: 108, protein_g: 5, fat_g: 3, carbs_g: 15, category: 'brands' },
  { name: 'Müller Milchreis', name_en: 'Müller Rice Pudding', quantity: 200, unit: 'g', calories: 220, protein_g: 6, fat_g: 5, carbs_g: 38, category: 'brands' },
  { name: 'Iglo Fischstäbchen', name_en: 'Iglo Fish Fingers', quantity: 4, unit: 'Stück', calories: 220, protein_g: 12, fat_g: 10, carbs_g: 20, category: 'brands', gram_per_piece: 30 },
  { name: 'McCain Pommes', name_en: 'McCain French Fries', quantity: 150, unit: 'g', calories: 230, protein_g: 3, fat_g: 8, carbs_g: 36, category: 'brands' },

  // Eigenmarken / Store Brands – EDEKA (Gut & Günstig, Gut Bio)
  { name: 'Gut & Günstig Vollmilch', name_en: 'Gut & Günstig Whole Milk', quantity: 200, unit: 'ml', calories: 128, protein_g: 7, fat_g: 7, carbs_g: 10, category: 'brands' },
  { name: 'Gut & Günstig Butter', name_en: 'Gut & Günstig Butter', quantity: 10, unit: 'g', calories: 74, protein_g: 0, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'Gut & Günstig Gouda', name_en: 'Gut & Günstig Gouda', quantity: 30, unit: 'g', calories: 105, protein_g: 7, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'Gut & Günstig Toastbrot', name_en: 'Gut & Günstig Toast', quantity: 1, unit: 'Scheibe', calories: 65, protein_g: 2, fat_g: 1, carbs_g: 12, category: 'brands', gram_per_piece: 25 },
  { name: 'Gut & Günstig Reis', name_en: 'Gut & Günstig Rice', quantity: 200, unit: 'g', calories: 260, protein_g: 5, fat_g: 1, carbs_g: 57, category: 'brands' },
  { name: 'Gut & Günstig Spaghetti (gekocht)', name_en: 'Gut & Günstig Spaghetti (cooked)', quantity: 200, unit: 'g', calories: 280, protein_g: 10, fat_g: 2, carbs_g: 55, category: 'brands' },
  { name: 'Gut & Günstig Hähnchenbrust', name_en: 'Gut & Günstig Chicken Breast', quantity: 150, unit: 'g', calories: 165, protein_g: 31, fat_g: 4, carbs_g: 0, category: 'brands' },
  { name: 'Gut & Günstig Kochschinken', name_en: 'Gut & Günstig Cooked Ham', quantity: 30, unit: 'g', calories: 35, protein_g: 6, fat_g: 1, carbs_g: 0, category: 'brands' },
  { name: 'Gut & Günstig Salami', name_en: 'Gut & Günstig Salami', quantity: 30, unit: 'g', calories: 120, protein_g: 7, fat_g: 10, carbs_g: 0, category: 'brands' },
  { name: 'Gut & Günstig Thunfisch', name_en: 'Gut & Günstig Canned Tuna', quantity: 100, unit: 'g', calories: 110, protein_g: 25, fat_g: 1, carbs_g: 0, category: 'brands' },
  { name: 'Gut & Günstig Haferflocken', name_en: 'Gut & Günstig Oats', quantity: 50, unit: 'g', calories: 190, protein_g: 7, fat_g: 3, carbs_g: 33, category: 'brands' },
  { name: 'Gut & Günstig Chips', name_en: 'Gut & Günstig Chips', quantity: 30, unit: 'g', calories: 160, protein_g: 2, fat_g: 10, carbs_g: 15, category: 'brands' },
  { name: 'Gut Bio Hafermilch', name_en: 'Gut Bio Oat Milk', quantity: 200, unit: 'ml', calories: 92, protein_g: 1, fat_g: 3, carbs_g: 14, category: 'brands' },
  { name: 'Gut Bio Joghurt Natur', name_en: 'Gut Bio Plain Yogurt', quantity: 150, unit: 'g', calories: 92, protein_g: 5, fat_g: 5, carbs_g: 7, category: 'brands' },

  // Eigenmarken / Store Brands – REWE (Ja!, REWE Bio, Beste Wahl)
  { name: 'Ja! Magerquark', name_en: 'Ja! Low-fat Quark', quantity: 250, unit: 'g', calories: 167, protein_g: 30, fat_g: 0, carbs_g: 10, category: 'brands' },
  { name: 'Ja! Vollmilch', name_en: 'Ja! Whole Milk', quantity: 200, unit: 'ml', calories: 128, protein_g: 7, fat_g: 7, carbs_g: 10, category: 'brands' },
  { name: 'Ja! Gouda', name_en: 'Ja! Gouda', quantity: 30, unit: 'g', calories: 105, protein_g: 7, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'Ja! Butter', name_en: 'Ja! Butter', quantity: 10, unit: 'g', calories: 74, protein_g: 0, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'Ja! Naturjoghurt', name_en: 'Ja! Plain Yogurt', quantity: 150, unit: 'g', calories: 92, protein_g: 5, fat_g: 5, carbs_g: 7, category: 'brands' },
  { name: 'Ja! Reis', name_en: 'Ja! Rice', quantity: 200, unit: 'g', calories: 260, protein_g: 5, fat_g: 1, carbs_g: 57, category: 'brands' },
  { name: 'Ja! Spaghetti (gekocht)', name_en: 'Ja! Spaghetti (cooked)', quantity: 200, unit: 'g', calories: 280, protein_g: 10, fat_g: 2, carbs_g: 55, category: 'brands' },
  { name: 'Ja! Kochschinken', name_en: 'Ja! Cooked Ham', quantity: 30, unit: 'g', calories: 35, protein_g: 6, fat_g: 1, carbs_g: 0, category: 'brands' },
  { name: 'Ja! Salami', name_en: 'Ja! Salami', quantity: 30, unit: 'g', calories: 120, protein_g: 7, fat_g: 10, carbs_g: 0, category: 'brands' },
  { name: 'Ja! Thunfisch', name_en: 'Ja! Canned Tuna', quantity: 100, unit: 'g', calories: 110, protein_g: 25, fat_g: 1, carbs_g: 0, category: 'brands' },
  { name: 'Ja! Chips', name_en: 'Ja! Chips', quantity: 30, unit: 'g', calories: 160, protein_g: 2, fat_g: 10, carbs_g: 15, category: 'brands' },
  { name: 'REWE Bio Haferflocken', name_en: 'REWE Bio Oats', quantity: 50, unit: 'g', calories: 190, protein_g: 7, fat_g: 3, carbs_g: 33, category: 'brands' },
  { name: 'REWE Beste Wahl Hähnchenbrust', name_en: 'REWE Beste Wahl Chicken Breast', quantity: 150, unit: 'g', calories: 165, protein_g: 31, fat_g: 4, carbs_g: 0, category: 'brands' },
  { name: 'REWE Beste Wahl Lachs', name_en: 'REWE Beste Wahl Salmon', quantity: 150, unit: 'g', calories: 310, protein_g: 30, fat_g: 20, carbs_g: 0, category: 'brands' },

  // Eigenmarken / Store Brands – LIDL (Milbona, Solevita, Combino, Metzgerfrisch)
  { name: 'Milbona Vollmilch', name_en: 'Milbona Whole Milk', quantity: 200, unit: 'ml', calories: 128, protein_g: 7, fat_g: 7, carbs_g: 10, category: 'brands' },
  { name: 'Milbona Magerquark', name_en: 'Milbona Low-fat Quark', quantity: 250, unit: 'g', calories: 167, protein_g: 30, fat_g: 0, carbs_g: 10, category: 'brands' },
  { name: 'Milbona Butter', name_en: 'Milbona Butter', quantity: 10, unit: 'g', calories: 74, protein_g: 0, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'Milbona Gouda', name_en: 'Milbona Gouda', quantity: 30, unit: 'g', calories: 105, protein_g: 7, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'Milbona Griechischer Joghurt', name_en: 'Milbona Greek Yogurt', quantity: 150, unit: 'g', calories: 145, protein_g: 13, fat_g: 8, carbs_g: 5, category: 'brands' },
  { name: 'Milbona Mozzarella', name_en: 'Milbona Mozzarella', quantity: 30, unit: 'g', calories: 85, protein_g: 6, fat_g: 6, carbs_g: 1, category: 'brands' },
  { name: 'Combino Spaghetti (gekocht)', name_en: 'Combino Spaghetti (cooked)', quantity: 200, unit: 'g', calories: 280, protein_g: 10, fat_g: 2, carbs_g: 55, category: 'brands' },
  { name: 'Combino Penne (gekocht)', name_en: 'Combino Penne (cooked)', quantity: 200, unit: 'g', calories: 280, protein_g: 10, fat_g: 2, carbs_g: 55, category: 'brands' },
  { name: 'Metzgerfrisch Kochschinken', name_en: 'Metzgerfrisch Cooked Ham', quantity: 30, unit: 'g', calories: 35, protein_g: 6, fat_g: 1, carbs_g: 0, category: 'brands' },
  { name: 'Metzgerfrisch Salami', name_en: 'Metzgerfrisch Salami', quantity: 30, unit: 'g', calories: 120, protein_g: 7, fat_g: 10, carbs_g: 0, category: 'brands' },
  { name: 'Metzgerfrisch Putenbrust', name_en: 'Metzgerfrisch Turkey Breast', quantity: 30, unit: 'g', calories: 30, protein_g: 6, fat_g: 0.5, carbs_g: 0, category: 'brands' },
  { name: 'Solevita Orangensaft', name_en: 'Solevita Orange Juice', quantity: 200, unit: 'ml', calories: 90, protein_g: 1, fat_g: 0, carbs_g: 21, category: 'brands' },
  { name: 'Solevita Apfelsaft', name_en: 'Solevita Apple Juice', quantity: 200, unit: 'ml', calories: 92, protein_g: 0, fat_g: 0, carbs_g: 22, category: 'brands' },

  // Eigenmarken / Store Brands – ALDI (Milfina, K-Classic, Meine Metzgerei)
  { name: 'Milfina Vollmilch', name_en: 'Milfina Whole Milk', quantity: 200, unit: 'ml', calories: 128, protein_g: 7, fat_g: 7, carbs_g: 10, category: 'brands' },
  { name: 'Milfina Magerquark', name_en: 'Milfina Low-fat Quark', quantity: 250, unit: 'g', calories: 167, protein_g: 30, fat_g: 0, carbs_g: 10, category: 'brands' },
  { name: 'Milfina Butter', name_en: 'Milfina Butter', quantity: 10, unit: 'g', calories: 74, protein_g: 0, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'Milfina Joghurt Natur', name_en: 'Milfina Plain Yogurt', quantity: 150, unit: 'g', calories: 92, protein_g: 5, fat_g: 5, carbs_g: 7, category: 'brands' },
  { name: 'Milfina Gouda', name_en: 'Milfina Gouda', quantity: 30, unit: 'g', calories: 105, protein_g: 7, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'Meine Metzgerei Kochschinken', name_en: 'Meine Metzgerei Cooked Ham', quantity: 30, unit: 'g', calories: 35, protein_g: 6, fat_g: 1, carbs_g: 0, category: 'brands' },
  { name: 'Meine Metzgerei Salami', name_en: 'Meine Metzgerei Salami', quantity: 30, unit: 'g', calories: 120, protein_g: 7, fat_g: 10, carbs_g: 0, category: 'brands' },
  { name: 'Meine Metzgerei Putenbrust', name_en: 'Meine Metzgerei Turkey Breast', quantity: 30, unit: 'g', calories: 30, protein_g: 6, fat_g: 0.5, carbs_g: 0, category: 'brands' },
  { name: 'K-Classic Vollmilch', name_en: 'K-Classic Whole Milk', quantity: 200, unit: 'ml', calories: 128, protein_g: 7, fat_g: 7, carbs_g: 10, category: 'brands' },
  { name: 'K-Classic Magerquark', name_en: 'K-Classic Low-fat Quark', quantity: 250, unit: 'g', calories: 167, protein_g: 30, fat_g: 0, carbs_g: 10, category: 'brands' },
  { name: 'K-Classic Butter', name_en: 'K-Classic Butter', quantity: 10, unit: 'g', calories: 74, protein_g: 0, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'K-Classic Reis', name_en: 'K-Classic Rice', quantity: 200, unit: 'g', calories: 260, protein_g: 5, fat_g: 1, carbs_g: 57, category: 'brands' },
  { name: 'K-Classic Spaghetti (gekocht)', name_en: 'K-Classic Spaghetti (cooked)', quantity: 200, unit: 'g', calories: 280, protein_g: 10, fat_g: 2, carbs_g: 55, category: 'brands' },
  { name: 'K-Classic Chips', name_en: 'K-Classic Chips', quantity: 30, unit: 'g', calories: 160, protein_g: 2, fat_g: 10, carbs_g: 15, category: 'brands' },

  // Eigenmarken / Store Brands – Österreich (S-Budget, Clever, SPAR)
  { name: 'S-Budget Vollmilch', name_en: 'S-Budget Whole Milk', quantity: 200, unit: 'ml', calories: 128, protein_g: 7, fat_g: 7, carbs_g: 10, category: 'brands' },
  { name: 'S-Budget Butter', name_en: 'S-Budget Butter', quantity: 10, unit: 'g', calories: 74, protein_g: 0, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'S-Budget Gouda', name_en: 'S-Budget Gouda', quantity: 30, unit: 'g', calories: 105, protein_g: 7, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'S-Budget Joghurt Natur', name_en: 'S-Budget Plain Yogurt', quantity: 150, unit: 'g', calories: 92, protein_g: 5, fat_g: 5, carbs_g: 7, category: 'brands' },
  { name: 'S-Budget Toast', name_en: 'S-Budget Toast', quantity: 1, unit: 'Scheibe', calories: 65, protein_g: 2, fat_g: 1, carbs_g: 12, category: 'brands', gram_per_piece: 25 },
  { name: 'S-Budget Reis', name_en: 'S-Budget Rice', quantity: 200, unit: 'g', calories: 260, protein_g: 5, fat_g: 1, carbs_g: 57, category: 'brands' },
  { name: 'S-Budget Spaghetti (gekocht)', name_en: 'S-Budget Spaghetti (cooked)', quantity: 200, unit: 'g', calories: 280, protein_g: 10, fat_g: 2, carbs_g: 55, category: 'brands' },
  { name: 'S-Budget Kochschinken', name_en: 'S-Budget Cooked Ham', quantity: 30, unit: 'g', calories: 35, protein_g: 6, fat_g: 1, carbs_g: 0, category: 'brands' },
  { name: 'S-Budget Salami', name_en: 'S-Budget Salami', quantity: 30, unit: 'g', calories: 120, protein_g: 7, fat_g: 10, carbs_g: 0, category: 'brands' },
  { name: 'S-Budget Thunfisch', name_en: 'S-Budget Canned Tuna', quantity: 100, unit: 'g', calories: 110, protein_g: 25, fat_g: 1, carbs_g: 0, category: 'brands' },
  { name: 'S-Budget Chips', name_en: 'S-Budget Chips', quantity: 30, unit: 'g', calories: 160, protein_g: 2, fat_g: 10, carbs_g: 15, category: 'brands' },
  { name: 'SPAR Natur*pur Bio Hafermilch', name_en: 'SPAR Organic Oat Milk', quantity: 200, unit: 'ml', calories: 92, protein_g: 1, fat_g: 3, carbs_g: 14, category: 'brands' },
  { name: 'SPAR Hähnchenbrust', name_en: 'SPAR Chicken Breast', quantity: 150, unit: 'g', calories: 165, protein_g: 31, fat_g: 4, carbs_g: 0, category: 'brands' },
  { name: 'Clever Vollmilch', name_en: 'Clever Whole Milk', quantity: 200, unit: 'ml', calories: 128, protein_g: 7, fat_g: 7, carbs_g: 10, category: 'brands' },
  { name: 'Clever Butter', name_en: 'Clever Butter', quantity: 10, unit: 'g', calories: 74, protein_g: 0, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'Clever Gouda', name_en: 'Clever Gouda', quantity: 30, unit: 'g', calories: 105, protein_g: 7, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'Clever Toastbrot', name_en: 'Clever Toast', quantity: 1, unit: 'Scheibe', calories: 65, protein_g: 2, fat_g: 1, carbs_g: 12, category: 'brands', gram_per_piece: 25 },
  { name: 'Clever Reis', name_en: 'Clever Rice', quantity: 200, unit: 'g', calories: 260, protein_g: 5, fat_g: 1, carbs_g: 57, category: 'brands' },
  { name: 'Clever Spaghetti (gekocht)', name_en: 'Clever Spaghetti (cooked)', quantity: 200, unit: 'g', calories: 280, protein_g: 10, fat_g: 2, carbs_g: 55, category: 'brands' },
  { name: 'Clever Kochschinken', name_en: 'Clever Cooked Ham', quantity: 30, unit: 'g', calories: 35, protein_g: 6, fat_g: 1, carbs_g: 0, category: 'brands' },
  { name: 'Clever Thunfisch', name_en: 'Clever Canned Tuna', quantity: 100, unit: 'g', calories: 110, protein_g: 25, fat_g: 1, carbs_g: 0, category: 'brands' },

  // Eigenmarken / Store Brands – Schweiz (M-Budget, Prix Garantie)
  { name: 'M-Budget Vollmilch', name_en: 'M-Budget Whole Milk', quantity: 200, unit: 'ml', calories: 128, protein_g: 7, fat_g: 7, carbs_g: 10, category: 'brands' },
  { name: 'M-Budget Butter', name_en: 'M-Budget Butter', quantity: 10, unit: 'g', calories: 74, protein_g: 0, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'M-Budget Joghurt Natur', name_en: 'M-Budget Plain Yogurt', quantity: 150, unit: 'g', calories: 92, protein_g: 5, fat_g: 5, carbs_g: 7, category: 'brands' },
  { name: 'M-Budget Reis', name_en: 'M-Budget Rice', quantity: 200, unit: 'g', calories: 260, protein_g: 5, fat_g: 1, carbs_g: 57, category: 'brands' },
  { name: 'M-Budget Spaghetti (gekocht)', name_en: 'M-Budget Spaghetti (cooked)', quantity: 200, unit: 'g', calories: 280, protein_g: 10, fat_g: 2, carbs_g: 55, category: 'brands' },
  { name: 'M-Budget Poulet Brust', name_en: 'M-Budget Chicken Breast', quantity: 150, unit: 'g', calories: 165, protein_g: 31, fat_g: 4, carbs_g: 0, category: 'brands' },
  { name: 'Prix Garantie Vollmilch', name_en: 'Prix Garantie Whole Milk', quantity: 200, unit: 'ml', calories: 128, protein_g: 7, fat_g: 7, carbs_g: 10, category: 'brands' },
  { name: 'Prix Garantie Butter', name_en: 'Prix Garantie Butter', quantity: 10, unit: 'g', calories: 74, protein_g: 0, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'Prix Garantie Reis', name_en: 'Prix Garantie Rice', quantity: 200, unit: 'g', calories: 260, protein_g: 5, fat_g: 1, carbs_g: 57, category: 'brands' },

  // Eigenmarken / Store Brands – Spanien (Hacendado)
  { name: 'Hacendado Leche Entera', name_en: 'Hacendado Whole Milk', quantity: 200, unit: 'ml', calories: 128, protein_g: 7, fat_g: 7, carbs_g: 10, category: 'brands' },
  { name: 'Hacendado Yogur Natural', name_en: 'Hacendado Plain Yogurt', quantity: 150, unit: 'g', calories: 92, protein_g: 5, fat_g: 5, carbs_g: 7, category: 'brands' },
  { name: 'Hacendado Queso Fresco', name_en: 'Hacendado Fresh Cheese', quantity: 30, unit: 'g', calories: 75, protein_g: 2, fat_g: 7, carbs_g: 1, category: 'brands' },
  { name: 'Hacendado Arroz', name_en: 'Hacendado Rice', quantity: 200, unit: 'g', calories: 260, protein_g: 5, fat_g: 1, carbs_g: 57, category: 'brands' },
  { name: 'Hacendado Pechuga de Pollo', name_en: 'Hacendado Chicken Breast', quantity: 150, unit: 'g', calories: 165, protein_g: 31, fat_g: 4, carbs_g: 0, category: 'brands' },
  { name: 'Hacendado Atún', name_en: 'Hacendado Canned Tuna', quantity: 100, unit: 'g', calories: 110, protein_g: 25, fat_g: 1, carbs_g: 0, category: 'brands' },
  { name: 'Hacendado Jamón Cocido', name_en: 'Hacendado Cooked Ham', quantity: 30, unit: 'g', calories: 35, protein_g: 6, fat_g: 1, carbs_g: 0, category: 'brands' },

  // Eier / Eggs
  { name: 'Ei gekocht', name_en: 'Boiled Egg', quantity: 1, unit: 'Stück', calories: 78, protein_g: 6, fat_g: 5, carbs_g: 1, category: 'eggs', gram_per_piece: 60 },
  { name: 'Spiegelei', name_en: 'Fried Egg', quantity: 1, unit: 'Stück', calories: 95, protein_g: 6, fat_g: 7, carbs_g: 1, category: 'eggs', gram_per_piece: 60 },
  { name: 'Rührei (2 Eier)', name_en: 'Scrambled Eggs (2)', quantity: 2, unit: 'Stück', calories: 200, protein_g: 14, fat_g: 15, carbs_g: 2, category: 'eggs', gram_per_piece: 60 },
  { name: 'Omelette', name_en: 'Omelette', quantity: 1, unit: 'Stück', calories: 180, protein_g: 12, fat_g: 14, carbs_g: 1, category: 'eggs', gram_per_piece: 120 },

  // Obst / Fruit
  { name: 'Apfel', name_en: 'Apple', quantity: 1, unit: 'Stück', calories: 72, protein_g: 0, fat_g: 0, carbs_g: 19, category: 'fruit', gram_per_piece: 150 },
  { name: 'Banane', name_en: 'Banana', quantity: 1, unit: 'Stück', calories: 105, protein_g: 1, fat_g: 0, carbs_g: 27, category: 'fruit', gram_per_piece: 120 },
  { name: 'Orange', name_en: 'Orange', quantity: 1, unit: 'Stück', calories: 62, protein_g: 1, fat_g: 0, carbs_g: 15, category: 'fruit', gram_per_piece: 130 },
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
  { name: 'Haferflocken', name_en: 'Oats', quantity: 1, unit: 'Portion', calories: 152, protein_g: 5.6, fat_g: 2.8, carbs_g: 26, category: 'cereal', gram_per_portion: 40 },
  { name: 'Müsli', name_en: 'Muesli', quantity: 1, unit: 'Portion', calories: 220, protein_g: 6, fat_g: 5, carbs_g: 38, category: 'cereal', gram_per_portion: 60 },
  { name: 'Granola', name_en: 'Granola', quantity: 1, unit: 'Portion', calories: 230, protein_g: 5, fat_g: 9, carbs_g: 32, category: 'cereal', gram_per_portion: 50 },
  { name: 'Protein Müsli', name_en: 'Protein Muesli', quantity: 1, unit: 'Portion', calories: 195, protein_g: 15, fat_g: 4, carbs_g: 25, category: 'cereal', gram_per_portion: 60 },
  { name: 'Overnight Oats', name_en: 'Overnight Oats', quantity: 1, unit: 'Portion', calories: 250, protein_g: 10, fat_g: 7, carbs_g: 35, category: 'cereal', gram_per_portion: 200 },
  { name: 'Porridge', name_en: 'Porridge', quantity: 1, unit: 'Portion', calories: 180, protein_g: 6, fat_g: 3, carbs_g: 30, category: 'cereal', gram_per_portion: 250 },

  // Fleisch / Meat
  { name: 'Hähnchenbrust', name_en: 'Chicken Breast', quantity: 150, unit: 'g', calories: 165, protein_g: 31, fat_g: 4, carbs_g: 0, category: 'meat' },
  { name: 'Rindfleisch', name_en: 'Beef', quantity: 150, unit: 'g', calories: 250, protein_g: 26, fat_g: 15, carbs_g: 0, category: 'meat' },
  { name: 'Hackfleisch (gemischt)', name_en: 'Mixed Ground Meat', quantity: 150, unit: 'g', calories: 340, protein_g: 23, fat_g: 27, carbs_g: 0, category: 'meat' },
  { name: 'Schweinefilet', name_en: 'Pork Tenderloin', quantity: 150, unit: 'g', calories: 185, protein_g: 30, fat_g: 6, carbs_g: 0, category: 'meat' },
  { name: 'Bratwurst', name_en: 'Bratwurst', quantity: 1, unit: 'Stück', calories: 310, protein_g: 14, fat_g: 27, carbs_g: 2, category: 'meat', gram_per_piece: 120 },
  { name: 'Frikadelle', name_en: 'Meatball', quantity: 1, unit: 'Stück', calories: 220, protein_g: 15, fat_g: 15, carbs_g: 8, category: 'meat', gram_per_piece: 100 },
  { name: 'Lammkeule', name_en: 'Leg of Lamb', quantity: 150, unit: 'g', calories: 290, protein_g: 25, fat_g: 21, carbs_g: 0, category: 'meat' },
  { name: 'Lammkotelett', name_en: 'Lamb Chop', quantity: 1, unit: 'Stück', calories: 230, protein_g: 20, fat_g: 16, carbs_g: 0, category: 'meat', gram_per_piece: 100 },
  { name: 'Lammfilet', name_en: 'Lamb Fillet', quantity: 150, unit: 'g', calories: 240, protein_g: 28, fat_g: 14, carbs_g: 0, category: 'meat' },
  { name: 'Lammhackfleisch', name_en: 'Ground Lamb', quantity: 150, unit: 'g', calories: 375, protein_g: 24, fat_g: 30, carbs_g: 0, category: 'meat' },
  { name: 'Lammschulter', name_en: 'Lamb Shoulder', quantity: 150, unit: 'g', calories: 310, protein_g: 24, fat_g: 23, carbs_g: 0, category: 'meat' },
  { name: 'Lammrücken', name_en: 'Lamb Rack', quantity: 150, unit: 'g', calories: 270, protein_g: 26, fat_g: 18, carbs_g: 0, category: 'meat' },

  // Ente / Duck
  { name: 'Entenbrust', name_en: 'Duck Breast', quantity: 150, unit: 'g', calories: 337, protein_g: 28, fat_g: 24, carbs_g: 0, category: 'meat' },
  { name: 'Entenbrust ohne Haut', name_en: 'Duck Breast (skinless)', quantity: 150, unit: 'g', calories: 200, protein_g: 30, fat_g: 9, carbs_g: 0, category: 'meat' },
  { name: 'Entenkeule', name_en: 'Duck Leg', quantity: 1, unit: 'Stück', calories: 430, protein_g: 28, fat_g: 35, carbs_g: 0, category: 'meat', gram_per_piece: 200 },
  { name: 'Ente (ganz, gebraten)', name_en: 'Roast Duck', quantity: 150, unit: 'g', calories: 340, protein_g: 26, fat_g: 26, carbs_g: 0, category: 'meat' },
  { name: 'Entenbrustfilet geräuchert', name_en: 'Smoked Duck Breast', quantity: 50, unit: 'g', calories: 105, protein_g: 15, fat_g: 5, carbs_g: 0, category: 'meat' },
  { name: 'Entenleber', name_en: 'Duck Liver', quantity: 100, unit: 'g', calories: 136, protein_g: 19, fat_g: 5, carbs_g: 3, category: 'meat' },

  // Gans / Goose
  { name: 'Gänsebrust', name_en: 'Goose Breast', quantity: 150, unit: 'g', calories: 350, protein_g: 29, fat_g: 25, carbs_g: 0, category: 'meat' },
  { name: 'Gänsekeule', name_en: 'Goose Leg', quantity: 1, unit: 'Stück', calories: 530, protein_g: 30, fat_g: 45, carbs_g: 0, category: 'meat', gram_per_piece: 250 },
  { name: 'Gänsebraten', name_en: 'Roast Goose', quantity: 150, unit: 'g', calories: 360, protein_g: 27, fat_g: 28, carbs_g: 0, category: 'meat' },
  { name: 'Gänseschmalz', name_en: 'Goose Fat', quantity: 15, unit: 'g', calories: 135, protein_g: 0, fat_g: 15, carbs_g: 0, category: 'meat' },
  { name: 'Gänseleber', name_en: 'Goose Liver', quantity: 100, unit: 'g', calories: 133, protein_g: 16, fat_g: 4, carbs_g: 6, category: 'meat' },
  { name: 'Foie Gras', name_en: 'Foie Gras', quantity: 50, unit: 'g', calories: 230, protein_g: 6, fat_g: 22, carbs_g: 2, category: 'meat' },

  // Kaninchen / Rabbit
  { name: 'Kaninchenfleisch', name_en: 'Rabbit Meat', quantity: 150, unit: 'g', calories: 215, protein_g: 32, fat_g: 9, carbs_g: 0, category: 'meat' },
  { name: 'Kaninchenkeule', name_en: 'Rabbit Leg', quantity: 1, unit: 'Stück', calories: 280, protein_g: 33, fat_g: 16, carbs_g: 0, category: 'meat', gram_per_piece: 180 },
  { name: 'Kaninchenrücken', name_en: 'Rabbit Saddle', quantity: 150, unit: 'g', calories: 195, protein_g: 33, fat_g: 7, carbs_g: 0, category: 'meat' },
  { name: 'Hasenfleisch', name_en: 'Hare Meat', quantity: 150, unit: 'g', calories: 230, protein_g: 30, fat_g: 12, carbs_g: 0, category: 'meat' },
  { name: 'Hasenkeule', name_en: 'Hare Leg', quantity: 1, unit: 'Stück', calories: 310, protein_g: 32, fat_g: 20, carbs_g: 0, category: 'meat', gram_per_piece: 200 },

  // Wild / Game
  { name: 'Wildschwein', name_en: 'Wild Boar', quantity: 150, unit: 'g', calories: 250, protein_g: 29, fat_g: 14, carbs_g: 0, category: 'meat' },
  { name: 'Wildschweinkeule', name_en: 'Wild Boar Leg', quantity: 150, unit: 'g', calories: 260, protein_g: 28, fat_g: 16, carbs_g: 0, category: 'meat' },
  { name: 'Wildgulasch', name_en: 'Game Goulash', quantity: 200, unit: 'g', calories: 340, protein_g: 36, fat_g: 16, carbs_g: 8, category: 'meat' },
  { name: 'Wildbraten', name_en: 'Roast Game', quantity: 150, unit: 'g', calories: 240, protein_g: 30, fat_g: 13, carbs_g: 0, category: 'meat' },
  { name: 'Wildragout', name_en: 'Game Ragout', quantity: 200, unit: 'g', calories: 320, protein_g: 34, fat_g: 14, carbs_g: 8, category: 'meat' },
  { name: 'Wildsalami', name_en: 'Game Salami', quantity: 30, unit: 'g', calories: 110, protein_g: 8, fat_g: 9, carbs_g: 0, category: 'meat' },

  // Reh / Venison (Roe Deer)
  { name: 'Rehkeule', name_en: 'Venison Leg', quantity: 150, unit: 'g', calories: 200, protein_g: 33, fat_g: 7, carbs_g: 0, category: 'meat' },
  { name: 'Rehrücken', name_en: 'Venison Saddle', quantity: 150, unit: 'g', calories: 185, protein_g: 34, fat_g: 5, carbs_g: 0, category: 'meat' },
  { name: 'Rehfilet', name_en: 'Venison Fillet', quantity: 150, unit: 'g', calories: 175, protein_g: 34, fat_g: 4, carbs_g: 0, category: 'meat' },
  { name: 'Rehschnitzel', name_en: 'Venison Schnitzel', quantity: 150, unit: 'g', calories: 190, protein_g: 33, fat_g: 6, carbs_g: 0, category: 'meat' },
  { name: 'Rehgulasch', name_en: 'Venison Goulash', quantity: 200, unit: 'g', calories: 310, protein_g: 38, fat_g: 10, carbs_g: 8, category: 'meat' },
  { name: 'Rehragout', name_en: 'Venison Ragout', quantity: 200, unit: 'g', calories: 290, protein_g: 36, fat_g: 8, carbs_g: 8, category: 'meat' },
  { name: 'Rehbraten', name_en: 'Roast Venison', quantity: 150, unit: 'g', calories: 195, protein_g: 33, fat_g: 6, carbs_g: 0, category: 'meat' },

  // Hirsch / Red Deer
  { name: 'Hirschfleisch', name_en: 'Red Deer Meat', quantity: 150, unit: 'g', calories: 210, protein_g: 32, fat_g: 9, carbs_g: 0, category: 'meat' },
  { name: 'Hirschkeule', name_en: 'Red Deer Leg', quantity: 150, unit: 'g', calories: 220, protein_g: 31, fat_g: 10, carbs_g: 0, category: 'meat' },
  { name: 'Hirschrücken', name_en: 'Red Deer Saddle', quantity: 150, unit: 'g', calories: 195, protein_g: 33, fat_g: 7, carbs_g: 0, category: 'meat' },
  { name: 'Hirschgulasch', name_en: 'Red Deer Goulash', quantity: 200, unit: 'g', calories: 330, protein_g: 36, fat_g: 12, carbs_g: 8, category: 'meat' },
  { name: 'Hirschsalami', name_en: 'Deer Salami', quantity: 30, unit: 'g', calories: 105, protein_g: 8, fat_g: 8, carbs_g: 0, category: 'meat' },

  // Fasan / Pheasant
  { name: 'Fasanenbrust', name_en: 'Pheasant Breast', quantity: 150, unit: 'g', calories: 195, protein_g: 33, fat_g: 7, carbs_g: 0, category: 'meat' },
  { name: 'Fasan (ganz)', name_en: 'Whole Pheasant', quantity: 150, unit: 'g', calories: 220, protein_g: 30, fat_g: 11, carbs_g: 0, category: 'meat' },

  // Wachtel / Quail
  { name: 'Wachtel', name_en: 'Quail', quantity: 1, unit: 'Stück', calories: 230, protein_g: 25, fat_g: 14, carbs_g: 0, category: 'meat', gram_per_piece: 150 },
  { name: 'Wachtelbrust', name_en: 'Quail Breast', quantity: 100, unit: 'g', calories: 134, protein_g: 22, fat_g: 5, carbs_g: 0, category: 'meat' },

  // Strauss / Ostrich
  { name: 'Straußensteak', name_en: 'Ostrich Steak', quantity: 150, unit: 'g', calories: 195, protein_g: 32, fat_g: 7, carbs_g: 0, category: 'meat' },
  { name: 'Straußenfilet', name_en: 'Ostrich Fillet', quantity: 150, unit: 'g', calories: 180, protein_g: 34, fat_g: 4, carbs_g: 0, category: 'meat' },

  // Pute / Truthahn / Turkey
  { name: 'Putenbrust', name_en: 'Turkey Breast', quantity: 150, unit: 'g', calories: 165, protein_g: 32, fat_g: 3, carbs_g: 0, category: 'meat' },
  { name: 'Putenkeule', name_en: 'Turkey Leg', quantity: 150, unit: 'g', calories: 230, protein_g: 28, fat_g: 13, carbs_g: 0, category: 'meat' },
  { name: 'Putenschnitzel', name_en: 'Turkey Schnitzel', quantity: 150, unit: 'g', calories: 170, protein_g: 33, fat_g: 3, carbs_g: 0, category: 'meat' },
  { name: 'Putenhackfleisch', name_en: 'Ground Turkey', quantity: 150, unit: 'g', calories: 240, protein_g: 27, fat_g: 14, carbs_g: 0, category: 'meat' },
  { name: 'Truthahnbrust', name_en: 'Turkey Breast', quantity: 150, unit: 'g', calories: 165, protein_g: 32, fat_g: 3, carbs_g: 0, category: 'meat' },

  // Weitere Fleischsorten / More Meats
  { name: 'Schweinebraten', name_en: 'Roast Pork', quantity: 150, unit: 'g', calories: 375, protein_g: 25, fat_g: 30, carbs_g: 0, category: 'meat' },
  { name: 'Schweineschnitzel', name_en: 'Pork Schnitzel', quantity: 150, unit: 'g', calories: 280, protein_g: 28, fat_g: 16, carbs_g: 5, category: 'meat' },
  { name: 'Schweinekotelett', name_en: 'Pork Chop', quantity: 1, unit: 'Stück', calories: 290, protein_g: 26, fat_g: 20, carbs_g: 0, category: 'meat', gram_per_piece: 150 },
  { name: 'Schweinehackfleisch', name_en: 'Ground Pork', quantity: 150, unit: 'g', calories: 390, protein_g: 22, fat_g: 33, carbs_g: 0, category: 'meat' },
  { name: 'Schweinebauch', name_en: 'Pork Belly', quantity: 150, unit: 'g', calories: 510, protein_g: 15, fat_g: 50, carbs_g: 0, category: 'meat' },
  { name: 'Kassler', name_en: 'Kassler (Smoked Pork)', quantity: 150, unit: 'g', calories: 260, protein_g: 28, fat_g: 16, carbs_g: 0, category: 'meat' },
  { name: 'Pulled Pork', name_en: 'Pulled Pork', quantity: 150, unit: 'g', calories: 340, protein_g: 26, fat_g: 24, carbs_g: 4, category: 'meat' },
  { name: 'Rinderfilet', name_en: 'Beef Fillet', quantity: 150, unit: 'g', calories: 270, protein_g: 32, fat_g: 15, carbs_g: 0, category: 'meat' },
  { name: 'Rindersteak', name_en: 'Beef Steak', quantity: 200, unit: 'g', calories: 370, protein_g: 40, fat_g: 22, carbs_g: 0, category: 'meat' },
  { name: 'Rindergulasch', name_en: 'Beef Goulash', quantity: 200, unit: 'g', calories: 350, protein_g: 30, fat_g: 18, carbs_g: 8, category: 'meat' },
  { name: 'Rinderhackfleisch', name_en: 'Ground Beef', quantity: 150, unit: 'g', calories: 340, protein_g: 26, fat_g: 26, carbs_g: 0, category: 'meat' },
  { name: 'Rinderroulade', name_en: 'Beef Roulade', quantity: 200, unit: 'g', calories: 360, protein_g: 32, fat_g: 20, carbs_g: 6, category: 'meat' },
  { name: 'Fleischkäse', name_en: 'Leberkäse', quantity: 1, unit: 'Stück', calories: 310, protein_g: 12, fat_g: 27, carbs_g: 3, category: 'meat', gram_per_piece: 100 },
  { name: 'Leberkäse', name_en: 'Leberkäse', quantity: 1, unit: 'Stück', calories: 310, protein_g: 12, fat_g: 27, carbs_g: 3, category: 'meat', gram_per_piece: 100 },
  { name: 'Gyros', name_en: 'Gyros', quantity: 150, unit: 'g', calories: 340, protein_g: 24, fat_g: 22, carbs_g: 8, category: 'meat' },
  { name: 'Döner Fleisch', name_en: 'Doner Meat', quantity: 150, unit: 'g', calories: 330, protein_g: 23, fat_g: 22, carbs_g: 6, category: 'meat' },
  { name: 'Cordon Bleu', name_en: 'Cordon Bleu', quantity: 1, unit: 'Stück', calories: 450, protein_g: 30, fat_g: 28, carbs_g: 14, category: 'meat', gram_per_piece: 200 },


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
  { name: 'Schalotten', name_en: 'Shallots', quantity: 30, unit: 'g', calories: 22, protein_g: 1, fat_g: 0, carbs_g: 5, category: 'vegetables' },
  { name: 'Zwiebel', name_en: 'Onion', quantity: 100, unit: 'g', calories: 40, protein_g: 1, fat_g: 0, carbs_g: 9, category: 'vegetables' },
  { name: 'Knoblauch', name_en: 'Garlic', quantity: 5, unit: 'g', calories: 7, protein_g: 0, fat_g: 0, carbs_g: 2, category: 'vegetables' },
  { name: 'Champignons', name_en: 'Mushrooms', quantity: 100, unit: 'g', calories: 22, protein_g: 3, fat_g: 0, carbs_g: 3, category: 'vegetables' },
  { name: 'Zucchini', name_en: 'Zucchini', quantity: 150, unit: 'g', calories: 26, protein_g: 2, fat_g: 0, carbs_g: 5, category: 'vegetables' },
  { name: 'Aubergine', name_en: 'Eggplant', quantity: 150, unit: 'g', calories: 38, protein_g: 1, fat_g: 0, carbs_g: 9, category: 'vegetables' },
  { name: 'Karotten', name_en: 'Carrots', quantity: 100, unit: 'g', calories: 41, protein_g: 1, fat_g: 0, carbs_g: 10, category: 'vegetables' },
  { name: 'Blumenkohl', name_en: 'Cauliflower', quantity: 150, unit: 'g', calories: 38, protein_g: 3, fat_g: 0, carbs_g: 8, category: 'vegetables' },
  { name: 'Lauch', name_en: 'Leek', quantity: 100, unit: 'g', calories: 31, protein_g: 2, fat_g: 0, carbs_g: 6, category: 'vegetables' },
  { name: 'Sellerie', name_en: 'Celery', quantity: 100, unit: 'g', calories: 16, protein_g: 1, fat_g: 0, carbs_g: 3, category: 'vegetables' },
  { name: 'Fenchel', name_en: 'Fennel', quantity: 100, unit: 'g', calories: 31, protein_g: 1, fat_g: 0, carbs_g: 7, category: 'vegetables' },

  // Fertiggerichte / Prepared meals
  { name: 'Pizza Margherita', name_en: 'Pizza Margherita', quantity: 1, unit: 'Stück', calories: 800, protein_g: 30, fat_g: 28, carbs_g: 100, category: 'prepared', gram_per_piece: 350 },
  { name: 'Döner Kebab', name_en: 'Döner Kebab', quantity: 1, unit: 'Stück', calories: 650, protein_g: 30, fat_g: 30, carbs_g: 60, category: 'prepared', gram_per_piece: 350 },
  { name: 'Burger', name_en: 'Burger', quantity: 1, unit: 'Stück', calories: 550, protein_g: 25, fat_g: 30, carbs_g: 40, category: 'prepared', gram_per_piece: 250 },
  { name: 'Schnitzel', name_en: 'Schnitzel', quantity: 1, unit: 'Stück', calories: 400, protein_g: 30, fat_g: 20, carbs_g: 20, category: 'prepared', gram_per_piece: 200 },
  { name: 'Sushi (8 Stück)', name_en: 'Sushi (8 pcs)', quantity: 8, unit: 'Stück', calories: 320, protein_g: 14, fat_g: 4, carbs_g: 56, category: 'prepared', gram_per_piece: 30 },
  { name: 'Wrap', name_en: 'Wrap', quantity: 1, unit: 'Stück', calories: 350, protein_g: 18, fat_g: 12, carbs_g: 40, category: 'prepared', gram_per_piece: 200 },

  // Snacks / Sweets
  { name: 'Schokolade (Milch)', name_en: 'Milk Chocolate', quantity: 25, unit: 'g', calories: 135, protein_g: 2, fat_g: 8, carbs_g: 14, category: 'snacks' },
  { name: 'Schokolade (dunkel)', name_en: 'Dark Chocolate', quantity: 25, unit: 'g', calories: 130, protein_g: 2, fat_g: 9, carbs_g: 11, category: 'snacks' },
  { name: 'Chips', name_en: 'Chips', quantity: 30, unit: 'g', calories: 160, protein_g: 2, fat_g: 10, carbs_g: 15, category: 'snacks' },
  { name: 'Nüsse (gemischt)', name_en: 'Mixed Nuts', quantity: 30, unit: 'g', calories: 180, protein_g: 5, fat_g: 16, carbs_g: 5, category: 'snacks' },
  { name: 'Mandeln', name_en: 'Almonds', quantity: 30, unit: 'g', calories: 175, protein_g: 6, fat_g: 15, carbs_g: 2, category: 'snacks' },
  { name: 'Müsliriegel', name_en: 'Granola Bar', quantity: 1, unit: 'Stück', calories: 140, protein_g: 3, fat_g: 5, carbs_g: 21, category: 'snacks', gram_per_piece: 30 },
  { name: 'Proteinriegel', name_en: 'Protein Bar', quantity: 1, unit: 'Stück', calories: 200, protein_g: 20, fat_g: 7, carbs_g: 18, category: 'snacks', gram_per_piece: 45, gram_per_portion: 45 },
  { name: 'Energieriegel', name_en: 'Energy Bar', quantity: 1, unit: 'Stück', calories: 200, protein_g: 3, fat_g: 6, carbs_g: 32, category: 'snacks', gram_per_piece: 45, gram_per_portion: 45 },
  { name: 'Keks', name_en: 'Cookie', quantity: 1, unit: 'Stück', calories: 80, protein_g: 1, fat_g: 3, carbs_g: 12, category: 'snacks', gram_per_piece: 15 },
  { name: 'Eis (Kugel)', name_en: 'Ice Cream (scoop)', quantity: 1, unit: 'Kugel', calories: 130, protein_g: 2, fat_g: 6, carbs_g: 17, category: 'snacks', gram_per_piece: 70 },
  { name: 'Kuchen', name_en: 'Cake', quantity: 1, unit: 'Stück', calories: 350, protein_g: 5, fat_g: 15, carbs_g: 48, category: 'snacks', gram_per_piece: 120 },

  // Soßen / Sauces
  { name: 'Ketchup', name_en: 'Ketchup', quantity: 15, unit: 'g', calories: 17, protein_g: 0, fat_g: 0, carbs_g: 4, category: 'sauces' },
  { name: 'Mayonnaise', name_en: 'Mayonnaise', quantity: 15, unit: 'g', calories: 100, protein_g: 0, fat_g: 11, carbs_g: 0, category: 'sauces' },
  { name: 'Olivenöl', name_en: 'Olive Oil', quantity: 10, unit: 'ml', calories: 88, protein_g: 0, fat_g: 10, carbs_g: 0, category: 'sauces' },
  { name: 'Salatdressing', name_en: 'Salad Dressing', quantity: 30, unit: 'ml', calories: 70, protein_g: 0, fat_g: 6, carbs_g: 3, category: 'sauces' },
  { name: 'Balsamico', name_en: 'Balsamic Vinegar', quantity: 15, unit: 'ml', calories: 14, protein_g: 0, fat_g: 0, carbs_g: 3, category: 'sauces' },
  { name: 'Balsamico Creme', name_en: 'Balsamic Glaze', quantity: 15, unit: 'ml', calories: 20, protein_g: 0, fat_g: 0, carbs_g: 5, category: 'sauces' },
  { name: 'Apfelessig', name_en: 'Apple Cider Vinegar', quantity: 15, unit: 'ml', calories: 3, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'sauces' },
  { name: 'Weißweinessig', name_en: 'White Wine Vinegar', quantity: 15, unit: 'ml', calories: 3, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'sauces' },
  { name: 'Essig', name_en: 'Vinegar', quantity: 15, unit: 'ml', calories: 3, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'sauces' },
  { name: 'Sojasauce', name_en: 'Soy Sauce', quantity: 15, unit: 'ml', calories: 8, protein_g: 1, fat_g: 0, carbs_g: 1, category: 'sauces' },
  { name: 'Senf', name_en: 'Mustard', quantity: 10, unit: 'g', calories: 7, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'sauces' },
  { name: 'Rapsöl', name_en: 'Canola Oil', quantity: 10, unit: 'ml', calories: 88, protein_g: 0, fat_g: 10, carbs_g: 0, category: 'sauces' },
  { name: 'Sonnenblumenöl', name_en: 'Sunflower Oil', quantity: 10, unit: 'ml', calories: 88, protein_g: 0, fat_g: 10, carbs_g: 0, category: 'sauces' },
  { name: 'Kokosöl', name_en: 'Coconut Oil', quantity: 10, unit: 'g', calories: 86, protein_g: 0, fat_g: 10, carbs_g: 0, category: 'sauces' },
  { name: 'Worcestersauce', name_en: 'Worcestershire Sauce', quantity: 5, unit: 'ml', calories: 4, protein_g: 0, fat_g: 0, carbs_g: 1, category: 'sauces' },
  { name: 'Tabasco', name_en: 'Tabasco', quantity: 5, unit: 'ml', calories: 1, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'sauces' },
  { name: 'Sriracha', name_en: 'Sriracha', quantity: 10, unit: 'g', calories: 10, protein_g: 0, fat_g: 0, carbs_g: 2, category: 'sauces' },
  { name: 'Pesto (Basilikum)', name_en: 'Basil Pesto', quantity: 15, unit: 'g', calories: 58, protein_g: 2, fat_g: 5, carbs_g: 1, category: 'sauces' },
  { name: 'BBQ Sauce', name_en: 'BBQ Sauce', quantity: 15, unit: 'g', calories: 29, protein_g: 0, fat_g: 0, carbs_g: 7, category: 'sauces' },
  { name: 'Hummus', name_en: 'Hummus', quantity: 30, unit: 'g', calories: 50, protein_g: 2, fat_g: 3, carbs_g: 4, category: 'sauces' },
  { name: 'Tzatziki', name_en: 'Tzatziki', quantity: 30, unit: 'g', calories: 20, protein_g: 1, fat_g: 1, carbs_g: 2, category: 'sauces' },

  // Gewürze / Spices
  { name: 'Salz', name_en: 'Salt', quantity: 1, unit: 'g', calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'spices' },
  { name: 'Pfeffer', name_en: 'Pepper', quantity: 1, unit: 'g', calories: 3, protein_g: 0, fat_g: 0, carbs_g: 1, category: 'spices' },
  { name: 'Paprikapulver', name_en: 'Paprika Powder', quantity: 5, unit: 'g', calories: 14, protein_g: 1, fat_g: 0, carbs_g: 3, category: 'spices' },
  { name: 'Curry', name_en: 'Curry Powder', quantity: 5, unit: 'g', calories: 16, protein_g: 1, fat_g: 1, carbs_g: 3, category: 'spices' },
  { name: 'Kurkuma', name_en: 'Turmeric', quantity: 3, unit: 'g', calories: 9, protein_g: 0, fat_g: 0, carbs_g: 2, category: 'spices' },
  { name: 'Zimt', name_en: 'Cinnamon', quantity: 3, unit: 'g', calories: 7, protein_g: 0, fat_g: 0, carbs_g: 2, category: 'spices' },
  { name: 'Oregano', name_en: 'Oregano', quantity: 2, unit: 'g', calories: 5, protein_g: 0, fat_g: 0, carbs_g: 1, category: 'spices' },
  { name: 'Basilikum (frisch)', name_en: 'Fresh Basil', quantity: 5, unit: 'g', calories: 1, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'spices' },
  { name: 'Petersilie', name_en: 'Parsley', quantity: 5, unit: 'g', calories: 2, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'spices' },
  { name: 'Schnittlauch', name_en: 'Chives', quantity: 5, unit: 'g', calories: 2, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'spices' },
  { name: 'Ingwer (frisch)', name_en: 'Fresh Ginger', quantity: 5, unit: 'g', calories: 4, protein_g: 0, fat_g: 0, carbs_g: 1, category: 'spices' },
  { name: 'Chili (frisch)', name_en: 'Fresh Chili', quantity: 5, unit: 'g', calories: 2, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'spices' },
  { name: 'Knoblauchpulver', name_en: 'Garlic Powder', quantity: 3, unit: 'g', calories: 10, protein_g: 1, fat_g: 0, carbs_g: 2, category: 'spices' },
  { name: 'Zwiebelpulver', name_en: 'Onion Powder', quantity: 3, unit: 'g', calories: 10, protein_g: 0, fat_g: 0, carbs_g: 2, category: 'spices' },
  { name: 'Rosmarin', name_en: 'Rosemary', quantity: 2, unit: 'g', calories: 3, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'spices' },
  { name: 'Thymian', name_en: 'Thyme', quantity: 2, unit: 'g', calories: 2, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'spices' },
  { name: 'Muskatnuss', name_en: 'Nutmeg', quantity: 1, unit: 'g', calories: 5, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'spices' },
  { name: 'Kreuzkümmel', name_en: 'Cumin', quantity: 3, unit: 'g', calories: 11, protein_g: 1, fat_g: 1, carbs_g: 1, category: 'spices' },
  { name: 'Koriander (frisch)', name_en: 'Fresh Cilantro', quantity: 5, unit: 'g', calories: 1, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'spices' },
  { name: 'Dill', name_en: 'Dill', quantity: 5, unit: 'g', calories: 2, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'spices' },
  { name: 'Minze (frisch)', name_en: 'Fresh Mint', quantity: 5, unit: 'g', calories: 2, protein_g: 0, fat_g: 0, carbs_g: 0, category: 'spices' },

  // Nüsse & Samen / Nuts & Seeds
  { name: 'Walnüsse', name_en: 'Walnuts', quantity: 30, unit: 'g', calories: 196, protein_g: 5, fat_g: 20, carbs_g: 1, category: 'snacks' },
  { name: 'Cashews', name_en: 'Cashews', quantity: 30, unit: 'g', calories: 166, protein_g: 5, fat_g: 13, carbs_g: 9, category: 'snacks' },
  { name: 'Haselnüsse', name_en: 'Hazelnuts', quantity: 30, unit: 'g', calories: 189, protein_g: 4, fat_g: 18, carbs_g: 2, category: 'snacks' },
  { name: 'Pistazien', name_en: 'Pistachios', quantity: 30, unit: 'g', calories: 169, protein_g: 6, fat_g: 14, carbs_g: 8, category: 'snacks' },
  { name: 'Erdnüsse', name_en: 'Peanuts', quantity: 30, unit: 'g', calories: 170, protein_g: 7, fat_g: 14, carbs_g: 5, category: 'snacks' },
  { name: 'Paranüsse', name_en: 'Brazil Nuts', quantity: 30, unit: 'g', calories: 197, protein_g: 4, fat_g: 20, carbs_g: 1, category: 'snacks' },
  { name: 'Macadamia', name_en: 'Macadamia Nuts', quantity: 30, unit: 'g', calories: 215, protein_g: 2, fat_g: 23, carbs_g: 1, category: 'snacks' },
  { name: 'Pekannüsse', name_en: 'Pecans', quantity: 30, unit: 'g', calories: 207, protein_g: 3, fat_g: 22, carbs_g: 1, category: 'snacks' },
  { name: 'Sonnenblumenkerne', name_en: 'Sunflower Seeds', quantity: 20, unit: 'g', calories: 117, protein_g: 4, fat_g: 10, carbs_g: 4, category: 'snacks' },
  { name: 'Kürbiskerne', name_en: 'Pumpkin Seeds', quantity: 20, unit: 'g', calories: 111, protein_g: 6, fat_g: 10, carbs_g: 1, category: 'snacks' },
  { name: 'Leinsamen', name_en: 'Flaxseeds', quantity: 10, unit: 'g', calories: 53, protein_g: 2, fat_g: 4, carbs_g: 0, category: 'snacks' },
  { name: 'Chiasamen', name_en: 'Chia Seeds', quantity: 10, unit: 'g', calories: 49, protein_g: 2, fat_g: 3, carbs_g: 0, category: 'snacks' },
  { name: 'Sesam', name_en: 'Sesame Seeds', quantity: 10, unit: 'g', calories: 57, protein_g: 2, fat_g: 5, carbs_g: 2, category: 'snacks' },

  // Backzutaten / Baking
  { name: 'Weizenmehl', name_en: 'Wheat Flour', quantity: 100, unit: 'g', calories: 364, protein_g: 10, fat_g: 1, carbs_g: 76, category: 'baking' },
  { name: 'Dinkelmehl', name_en: 'Spelt Flour', quantity: 100, unit: 'g', calories: 349, protein_g: 12, fat_g: 2, carbs_g: 70, category: 'baking' },
  { name: 'Mandelmehl', name_en: 'Almond Flour', quantity: 30, unit: 'g', calories: 170, protein_g: 6, fat_g: 15, carbs_g: 2, category: 'baking' },
  { name: 'Kokosmehl', name_en: 'Coconut Flour', quantity: 30, unit: 'g', calories: 107, protein_g: 5, fat_g: 4, carbs_g: 8, category: 'baking' },
  { name: 'Backpulver', name_en: 'Baking Powder', quantity: 5, unit: 'g', calories: 2, protein_g: 0, fat_g: 0, carbs_g: 1, category: 'baking' },
  { name: 'Hefe', name_en: 'Yeast', quantity: 7, unit: 'g', calories: 7, protein_g: 1, fat_g: 0, carbs_g: 1, category: 'baking' },
  { name: 'Vanillezucker', name_en: 'Vanilla Sugar', quantity: 8, unit: 'g', calories: 31, protein_g: 0, fat_g: 0, carbs_g: 8, category: 'baking' },
  { name: 'Kakao (ungesüßt)', name_en: 'Cocoa Powder', quantity: 10, unit: 'g', calories: 23, protein_g: 2, fat_g: 1, carbs_g: 2, category: 'baking' },
  { name: 'Speisestärke', name_en: 'Cornstarch', quantity: 10, unit: 'g', calories: 36, protein_g: 0, fat_g: 0, carbs_g: 9, category: 'baking' },
  { name: 'Kokosflocken', name_en: 'Shredded Coconut', quantity: 15, unit: 'g', calories: 100, protein_g: 1, fat_g: 10, carbs_g: 1, category: 'baking' },
  { name: 'Rosinen', name_en: 'Raisins', quantity: 30, unit: 'g', calories: 90, protein_g: 1, fat_g: 0, carbs_g: 22, category: 'baking' },
  { name: 'Agavendicksaft', name_en: 'Agave Syrup', quantity: 10, unit: 'g', calories: 31, protein_g: 0, fat_g: 0, carbs_g: 8, category: 'baking' },
  { name: 'Ahornsirup', name_en: 'Maple Syrup', quantity: 15, unit: 'ml', calories: 39, protein_g: 0, fat_g: 0, carbs_g: 10, category: 'baking' },

  // Hülsenfrüchte / Legumes
  { name: 'Kichererbsen (Dose)', name_en: 'Chickpeas (canned)', quantity: 150, unit: 'g', calories: 164, protein_g: 9, fat_g: 3, carbs_g: 27, category: 'grains' },
  { name: 'Kidneybohnen (Dose)', name_en: 'Kidney Beans (canned)', quantity: 150, unit: 'g', calories: 158, protein_g: 10, fat_g: 1, carbs_g: 27, category: 'grains' },
  { name: 'Weiße Bohnen (Dose)', name_en: 'White Beans (canned)', quantity: 150, unit: 'g', calories: 149, protein_g: 10, fat_g: 1, carbs_g: 26, category: 'grains' },
  { name: 'Linsen (gekocht)', name_en: 'Lentils (cooked)', quantity: 150, unit: 'g', calories: 173, protein_g: 13, fat_g: 1, carbs_g: 30, category: 'grains' },
  { name: 'Rote Linsen (trocken)', name_en: 'Red Lentils (dry)', quantity: 80, unit: 'g', calories: 272, protein_g: 20, fat_g: 1, carbs_g: 45, category: 'grains' },
  { name: 'Edamame', name_en: 'Edamame', quantity: 100, unit: 'g', calories: 122, protein_g: 12, fat_g: 5, carbs_g: 9, category: 'grains' },

  // Getrocknete Früchte & Extras
  { name: 'Datteln', name_en: 'Dates', quantity: 30, unit: 'g', calories: 83, protein_g: 1, fat_g: 0, carbs_g: 20, category: 'fruit' },
  { name: 'Cranberries (getrocknet)', name_en: 'Dried Cranberries', quantity: 30, unit: 'g', calories: 93, protein_g: 0, fat_g: 0, carbs_g: 23, category: 'fruit' },
  { name: 'Feigen (getrocknet)', name_en: 'Dried Figs', quantity: 30, unit: 'g', calories: 75, protein_g: 1, fat_g: 0, carbs_g: 19, category: 'fruit' },
  { name: 'Aprikosen (getrocknet)', name_en: 'Dried Apricots', quantity: 30, unit: 'g', calories: 72, protein_g: 1, fat_g: 0, carbs_g: 17, category: 'fruit' },
  { name: 'Kokosmilch (Dose)', name_en: 'Coconut Milk (canned)', quantity: 100, unit: 'ml', calories: 197, protein_g: 2, fat_g: 21, carbs_g: 3, category: 'dairy' },
  { name: 'Sahne', name_en: 'Heavy Cream', quantity: 30, unit: 'ml', calories: 93, protein_g: 1, fat_g: 10, carbs_g: 1, category: 'dairy' },
  { name: 'Saure Sahne', name_en: 'Sour Cream', quantity: 30, unit: 'g', calories: 56, protein_g: 1, fat_g: 6, carbs_g: 1, category: 'dairy' },
  { name: 'Crème fraîche', name_en: 'Crème Fraîche', quantity: 30, unit: 'g', calories: 88, protein_g: 1, fat_g: 9, carbs_g: 1, category: 'dairy' },
  { name: 'Schmand', name_en: 'Schmand (Sour Cream)', quantity: 30, unit: 'g', calories: 72, protein_g: 1, fat_g: 7, carbs_g: 1, category: 'dairy' },
  { name: 'Mascarpone', name_en: 'Mascarpone', quantity: 30, unit: 'g', calories: 120, protein_g: 1, fat_g: 13, carbs_g: 0, category: 'dairy' },
  { name: 'Ricotta', name_en: 'Ricotta', quantity: 50, unit: 'g', calories: 87, protein_g: 6, fat_g: 6, carbs_g: 2, category: 'dairy' },
  { name: 'Parmesan', name_en: 'Parmesan', quantity: 10, unit: 'g', calories: 39, protein_g: 4, fat_g: 3, carbs_g: 0, category: 'dairy' },
  { name: 'Feta', name_en: 'Feta Cheese', quantity: 30, unit: 'g', calories: 79, protein_g: 4, fat_g: 6, carbs_g: 1, category: 'dairy' },
  { name: 'Ziegenkäse', name_en: 'Goat Cheese', quantity: 30, unit: 'g', calories: 103, protein_g: 7, fat_g: 8, carbs_g: 0, category: 'dairy' },
  { name: 'Hüttenkäse', name_en: 'Cottage Cheese', quantity: 100, unit: 'g', calories: 98, protein_g: 11, fat_g: 4, carbs_g: 3, category: 'dairy' },
  { name: 'Raclettekäse', name_en: 'Raclette Cheese', quantity: 50, unit: 'g', calories: 175, protein_g: 12, fat_g: 14, carbs_g: 0, category: 'dairy' },
  { name: 'Fonduekäse (Mischung)', name_en: 'Fondue Cheese (Mix)', quantity: 100, unit: 'g', calories: 330, protein_g: 24, fat_g: 25, carbs_g: 2, category: 'dairy' },
  { name: 'Gruyère', name_en: 'Gruyère Cheese', quantity: 30, unit: 'g', calories: 117, protein_g: 8, fat_g: 9, carbs_g: 0, category: 'dairy' },
  { name: 'Appenzeller', name_en: 'Appenzeller Cheese', quantity: 30, unit: 'g', calories: 115, protein_g: 8, fat_g: 9, carbs_g: 0, category: 'dairy' },
  { name: 'Cheddar', name_en: 'Cheddar Cheese', quantity: 30, unit: 'g', calories: 121, protein_g: 7, fat_g: 10, carbs_g: 0, category: 'dairy' },
  { name: 'Camembert', name_en: 'Camembert', quantity: 30, unit: 'g', calories: 85, protein_g: 6, fat_g: 7, carbs_g: 0, category: 'dairy' },
  { name: 'Brie', name_en: 'Brie Cheese', quantity: 30, unit: 'g', calories: 100, protein_g: 6, fat_g: 8, carbs_g: 0, category: 'dairy' },
  { name: 'Edamer', name_en: 'Edam Cheese', quantity: 30, unit: 'g', calories: 100, protein_g: 7, fat_g: 8, carbs_g: 0, category: 'dairy' },
  { name: 'Tilsiter', name_en: 'Tilsit Cheese', quantity: 30, unit: 'g', calories: 110, protein_g: 8, fat_g: 9, carbs_g: 0, category: 'dairy' },
  { name: 'Bergkäse', name_en: 'Mountain Cheese', quantity: 30, unit: 'g', calories: 120, protein_g: 8, fat_g: 10, carbs_g: 0, category: 'dairy' },
  { name: 'Sbrinz', name_en: 'Sbrinz Cheese', quantity: 10, unit: 'g', calories: 45, protein_g: 5, fat_g: 3, carbs_g: 0, category: 'dairy' },

  // Schweizer Gerichte / Swiss Dishes
  { name: 'Rösti', name_en: 'Rösti (Swiss Hash Browns)', quantity: 200, unit: 'g', calories: 280, protein_g: 4, fat_g: 14, carbs_g: 34, category: 'swiss' },
  { name: 'Rösti mit Käse', name_en: 'Rösti with Cheese', quantity: 250, unit: 'g', calories: 420, protein_g: 14, fat_g: 24, carbs_g: 36, category: 'swiss' },
  { name: 'Züpfe (Zopf)', name_en: 'Swiss Braided Bread', quantity: 60, unit: 'g', calories: 190, protein_g: 6, fat_g: 5, carbs_g: 30, gram_per_piece: 60, category: 'bread' },
  { name: 'Bündnerfleisch', name_en: 'Bündnerfleisch (Air-Dried Beef)', quantity: 30, unit: 'g', calories: 55, protein_g: 12, fat_g: 1, carbs_g: 0, category: 'meat' },
  { name: 'Cervelat', name_en: 'Cervelat (Swiss Sausage)', quantity: 100, unit: 'g', calories: 270, protein_g: 12, fat_g: 24, carbs_g: 1, category: 'meat' },
  { name: 'Birchermüesli', name_en: 'Bircher Muesli', quantity: 200, unit: 'g', calories: 230, protein_g: 7, fat_g: 7, carbs_g: 34, category: 'breakfast' },
  { name: 'Älplermagronen', name_en: 'Alpine Macaroni', quantity: 300, unit: 'g', calories: 510, protein_g: 18, fat_g: 22, carbs_g: 58, category: 'swiss' },
  { name: 'Capuns', name_en: 'Capuns (Graubünden Rolls)', quantity: 250, unit: 'g', calories: 380, protein_g: 16, fat_g: 18, carbs_g: 38, category: 'swiss' },
  { name: 'Ghackets mit Hörnli', name_en: 'Minced Meat with Pasta', quantity: 300, unit: 'g', calories: 450, protein_g: 25, fat_g: 18, carbs_g: 45, category: 'swiss' },
  { name: 'Zürcher Geschnetzeltes', name_en: 'Zurich-Style Sliced Meat', quantity: 250, unit: 'g', calories: 380, protein_g: 30, fat_g: 22, carbs_g: 10, category: 'swiss' },
  { name: 'Berner Platte', name_en: 'Bernese Platter', quantity: 350, unit: 'g', calories: 650, protein_g: 40, fat_g: 38, carbs_g: 35, category: 'swiss' },
  { name: 'Raclette (Portion)', name_en: 'Raclette (Serving)', quantity: 250, unit: 'g', calories: 550, protein_g: 25, fat_g: 30, carbs_g: 40, category: 'swiss' },
  { name: 'Fondue (Portion)', name_en: 'Fondue (Serving)', quantity: 250, unit: 'g', calories: 580, protein_g: 30, fat_g: 35, carbs_g: 15, category: 'swiss' },
  { name: 'Weggli', name_en: 'Swiss Bread Roll', quantity: 50, unit: 'g', calories: 145, protein_g: 5, fat_g: 3, carbs_g: 25, gram_per_piece: 50, category: 'bread' },
  { name: 'Nussgipfel', name_en: 'Nut Croissant', quantity: 80, unit: 'g', calories: 340, protein_g: 7, fat_g: 18, carbs_g: 38, gram_per_piece: 80, category: 'snacks' },
  { name: 'Luxemburgerli', name_en: 'Luxemburgerli (Mini Macaron)', quantity: 12, unit: 'g', calories: 45, protein_g: 1, fat_g: 2, carbs_g: 6, gram_per_piece: 12, category: 'sweets' },
  { name: 'Rivella', name_en: 'Rivella', quantity: 330, unit: 'ml', calories: 115, protein_g: 0, fat_g: 0, carbs_g: 29, category: 'drinks' },
  { name: 'Ovomaltine (Getränk)', name_en: 'Ovaltine Drink', quantity: 200, unit: 'ml', calories: 160, protein_g: 6, fat_g: 3, carbs_g: 28, category: 'drinks' },
  { name: 'Landjäger', name_en: 'Landjäger (Dried Sausage)', quantity: 60, unit: 'g', calories: 200, protein_g: 14, fat_g: 16, carbs_g: 1, gram_per_piece: 60, category: 'meat' },
  { name: 'Biberli', name_en: 'Biberli (Appenzell Gingerbread)', quantity: 45, unit: 'g', calories: 155, protein_g: 2, fat_g: 3, carbs_g: 30, gram_per_piece: 45, category: 'sweets' },
  { name: 'Basler Läckerli', name_en: 'Basel Läckerli', quantity: 30, unit: 'g', calories: 105, protein_g: 2, fat_g: 2, carbs_g: 22, category: 'sweets' },

  // Flavour Pulver / Flavour Powders
  { name: 'Chunky Flavour', name_en: 'Chunky Flavour Powder', quantity: 2, unit: 'Portion', calories: 18, protein_g: 0, fat_g: 0, carbs_g: 4, category: 'brands', gram_per_portion: 3 },
  { name: 'Chunky Flavour (Vanille)', name_en: 'Chunky Flavour Vanilla', quantity: 2, unit: 'Portion', calories: 18, protein_g: 0, fat_g: 0, carbs_g: 4, category: 'brands', gram_per_portion: 3 },
  { name: 'Chunky Flavour (Schoko)', name_en: 'Chunky Flavour Chocolate', quantity: 2, unit: 'Portion', calories: 18, protein_g: 0, fat_g: 0, carbs_g: 4, category: 'brands', gram_per_portion: 3 },
  { name: 'Chunky Flavour (Zimt)', name_en: 'Chunky Flavour Cinnamon', quantity: 2, unit: 'Portion', calories: 18, protein_g: 0, fat_g: 0, carbs_g: 4, category: 'brands', gram_per_portion: 3 },
  { name: 'Chunky Flavour (Erdbeere)', name_en: 'Chunky Flavour Strawberry', quantity: 2, unit: 'Portion', calories: 18, protein_g: 0, fat_g: 0, carbs_g: 4, category: 'brands', gram_per_portion: 3 },
  { name: 'Chunky Flavour (Karamell)', name_en: 'Chunky Flavour Caramel', quantity: 2, unit: 'Portion', calories: 18, protein_g: 0, fat_g: 0, carbs_g: 4, category: 'brands', gram_per_portion: 3 },
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
  'zopf': ['züpfe (zopf)', 'swiss braided bread'],
  'zuepfe': ['züpfe (zopf)', 'swiss braided bread'],
  'weggli': ['weggli', 'swiss bread roll'],
  'mutschli': ['weggli', 'swiss bread roll'],
  'cervelat': ['cervelat', 'cervelat (swiss sausage)'],
  'schuebling': ['cervelat', 'cervelat (swiss sausage)'],
  'raclette': ['raclette (portion)', 'raclette (serving)'],
  'rosti': ['rösti'],
  'roesti': ['rösti'],
  'birchermuesli': ['birchermüesli', 'bircher muesli'],
  'birchermüesli': ['birchermüesli', 'bircher muesli'],
  'rivella': ['rivella'],
  'kaegi': ['keks', 'cookie'],
  'toblerone': ['schokolade (milch)', 'milk chocolate'],
  'ovomaltine': ['ovomaltine (getränk)', 'ovaltine drink'],
  'ovo': ['ovomaltine (getränk)', 'ovaltine drink'],
  'rahm': ['sahne', 'cream', 'kaffee mit sahne'],
  'anke': ['butter'],
  'ziger': ['frischkaese', 'cream cheese'],
  'fondue': ['fondue (portion)', 'fondue (serving)'],
  'alpkaese': ['bergkaese', 'mountain cheese'],
  'emmentaler': ['kaese (emmentaler)', 'emmental cheese'],
  'gruyere': ['gruyère', 'gruyère cheese'],
  'appenzeller': ['appenzeller', 'appenzeller cheese'],
  'buendnerfleisch': ['bündnerfleisch'],
  'bundnerfleisch': ['bündnerfleisch'],
  'trockenfleisch': ['bündnerfleisch'],
  'aelplermagronen': ['älplermagronen', 'alpine macaroni'],
  'alplermagronen': ['älplermagronen', 'alpine macaroni'],
  'ghackets': ['ghackets mit hörnli', 'minced meat with pasta'],
  'hoernli': ['ghackets mit hörnli', 'minced meat with pasta'],
  'geschnetzeltes': ['zürcher geschnetzeltes', 'zurich-style sliced meat'],
  'nussgipfel': ['nussgipfel', 'nut croissant'],
  'landjaeger': ['landjäger'],
  'biberli': ['biberli'],
  'laeckerli': ['basler läckerli'],
  'chunky': ['chunky flavour'],
  'chunky flavour': ['chunky flavour'],
  'chunky flavor': ['chunky flavour'],
  'geschmackspulver': ['chunky flavour'],
  'flavour pulver': ['chunky flavour'],

  // === Lamm / Lamb ===
  'lamb': ['lammkeule', 'leg of lamb'],
  'lamm': ['lammkeule', 'leg of lamb'],
  'lamb chop': ['lammkotelett', 'lamb chop'],
  'lamb leg': ['lammkeule', 'leg of lamb'],
  'lamb fillet': ['lammfilet', 'lamb fillet'],
  'lammfleisch': ['lammkeule', 'leg of lamb'],
  'lammbraten': ['lammkeule', 'leg of lamb'],
  'gigot': ['lammkeule', 'leg of lamb'],

  // === Ente / Duck ===
  'ente': ['entenbrust', 'duck breast'],
  'duck': ['entenbrust', 'duck breast'],
  'entenfleisch': ['entenbrust', 'duck breast'],
  'entenbraten': ['ente (ganz, gebraten)', 'roast duck'],
  'pekingente': ['ente (ganz, gebraten)', 'roast duck'],
  'canard': ['entenbrust', 'duck breast'],
  'duck breast': ['entenbrust', 'duck breast'],
  'duck leg': ['entenkeule', 'duck leg'],

  // === Gans / Goose ===
  'gans': ['gänsebrust', 'goose breast'],
  'goose': ['gänsebrust', 'goose breast'],
  'gaensebrust': ['gänsebrust', 'goose breast'],
  'gaensekeule': ['gänsekeule', 'goose leg'],
  'gaensebraten': ['gänsebraten', 'roast goose'],
  'martinsgans': ['gänsebraten', 'roast goose'],
  'weihnachtsgans': ['gänsebraten', 'roast goose'],
  'gaenseschmalz': ['gänseschmalz', 'goose fat'],
  'gaenseleber': ['gänseleber', 'goose liver'],
  'foie gras': ['foie gras'],
  'stopfleber': ['foie gras'],

  // === Kaninchen / Rabbit ===
  'kaninchen': ['kaninchenfleisch', 'rabbit meat'],
  'rabbit': ['kaninchenfleisch', 'rabbit meat'],
  'hase': ['hasenfleisch', 'hare meat'],
  'hare': ['hasenfleisch', 'hare meat'],
  'hasenpfeffer': ['hasenfleisch', 'hare meat'],
  'lapin': ['kaninchenfleisch', 'rabbit meat'],

  // === Wild / Game ===
  'wild': ['wildbraten', 'roast game'],
  'game': ['wildbraten', 'roast game'],
  'wildfleisch': ['wildbraten', 'roast game'],
  'wildschwein': ['wildschwein', 'wild boar'],
  'wild boar': ['wildschwein', 'wild boar'],
  'wildschweingulasch': ['wildgulasch', 'game goulash'],
  'wildragout': ['wildragout', 'game ragout'],
  'wildgulasch': ['wildgulasch', 'game goulash'],
  'wildsalami': ['wildsalami', 'game salami'],
  'wildwurst': ['wildsalami', 'game salami'],
  'venison': ['rehkeule', 'venison leg'],

  // === Reh / Roe Deer ===
  'reh': ['rehkeule', 'venison leg'],
  'rehfleisch': ['rehkeule', 'venison leg'],
  'rehbraten': ['rehbraten', 'roast venison'],
  'rehruecken': ['rehrücken', 'venison saddle'],
  'rehschnitzel': ['rehschnitzel', 'venison schnitzel'],
  'rehgulasch': ['rehgulasch', 'venison goulash'],
  'roe deer': ['rehkeule', 'venison leg'],

  // === Hirsch / Red Deer ===
  'hirsch': ['hirschfleisch', 'red deer meat'],
  'hirschfleisch': ['hirschfleisch', 'red deer meat'],
  'hirschbraten': ['hirschkeule', 'red deer leg'],
  'hirschgulasch': ['hirschgulasch', 'red deer goulash'],
  'hirschruecken': ['hirschrücken', 'red deer saddle'],
  'hirschsalami': ['hirschsalami', 'deer salami'],
  'red deer': ['hirschfleisch', 'red deer meat'],
  'deer': ['hirschfleisch', 'red deer meat'],

  // === Fasan, Wachtel, Strauß / Pheasant, Quail, Ostrich ===
  'fasan': ['fasanenbrust', 'pheasant breast'],
  'pheasant': ['fasanenbrust', 'pheasant breast'],
  'wachtel': ['wachtel', 'quail'],
  'quail': ['wachtelbrust', 'quail breast'],
  'strauss': ['straußensteak', 'ostrich steak'],
  'straussfleisch': ['straußensteak', 'ostrich steak'],
  'ostrich': ['straußensteak', 'ostrich steak'],

  // === Pute / Turkey ===
  'pute': ['putenbrust', 'turkey breast'],
  'turkey': ['putenbrust', 'turkey breast'],
  'putenfleisch': ['putenbrust', 'turkey breast'],
  'truthahn': ['truthahnbrust', 'turkey breast'],
  'putenschnitzel': ['putenschnitzel', 'turkey schnitzel'],
  'putenhack': ['putenhackfleisch', 'ground turkey'],

  // === Weitere Fleisch-Synonyme ===
  'schweinebraten': ['schweinebraten', 'roast pork'],
  'kassler': ['kassler', 'kassler (smoked pork)'],
  'kasseler': ['kassler', 'kassler (smoked pork)'],
  'pulled pork': ['pulled pork'],
  'rinderfilet': ['rinderfilet', 'beef fillet'],
  'steak': ['rindersteak', 'beef steak'],
  'rindersteak': ['rindersteak', 'beef steak'],
  'gulasch': ['rindergulasch', 'beef goulash'],
  'roulade': ['rinderroulade', 'beef roulade'],
  'rinderroulade': ['rinderroulade', 'beef roulade'],
  'gyros': ['gyros'],
  'doener': ['döner fleisch', 'doner meat'],
  'doenerfleisch': ['döner fleisch', 'doner meat'],
  'kebab': ['döner fleisch', 'doner meat'],
  'cordon bleu': ['cordon bleu'],

  // === Streichfette & Öle / Spreads & Oils ===
  'rama': ['rama original'],
  'laetta': ['lätta'],
  'latta': ['lätta'],
  'ghee': ['butterschmalz / ghee', 'clarified butter / ghee'],
  'butterschmalz': ['butterschmalz / ghee', 'clarified butter / ghee'],
  'kokosoel': ['kokosöl', 'coconut oil'],
  'kokosfett': ['kokosöl', 'coconut oil'],
  'olivenoel': ['olivenöl', 'olive oil'],
  'sonnenblumenoel': ['sonnenblumenöl', 'sunflower oil'],
  'rapsoel': ['rapsöl', 'rapeseed oil'],
  'halbfettbutter': ['halbfettbutter', 'half-fat butter'],

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
  'tilsiter': ['tilsiter', 'tilsit cheese'],
  'edamer': ['edamer', 'edam cheese'],
  'cheddar': ['cheddar', 'cheddar cheese'],
  'parmesan': ['parmesan'],
  'feta': ['feta', 'feta cheese'],
  'camembert': ['camembert'],
  'brie': ['brie', 'brie cheese'],
  'bergkaese': ['bergkaese', 'mountain cheese'],
  'sbrinz': ['sbrinz', 'sbrinz cheese'],

  // === Wurst / Aufschnitt ===
  'fleischwurst': ['salami'],
  'mortadella': ['salami'],
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
  'nescafe': ['nescafe gold', 'instantkaffee (pulver)', 'instant coffee'],
  'nescaffe': ['nescafe gold', 'instantkaffee (pulver)', 'instant coffee'],
  'instant kaffee': ['instantkaffee (pulver)', 'nescafe gold'],
  'loeslicher kaffee': ['instantkaffee (pulver)', 'nescafe gold'],
  'kaffeepulver': ['instantkaffee (pulver)', 'nescafe gold'],
  'kaffee pulver': ['instantkaffee (pulver)', 'nescafe gold'],
  'jacobs': ['instantkaffee (pulver)', 'nescafe gold'],
  'dallmayr': ['kaffee schwarz', 'black coffee'],
  'senseo': ['kaffee schwarz', 'black coffee'],
  'dolce gusto': ['cappuccino pulver', 'cappuccino powder'],
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
  'kakao': ['kakaopulver', 'cocoa powder', 'milch'],
  'heisse schokolade': ['kakaopulver', 'cocoa powder', 'milch'],

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

function findSynonymMatches(query: string): { targets: string[]; alias: string } | null {
  const normalized = normalizeSearchText(query);
  for (const [alias, canonicals] of Object.entries(SYNONYMS)) {
    if (normalized.includes(alias) || alias.includes(normalized)) {
      return {
        targets: canonicals.map(normalizeSearchText),
        alias,
      };
    }
  }
  return null;
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
  const synonymMatch = findSynonymMatches(normalizedQuery);
  const synonymTargets = synonymMatch?.targets ?? [];
  const matchedAlias = synonymMatch?.alias ?? '';

  const scored = foodDatabase
    .map((entry) => {
      const primaryName = language === 'de' ? entry.name : entry.name_en;
      const secondaryName = language === 'de' ? entry.name_en : entry.name;

      const primary = normalizeSearchText(primaryName);
      const secondary = normalizeSearchText(secondaryName);
      const primaryTokens = tokenize(primaryName);
      const secondaryTokens = tokenize(secondaryName);

      let score = 0;
      let isSynonymHit = false;

      // Check synonym matches
      if (synonymTargets.length > 0) {
        for (const target of synonymTargets) {
          if (primary.includes(target) || secondary.includes(target)) {
            score = Math.max(score, 70);
            isSynonymHit = true;
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

      if (score > 0) {
        const resultEntry = isSynonymHit ? { ...entry, matchedAlias } : entry;
        return { entry: resultEntry, score };
      }
      return null;
    })
    .filter((result): result is { entry: FoodEntry; score: number } => result !== null)
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name));

  return scored.slice(0, 8).map((result) => result.entry);
}
