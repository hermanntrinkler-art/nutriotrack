

## Problem

Beim Barcode-Scan von Magnesium-Tabletten (78g Röhrchen, 20 Tabletten × 3.9g) passiert Folgendes:
1. Das Produkt wird gefunden, aber `gram_per_piece` wird nicht weitergegeben
2. Im FoodDetailDrawer fehlt die Info "1 Stück = 3.9g" 
3. Beim Umschalten auf "Stück" ändert sich nichts, weil der Fallback `gram_per_piece || 100` greift
4. Schneller Eintrag zeigt nur "100g" — kein Preset für "1 Tablette (3.9g)"

## Lösung

### 1. `gram_per_piece` durch die gesamte Pipeline transportieren

**`src/lib/types.ts`** — `AnalyzedFoodItem` um optionales `gram_per_piece` erweitern.

**`src/components/meals/BarcodeScanner.tsx`** — In `lookupOpenFoodFacts`:
- Aus OpenFoodFacts `serving_size` und `product_quantity` (Gesamtgewicht) das Stückgewicht berechnen
- Auch bei nicht-isPieceProduct das `gram_per_piece` mitgeben wenn `serving_size` vorhanden
- Beispiel: 78g Packung, serving_size "3.9g" → `gram_per_piece: 3.9`
- Wenn `product_quantity` vorhanden (z.B. "78") und `serving_quantity` (z.B. "3.9"), Stückzahl = 78/3.9 = 20

**`src/components/meals/FoodSearchScreen.tsx`** — Im `initialItem` useEffect: `gram_per_piece` aus dem AnalyzedFoodItem in die FoodEntry übernehmen.

### 2. FoodDetailDrawer: Presets und Unit-Wechsel korrigieren

**`src/components/meals/FoodDetailDrawer.tsx`**:
- `getPortionPresets`: Wenn `gram_per_piece` vorhanden → Preset "1 Stück (3.9 g)" hinzufügen mit korrekten skalierten Nährwerten
- `handleUnitChange`: Nutzt bereits `gram_per_piece`, funktioniert korrekt sobald der Wert vorhanden ist
- Beim Wechsel g→Stück: Menge wird auf 1 gesetzt und Nährwerte skalieren auf 3.9g

### Dateien
- `src/lib/types.ts` — 1 Zeile hinzufügen
- `src/components/meals/BarcodeScanner.tsx` — `lookupOpenFoodFacts` erweitern
- `src/components/meals/FoodSearchScreen.tsx` — `gram_per_piece` in FoodEntry übernehmen
- `src/components/meals/FoodDetailDrawer.tsx` — Presets für barcode-Produkte mit `gram_per_piece`

