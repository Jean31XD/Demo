export const orderTypeDefs = /* GraphQL */ `
  enum OrderStatus {
    PENDING
    CONFIRMED
    SHIPPED
    DELIVERED
    CANCELLED
  }

  type Order {
    id: ID!
    customer: Customer!
    items: [OrderItem!]!
    total: Float!
    status: OrderStatus!
    notes: String
    createdAt: String!
  }

  type OrderItem {
    id: ID!
    product: Product!
    quantity: Int!
    unitPrice: Float!
    subtotal: Float!
  }

  type OrdersResult {
    items: [Order!]!
    pagination: Pagination!
    totalRevenue: Float!
  }

  type CustomersResult {
    items: [Customer!]!
    pagination: Pagination!
  }

  input PlaceOrderItemInput {
    productId: ID!
    quantity: Int!
  }

  input PlaceOrderInput {
    items: [PlaceOrderItemInput!]!
    shippingAddr: String
    notes: String
  }

  extend type Query {
    myOrders: [Order!]!
    order(id: ID!): Order
    # Admin queries — requieren token válido
    allOrders(page: Int, pageSize: Int, status: OrderStatus): OrdersResult!
    allCustomers(page: Int, pageSize: Int): CustomersResult!
    dashboardStats: DashboardStats!
  }

  type DashboardStats {
    totalProducts: Int!
    lowStockProducts: Int!
    outOfStockProducts: Int!
    totalOrders: Int!
    pendingOrders: Int!
    totalRevenue: Float!
    totalCustomers: Int!
  }

  extend type Mutation {
    placeOrder(input: PlaceOrderInput!): Order!
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!
  }
`;
