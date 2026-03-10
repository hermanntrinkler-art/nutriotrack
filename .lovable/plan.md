

## Portionslöffel-Einheit für Chunky Flavour & Co.

### Problem
Chunky Flavour hat 3g pro Portionslöffel, aber im Editor kann man nur g/ml/TL/EL/Stück wählen. Der User muss manuell 6g eintippen statt einfach "2 Portionen" zu wählen.

### Lösung
Eine neue Einheit **"Portion"** zum Editor hinzufügen, mit einem pro-Lebensmittel definierten Grammwert (ähnlich wie `gram_per_piece` für Stück).

### Änderungen

**`src/lib/food-database.ts`**
- `FoodEntry`-Interface: Neues optionales Feld `gram_per_portion?: number`
- Chunky Flavour Einträge: `gram_per_portion: 3` hinzufügen, Default-Menge auf `2` Portionen (= 6g) setzen, `unit: 'Portion'`
- Weitere Lebensmittel mit bekannten Portionsgrößen bekommen ebenfalls `gram_per_portion` (z.B. Proteinpulver ~30g/Scoop)

**`src/components/meals/FoodItemEditorModal.tsx`**
- `UNIT_TO_GRAMS`: `'Portion': 0` hinzufügen (dynamisch, wie Stück)
- `UNIT_OPTIONS_DE/EN`: `{ value: 'Portion', label: 'Portion (Messlöffel)' }` hinzufügen
- Neues Lookup `PORTION_WEIGHTS` analog zu `PIECE_WEIGHTS`, z.B. `'chunky': 3, 'proteinpulver': 30`
- `getGramsEquivalent()`: Wenn `unit === 'Portion'`, Grammwert aus `PORTION_WEIGHTS` nachschlagen
- `handleUnitChange()`: Korrekte Umrechnung g↔Portion unterstützen

### Flow nach Änderung
```text
Chunky Flavour auswählen
  → Default: 2 Portion (= 6g, 18 kcal)
  → Menge ändern: 1 Portion → 3g, 9 kcal
  → Oder Einheit auf "g" wechseln → 6g, 18 kcal
```

