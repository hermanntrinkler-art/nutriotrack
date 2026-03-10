

## Mahlzeiten-Flow vereinfachen: Von 3 Schritten auf 2

### Problem
Aktuell braucht man 3 Screens um eine Mahlzeit zu speichern:
1. Overview → Slot antippen
2. Diary Entry → Suchen, Lebensmittel auswählen → "Übernehmen" klicken
3. Review → Nochmal alle Items sehen, Mengen anpassen → "Speichern"

Der Review-Screen zeigt im Grunde das gleiche nochmal wie die Auswahl in der Suche. Das sind zu viele Klicks.

### Lösung: Suche und Review zusammenführen

**Statt 3 Screens → 2 Screens:**

```text
Overview → Slot tippen → Kombinierter Such-/Review-Screen → Speichern
```

**Kombinierter Screen (ersetzt Diary Entry + Review):**
- Oben: Suchleiste + Kategorien + Barcode/Foto-Buttons (wie bisher)
- Mitte: Suchergebnisse / Favoriten / Rezepte (Tabs bleiben)
- Unten (sticky): Warenkorb-Leiste mit ausgewählten Items
  - Zeigt Anzahl Items + Gesamt-kcal
  - Antippen klappt den Warenkorb auf → dort kann man Mengen anpassen (+/−), Items löschen, Details bearbeiten
  - "Speichern"-Button direkt im Warenkorb

**Vorteile:**
- Ein Schritt weniger
- Man kann weiter suchen während man schon Items im Warenkorb hat
- Mengenanpassung direkt im aufklappbaren Warenkorb
- "Als Favorit speichern" kommt in den Warenkorb-Bereich

### Technische Umsetzung

1. **FoodSearchScreen erweitern**: Bekommt die Review-Funktionalität (Mengen-Stepper, Editor-Modal, Speichern-Button) direkt integriert
2. **Neues BottomCart-Komponente**: Sticky am unteren Rand, aufklappbar per Tap
   - Collapsed: `"3 Items · 542 kcal  [Speichern]"`
   - Expanded: Vollständige Item-Liste mit +/− Steppern, Trash, Edit-Button, Favorit-speichern, Nährwert-Zusammenfassung
3. **MealsPage.tsx**: `step === 'review'` entfällt. `step === 'diary-entry'` wird zum einzigen Erfassungs-Screen. `handleSave` wird direkt aus FoodSearchScreen aufgerufen
4. **Foto/KI-Flow bleibt**: Nach KI-Analyse landen die Items direkt im Warenkorb des Such-Screens (Warenkorb klappt automatisch auf)

### Betroffene Dateien
- `src/components/meals/FoodSearchScreen.tsx` — Warenkorb + Speichern-Logik integrieren
- `src/pages/MealsPage.tsx` — Review-Step entfernen, Save-Logik an FoodSearchScreen übergeben
- Neue Komponente: `src/components/meals/BottomCart.tsx`

