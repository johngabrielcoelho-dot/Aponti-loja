import { categories } from "@/data/categories";
import { neighborhoods } from "@/data/neighborhoods";
import { products } from "@/data/products";
import { stores } from "@/data/stores";
import { normalize } from "@/lib/format";
import type { Category, Neighborhood, Product, ProductListing, SearchFilters } from "@/lib/types";

const STOCK_RANK = { disponivel: 0, poucas: 1, esgotado: 2 } as const;

const STOPWORDS = new Set([
  "a",
  "o",
  "as",
  "os",
  "de",
  "da",
  "do",
  "das",
  "dos",
  "e",
  "em",
  "para",
  "pra",
  "com",
  "um",
  "uma",
]);

function toListing(product: Product): ProductListing {
  const store = stores.find((s) => s.id === product.storeId);
  const category = categories.find((c) => c.slug === product.categorySlug);
  const neighborhood = neighborhoods.find((n) => n.slug === store?.neighborhoodSlug);
  if (!store || !category || !neighborhood) {
    throw new Error(`Produto ${product.id} referencia loja, categoria ou bairro inexistente`);
  }
  return { ...product, category, store: { ...store, neighborhood } };
}

const listings: ProductListing[] = products.map(toListing);

function tokenize(query: string): string[] {
  return normalize(query)
    .split(/[^a-z0-9]+/)
    .filter((token) => token && !STOPWORDS.has(token))
    .map((token) => (token.length > 3 && token.endsWith("s") ? token.slice(0, -1) : token));
}

function relevance(listing: ProductListing, tokens: string[]): number {
  const title = normalize(`${listing.name} ${listing.brand ?? ""}`);
  const body = normalize(
    [
      listing.category.name,
      listing.store.name,
      listing.description,
      ...listing.details,
      ...(listing.tags ?? []),
    ].join(" "),
  );

  let score = 0;
  for (const token of tokens) {
    if (title.includes(token)) score += 3;
    else if (body.includes(token)) score += 1;
    else return -1;
  }
  return score;
}

export async function searchProducts(filters: SearchFilters): Promise<ProductListing[]> {
  const tokens = tokenize(filters.q);

  const results = listings
    .filter((p) => !filters.categoria || p.categorySlug === filters.categoria)
    .filter((p) => !filters.bairro || p.store.neighborhoodSlug === filters.bairro)
    .filter((p) => !filters.estoque || p.stock !== "esgotado")
    .map((product) => ({ product, score: relevance(product, tokens) }))
    .filter(({ score }) => score >= 0);

  results.sort((a, b) => {
    const outOfStock =
      Number(a.product.stock === "esgotado") - Number(b.product.stock === "esgotado");
    if (outOfStock !== 0) return outOfStock;

    if (filters.ordem === "menor-preco") return a.product.price - b.product.price;
    if (filters.ordem === "maior-preco") return b.product.price - a.product.price;

    return (
      b.score - a.score ||
      Number(Boolean(b.product.featured)) - Number(Boolean(a.product.featured)) ||
      STOCK_RANK[a.product.stock] - STOCK_RANK[b.product.stock] ||
      a.product.name.localeCompare(b.product.name, "pt-BR")
    );
  });

  return results.map(({ product }) => product);
}

export async function getFeaturedProducts(limit = 8): Promise<ProductListing[]> {
  return listings.filter((p) => p.featured && p.stock !== "esgotado").slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<ProductListing | null> {
  return listings.find((p) => p.slug === slug) ?? null;
}

export async function getProductSlugs(): Promise<string[]> {
  return listings.map((p) => p.slug);
}

export async function getStoreProducts(
  storeId: string,
  excludeSlug: string,
  limit = 4,
): Promise<ProductListing[]> {
  return listings
    .filter((p) => p.storeId === storeId && p.slug !== excludeSlug)
    .sort((a, b) => STOCK_RANK[a.stock] - STOCK_RANK[b.stock])
    .slice(0, limit);
}

export function getCategories(): Category[] {
  return categories;
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getNeighborhoods(): Neighborhood[] {
  return neighborhoods;
}

export function getNeighborhood(slug: string): Neighborhood | undefined {
  return neighborhoods.find((n) => n.slug === slug);
}

export function getNeighborhoodsWithStores(): (Neighborhood & { storeCount: number })[] {
  return neighborhoods
    .map((n) => ({ ...n, storeCount: stores.filter((s) => s.neighborhoodSlug === n.slug).length }))
    .filter((n) => n.storeCount > 0)
    .sort((a, b) => b.storeCount - a.storeCount);
}
