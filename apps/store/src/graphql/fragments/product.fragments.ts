import { gql } from '@apollo/client';

/**
 * Fragmento mínimo para tarjeta de producto en listados.
 * Cada componente declara sus propios campos → sin over-fetching.
 */
export const PRODUCT_CARD_FRAGMENT = gql`
  fragment ProductCard on Product {
    id
    name
    slug
    price
    compareAtPrice
    sku
    brand
    images { url alt }
    attributes { name value }
    inventory { available quantity }
    category { id name }
  }
`;

/**
 * Fragmento extendido para la página de detalle de producto.
 * Incluye campos adicionales que no necesitamos en el listado.
 */
export const PRODUCT_DETAIL_FRAGMENT = gql`
  fragment ProductDetail on Product {
    ...ProductCard
    description
    relatedProducts {
      id
      name
      slug
      price
      sku
      images { url alt }
      inventory { available quantity }
      category { id name }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;
