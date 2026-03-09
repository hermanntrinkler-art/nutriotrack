

## Problem

Der User nutzt den Weg "Manuelle Eingabe" und findet dort keinen Plus-Button, Warenkorb oder Favoriten-Funktion. Diese Features existieren nur im "Lebensmittel suchen"-Flow. Das ist verwirrend — der User erwartet die Stücklisten-/Favoriten-Funktion überall.

## Plan

### Favoriten-Zugang zum Review-Schritt hinzufügen
Da der manuelle Weg direkt in den `review`-Schritt führt (wo Items bearbeitet werden), soll dort auch die Möglichkeit bestehen, Favoriten zu nutzen und zu erstellen:

1. **Im Review-Schritt**: Den bestehenden "Als Favorit speichern"-Button (goldener Stern) prominenter und immer sichtbar machen — nicht nur am Ende, sondern direkt unter den Food-Items
2. **"Aus Favoriten hinzufügen"-Button** im Review-Schritt ergänzen: Ein Button, der eine kleine Favoriten-Auswahl öffnet (Inline-Liste oder Modal), um Items aus einem gespeicherten Favorit direkt zu den aktuellen Items hinzuzufügen
3. **Such-Button im Review-Schritt**: Einen "Lebensmittel suchen"-Link hinzufügen, der zum `search`-Schritt wechselt und bei Rückkehr die Items zusammenführt

### Betroffene Dateien
- `src/pages/MealsPage.tsx` — Im Review-Abschnitt: Favoriten-Auswahl-Button und "Suche öffnen"-Option hinzufügen, Favoriten-Speichern-Button besser positionieren

