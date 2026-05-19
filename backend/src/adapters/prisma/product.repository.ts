import type { IProductRepository, PaginatedProducts, ProductFilters, ProductRecord } from '../interfaces/IProductRepository.js';
import prisma from './prisma.client.js';

/**
 * Adaptador Prisma para el repositorio de productos.
 * Implementa el puerto IProductRepository usando SQLite/PostgreSQL.
 *
 * Para conectar ERP: crear ERPProductAdapter en adapters/erp/ que implemente
 * la misma interfaz IProductRepository. El servicio no cambia.
 */
export class PrismaProductRepository implements IProductRepository {

  /** Parsea JSON almacenado como string (limitación SQLite) */
  private parse<T>(json: string, fallback: T): T {
    try { return JSON.parse(json) as T; } catch { return fallback; }
  }

  private toRecord(p: any): ProductRecord {
    return {
      ...p,
      images: this.parse(p.images, []),
      attributes: this.parse(p.attributes, []),
    };
  }

  async findMany(filters: ProductFilters, page: number, pageSize: number): Promise<PaginatedProducts> {
    const where: any = {};

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.brand) where.brand = filters.brand;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
        { sku: { contains: filters.search } },
      ];
    }
    if (filters.minPrice !== undefined) where.price = { ...where.price, gte: filters.minPrice };
    if (filters.maxPrice !== undefined) where.price = { ...where.price, lte: filters.maxPrice };
    if (filters.inStock) {
      where.inventory = { quantity: { gt: 0 } };
    }

    const skip = (page - 1) * pageSize;

    const ORDER_MAP: Record<string, object> = {
      newest:     { createdAt: 'desc' },
      oldest:     { createdAt: 'asc'  },
      price_asc:  { price: 'asc'      },
      price_desc: { price: 'desc'     },
    };
    const orderBy = ORDER_MAP[filters.sort ?? 'newest'] ?? { createdAt: 'desc' };

    const [total, rows] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: { inventory: true },
        orderBy,
        skip,
        take: pageSize,
      }),
    ]);

    return {
      items: rows.map((p) => this.toRecord(p)),
      total,
      page,
      pageSize,
    };
  }

  async findById(id: string): Promise<ProductRecord | null> {
    const p = await prisma.product.findUnique({
      where: { id },
      include: { inventory: true },
    });
    return p ? this.toRecord(p) : null;
  }

  async findBySlug(slug: string): Promise<ProductRecord | null> {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: { inventory: true },
    });
    return p ? this.toRecord(p) : null;
  }

  /** Usado por DataLoader para batch-loading — elimina el problema N+1 */
  async findByIds(ids: string[]): Promise<ProductRecord[]> {
    const rows = await prisma.product.findMany({
      where: { id: { in: ids } },
      include: { inventory: true },
    });
    // Mantener el orden que DataLoader espera
    const map = new Map(rows.map((p) => [p.id, this.toRecord(p)]));
    return ids.map((id) => map.get(id)!).filter(Boolean);
  }

  async create(data: Omit<ProductRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductRecord> {
    const p = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        sku: data.sku,
        images: JSON.stringify(data.images),
        attributes: JSON.stringify(data.attributes),
        categoryId: data.categoryId,
        inventory: {
          create: { quantity: data.inventory?.quantity ?? 0 },
        },
      },
      include: { inventory: true },
    });
    return this.toRecord(p);
  }

  async update(id: string, data: Partial<ProductRecord>): Promise<ProductRecord> {
    const p = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.compareAtPrice !== undefined && { compareAtPrice: data.compareAtPrice }),
        ...(data.sku !== undefined && { sku: data.sku }),
        ...(data.brand !== undefined && { brand: data.brand }),
        ...(data.images && { images: JSON.stringify(data.images) }),
        ...(data.attributes && { attributes: JSON.stringify(data.attributes) }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.inventory && {
          inventory: {
            update: { quantity: data.inventory.quantity }
          }
        }),
      },
      include: { inventory: true },
    });
    return this.toRecord(p);
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}
