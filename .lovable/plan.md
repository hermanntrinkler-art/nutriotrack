

## Plan: OpenFoodFacts-Suche verbessern – mehr Ergebnisse, bessere Relevanz

**Problem**: Die Online-Suche holt aktuell nur **8 Ergebnisse** von `world.openfoodfacts.org`. Bei generischen Begriffen wie "Lamm" kommen oft irrelevante oder gar keine Treffer, weil die globale Suche schlecht mit deutschen Begriffen funktioniert.

### Änderungen

**1. `src/lib/openfoodfacts-search.ts`** — Suche deutlich verbessern:

- **Länderspezifische URL**: `de.openfoodfacts.org` für `lang=de`, `world.openfoodfacts.org` für `en` — liefert relevantere Ergebnisse für deutsche Suchbegriffe
- **Mehr Ergebnisse**: `page_size` von 8 auf **20** erhöhen
- **Bessere Sortierung**: `sort_by=unique_scans_n` hinzufügen (beliebteste Produkte zuerst)
- **Zusätzliche Felder**: `serving_size` und `product_quantity` für bessere Mengeninfos abrufen
- **Slice auf 15** statt 8 — mehr Vielfalt in den Ergebnissen

**2. `src/components/meals/FoodSearchScreen.tsx`** — Mehr Online-Ergebnisse anzeigen:

- Gesamtlimit der gemergten Ergebnisse von **25 auf 40** erhöhen
- Online-Ergebnisse werden bereits mit 🌐-Icon markiert — das bleibt

### Technisches Detail

```text
Vorher:  world.openfoodfacts.org?...&page_size=8
Nachher: de.openfoodfacts.org?...&page_size=20&sort_by=unique_scans_n
```

Die länderspezifische Domain priorisiert Produkte, die in DE/AT/CH gescannt wurden — dadurch kommen bei "Lamm" tatsächlich Lammfleisch-Produkte statt z.B. ein Markenname aus Brasilien.

