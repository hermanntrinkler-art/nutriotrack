

## Fix: Barcode geht beim Bearbeiten verloren

### Problem
Wenn du im Food-Editor ein Produkt bearbeitest oder eine Suggestion auswählst, wird der Barcode gelöscht. Das passiert an zwei Stellen in `FoodItemEditorModal.tsx`:

1. **Zeile 414**: Wenn du eine Food-Suggestion auswählst, wird `setForm({...})` mit einem neuen Objekt aufgerufen, das **keinen `barcode`** enthält → Barcode weg.
2. **Zeile 177**: Der initiale State hat keinen `barcode`.

Danach wird beim Community-Teilen `item.barcode` als `undefined` erkannt → das `custom_products`-Update wird übersprungen → beim nächsten Scan kommen die alten Werte.

### Lösung

**`src/components/meals/FoodItemEditorModal.tsx`** — Barcode bei allen `setForm`-Aufrufen beibehalten:

1. Bei Suggestion-Auswahl (Zeile 414): `barcode: form.barcode` mit übergeben, damit der Barcode erhalten bleibt.
2. Bei `handleSave` (Zeile 429): Der `...form` Spread enthält den Barcode bereits — hier ist nichts zu ändern, solange `form.barcode` gesetzt ist.

### Dateien
- `src/components/meals/FoodItemEditorModal.tsx` — Barcode bei Suggestion-Auswahl bewahren (~1 Zeile)

