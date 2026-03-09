

## Plan: Dedizierte Share-Buttons für Facebook, WhatsApp & Instagram

### Problem
Der aktuelle einzelne Share-Button nutzt `navigator.share` (funktioniert nicht im iframe) oder lädt nur das Bild herunter. Der User will direkte Buttons für die drei Plattformen.

### Lösung

Den einzelnen Share2-Button durch drei separate Icons ersetzen:

**1. Facebook** — Öffnet `https://www.facebook.com/sharer/sharer.php?u=APP_URL&quote=SHARE_TEXT` in neuem Tab. Da wir kein OG-Image kontrollieren können, wird zusätzlich das Badge-Bild heruntergeladen mit Toast-Hinweis "Bild heruntergeladen — füge es als Foto zu deinem Post hinzu".

**2. WhatsApp** — Öffnet `https://wa.me/?text=SHARE_TEXT` direkt. WhatsApp braucht kein Bild in der URL, aber wir laden das Badge-Bild zusätzlich herunter damit der User es anhängen kann.

**3. Instagram** — Instagram hat keine Web-Share-API. Wir laden das Bild herunter und zeigen einen Toast: "Bild heruntergeladen — öffne Instagram und teile es als Story/Post".

### UI-Änderungen (AchievementsBadges.tsx)

- Ersetze den einzelnen `Share2`-Button im Badge-Detail-Bereich (Zeilen 423-432) durch drei nebeneinander liegende runde Buttons mit SVG-Icons für Facebook (blau), WhatsApp (grün), Instagram (gradient pink/orange)
- Jeder Button generiert das Share-Image via `generateShareImage()` und führt die plattformspezifische Aktion aus
- Loading-State pro Plattform

### Neue Hilfsfunktionen (share-image.ts)

```typescript
export async function shareToFacebook(blob: Blob, shareText: string, language: 'de' | 'en')
export async function shareToWhatsApp(blob: Blob, shareText: string, language: 'de' | 'en') 
export async function shareToInstagram(blob: Blob, language: 'de' | 'en')
```

Jede Funktion: Bild herunterladen + plattformspezifische URL öffnen (Facebook/WhatsApp) oder nur Download + Toast (Instagram).

### Dateien
- `src/lib/share-image.ts` — drei neue Export-Funktionen
- `src/components/AchievementsBadges.tsx` — Badge-Detail UI mit drei Share-Buttons

