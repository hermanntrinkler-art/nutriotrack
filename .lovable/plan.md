

## Problem

Beim Facebook-Sharing wird die Domain **ygiknwgqmsfksgjgwwji.supabase.co** angezeigt statt **nutriotrack.com**, weil die geteilte URL auf den Supabase-Storage-Bucket zeigt. Außerdem fehlt der Share-Text (og:description) in der Facebook-Vorschau.

## Ursache

Die Funktion `shareToFacebook` ruft die Edge Function `share-badge` auf, die eine HTML-Datei in den Supabase-Storage hochlädt und dessen URL zurückgibt. Facebook zeigt dann diese Storage-Domain an.

## Lösung

1. **`shareToFacebook` in `src/lib/share-image.ts`**: Statt die Storage-URL zu verwenden, direkt `https://nutriotrack.com/share/badge/${badgeId}` als Share-URL nutzen. Das zeigt die korrekte Domain in Facebook.

2. **Edge Function `share-badge`**: Die `og:url` auf `https://nutriotrack.com/share/badge/${badgeId}` setzen und die HTML-Seite weiterhin generieren — aber die Share-URL im Client wird jetzt die nutriotrack.com-URL.

3. **`index.html`**: Dynamische OG-Tags sind in einer SPA nicht möglich. Daher gute Default-OG-Tags setzen (Titel, Beschreibung, Bild), die Facebook beim Crawlen der `/share/badge/...`-Route findet.

4. **Alternative**: Die Edge Function direkt als HTML-Response nutzen (statt Storage-Upload), und die Share-URL als Edge-Function-URL beibehalten, aber `og:url` auf nutriotrack.com setzen. Facebook zeigt die Domain aus der tatsächlichen URL — daher muss die geteilte URL nutriotrack.com sein.

### Einschränkung
Da die App eine SPA ist, kann Facebook beim Crawlen von `nutriotrack.com/share/badge/streak_3` nur die statischen Meta-Tags aus `index.html` lesen. Badge-spezifische OG-Tags (Titel, Beschreibung, Bild pro Badge) sind ohne Server-Side Rendering nicht möglich. Die Share-Vorschau zeigt dann den allgemeinen NutrioTrack-Titel/Beschreibung — der badge-spezifische Text geht über den `quote`-Parameter mit.

