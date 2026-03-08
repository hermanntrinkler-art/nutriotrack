import type { FoodEntry } from './food-database';

export async function searchOpenFoodFacts(query: string, lang: 'de' | 'en'): Promise<FoodEntry[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const lc = lang === 'de' ? 'de' : 'world';
    const url = `https://${lc}.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query.trim())}&search_simple=1&action=process&json=1&page_size=8&fields=product_name,product_name_de,product_name_en,nutriments,serving_size`;

    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.products || !Array.isArray(data.products)) return [];

    return data.products
      .filter((p: any) => {
        const name = p.product_name || p.product_name_de || p.product_name_en;
        return name && name.trim().length > 0;
      })
      .map((p: any) => {
        const n = p.nutriments || {};
        const name = p.product_name || p.product_name_de || p.product_name_en || '';
        const nameEn = p.product_name_en || p.product_name || '';
        return {
          name: p.product_name_de || name,
          name_en: nameEn,
          quantity: 100,
          unit: 'g',
          calories: Math.round(n['energy-kcal_100g'] || 0),
          protein_g: Math.round((n.proteins_100g || 0) * 10) / 10,
          fat_g: Math.round((n.fat_100g || 0) * 10) / 10,
          carbs_g: Math.round((n.carbohydrates_100g || 0) * 10) / 10,
          category: 'openfoodfacts',
        } as FoodEntry;
      })
      .filter((e: FoodEntry) => e.calories > 0 || e.protein_g > 0 || e.fat_g > 0 || e.carbs_g > 0);
  } catch {
    return [];
  }
}
