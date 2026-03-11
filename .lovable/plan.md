

## Fix: Barcode-Scanner scannt zu schnell und erkennt Codes falsch

### Problem
Der Scanner läuft mit `fps: 10` (10 Frames/Sekunde) und nimmt den **ersten** erkannten Code sofort an — auch wenn der Code nur teilweise im Bild ist und dadurch falsch gelesen wird. Es gibt keine Validierung oder Bestätigungs-Logik.

### Lösung

**`src/components/meals/BarcodeScanner.tsx`** — 3 Änderungen:

1. **FPS reduzieren**: `fps: 10` → `fps: 5` — gibt der Kamera mehr Zeit zum Fokussieren.

2. **Barcode-Validierung**: Nur EAN-8/EAN-13/UPC-A Codes akzeptieren (8, 12 oder 13 Ziffern, nur Zahlen). Verhindert, dass Teilcodes oder QR-Fragmente durchrutschen.

3. **Bestätigungs-Debounce**: Der gleiche Code muss **2x hintereinander** erkannt werden, bevor er verarbeitet wird. Das filtert Fehllesungen zuverlässig raus.

```text
Scan 1: "401234567" (teilweise) → ignoriert
Scan 2: "4012345678901" → gespeichert als Kandidat
Scan 3: "4012345678901" → Match! → handleCode()
```

### Dateien
- `src/components/meals/BarcodeScanner.tsx` — FPS, Validierung, Debounce (~15 Zeilen)

