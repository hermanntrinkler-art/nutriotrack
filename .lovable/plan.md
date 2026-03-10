

## Rezept-Zutaten direkt hinzufügen statt über Umweg

### Problem
Beim Erstellen eines Rezepts öffnet sich die volle `FoodSearchScreen` mit eigenem Warenkorb. Der User muss dort Zutaten sammeln und dann "Speichern" klicken, um zurück zum Rezept zu kommen. Das ist umständlich — man will einfach auf "+" klicken und die Zutat erscheint sofort in der Rezept-Zutatenliste.

### Lösung
Die `FoodSearchScreen` im Rezept-Modus so anpassen, dass jeder Klick auf "+" das Item sofort zum Rezept hinzufügt und automatisch zurück zum Rezept-Screen navigiert (oder die Suche inline hält mit sichtbarer Zutatenliste).

**Gewählter Ansatz**: Beim Klick auf "+" wird das Item direkt an `CreateRecipeScreen` übergeben und die Suche geschlossen. Der User sieht sofort sein Rezept mit der neuen Zutat und kann über "+ Zutat hinzufügen" weitere suchen.

### Betroffene Dateien

**`src/components/meals/CreateRecipeScreen.tsx`**
- `handleSaveFromSearch` erhält ein einzelnes Item (oder Array) und schließt die Suche sofort
- Keine Änderung nötig — funktioniert bereits so, da `onSave` aufgerufen wird und `showSearch` auf `false` gesetzt wird

**`src/components/meals/FoodSearchScreen.tsx`**
- Neues Prop: `singleAddMode?: boolean`
- Wenn `singleAddMode=true`: Klick auf "+" ruft sofort `onSave([item])` auf statt es nur in den internen Warenkorb zu legen
- BottomCart wird im `singleAddMode` ausgeblendet, da nicht benötigt

**`src/components/meals/CreateRecipeScreen.tsx`**
- `FoodSearchScreen` mit `singleAddMode={true}` aufrufen
- So wird jede Zutat einzeln hinzugefügt und der User kommt sofort zurück zum Rezept

### Flow nach Änderung
```text
Rezept-Screen (Mandelmilch 🥛)
  ├─ Zutaten: [leer]
  └─ [+ Zutat hinzufügen] → Suche öffnet sich
       └─ "mandeln" suchen → [+] klicken
            └─ Sofort zurück zum Rezept-Screen
                 ├─ Zutaten: [Mandeln 30g]
                 └─ [+ Zutat hinzufügen] → nächste Zutat suchen
```

