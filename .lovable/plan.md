

## Korrigierte Produkte speichern

### Problem
Wenn du ein Produkt scannst (z.B. Mandeln mit 583 statt 619 kcal) und die Werte im Editor korrigierst, werden die Korrekturen aktuell **nicht gespeichert**. Beim nächsten Scan bekommst du wieder die falschen Werte.

### Lösung
Wenn ein Nutzer die Nährwerte eines gescannten Produkts manuell korrigiert und die Mahlzeit speichert, werden die korrigierten Werte automatisch in der persönlichen `custom_products`-Tabelle gespeichert (mit Barcode, falls vorhanden). Beim nächsten Scan wird zuerst in den eigenen Produkten gesucht — deine korrigierten Werte haben Vorrang.

### Was passiert konkret

1. **BottomCart/Editor**: Wenn ein Item manuell editiert wurde (Kalorien, Makros geändert), wird es als `was_user_edited: true` markiert
2. **Beim Speichern der Mahlzeit**: Für jedes editierte Item wird ein Upsert in `custom_products` gemacht — so hast du beim nächsten Mal automatisch deine korrigierten Werte
3. **Barcode-Scan Priorität**: Der BarcodeScanner prüft bereits zuerst `custom_products` → deine Korrekturen greifen sofort beim nächsten Scan
4. **Kein Community-Produkt**: Die Korrektur bleibt privat bei dir. Community-Produkte werden nur erstellt, wenn ein komplett neues Produkt angelegt wird

### Betroffene Dateien
- `src/components/meals/BottomCart.tsx` — `was_user_edited` Flag tracken
- `src/components/meals/FoodItemEditorModal.tsx` — Flag setzen bei manueller Änderung
- `src/lib/types.ts` — `AnalyzedFoodItem` um optionale Felder erweitern (`was_user_edited`, `barcode`)
- `src/pages/MealsPage.tsx` (oder wo die Mahlzeit gespeichert wird) — beim Save editierte Items in `custom_products` upserten

