

## Problem

Zwei Probleme beim Barcode-Scanner:

1. **Hängt bei "Produkt wird gesucht..."** — Der OpenFoodFacts-API-Call hat kein Timeout. Wenn die API nicht antwortet, bleibt der Spinner ewig.

2. **Keine Mengenanpassung nach Scan** — Barcode-Ergebnis wird sofort auto-gespeichert (`handleSave([item])`). Bei Produkten wie Magnesium-Tabletten (Packung 78g, aber nur 1 Tablette nötig) kann der Nutzer die Menge nicht vorher anpassen.

## Lösung

### 1. Timeout für API-Call hinzufügen
**`src/components/meals/BarcodeScanner.tsx`** — `lookupOpenFoodFacts` mit AbortController + 5s Timeout absichern. Falls Timeout: als "nicht gefunden" behandeln.

### 2. Barcode-Ergebnis im FoodDetailDrawer anzeigen statt auto-save
**`src/pages/MealsPage.tsx`** — Statt `handleSave([item])` direkt aufzurufen:
- Das gescannte Item in den `diary-entry`-Step überführen (FoodSearchScreen)
- Dort öffnet sich der FoodDetailDrawer mit dem Produkt
- Der Nutzer kann die Menge anpassen (z.B. von 100g auf 4.5g für 1 Tablette)
- Erst beim "Eintragen" im Drawer wird gespeichert

Konkret:
- `BarcodeScanner.onResult` → setzt das Item als "pre-selected" Item und wechselt zu `diary-entry`
- In `FoodSearchScreen` wird ein neuer Prop `initialItem` hinzugefügt, der automatisch den FoodDetailDrawer öffnet
- FoodDetailDrawer zeigt das Produkt mit Mengen-Stepper, Makros, und Eintragen-Button

### Änderungen

**`src/components/meals/BarcodeScanner.tsx`**:
- Timeout (5s) für `lookupOpenFoodFacts` fetch hinzufügen

**`src/pages/MealsPage.tsx`**:
- `BarcodeScanner.onResult`: Statt auto-save → Item als `initialSearchItem` speichern, Step auf `diary-entry` setzen
- Neuen State `initialSearchItem` anlegen und an `FoodSearchScreen` weitergeben

**`src/components/meals/FoodSearchScreen.tsx`**:
- Neuer Prop `initialItem?: AnalyzedFoodItem`
- Wenn gesetzt: automatisch FoodDetailDrawer mit diesem Item öffnen
- Nutzer kann Menge anpassen → "Eintragen" speichert wie gewohnt

