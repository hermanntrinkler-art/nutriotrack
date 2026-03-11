import type { FoodEntry } from './food-database';

const CACHE_TTL_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 4500;

const searchCache = new Map<string, { timestamp: number; results: FoodEntry[] }>();
const pendingRequests = new Map<string, Promise<FoodEntry[]>>();

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function getCacheKey(query: string, lang: string) {
  return `${lang}:${query.trim().toLowerCase()}`;
}

export async function searchOpenFoodFacts(
  query: string,
  lang: string,
  options?: { signal?: AbortSignal },
): Promise<FoodEntry[]> {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 3) return [];

  const cacheKey = getCacheKey(normalizedQuery, lang);
  const now = Date.now();

  const cached = searchCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.results;
  }

  const pending = pendingRequests.get(cacheKey);
  if (pending) return pending;

  const requestPromise = (async () => {
    const searchTerms = encodeURIComponent(normalizedQuery);
    const domainMap: Record<string, string> = {
      de: 'de.openfoodfacts.org',
      fr: 'fr.openfoodfacts.org',
      es: 'es.openfoodfacts.org',
      it: 'it.openfoodfacts.org',
      pt: 'pt.openfoodfacts.org',
      pl: 'pl.openfoodfacts.org',
      nl: 'nl.openfoodfacts.org',
    };
    const domain = domainMap[lang] || 'world.openfoodfacts.org';

    // Dynamically include the localized product_name field
    const extraLangFields = !['de', 'en'].includes(lang) ? `,product_name_${lang}` : '';
    const fields = `product_name,product_name_de,product_name_en${extraLangFields},energy-kcal_100g,proteins_100g,fat_100g,carbohydrates_100g,serving_size,product_quantity`;

    const buildUrl = (page: number) =>
      `https://${domain}/cgi/search.pl?search_terms=${searchTerms}&search_simple=1&action=process&json=1&page_size=30&page=${page}&sort_by=unique_scans_n&fields=${fields}`;

    const mapProducts = (products: any[]): FoodEntry[] =>
      products
        .filter((p: any) => {
          const name = p[`product_name_${lang}`] || p.product_name || p.product_name_de || p.product_name_en;
          return typeof name === 'string' && name.trim().length > 0;
        })
        .map((p: any) => {
          const calories = toNumber(p['energy-kcal_100g']);
          const protein = toNumber(p.proteins_100g);
          const fat = toNumber(p.fat_100g);
          const carbs = toNumber(p.carbohydrates_100g);

          const localizedName = p[`product_name_${lang}`];
          const genericName = p.product_name;
          const deName = p.product_name_de;
          const enName = p.product_name_en;

          const displayName = localizedName || genericName || (lang === 'de' ? deName : enName) || deName || enName || '';

          return {
            name: displayName,
            name_en: enName || genericName || displayName,
            quantity: 100,
            unit: 'g',
            calories: Math.round(calories),
            protein_g: Math.round(protein * 10) / 10,
            fat_g: Math.round(fat * 10) / 10,
            carbs_g: Math.round(carbs * 10) / 10,
            category: 'openfoodfacts',
          } as FoodEntry;
        })
        .filter((e: FoodEntry) => e.calories > 0 || e.protein_g > 0 || e.fat_g > 0 || e.carbs_g > 0);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const onAbort = () => controller.abort();
    if (options?.signal) {
      if (options.signal.aborted) {
        clearTimeout(timeoutId);
        return [];
      }
      options.signal.addEventListener('abort', onAbort, { once: true });
    }

    try {
      const fetchPage = async (page: number) => {
        const res = await fetch(buildUrl(page), { signal: controller.signal });
        if (!res.ok) return [];
        const data = await res.json();
        if (!Array.isArray(data?.products)) return [];
        return mapProducts(data.products);
      };

      let results = await fetchPage(1);

      // If too few results after filtering, try page 2
      if (results.length < 5) {
        const page2 = await fetchPage(2);
        results = [...results, ...page2];
      }

      const mapped = results.slice(0, 15);
      searchCache.set(cacheKey, { timestamp: Date.now(), results: mapped });
      return mapped;
    } catch {
      return [];
    } finally {
      clearTimeout(timeoutId);
      if (options?.signal) {
        options.signal.removeEventListener('abort', onAbort);
      }
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, requestPromise);
  return requestPromise;
}
