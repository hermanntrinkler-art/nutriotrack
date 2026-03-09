

## Empfehlung: Alles über die Suche -- ein einziger, linearer Flow

Der einfachste Ansatz: Die **Lebensmittel-Suche wird zum zentralen Ort** für alles. Kein Hin-und-Her zwischen verschiedenen Screens.

### So funktioniert es für den User

1. Mahlzeit-Typ wählen (Frühstück, Mittag...)
2. **"Lebensmittel suchen"** antippen
3. Im Suchfeld tippen, Item antippen → landet im Warenkorb unten
4. Weiteres Item suchen, antippen → landet auch im Warenkorb
5. Wenn 2+ Items im Warenkorb: automatisch erscheint ein goldener **"⭐ Als Favorit speichern"**-Button direkt im Warenkorb
6. Fertig. Nächstes Mal erscheint der Favorit direkt in der Suche.

### Konkrete Änderungen

#### 1. FoodSearchScreen.tsx -- "Als Favorit speichern" in den Warenkorb
- Der Warenkorb unten (der die ausgewählten Items zeigt) bekommt einen **⭐-Button**, sobald 2+ Items ausgewählt sind
- Tap → Name-Eingabe-Dialog (ein einfaches Textfeld + Bestätigen) → gespeichert
- Kein Verlassen des Screens, kein Review-Schritt nötig

#### 2. MealsPage.tsx -- "Manuelle Eingabe" entfernen oder vereinfachen
- Den separaten "Manuelle Eingabe"-Button entfernen (oder in die Suche integrieren als "Eigenes Produkt erstellen")
- Das reduziert Verwirrung: es gibt nur noch EINEN Weg, Items zusammenzustellen
- Die Suche hat bereits die gesamte Funktionalität (600+ Lebensmittel, Online-Datenbank, Fuzzy-Search)

#### 3. FoodSearchScreen.tsx -- Favoriten-Speicher-Dialog
- Kleines Inline-Modal: Textfeld für den Namen, optional Emoji-Auswahl (3-4 vorgefertigte), Bestätigen
- Nutzt die bestehende `saveAsRecipe`-Funktion

### Betroffene Dateien
- `src/components/meals/FoodSearchScreen.tsx` -- Favorit-speichern-Button im Warenkorb + Name-Dialog
- `src/pages/MealsPage.tsx` -- "Manuelle Eingabe" entfernen oder zusammenführen

### Warum dieser Ansatz?
- **Ein Ort für alles**: User muss nicht wissen, ob er "manuell" oder "suchen" will
- **Linear**: Suchen → Auswählen → Optional speichern. Fertig.
- **Kein Hin-und-Her**: Kein Wechsel zwischen Review/Suche/Favoriten-Screens
- **Selbsterklärend**: Der ⭐-Button erscheint genau dann, wenn er Sinn macht (2+ Items)

