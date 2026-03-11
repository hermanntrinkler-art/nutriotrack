

## Kamera-Button neben Barcode-Button in die Suchleiste

Aktuell sind "Foto" und "Hochladen" als separate Buttons unterhalb der Suche versteckt. Der Kamera-Button soll direkt neben dem Barcode-Icon in der Suchleiste erscheinen — wie im FDDB-Screenshot gezeigt.

### Änderungen

**`src/components/meals/FoodSearchScreen.tsx`**:
- Neue Prop `onCameraOpen` hinzufügen
- Neben dem Barcode-Button einen Kamera-Button (Camera-Icon aus lucide) einfügen, gleicher Style wie der Barcode-Button

**`src/pages/MealsPage.tsx`**:
- `onCameraOpen={handleOpenCamera}` an `FoodSearchScreen` übergeben
- Die separate "Foto" / "Hochladen"-Zeile (Zeilen 699–717) entfernen oder nur "Hochladen" behalten (da Kamera jetzt oben ist)

### Ergebnis

```text
[ 🔍 Suchfeld...          X ]  [📷]  [|||]
                                cam   barcode
```

Beide Icons gleichberechtigt nebeneinander, sofortiger Zugriff auf Kamera und Barcode.

