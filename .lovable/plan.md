

## Favoriten-Dialog: Standard-Menge auf runde Zahl setzen

### Problem
Wenn ein Favorit z.B. 262g/ml hat, wird 262 als Standardwert angezeigt — sieht unschön aus.

### Lösung
In `src/components/meals/FoodSearchScreen.tsx`: Statt `setPortionAmount(totalQty)` wird der Default auf eine sinnvolle runde Zahl gesetzt. Logik:
- Wenn `totalQty <= 100` → Default 100
- Wenn `totalQty <= 500` → nächste 50er-Stufe abrunden (z.B. 262 → 250), mindestens 100
- Wenn `totalQty > 500` → nächste 100er-Stufe abrunden

So bekommt der User immer eine glatte, intuitive Zahl als Ausgangspunkt.

**Alternativ (einfacher):** Immer Default 100 setzen — der User gibt dann einfach seine gewünschte Menge ein (z.B. 300 ml). Das ist am intuitivsten: "Wie viel ml willst du?" → Standardantwort 100.

Ich würde **Default 100** nehmen, wie der User vorschlägt.

### Änderung
`src/components/meals/FoodSearchScreen.tsx`, Zeile ~300:
```typescript
// vorher:
setPortionAmount(totalQty);
// nachher:
setPortionAmount(100);
```

