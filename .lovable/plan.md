

## FAB (+) Button global verfügbar machen

Der Plus-Button ist aktuell nur in `DashboardPage.tsx` eingebettet. Er sollte auf allen geschützten Seiten sichtbar sein, damit man von überall schnell eine Mahlzeit hinzufügen kann.

### Änderungen

1. **Neues Component `src/components/FloatingAddButton.tsx`** erstellen — extrahiert den FAB aus DashboardPage mit gleicher Logik (`navigate('/meals?quick=1')`). Auf der `/meals`-Seite wird er ausgeblendet (dort ist man ja schon).

2. **`src/components/BottomNav.tsx`** oder besser **`AppLayout` in `src/App.tsx`** — den FAB ins `AppLayout` einbauen, damit er automatisch auf allen geschützten Seiten mit BottomNav erscheint (Dashboard, History, Weight, Profile). Nicht auf Meals, da dort bereits die Eingabe läuft.

3. **`src/pages/DashboardPage.tsx`** — den bestehenden FAB-Code (Zeilen 670–681) entfernen, da er jetzt global ist.

### Technisches Detail

```text
AppLayout (App.tsx)
├── {children}        (aktuelle Seite)
├── <FloatingAddButton />   ← NEU, versteckt sich auf /meals
└── <BottomNav />
```

Der Button wird `position: fixed` beibehalten, `bottom-20 right-4 z-50`, identisch zum aktuellen Styling. Auf `/meals` und `/meals/:id/edit` wird er per `useLocation()` ausgeblendet.

