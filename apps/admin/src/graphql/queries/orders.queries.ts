import { gql } from '@apollo/client';

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
        product { id name slug }
      }
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query GetAllOrders($page: Int, $pageSize: Int, $status: OrderStatus) {
    allOrders(page: $page, pageSize: $pageSize, status: $status) {
      items {
        id
        total
        status
        notes
        createdAt
        customer { id name email }
        items {
          id
          quantity
          unitPrice
          subtotal
          product { id name slug }
        }
      }
      pagination {
        total
        page
        pageSize
        hasNextPage
      }
      totalRevenue
    }
  }
`;

export const GET_ALL_CUSTOMERS = gql`
  query GetAllCustomers($page: Int, $pageSize: Int) {
    allCustomers(page: $page, pageSize: $pageSize) {
      items {
        id
        name
        email
        createdAt
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

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalProducts
      lowStockProducts
      outOfStockProducts
      totalOrders
      pendingOrders
      totalRevenue
      totalCustomers
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      total
      status
      notes
      createdAt
      items {
        id
        quantity
        unitPrice
        subtotal
        product { id name slug images { url alt } }
      }
    }
  }
`;
