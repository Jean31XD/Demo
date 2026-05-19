import { gql } from '@apollo/client';

// TODO: Agregar al backend schema: createProduct, updateProduct, deleteProduct
// Los resolvers deben verificar rol admin antes de ejecutar

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      slug
      price
      inventory { quantity available }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      price
      inventory { quantity available }
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;
