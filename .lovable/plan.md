

## Fix: Drawer schließt sich beim Tippen auf dem Handy

### Problem
Der Vaul-Drawer interpretiert die Viewport-Änderung durch die mobile Tastatur als Wisch-Geste nach unten und schließt sich. Außerdem wird der Input-Bereich von der Tastatur verdeckt.

### Lösung

1. **`src/components/ui/drawer.tsx`** — `handleOnly` als Prop unterstützen, damit der Drawer NUR über den Griff (Handle-Bar) geschlossen werden kann, nicht durch Ziehen am Content.

2. **`src/components/meals/FoodDetailDrawer.tsx`** — 
   - `handleOnly={true}` auf dem Drawer setzen, damit Eingaben im Input nicht versehentlich den Drawer schließen.
   - Beim Fokussieren des Inputs mit `scrollIntoView` dafür sorgen, dass das Eingabefeld sichtbar über der Tastatur bleibt.

### Dateien
- `src/components/ui/drawer.tsx` — `handleOnly` Prop durchreichen
- `src/components/meals/FoodDetailDrawer.tsx` — `handleOnly` aktivieren + Input scroll-fix

