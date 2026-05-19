// ─── Catálogo ─────────────────────────────────────────────────────────────────

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductInventory {
  available: boolean;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}

export interface ProductAttribute { name: string; value: string; }

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  brand?: string;
  images: ProductImage[];
  inventory: ProductInventory;
  category: Pick<Category, 'id' | 'name'>;
  attributes?: ProductAttribute[];
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface ProductsResult {
  products: {
    items: ProductCardData[];
    pagination: Pagination;
  };
}

// ─── Filtros ──────────────────────────────────────────────────────────────────

export type ProductSort = 'newest' | 'oldest' | 'price_asc' | 'price_desc';

export interface ProductFilters {
  categoryId?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: ProductSort;
}

// ─── Carrito ──────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: ProductImage;
  sku?: string;
  attributes?: Array<{ name: string; value: string }>;
}
