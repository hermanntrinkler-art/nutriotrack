

## Gramm-Angaben in Mahlzeiten-Übersicht sicherstellen

### Problem
In der kompakten 2-Zeilen-Ansicht fehlen die Gramm-Angaben. Zeile 525 zeigt zwar `quantity` + `unit`, aber wenn `quantity` 0/null ist oder `unit` fehlt, wird nichts angezeigt.

### Fix in `src/pages/MealsPage.tsx` (Zeile 525)

Die Format-Logik robuster machen und immer "g" als Fallback-Unit verwenden:

**Vorher:**
```
`${item.quantity ? Math.round(Number(item.quantity)) : ''}${item.unit && item.unit !== 'portion' ? ' ' + item.unit : 'x'} ${item.food_name}`
```

**Nachher:**
```
`${item.food_name} ${Math.round(Number(item.quantity) || 100)} ${item.unit || 'g'}`
```

Das zeigt z.B.: `Mandeln 100 g, Kaffee 200 ml · P23 F54 K7`

- Food-Name zuerst (lesbarer)
- Fallback: 100g wenn quantity fehlt
- Fallback: "g" wenn unit fehlt
- "portion" wird als "Port." angezeigt

