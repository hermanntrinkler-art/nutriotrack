

## Plan: Eigene Badge-Bilder statt Icons verwenden

Ja, das geht! Du kannst eigene Badge-Bilder (wie das hochgeladene "First Meal Logged") für jedes Achievement verwenden. 

### Ansatz

Statt der aktuellen Lucide-Icons (einfache Vektorsymbole) werden **PNG-Bilder** als Badge-Grafiken angezeigt. Das hochgeladene Bild wird als erstes Badge verwendet. Für die restlichen Badges können wir entweder:
- Weitere Bilder von dir verwenden (du lädst sie hoch)
- Bilder per AI generieren lassen (gleicher Stil wie dein Beispiel)

### Änderungen

**1. Badge-Bild als Asset speichern**
- Das hochgeladene Bild wird nach `src/assets/badges/first-meal.png` kopiert
- Für jedes weitere Badge wird ein eigenes Bild erwartet

**2. `src/components/AchievementsBadges.tsx`**
- `Achievement`-Interface: `icon` Feld von `React.ElementType` auf `string | React.ElementType` ändern (unterstützt sowohl Bild-URL als auch Fallback-Icon)
- Neues optionales Feld `badgeImage?: string` für den Import-Pfad
- Badge-Rendering: Wenn `badgeImage` vorhanden → `<img>` anzeigen (rund, mit Glow-Effekt bei unlocked), sonst Fallback auf Lucide-Icon wie bisher
- Nicht-freigeschaltete Badges bleiben ausgegraut (grayscale + opacity)

**3. `src/lib/share-image.ts`**
- Im Single-Badge-Modus: Das Badge-Bild statt des Trophy-Emoji im Canvas rendern (via `drawImage`)

### Nächster Schritt

Ich würde zunächst das erste Badge ("First Meal") einbauen. Für die restlichen Badges brauchst du entweder eigene Bilder oder ich kann sie per AI im gleichen Stil generieren lassen.

