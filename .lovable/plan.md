

## Einzelne Lebensmittel in Mahlzeiten-Übersicht anzeigen

Wie im FDDB-Screenshot: Unter jeder Mahlzeit die einzelnen Food-Items mit Menge und Makros anzeigen.

### Umsetzung in `src/pages/MealsPage.tsx`

**1. Query erweitern** (Zeile 117-123):
- `.select('*')` → `.select('*, meal_food_items(*)')` um Food-Items mitzuladen

**2. State-Typ erweitern** (Zeile 98):
- Lokaler Typ: `MealEntry & { meal_food_items?: MealFoodItem[] }`

**3. Anzeige erweitern** (Zeilen 501-523):
- Unter jedem Meal-Eintrag die Food-Items auflisten, ähnlich dem FDDB-Screenshot:
  ```
  10x Mandeln (ganz)              648 kcal
  100 g – 50 g F, 22 g KH, 21 g P
  ```
- Kompaktes Layout: Food-Name + Menge oben, Makros darunter in kleiner Schrift
- Kein Uhrzeit-Feld (das "22:00 Uhr" aus dem FDDB-Screenshot wird weggelassen)
- Der bestehende Meal-Header mit Gesamtkalorien bleibt, die Items erscheinen darunter

### Betroffene Datei
- `src/pages/MealsPage.tsx`

