import { gql } from '@apollo/client';

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`;
