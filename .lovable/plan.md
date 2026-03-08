

## Plan: Internationale Badge-Namen + lokalisierte Share-Texte

### Konzept
Badge-Namen bleiben **immer auf Englisch** (international erkennbar). Dazu kommt eine **lokalisierte Beschreibung/Motivationstext** je nach Spracheinstellung, die beim Teilen als Social-Media-Text verwendet wird.

### Beispiele
| Badge (EN) | Share-Text (DE) | Share-Text (EN) |
|---|---|---|
| First Meal | Meine erste Mahlzeit mit NutrioTrack geloggt! 🍽️ | Just logged my first meal with NutrioTrack! 🍽️ |
| 7-Day Streak | 7 Tage am Stück – Disziplin zahlt sich aus! 🔥 | 7 days in a row – consistency pays off! 🔥 |
| 100 Meals | 100 Mahlzeiten getrackt – was für eine Reise! 🏆 | 100 meals tracked – what a journey! 🏆 |
| Goal Reached | Zielgewicht erreicht! Alles ist möglich! 🎯 | Goal weight reached! Anything is possible! 🎯 |

### Änderungen

**1. `src/components/AchievementsBadges.tsx`**
- Badge-Titel werden nur noch auf Englisch definiert (kein `de ? ... : ...` mehr für `title`)
- `desc` wird weiterhin lokalisiert (DE/EN) als kurze Erklärung
- Neues Feld `shareText` pro Badge mit lokalisiertem Social-Media-Text (motivierend, mit Emoji)
- Einzelne Badges bekommen einen eigenen Share-Button, der `shareText` + Share-Image nutzt

**2. `src/lib/share-image.ts`**
- `generateShareImage` erhält optionalen Parameter `badgeTitle` und `shareText`
- Wenn ein einzelnes Badge geteilt wird: Badge-Name groß im Bild + motivierender Text darunter
- Allgemeines Teilen bleibt wie bisher (Gesamtübersicht)

**3. Share-Text bei `navigator.share`**
- Der `text`-Parameter in `shareImage()` wird dynamisch: Wenn ein `shareText` übergeben wird, wird dieser statt des generischen Textes verwendet

