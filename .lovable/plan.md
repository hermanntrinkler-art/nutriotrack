

## Problem

Gespeicherte Mahlzeit-Artikel in der Übersicht sind nicht anklickbar. Der Nutzer kann sie nach dem Speichern nicht mehr ansehen oder bearbeiten — nur löschen.

## Lösung

Die Mahlzeit-Zeilen in der Slot-Übersicht anklickbar machen, sodass sie zur bestehenden Edit-Seite (`/meals/:id/edit`) navigieren.

### Änderung

**`src/pages/MealsPage.tsx`** (Zeilen ~509-535):
- Den Mahlzeit-Container (`div`) zu einem klickbaren Element machen
- Bei Klick: `navigate(`/meals/${meal.id}/edit`)` aufrufen
- Cursor-Pointer hinzufügen, visuelles Feedback bei Hover
- Der Lösch-Button behält `e.stopPropagation()` (schon vorhanden)

Einzige Datei, eine kleine Änderung: Der `div` um jede Mahlzeit bekommt einen `onClick`-Handler mit Navigation zur Edit-Seite.

