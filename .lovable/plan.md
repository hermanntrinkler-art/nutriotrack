

## Plan: Einheitlicher Tagebuch-Eintrag wie FDDB

### Konzept
Statt 4 separate Buttons (Suche, Foto, Upload, Barcode) auf dem `select-method`-Screen wird ein **einziger "Tagebucheintrag"-Screen** mit horizontalen Tabs geöffnet – genau wie im FDDB-Screenshot:

```text
× Tagebucheintrag                    +
──────────────────────────────────────
Suche | Favoriten | Rezepte/Listen | Aktivitäten
──────────────────────────────────────
🔍 Lebensmittel suchen          [|||]
```

### Änderungen in `src/pages/MealsPage.tsx`

1. **`select-method`-Step ersetzen** durch einen Tab-basierten Screen:
   - **Tab "Suche"**: Suchfeld + Barcode-Button rechts daneben (wie FDDB). Darunter Ergebnisse. Foto/Upload als kleiner sekundärer Button am Ende.
   - **Tab "Favoriten"**: Gespeicherte Favoriten-Liste (aus FoodSearchScreen-Logik).
   - **Tab "Rezepte/Listen"**: SavedRecipesScreen inline eingebettet.
   - **Tab "Aktivitäten"**: Aktivitäten-Eingabe (Presets + manuell), aktuell im Sheet – wird direkt als Tab-Inhalt gezeigt.

2. **Header**: "× Tagebucheintrag" mit X-Button links (zurück zur Übersicht) und +-Button rechts (manueller Eintrag).

3. **Suche-Tab**: Die bestehende `FoodSearchScreen`-Komponente wird inline gerendert statt als eigener Step. Das Barcode-Icon sitzt rechts neben dem Suchfeld.

4. **Foto/Upload**: Kompakter Link oder kleiner Button unterhalb der Suchergebnisse ("📷 Per Foto erkennen"), statt eigener großer Cards.

### Dateien
- **`src/pages/MealsPage.tsx`**: `select-method`-Step durch Tab-Layout ersetzen, Aktivitäten-Sheet in Tab verschieben, Barcode inline neben Suchfeld, Foto/Upload als sekundäre Optionen.

### Vorteile
- Ein Tipp auf einen Mahlzeiten-Slot → sofort im Such-Tab, kein Zwischenschritt
- Alle Eingabemethoden (Suche, Favoriten, Rezepte, Aktivitäten) auf einem Screen erreichbar
- Barcode direkt neben dem Suchfeld, kein eigener Button

