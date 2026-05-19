import { gql } from '@apollo/client';
import { PRODUCT_CARD_FRAGMENT, PRODUCT_DETAIL_FRAGMENT } from '../fragments/product.fragments';

// ─── Listado de productos ─────────────────────────────────────────────────────
export const GET_PRODUCTS = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query GetProducts($filters: ProductFilters, $page: Int = 1, $pageSize: Int = 12) {
    products(filters: $filters, page: $page, pageSize: $pageSize) {
      items {
        ...ProductCard
      }
      pagination {
        total
        page
        pageSize
        hasNextPage
      }
    }
  }
`;

// ─── Detalle de un producto ───────────────────────────────────────────────────
export const GET_PRODUCT_BY_SLUG = gql`
  ${PRODUCT_DETAIL_FRAGMENT}
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      ...ProductDetail
    }
  }
`;

// ─── Categorías para el nav / filtros ────────────────────────────────────────
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      productCount
    }
  }
`;
