

## Plan: Rechtliche Links auf der Profilseite

Vier dezente Links (Impressum, Datenschutz, AGB, Datenlöschung) als kleine Text-Links unterhalb des Logout-Buttons auf der Profilseite einfügen.

### Änderung

**`src/pages/ProfilePage.tsx`** (nach dem Logout-Button, ca. Zeile 491):
- Neuen `motion.div` Block mit vier `Link`-Elementen (aus react-router-dom) einfügen
- Styling: `text-xs text-muted-foreground` mit Dot-Separatoren (`·`), zentriert
- Links: `/impressum`, `/datenschutz`, `/agb`, `/datenloeschung`
- Zweisprachig (DE/EN Labels je nach `language`)

