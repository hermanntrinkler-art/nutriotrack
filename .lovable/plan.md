

## Problem

Die Supabase Gateway uberschreibt den `Content-Type` Header der Edge Function von `text/html` auf `text/plain`. Facebooks Crawler kann deshalb die OG-Tags nicht lesen und zeigt nur die nackte Domain "ygiknwgqmsfksgjgwwji.supabase.co".

Das wurde durch direktes Fetchen der URL bestatigt - die HTML-Inhalte sind korrekt (Titel, Bild, Beschreibung), werden aber als Klartext ausgeliefert.

## Losung

Zwei Anderungen, um das Problem zu umgehen:

### 1. Edge Function: Headers-Konstruktion andern

Die `Content-Type` Header-Setzung muss anders konstruiert werden, um die Gateway-Uberschreibung zu umgehen. Wir verwenden das `Headers`-Objekt explizit und setzen zusatzlich `X-Content-Type-Options: nosniff`:

```typescript
// In supabase/functions/share-badge/index.ts
const responseHeaders = new Headers();
responseHeaders.set('content-type', 'text/html; charset=utf-8');
responseHeaders.set('cache-control', 'public, max-age=3600');
responseHeaders.set('x-content-type-options', 'nosniff');
responseHeaders.set('access-control-allow-origin', '*');
responseHeaders.set('access-control-allow-headers', 'authorization, x-client-info, apikey, content-type');

return new Response(html, { status: 200, headers: responseHeaders });
```

### 2. Fallback: `og:url` auf App-Domain zeigen

Statt `req.url` (interne Supabase-URL) immer die App-Origin verwenden:

```typescript
const ogCanonicalUrl = safeOrigin 
  ? `${safeOrigin}/share/${badgeId}` 
  : `https://id-preview--5f3fe5d0-5358-4723-9618-5f168297cbde.lovable.app/share/${badgeId}`;
```

### 3. Edge Function neu deployen

Nach den Anderungen muss die Funktion neu deployed werden. Falls `Content-Type: text/plain` weiterhin von der Gateway erzwungen wird, brauchen wir einen komplett anderen Ansatz (z.B. die Share-Bilder direkt als Storage-URLs teilen ohne HTML-Zwischenseite).

## Technische Details

- Problem: Supabase Edge Function Gateway uberschreibt `Content-Type: text/html` mit `text/plain`
- Datei: `supabase/functions/share-badge/index.ts` - Response-Konstruktion andern
- Deployment: Edge Function muss neu deployed werden

