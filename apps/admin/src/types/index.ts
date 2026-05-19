// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

// ─── Catálogo ─────────────────────────────────────────────────────────────────

export interface ProductImage { url: string; alt: string; }
export interface ProductInventory { available: boolean; quantity: number; }
export interface Category { id: string; name: string; slug: string; }

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  brand?: string;
  images: ProductImage[];
  inventory: ProductInventory;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface ProductsResult {
  products: { items: Product[]; pagination: Pagination };
}

// ─── Órdenes ──────────────────────────────────────────────────────────────────

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  product: Pick<Product, 'id' | 'name' | 'slug'>;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customer: { id: string; name: string; email: string };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
}

// ─── Clientes ─────────────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export interface StatsCardData {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  icon: string;
}
