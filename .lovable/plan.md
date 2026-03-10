

## Rezept direkt erstellen — Stücklisten-Modus

### Problem
Um ein Rezept (z.B. "Mandelmilch") zu erstellen, muss man aktuell erst eine Mahlzeit loggen und dann als Favorit speichern. Das ist umständlich. Der User will einfach: Name eingeben → Zutaten zusammensuchen → Speichern.

### Lösung
Einen **"+ Neues Rezept"**-Button im Favoriten- und Rezepte-Tab hinzufügen, der einen eigenen Mini-Flow öffnet:

1. **Name & Emoji** eingeben (z.B. "Mandelmilch" 🥛)
2. **Zutaten suchen & hinzufügen** — die bestehende `FoodSearchScreen`-Suche wiederverwenden, aber statt "Speichern als Mahlzeit" → "Als Rezept speichern"
3. **Fertig** — Rezept wird in `saved_recipes` + `saved_recipe_items` gespeichert

### Betroffene Dateien

**`src/components/meals/CreateRecipeScreen.tsx`** (neu)
- Kompakter Screen: Name/Emoji-Input oben, dann FoodSearch darunter
- Eigener BottomCart mit "Rezept speichern"-Button statt "Mahlzeit speichern"
- Nutzt `saveAsRecipe()` aus `SavedRecipesScreen.tsx`

**`src/components/meals/SavedRecipesScreen.tsx`**
- "Neues Rezept erstellen"-Button oben hinzufügen
- State `showCreate` → wenn true, `CreateRecipeScreen` rendern
- Nach dem Speichern: Liste neu laden, zurück zur Übersicht

**`src/pages/MealsPage.tsx`**
- Keine Änderung nötig, da `SavedRecipesScreen` in beiden Tabs (Favoriten + Rezepte) bereits eingebunden ist

### Flow
```text
Favoriten/Rezepte-Tab
  └─ [+ Neues Rezept] Button
       └─ Name: "Mandelmilch"  Emoji: 🥛
       └─ Suche: "Wasser" → 150 ml hinzufügen
       └─ Suche: "Mandeln" → 110 g hinzufügen  
       └─ Suche: "Chunky Flavor" → Menge hinzufügen
       └─ [Rezept speichern] → fertig, zurück zur Liste
```

### Keine DB-Änderung nötig
Die bestehenden Tabellen `saved_recipes` + `saved_recipe_items` decken alles ab.

