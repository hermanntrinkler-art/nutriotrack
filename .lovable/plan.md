

## Schnelleingabe über den Plus-Button

### Was sich ändert

1. **`src/pages/DashboardPage.tsx`** — Der FAB-Button navigiert zu `/meals?quick=1` statt nur `/meals`.

2. **`src/pages/MealsPage.tsx`** — Beim Laden wird der URL-Parameter `quick` geprüft. Wenn vorhanden:
   - `getSlotForTime` wird mit der aktuellen Uhrzeit aufgerufen → automatische Slot-Zuweisung (z.B. 8:30 → Frühstück, 12:30 → Mittagessen)
   - `step` wird direkt auf `'diary-entry'` gesetzt (überspringt die Overview)
   - Der Suchfeld-Input wird automatisch fokussiert
   - Der URL-Parameter wird nach dem Lesen entfernt (damit Zurück-Navigation normal funktioniert)

### Ablauf

```text
[+] Button drücken
  → /meals?quick=1
  → Uhrzeit erkennen (z.B. 08:01 → Frühstück)
  → Direkt Suchfeld mit Cursor
  → Eingabe → Eintragen → automatisch im richtigen Slot
```

### Dateien
- `src/pages/DashboardPage.tsx` — 1 Zeile (navigate URL)
- `src/pages/MealsPage.tsx` — ~10 Zeilen (useEffect für quick-mode + auto-focus)

