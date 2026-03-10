

## Plan: Dashboard aufräumen – Fokus auf Meal-Tracking

### Problem
Das Dashboard hat aktuell ~15 Sektionen, die man durchscrollen muss, bevor man eine Mahlzeit tracken kann. Sekundäre Widgets (7-Tage Trend, 30-Tage Heatmap, Wochenreport, Gestern-Vergleich, Mikronährstoffe) nehmen viel Platz ein.

### Lösung

**1. Dashboard-Layout umstrukturieren (DashboardPage.tsx)**
- **Oben fixiert**: Header + großer "Mahlzeit tracken" FAB-Button (Floating Action Button) — immer sichtbar
- Reihenfolge neu:
  1. Header + Greeting
  2. Kalorienring + Makro-Ringe (kompakter, in einer Card kombiniert)
  3. Heutige Mahlzeiten + "Mahlzeit hinzufügen" Button
  4. Streak + Motivational Message (kompakter, einzeilig)
  5. Wasser-Tracker
  6. Hints
  7. **Ausblendbare Sektion** "Statistiken" (collapsed by default): Gestern-Vergleich, 7-Tage Trend, 30-Tage Heatmap, Wochenreport, Mikronährstoffe

**2. Ausblendbare Statistiken-Sektion**
- Collapsible-Bereich mit Chevron-Toggle: "📊 Statistiken anzeigen"
- State wird in `localStorage` gespeichert (`dashboard_stats_collapsed`)
- Enthält: Yesterday Comparison, 7-Day Trend, Calendar Heatmap, Weekly Report, Micronutrients

**3. Einstellungen in ProfilePage (optional toggle)**
- Neuer Abschnitt "Dashboard-Widgets" in den Einstellungen
- Checkboxen für: 7-Tage Trend, 30-Tage Heatmap, Wochenreport, Gestern-Vergleich, Mikronährstoffe
- Gespeichert in `localStorage` (`dashboard_hidden_widgets`)
- Dashboard liest diese Settings und blendet Widgets entsprechend aus

**4. Floating Action Button**
- Runder "+" Button unten rechts (über BottomNav), navigiert direkt zu `/meals`
- Immer sichtbar, egal wo man scrollt

### Dateien
- `src/pages/DashboardPage.tsx` — Umstrukturierung, Collapsible Stats, FAB, Widget-Visibility
- `src/pages/ProfilePage.tsx` — Dashboard-Widget-Toggles hinzufügen

### Kein Backend nötig
Alles via `localStorage` — keine DB-Migration erforderlich.

