/**
 * Puerto del repositorio de órdenes.
 */

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItemRecord {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderRecord {
  id: string;
  customerId: string;
  items: OrderItemRecord[];
  total: number;
  status: OrderStatus;
  shippingAddr: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderInput {
  customerId: string;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
  total: number;
  shippingAddr?: string;
  notes?: string;
}

export interface IOrderRepository {
  findById(id: string): Promise<OrderRecord | null>;
  findByCustomerId(customerId: string): Promise<OrderRecord[]>;
  create(data: CreateOrderInput): Promise<OrderRecord>;
  updateStatus(id: string, status: OrderStatus): Promise<OrderRecord>;
}
