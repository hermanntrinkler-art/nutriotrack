

## Plan: Aktivitäten-Tracking (verbrannte Kalorien)

### Konzept
Neuer "Aktivitäten"-Slot auf der Meals-Seite (unterhalb der Mahlzeiten-Slots), plus Anpassung des Ziel-Headers auf **Ziel − Gegessen + Verbrannt = Übrig**. Verbrannte Kalorien werden dem Tagesbudget gutgeschrieben.

### 1. Neue DB-Tabelle `activity_entries`

```sql
CREATE TABLE activity_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  activity_name text NOT NULL,
  duration_minutes integer,
  calories_burned numeric NOT NULL DEFAULT 0,
  emoji text DEFAULT '🏃',
  created_at timestamptz NOT NULL DEFAULT now()
);
-- RLS: User CRUD on own entries
-- Realtime not needed
```

### 2. Aktivitäten-Eingabe auf MealsPage
- Neuer Abschnitt nach den Mahlzeiten-Slots: "🏃 Aktivitäten" Card
- Tipp auf "+" öffnet ein kleines Modal/Sheet mit:
  - Vorgefertigte Aktivitäten (Gehen, Laufen, Radfahren, Krafttraining, Schwimmen, Yoga) mit geschätzten kcal/Minute
  - Felder: Aktivitätsname, Dauer (Min), verbrannte kcal (berechnet oder manuell überschreibbar)
- Gespeicherte Aktivitäten werden in der Card angezeigt (Name + kcal), löschbar

### 3. Ziel-Header Anpassung
Aktuell: `Ziel | Gegessen | Übrig`
Neu: `Ziel | Gegessen | Verbrannt | Übrig`
- `Übrig = Ziel - Gegessen + Verbrannt`
- "Verbrannt" in grüner Farbe mit Flame-Icon

### 4. Dashboard-Integration
- Dashboard-Remaining-Berechnung ebenfalls um `burned` erweitern
- DailyView (History) zeigt verbrannte Kalorien

### 5. Vorgefertigte Aktivitäten (kcal/min Schätzungen)
| Aktivität | kcal/min (ca.) | Emoji |
|-----------|---------------|-------|
| Gehen | 4 | 🚶 |
| Laufen | 10 | 🏃 |
| Radfahren | 7 | 🚴 |
| Krafttraining | 6 | 🏋️ |
| Schwimmen | 8 | 🏊 |
| Yoga | 3 | 🧘 |
| Sonstiges | manuell | ⚡ |

### Dateien
- **Migration**: Neue `activity_entries` Tabelle + RLS
- **`src/pages/MealsPage.tsx`**: Aktivitäten-Sektion + Modal, Header-Formel anpassen
- **`src/pages/DashboardPage.tsx`**: Burned-Kalorien in Remaining-Berechnung
- **`src/components/history/DailyView.tsx`**: Burned anzeigen
- **`src/lib/types.ts`**: `ActivityEntry` Interface

