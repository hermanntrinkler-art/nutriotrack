

## Problem

Wenn du ein Badge auf Facebook teilst, zeigt Facebook die **generischen OG-Tags** aus `index.html` (NutrioTrack – Smart Nutrition Tracking / Lovable-Logo) statt der Badge-spezifischen Daten.

**Ursache:** Die Share-URL zeigt auf `window.location.origin/share/badgeId` – das ist die React SPA. Facebooks Crawler kann kein JavaScript ausführen, sieht also nur die statischen Meta-Tags aus `index.html`. Die Edge Function `share-badge`, die korrektes HTML mit Badge-spezifischen OG-Tags generiert, wird gar nicht verwendet.

## Lösung

Die Facebook-Share-URL muss auf die **Edge Function** zeigen statt auf die SPA-Route.

### Änderung in `src/lib/share-image.ts`

Zeile 415 ändern von:
```typescript
const shareUrl = `${window.location.origin}/share/...`;
```
zu:
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const shareUrl = `${supabaseUrl}/functions/v1/share-badge?badge=${encodeURIComponent(badgeId)}&lang=${encodeURIComponent(language)}`;
```

Die Edge Function `share-badge` liefert bereits korrektes HTML mit:
- Badge-spezifischem `og:title` (z.B. "3-Tage-Streak – NutrioTrack")
- Badge-spezifischem `og:description` (der Share-Text)
- Badge-spezifischem `og:image` (das Badge-Bild)

Das ist die einzige Änderung die nötig ist – eine Zeile. Die Edge Function existiert bereits und funktioniert korrekt.

