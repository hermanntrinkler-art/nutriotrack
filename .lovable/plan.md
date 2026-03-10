

## Mikronährstoff-Felder im Editor & in der Datenbank

### Problem
Die `community_products`-Tabelle (und `custom_products`, `meal_food_items`) hat aktuell **keine Spalten für Mikronährstoffe** (Vitamine, Mineralstoffe). Das FoodItemEditorModal zeigt nur Kalorien + Makros. Wenn du z.B. Magnesium-Tabletten einträgst, kannst du die Mikronährstoffe nirgends eingeben — und sie werden auch nicht in der Community geteilt.

### Lösung

**1. Datenbank-Migration** — Mikronährstoff-Spalten hinzufügen zu:
- `community_products` — 17 neue Spalten (vitaminA_ug, vitaminB1_mg, ..., magnesium_mg, etc.), alle nullable, default 0
- `meal_food_items` — gleiche 17 Spalten
- `custom_products` — gleiche 17 Spalten

**2. `src/lib/types.ts`** — `AnalyzedFoodItem` um optionale Mikronährstoff-Felder erweitern

**3. `src/components/meals/FoodItemEditorModal.tsx`** — Aufklappbarer Bereich "Vitamine & Mineralstoffe" unter den Makro-Feldern:
- 17 Input-Felder in einem Collapsible/Accordion-Bereich (damit der Dialog nicht überladen wirkt)
- Felder gruppiert: Vitamine (10) und Mineralstoffe (7)
- Skalierung funktioniert analog zu den Makros bei Mengenänderung

**4. `src/pages/EditMealPage.tsx`** — `handleShareToCommunity` erweitern, um die Mikronährstoffe mit in den Community-Insert zu nehmen

### Dateien
- Datenbank: 1 Migration (3 Tabellen)
- `src/lib/types.ts` — AnalyzedFoodItem erweitern
- `src/components/meals/FoodItemEditorModal.tsx` — Mikro-Felder + Skalierung
- `src/pages/EditMealPage.tsx` — Community-Insert mit Mikros

