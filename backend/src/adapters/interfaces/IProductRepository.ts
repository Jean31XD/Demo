/**
 * Puerto (Port) del repositorio de productos.
 *
 * Esta interfaz es el CONTRATO que define qué operaciones de datos
 * necesita la capa de servicios. Es agnóstica al origen de datos:
 * puede ser Prisma, un ERP, una API REST, etc.
 *
 * Para conectar el ERP: implementar esta interfaz en adapters/erp/
 */

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  sku: string | null;
  brand: string | null;
  images: ProductImage[];
  attributes: ProductAttribute[];
  categoryId: string;
  inventory: { quantity: number } | null;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface PaginatedProducts {
  items: ProductRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IProductRepository {
  findMany(filters: ProductFilters, page: number, pageSize: number): Promise<PaginatedProducts>;
  findById(id: string): Promise<ProductRecord | null>;
  findBySlug(slug: string): Promise<ProductRecord | null>;
  findByIds(ids: string[]): Promise<ProductRecord[]>; // Para DataLoader
  create(data: Omit<ProductRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductRecord>;
  update(id: string, data: Partial<ProductRecord>): Promise<ProductRecord>;
  delete(id: string): Promise<void>;
}
