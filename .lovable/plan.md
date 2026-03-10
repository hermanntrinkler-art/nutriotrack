

## Favoriten-Dialog wie FDDB gestalten

Der reguläre Lebensmittel-Detail-Drawer (`FoodDetailDrawer`) hat bereits genau dieses FDDB-Muster: Mengen-Input mit Einheit, "Eintragen"-Button und Schnelleintrag-Presets. Der Favoriten-Dialog ist dagegen nur ein einfaches Eingabefeld.

### Vorschlag

Den Favoriten-Portionspicker an den bestehenden `FoodDetailDrawer`-Stil angleichen:

1. **Makro-Anzeige oben** — kcal, Fett, KH, Protein als 4er-Grid (skaliert auf aktuelle Menge)
2. **Mengen-Input mit +/- Buttons und Einheit** — wie im FoodDetailDrawer
3. **"Eintragen"-Button** — prominent darunter
4. **Schnelleintrag-Presets** — z.B. "Originalrezept (262 ml)", "Glas (200 ml)", "100 ml" mit Nährwert-Vorschau und Plus-Button zum direkten Hinzufügen

### Änderung

**`src/components/meals/FoodSearchScreen.tsx`** — Den Favoriten-Dialog (`Dialog` bei Zeile ~558) erweitern:
- Drawer statt Dialog verwenden (konsistent mit FoodDetailDrawer)
- Makro-Grid oben anzeigen (skaliert)
- +/- Stepper + Input + Einheits-Label
- "Eintragen"-Button
- Schnelleintrag-Sektion mit Presets:
  - Originalrezept (exakte Gesamtmenge)
  - Glas (200 ml) — wenn Einheit ml
  - Portion (250 ml) — wenn Einheit ml
  - 100 g/ml
  - Becher (400 ml) — wenn Einheit ml
- Jeder Preset zeigt Nährwerte und kann direkt per Plus-Button hinzugefügt werden

