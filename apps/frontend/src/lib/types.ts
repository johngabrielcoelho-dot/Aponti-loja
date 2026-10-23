export type StockLevel = "disponivel" | "poucas" | "esgotado";

export type SortOrder = "relevancia" | "menor-preco" | "maior-preco";

export interface Category {
  slug: string;
  name: string;
}

export interface Neighborhood {
  slug: string;
  name: string;
}

export interface DayHours {
  open: string;
  close: string;
}

export interface Store {
  id: string;
  slug: string;
  name: string;
  neighborhoodSlug: string;
  address: string;
  cep: string;
  whatsapp: string;
  phone: string;
  hours: (DayHours | null)[];
  rating: number;
  reviewCount: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  categorySlug: string;
  storeId: string;
  price: number;
  oldPrice?: number;
  stock: StockLevel;
  description: string;
  details: string[];
  images: string[];
  featured?: boolean;
  tags?: string[];
}

export interface ProductListing extends Product {
  category: Category;
  store: Store & { neighborhood: Neighborhood };
}

export interface SearchFilters {
  q: string;
  categoria: string;
  bairro: string;
  estoque: boolean;
  ordem: SortOrder;
}
