

## Magnesium-Eintrag anpassen & zur Community teilen

### Aktueller Stand
- Du kannst gespeicherte Mahlzeiten über die Edit-Seite (`/meals/:id/edit`) öffnen und dort Nährwerte anpassen
- **Aber**: Es gibt aktuell keinen Button, um ein bearbeitetes Produkt nachträglich in die öffentliche Community-Datenbank zu veröffentlichen
- Community-Einträge werden bisher nur beim ersten Barcode-Scan (manuelles Anlegen) automatisch erstellt

### Änderung

**`src/pages/EditMealPage.tsx`**:
- Pro Food-Item einen "Zur Community teilen"-Button (👥-Icon) hinzufügen
- Beim Klick: Das einzelne Item mit den aktuellen (ggf. korrigierten) Nährwerten in `community_products` einfügen
- Profil-Daten (display_name, avatar_emoji) werden für den Contributor-Eintrag geladen
- Nach dem Teilen: Erfolgsmeldung und Button wird deaktiviert/zum Häkchen
- Optional: Barcode-Feld, Brand und Store können mitgegeben werden wenn vorhanden

### Ablauf für dich
1. Mahlzeit antippen → Edit-Seite öffnet sich
2. Nährwerte korrigieren (z.B. pro Tablette)
3. 👥-Button am Item drücken → wird öffentlich in der Community-Datenbank gespeichert
4. Andere Nutzer finden das Produkt dann bei der Suche

### Dateien
- `src/pages/EditMealPage.tsx` — Share-Button pro Item + Community-Insert-Logik

