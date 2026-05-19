import { gql } from '@apollo/client';

export const PLACE_ORDER = gql`
  mutation PlaceOrder($input: PlaceOrderInput!) {
    placeOrder(input: $input) {
      id
      total
      status
      createdAt
    }
  }
`;

export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      total
      status
      createdAt
      items {
        id
        quantity
        unitPrice
        subtotal
        product {
          id
          name
          sku
        }
      }
    }
  }
`;
