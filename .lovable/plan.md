

## Problem

Der "Als Favorit speichern"-Button befindet sich ganz unten im Review-Schritt (nach der Analyse), unter den Nährwert-Details. Man muss scrollen und er ist leicht zu übersehen, weil er nur ein outline-Button ist.

## Plan

### 1. Button prominenter platzieren
- Den "⭐ Als Favorit speichern"-Button direkt **über** den Aktions-Buttons (Abbrechen/Speichern) platzieren, mit mehr visuellem Gewicht
- Statt `variant="outline"` einen auffälligeren Stil verwenden: goldener/gelber Hintergrund mit Stern-Icon
- Visuell absetzen mit einer Trennlinie oder einem eigenen Card-Container

### 2. Auch nach dem Speichern anbieten
- In der `SaveMealConfirmation`-Ansicht (nach erfolgreichem Speichern) ebenfalls einen "Als Favorit speichern"-Button anzeigen, falls noch nicht als Favorit gespeichert
- So kann der User auch nachträglich entscheiden

### Betroffene Dateien
- `src/pages/MealsPage.tsx` — Button-Styling und Positionierung verbessern, Option in Confirmation-Screen einbauen

