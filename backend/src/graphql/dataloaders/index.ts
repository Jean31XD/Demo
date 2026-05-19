import DataLoader from 'dataloader';
import type { ProductService } from '../../modules/products/product.service.js';
import type { ProductRecord } from '../../adapters/interfaces/IProductRepository.js';

/**
 * DataLoaders — previenen el problema N+1 en GraphQL.
 *
 * Sin DataLoader: resolver de Order.items llama a DB N veces (una por item).
 * Con DataLoader: acumula todos los IDs en un tick y hace UNA sola query.
 *
 * Se crean POR REQUEST (no son singletons) para que el caché sea por petición.
 */
export const createDataLoaders = (productService: ProductService) => ({
  productLoader: new DataLoader<string, ProductRecord | null>(async (ids) => {
    const products = await productService.getProductsByIds([...ids]);
    const map = new Map(products.map((p) => [p.id, p]));
    return ids.map((id) => map.get(id) ?? null);
  }),
});

export type DataLoaders = ReturnType<typeof createDataLoaders>;
