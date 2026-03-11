

## Kamera-Button mit Popup-Menü (Foto aufnehmen / Bild hochladen)

Der 📷-Button in der Suchleiste zeigt beim Tippen ein kleines Popover mit zwei Optionen: "Foto aufnehmen" und "Bild hochladen". So bleibt die Leiste clean mit nur 2 Icons (📷 + Barcode).

### Änderungen

**`src/components/meals/FoodSearchScreen.tsx`**:
- Neue Prop `onPhotoUpload` hinzufügen (neben bestehendem `onCameraOpen`)
- Den Kamera-Button (Zeilen 404–411) durch ein Radix `Popover` ersetzen, das zwei Optionen zeigt:
  - 📷 "Foto aufnehmen" → ruft `onCameraOpen` auf
  - 📁 "Bild hochladen" → ruft `onPhotoUpload` auf
- Styling: kompaktes Popover mit zwei Zeilen, Icons links

**`src/pages/MealsPage.tsx`**:
- Neue Handler-Funktion `handlePhotoUpload` erstellen, die `fileInputRef.current?.click()` aufruft
- An `FoodSearchScreen` die neue Prop `onPhotoUpload={handlePhotoUpload}` übergeben

### UI-Ergebnis

```text
Suchleiste:  [ 🔍 Suche...    ]  [📷]  [|||]

Tap auf 📷 → Popover:
┌─────────────────────┐
│ 📷 Foto aufnehmen   │
│ 📁 Bild hochladen   │
└─────────────────────┘
```

