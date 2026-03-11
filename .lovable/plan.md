

## Problem: Sprachspezifische Produktnamen werden nicht abgerufen

Die API-Anfrage an OpenFoodFacts fordert nur `product_name`, `product_name_de` und `product_name_en` an. Bei einer Suche auf Spanisch fehlt `product_name_es` — viele Produkte haben keinen generischen `product_name`, nur einen spanischen. Diese werden entweder herausgefiltert oder mit falschem Namen angezeigt. Gleiches Problem für FR, IT, PT, PL, NL.

## Änderungen

**`src/lib/openfoodfacts-search.ts`**:

1. **Sprachspezifisches Feld dynamisch anfragen**: `product_name_${lang}` in die `fields`-Liste aufnehmen (z.B. `product_name_es` für Spanisch)
2. **Name-Auflösung verbessern**: Zuerst den sprachspezifischen Namen verwenden (`product_name_es`), dann Fallback auf `product_name`, dann `product_name_en`
3. **Mehr Ergebnisse holen**: `page_size` auf 30 erhöhen, da viele Produkte nach dem Filter (keine Nährwerte) wegfallen
4. **Zusätzliche Seite abrufen**: Bei weniger als 5 verwertbaren Ergebnissen automatisch Seite 2 nachladen

### Technisches Detail

```text
Vorher:  fields=product_name,product_name_de,product_name_en,...
Nachher: fields=product_name,product_name_de,product_name_en,product_name_es,...
         (dynamisch je nach aktiver Sprache)

Name-Auflösung:
  1. product_name_{lang}  (z.B. product_name_es)
  2. product_name          (generischer Name)
  3. product_name_en        (englischer Fallback)
```

Das behebt das Problem, dass bei "pollo" oder "serrano" auf Spanisch kaum Ergebnisse kommen, obwohl hunderte spanische Produkte in der Datenbank existieren.

