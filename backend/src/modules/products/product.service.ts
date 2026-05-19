import type { IProductRepository, ProductFilters, ProductRecord, PaginatedProducts } from '../../adapters/interfaces/IProductRepository.js';
import { NotFoundError } from '../../utils/errors.js';

/**
 * Servicio de productos — capa de lógica de negocio.
 *
 * Recibe el repositorio por inyección de dependencias (constructor injection).
 * Esto permite:
 *   - Tests: inyectar un mock repository
 *   - ERP: inyectar ERPProductAdapter sin cambiar este código
 */
export class ProductService {
  constructor(private readonly repo: IProductRepository) {}

  async getProducts(
    filters: ProductFilters = {},
    page = 1,
    pageSize = 12
  ): Promise<PaginatedProducts & { hasNextPage: boolean }> {
    const result = await this.repo.findMany(filters, page, pageSize);
    const hasNextPage = page * pageSize < result.total;
    return { ...result, hasNextPage };
  }

  async getProductBySlug(slug: string): Promise<ProductRecord> {
    const product = await this.repo.findBySlug(slug);
    if (!product) throw NotFoundError('Producto');
    return product;
  }

  async getProductById(id: string): Promise<ProductRecord> {
    const product = await this.repo.findById(id);
    if (!product) throw NotFoundError('Producto', id);
    return product;
  }

  /** Para DataLoader — batch loading eficiente */
  async getProductsByIds(ids: string[]): Promise<ProductRecord[]> {
    return this.repo.findByIds(ids);
  }

  async createProduct(data: any): Promise<ProductRecord> {
    return this.repo.create(data);
  }

  async updateProduct(id: string, data: any): Promise<ProductRecord> {
    return this.repo.update(id, data);
  }

  async deleteProduct(id: string): Promise<boolean> {
    await this.repo.delete(id);
    return true;
  }
}
