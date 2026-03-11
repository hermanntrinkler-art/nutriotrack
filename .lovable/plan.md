

## Plan: Mikronährstoff-Felder im Community-Produkt-Formular

Das Formular (`CommunityProductForm.tsx`) hat aktuell nur kcal, P, F, C. Die Datenbank hat bereits alle 17 Mikronährstoff-Spalten – das Formular nutzt sie nur nicht.

### Änderung

**`src/components/CommunityProductForm.tsx`**:

1. **State hinzufügen** für alle 17 Mikronährstoffe (vitamin_a_ug, vitamin_b1_mg, ..., zinc_mg) – jeweils als leerer String (optional)

2. **Aufklappbare Sektion** unter den Makro-Feldern einfügen (Collapsible mit Chevron):
   - Titel: "Vitamine & Mineralstoffe" / "Vitamins & Minerals"
   - 2-spaltige Anordnung mit kompakten Input-Feldern
   - Gruppierung: Vitamine (A, B1, B2, B6, B12, C, D, E, K, Folat) + Mineralstoffe (Eisen, Kalium, Calcium, Magnesium, Natrium, Phosphor, Zink)
   - Labels mit Einheit (z.B. "Vit. A (µg)", "Mg (mg)")

3. **handleSave erweitern**: Alle Mikronährstoff-Werte im Insert-Objekt mitsenden (Number() || 0)

Das Design folgt dem bestehenden Muster aus dem FoodItemEditorModal, wo Mikronährstoffe bereits in einer aufklappbaren Sektion dargestellt werden.

