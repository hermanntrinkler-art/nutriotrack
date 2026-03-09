

## Idee: Favoriten als "Kombinations-Rezepte" direkt in der Suche

Das Konzept ist wie eine **Stückliste**: Ein Favorit besteht aus mehreren Einzelprodukten (z.B. "Kaffee schwarz" + "Sahne 50g") und kann mit einem Tap als komplette Kombination hinzugefügt werden.

### Änderungen

#### 1. Favoriten in die Food-Suche integrieren
- In `FoodSearchScreen.tsx` die gespeicherten Favoriten laden und **oberhalb** der Suchergebnisse als eigene Sektion "⭐ Favoriten" anzeigen
- Bei Tap auf einen Favoriten werden alle enthaltenen Items auf einmal in die `selectedItems`-Liste übernommen
- So findet man Favoriten genau dort, wo man auch einzelne Lebensmittel sucht -- kein extra Schritt nötig

#### 2. Favoriten direkt aus der Suche erstellen
- Im Review-Schritt (nach Auswahl mehrerer Items) den "Als Favorit speichern"-Button beibehalten
- Zusätzlich: In der Suche selbst, wenn mehrere Items ausgewählt sind, einen kleinen "⭐ Als Favorit speichern"-Button in der Warenkorb-Leiste unten anzeigen
- Beim Speichern: Name eingeben (z.B. "Mein Frühstückskaffee"), Emoji wählen, fertig

#### 3. Favoriten durchsuchbar machen
- Wenn der User in der Suche tippt (z.B. "Kaffee"), werden auch passende Favoriten gefiltert und angezeigt
- So erscheint "Mein Frühstückskaffee ☕" direkt bei der Suche nach "Kaffee"

### Betroffene Dateien
- `src/components/meals/FoodSearchScreen.tsx` -- Favoriten-Sektion laden, anzeigen, durchsuchbar machen, Quick-Add bei Tap
- `src/pages/MealsPage.tsx` -- Optional: "Als Favorit speichern" im Review-Schritt bleibt erhalten
- `src/components/meals/SavedRecipesScreen.tsx` -- Bestehende Logik wird mitgenutzt (saveAsRecipe-Funktion)

### Kein DB-Schema-Change nötig
Die bestehenden Tabellen `saved_recipes` und `saved_recipe_items` decken das Kombinations-Konzept bereits ab.

