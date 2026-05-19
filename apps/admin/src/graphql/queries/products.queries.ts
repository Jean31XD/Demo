import { gql } from '@apollo/client';

/** Vista completa del producto para el admin (incluye SKU, stock, timestamps) */
export const GET_ADMIN_PRODUCTS = gql`
  query GetAdminProducts($filters: ProductFilters, $page: Int, $pageSize: Int) {
    products(filters: $filters, page: $page, pageSize: $pageSize) {
      items {
        id
        name
        slug
        price
        compareAtPrice
        sku
        images { url alt }
        inventory { available quantity }
        category { id name }
        createdAt
        updatedAt
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

export const GET_ADMIN_PRODUCT = gql`
  query GetAdminProduct($id: ID!) {
    productById(id: $id) {
      id
      name
      slug
      description
      price
      compareAtPrice
      sku
      images { url alt }
      attributes { name value }
      inventory { available quantity }
      category { id name slug }
    }
  }
`;

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
