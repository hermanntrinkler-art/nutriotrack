

## Fix: Community-Produkte werden ohne Barcode gespeichert

### Problem
Wenn du ein Produkt per Barcode scannst, wird der Barcode **nicht** in der `meal_food_items`-Tabelle gespeichert (die Spalte existiert gar nicht). Wenn du das Produkt später aus der Mahlzeiten-Bearbeitung heraus zur Community teilst, ist `item.barcode` immer `undefined` → das Community-Produkt wird mit `barcode: null` gespeichert → beim nächsten Scan wird es nicht gefunden.

### Lösung

1. **Datenbank-Migration** — `barcode` Spalte zur `meal_food_items` Tabelle hinzufügen:
   ```sql
   ALTER TABLE public.meal_food_items ADD COLUMN barcode text;
   ```

2. **`src/pages/MealsPage.tsx`** (oder wo Mahlzeiten gespeichert werden) — beim Speichern der Food Items den Barcode mit durchreichen, falls vorhanden.

3. **`src/pages/EditMealPage.tsx`** — beim Laden der Items aus `meal_food_items` den Barcode mit auslesen (`barcode: fi.barcode`), damit er beim Community-Teilen vorhanden ist.

### Dateien
- DB-Migration: 1 Spalte hinzufügen
- `src/pages/MealsPage.tsx` — Barcode beim Insert mitgeben
- `src/pages/EditMealPage.tsx` — Barcode beim Laden aus DB mappen
- Ggf. weitere Stellen die `meal_food_items` inserten (z.B. `SaveMealConfirmation.tsx`)

