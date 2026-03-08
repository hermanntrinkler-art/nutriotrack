

## So funktioniert Facebook-Sharing aktuell

### Was passiert beim Teilen?

Die App nutzt die **Web Share API** (`navigator.share`). Wenn du auf "Teilen" klickst:

1. **Auf dem Handy**: Das native Share-Menü öffnet sich → du wählst Facebook → Es wird gepostet:
   - **Bild**: Das generierte 1080×1080 Canvas-Bild (Badge + Stats auf dunklem Hintergrund)
   - **Text**: Der lokalisierte `shareText`, z.B. *"Meine erste Mahlzeit mit NutrioTrack geloggt! 🍽️"*

2. **Am Desktop / kein Share API**: Die Datei wird als PNG heruntergeladen → du müsstest sie manuell bei Facebook hochladen

### Was du NICHT beeinflussen kannst

Facebook zeigt bei **manuell hochgeladenen Bildern** nur das Bild + deinen eigenen Text. Das ist alles – kein Link-Preview, kein OG-Image.

### Was möglich wäre: Open Graph Meta Tags

Wenn NutrioTrack als **veröffentlichte Web-App** läuft und du einen **Link teilst** (statt ein Bild), kann Facebook die sogenannten **Open Graph Tags** lesen. Damit kontrollierst du:
- **og:title** → Titel im Facebook-Post
- **og:description** → Beschreibungstext
- **og:image** → Vorschaubild (das Badge-Bild)

### Vorschlag: Shareable Badge-Seite

Eine **öffentliche Badge-Seite** pro Achievement erstellen (z.B. `nutriotrack.app/badge/streak_7`), die:
- Open Graph Tags dynamisch setzt (Titel, Beschreibung, Badge-Bild)
- Beim Öffnen eine schöne Vorschau des Badges zeigt
- Einen CTA "Jetzt auch tracken" hat

So wird beim Teilen des Links auf Facebook automatisch ein schönes Preview generiert.

### Umsetzung

**1. Neue Route `/share/:badgeId`**
- Öffentlich zugänglich (kein Login nötig)
- Zeigt Badge-Bild, Titel, motivierenden Text, CTA-Button

**2. Backend-Funktion für OG-Tags**
- Edge Function die für `/share/:badgeId` dynamisches HTML mit OG-Tags liefert
- `og:image` zeigt auf das Badge-Bild (aus Storage oder Asset)
- `og:title`: z.B. "I unlocked 7-Day Streak on NutrioTrack!"
- `og:description`: der `shareText`

**3. Share-Logik erweitern**
- Statt nur Bild teilen → Option den Link zur Badge-Seite zu teilen
- Facebook, WhatsApp etc. zeigen dann automatisch das richtige Preview

**4. Admin-Einfluss**
- Share-Texte über die Admin-Seite editierbar machen (neues DB-Feld `share_texts` in `badge_images` Tabelle)
- So kannst du jederzeit ändern was bei Facebook als Text erscheint

