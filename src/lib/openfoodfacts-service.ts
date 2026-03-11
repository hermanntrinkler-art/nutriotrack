/**
 * OpenFoodFacts Service
 * Robust barcode lookup with retry, fallback search, validation, caching.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OFFProduct {
  source: 'openfoodfacts';
  barcode: string;
  productName: string;
  brand: string;
  imageUrl: string | null;
  quantity: string; // e.g. "42 g", "1.5 L"
  servingSize: string; // e.g. "1 Riegel (42 g)"
  // per 100g/100ml
  kcal100g: number;
  kj100g: number;
  carbs100g: number;
  sugar100g: number;
  fat100g: number;
  saturatedFat100g: number;
  protein100g: number;
  fiber100g: number;
  salt100g: number;
  // calculated
  calculatedWeightG: number | null; // single unit/serving weight
  calculatedKcalPerServing: number | null;
  calculatedCarbsPerServing: number | null;
  calculatedFatPerServing: number | null;
  calculatedProteinPerServing: number | null;
  // raw for debugging
  rawNutriments: Record<string, unknown>;
}

export interface OFFLookupResult {
  product: OFFProduct | null;
  /** Fallback search results when exact barcode has no/bad data */
  alternatives: OFFProduct[];
  /** Product name from API even when nutrition missing */
  partialName: string | null;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const REQUEST_TIMEOUT_MS = 6000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 800;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min

const barcodeCache = new Map<string, { ts: number; result: OFFLookupResult }>();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Safely parse a number from any value. Returns 0 for invalid/negative. */
function safeNum(value: unknown): number {
  if (value === null || value === undefined || value === '') return 0;
  const str = String(value).replace(',', '.');
  const n = parseFloat(str);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Extract weight in grams from a quantity string like "42 g", "1,5 kg", "330 ml" */
function parseWeightFromString(str: string): number | null {
  if (!str) return null;
  // Try grams
  let m = str.match(/([\d.,]+)\s*g(?:ramm)?(?:\s|$|[^a-z])/i);
  if (m) return safeNum(m[1]);
  // Try kg
  m = str.match(/([\d.,]+)\s*kg/i);
  if (m) return safeNum(m[1]) * 1000;
  // Try ml (treat as grams for food density ≈ 1)
  m = str.match(/([\d.,]+)\s*ml/i);
  if (m) return safeNum(m[1]);
  // Try L
  m = str.match(/([\d.,]+)\s*l(?:iter)?(?:\s|$)/i);
  if (m) return safeNum(m[1]) * 1000;
  return null;
}

/** Extract serving weight from serving_size or serving_quantity */
function getServingWeightG(product: any): number | null {
  // serving_quantity is often a direct number in grams
  const sq = safeNum(product.serving_quantity);
  if (sq > 0 && sq < 5000) return sq;

  // Parse from serving_size string
  const ss = product.serving_size;
  if (typeof ss === 'string') {
    const w = parseWeightFromString(ss);
    if (w && w > 0 && w < 5000) return w;
  }
  return null;
}

/** Get single-unit weight from product_quantity or quantity fields */
function getProductWeightG(product: any): number | null {
  // product_quantity is often total weight
  const pq = safeNum(product.product_quantity);
  if (pq > 0 && pq < 50000) return pq;

  // Parse from quantity string
  const q = product.quantity;
  if (typeof q === 'string') {
    const w = parseWeightFromString(q);
    if (w && w > 0 && w < 50000) return w;
  }
  return null;
}

// ─── Fetch with retry ─────────────────────────────────────────────────────────

async function fetchWithRetry(url: string, signal?: AbortSignal): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      // Chain external signal
      const onAbort = () => controller.abort();
      signal?.addEventListener('abort', onAbort, { once: true });

      try {
        const res = await fetch(url, { signal: controller.signal });
        if (res.ok) return res;
        // 404 → don't retry
        if (res.status === 404) throw new Error('not_found');
        lastError = new Error(`HTTP ${res.status}`);
      } finally {
        clearTimeout(timeoutId);
        signal?.removeEventListener('abort', onAbort);
      }
    } catch (err: any) {
      if (err?.message === 'not_found' || signal?.aborted) throw err;
      lastError = err;
    }
    if (attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
    }
  }
  throw lastError;
}

// ─── Map API response to OFFProduct ───────────────────────────────────────────

function mapProduct(p: any, barcode: string): OFFProduct | null {
  const n = p.nutriments || {};

  // Extract calories — try multiple field names
  const kcalRaw = safeNum(n['energy-kcal_100g']) || safeNum(n['energy-kcal_value']);
  const kjRaw = safeNum(n['energy-kj_100g']) || safeNum(n['energy_100g']) || safeNum(n['energy_value']);
  const kcal100g = kcalRaw > 0 ? Math.round(kcalRaw) : (kjRaw > 0 ? Math.round(kjRaw / 4.184) : 0);
  const kj100g = kjRaw > 0 ? Math.round(kjRaw) : Math.round(kcal100g * 4.184);

  const protein100g = round1(safeNum(n.proteins_100g) || safeNum(n.proteins_value));
  const fat100g = round1(safeNum(n.fat_100g) || safeNum(n.fat_value));
  const carbs100g = round1(safeNum(n.carbohydrates_100g) || safeNum(n.carbohydrates_value));
  const sugar100g = round1(safeNum(n.sugars_100g) || safeNum(n.sugars_value));
  const saturatedFat100g = round1(safeNum(n['saturated-fat_100g']) || safeNum(n['saturated-fat_value']));
  const fiber100g = round1(safeNum(n.fiber_100g) || safeNum(n.fiber_value));
  const salt100g = round1(safeNum(n.salt_100g) || safeNum(n.salt_value));

  // Product name
  const productName = p.product_name_de || p.product_name || p.product_name_en || p.product_name_fr || '';
  const brand = p.brands || '';

  // If absolutely no name and no nutrition, skip
  if (!productName.trim() && !brand.trim() && kcal100g === 0 && protein100g === 0 && fat100g === 0 && carbs100g === 0) {
    return null;
  }

  const displayName = productName.trim() || (brand ? `${brand} (${barcode})` : barcode);

  // Image
  const imageUrl = p.image_front_small_url || p.image_front_url || p.image_url || null;

  // Serving & weight
  const servingWeightG = getServingWeightG(p);
  const productWeightG = getProductWeightG(p);
  const servingSize = p.serving_size || '';
  const quantity = p.quantity || '';

  // calculatedWeightG = single serving/piece weight
  const calculatedWeightG = servingWeightG || productWeightG || null;

  // Per-serving calculations
  let calculatedKcalPerServing: number | null = null;
  let calculatedCarbsPerServing: number | null = null;
  let calculatedFatPerServing: number | null = null;
  let calculatedProteinPerServing: number | null = null;

  if (calculatedWeightG && calculatedWeightG > 0) {
    const factor = calculatedWeightG / 100;
    calculatedKcalPerServing = Math.round(kcal100g * factor);
    calculatedCarbsPerServing = round1(carbs100g * factor);
    calculatedFatPerServing = round1(fat100g * factor);
    calculatedProteinPerServing = round1(protein100g * factor);
  }

  return {
    source: 'openfoodfacts',
    barcode,
    productName: displayName,
    brand: brand.trim(),
    imageUrl,
    quantity,
    servingSize,
    kcal100g,
    kj100g,
    carbs100g,
    sugar100g,
    fat100g,
    saturatedFat100g,
    protein100g,
    fiber100g,
    salt100g,
    calculatedWeightG,
    calculatedKcalPerServing,
    calculatedCarbsPerServing,
    calculatedFatPerServing,
    calculatedProteinPerServing,
    rawNutriments: n,
  };
}

// ─── Barcode lookup ───────────────────────────────────────────────────────────

export async function lookupBarcode(
  barcode: string,
  options?: { signal?: AbortSignal; lang?: string },
): Promise<OFFLookupResult> {
  const code = barcode.trim();
  if (!code) return { product: null, alternatives: [], partialName: null };

  // Check cache
  const cached = barcodeCache.get(code);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.result;
  }

  let product: OFFProduct | null = null;
  let partialName: string | null = null;
  let alternatives: OFFProduct[] = [];

  // Step 1: Exact barcode lookup
  try {
    const res = await fetchWithRetry(
      `https://world.openfoodfacts.net/api/v2/product/${code}.json`,
      options?.signal,
    );
    const data = await res.json();
    const p = data?.product;

    if (p) {
      const mapped = mapProduct(p, code);
      const hasNutrition = mapped && (mapped.kcal100g > 0 || mapped.protein100g > 0 || mapped.fat100g > 0 || mapped.carbs100g > 0);

      if (mapped && hasNutrition) {
        product = mapped;
      } else {
        // Product exists but no nutrition → save name for manual entry
        partialName = p.product_name_de || p.product_name || p.product_name_en || null;

        // Also try .org domain as fallback (sometimes different data)
        try {
          const res2 = await fetchWithRetry(
            `https://world.openfoodfacts.org/api/v2/product/${code}.json`,
            options?.signal,
          );
          const data2 = await res2.json();
          if (data2?.product) {
            const mapped2 = mapProduct(data2.product, code);
            if (mapped2 && (mapped2.kcal100g > 0 || mapped2.protein100g > 0 || mapped2.fat100g > 0 || mapped2.carbs100g > 0)) {
              product = mapped2;
              partialName = null;
            }
          }
        } catch {}
      }
    }
  } catch (err: any) {
    if (err?.message === 'not_found') {
      // Product doesn't exist → fall through to search
    } else if (options?.signal?.aborted) {
      return { product: null, alternatives: [], partialName: null };
    }
    // Network error → still try fallback search
  }

  // Step 2: Fallback search if no product with nutrition found
  if (!product) {
    try {
      const searchQuery = partialName || code;
      alternatives = await searchOFF(searchQuery, { signal: options?.signal, limit: 8 });
    } catch {}
  }

  const result: OFFLookupResult = { product, alternatives, partialName };

  // Cache result
  barcodeCache.set(code, { ts: Date.now(), result });

  return result;
}

// ─── Text search on OFF ──────────────────────────────────────────────────────

export async function searchOFF(
  query: string,
  options?: { signal?: AbortSignal; limit?: number; lang?: string },
): Promise<OFFProduct[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const limit = options?.limit || 10;
  const fields = [
    'code', 'product_name', 'product_name_de', 'product_name_en', 'brands',
    'nutriments', 'serving_size', 'serving_quantity', 'product_quantity', 'quantity',
    'image_front_small_url', 'image_front_url', 'image_url',
  ].join(',');

  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=${limit}&sort_by=unique_scans_n&fields=${fields}`;

  try {
    const res = await fetchWithRetry(url, options?.signal);
    const data = await res.json();
    if (!Array.isArray(data?.products)) return [];

    return data.products
      .map((p: any) => mapProduct(p, p.code || ''))
      .filter((p: OFFProduct | null): p is OFFProduct => {
        if (!p) return false;
        // Must have at least some nutrition data
        return p.kcal100g > 0 || p.protein100g > 0 || p.fat100g > 0 || p.carbs100g > 0;
      });
  } catch {
    return [];
  }
}

// ─── Convert OFFProduct to app's AnalyzedFoodItem ─────────────────────────────

import type { AnalyzedFoodItem } from '@/lib/types';
import type { FoodEntry } from '@/lib/food-database';

export function offProductToAnalyzedItem(product: OFFProduct): AnalyzedFoodItem {
  const weight = product.calculatedWeightG;
  const usePiece = weight !== null && weight > 0 && weight < 500;

  if (usePiece) {
    const factor = weight! / 100;
    return {
      food_name: product.productName,
      quantity: 1,
      unit: 'Stück',
      calories: Math.round(product.kcal100g * factor),
      protein_g: round1(product.protein100g * factor),
      fat_g: round1(product.fat100g * factor),
      carbs_g: round1(product.carbs100g * factor),
      confidence_score: 0.95,
      barcode: product.barcode,
      gram_per_piece: weight!,
    };
  }

  return {
    food_name: product.productName,
    quantity: 100,
    unit: 'g',
    calories: product.kcal100g,
    protein_g: product.protein100g,
    fat_g: product.fat100g,
    carbs_g: product.carbs100g,
    confidence_score: 0.95,
    barcode: product.barcode,
    gram_per_piece: weight || undefined,
  };
}

export function offProductToFoodEntry(product: OFFProduct): FoodEntry {
  const weight = product.calculatedWeightG;
  const usePiece = weight !== null && weight > 0 && weight < 500;

  if (usePiece) {
    const factor = weight! / 100;
    return {
      name: product.productName,
      name_en: product.productName,
      quantity: 1,
      unit: 'Stück',
      calories: Math.round(product.kcal100g * factor),
      protein_g: round1(product.protein100g * factor),
      fat_g: round1(product.fat100g * factor),
      carbs_g: round1(product.carbs100g * factor),
      category: 'openfoodfacts',
      gram_per_piece: weight!,
      communityBrand: product.brand || undefined,
      imageUrl: product.imageUrl || undefined,
    };
  }

  return {
    name: product.productName,
    name_en: product.productName,
    quantity: 100,
    unit: 'g',
    calories: product.kcal100g,
    protein_g: product.protein100g,
    fat_g: product.fat100g,
    carbs_g: product.carbs100g,
    category: 'openfoodfacts',
    gram_per_piece: weight || undefined,
    communityBrand: product.brand || undefined,
    imageUrl: product.imageUrl || undefined,
  };
}

// ─── Clear cache (useful for testing) ─────────────────────────────────────────

export function clearOFFCache() {
  barcodeCache.clear();
}
