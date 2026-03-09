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
  matchedAlias?: string;
  communityContributor?: string;
  communityBrand?: string;
  communityStore?: string;
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

  // Kaffee-Zutaten / Coffee Add-ins
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

  // Eigenmarken / Store Brands – EDEKA (Gut & Günstig, Gut Bio)
  { name: 'Gut & Günstig Vollmilch', name_en: 'Gut & Günstig Whole Milk', quantity: 200, unit: 'ml', calories: 128, protein_g: 7, fat_g: 7, carbs_g: 10, category: 'brands' },
  { name: 'Gut & Günstig Butter', name_en: 'Gut & Günstig Butter', quantity: 10, unit: 'g', calories: 74, protein_g: 0, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'Gut & Günstig Gouda', name_en: 'Gut & Günstig Gouda', quantity: 30, unit: 'g', calories: 105, protein_g: 7, fat_g: 8, carbs_g: 0, category: 'brands' },
  { name: 'Gut & Günstig Toastbrot', name_en: 'Gut & Günstig Toast', quantity: 1, unit: 'Scheibe', calories: 65, protein_g: 2, fat_g: 1, carbs_g: 12, category: 'brands' },
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
  { name: 'S-Budget Toast', name_en: 'S-Budget Toast', quantity: 1, unit: 'Scheibe', calories: 65, protein_g: 2, fat_g: 1, carbs_g: 12, category: 'brands' },
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
  { name: 'Clever Toastbrot', name_en: 'Clever Toast', quantity: 1, unit: 'Scheibe', calories: 65, protein_g: 2, fat_g: 1, carbs_g: 12, category: 'brands' },
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
