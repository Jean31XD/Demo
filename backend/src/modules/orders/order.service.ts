import type { IOrderRepository, OrderRecord, CreateOrderInput, OrderStatus } from '../../adapters/interfaces/IOrderRepository.js';
import type { IProductRepository } from '../../adapters/interfaces/IProductRepository.js';
import { NotFoundError, ValidationError } from '../../utils/errors.js';
import { sendOrderConfirmationEmail } from '../../utils/mailer.js';
import prisma from '../../adapters/prisma/prisma.client.js';

export interface PlaceOrderInput {
  customerId: string;
  items: Array<{ productId: string; quantity: number }>;
  shippingAddr?: string;
  notes?: string;
}

export class OrderService {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly productRepo: IProductRepository
  ) {}

  async placeOrder(input: PlaceOrderInput): Promise<OrderRecord> {
    if (input.items.length === 0) throw ValidationError('La orden debe tener al menos un artículo');

    // Verificar stock y calcular total
    const products = await this.productRepo.findByIds(input.items.map((i) => i.productId));

    let total = 0;
    const orderItems: CreateOrderInput['items'] = [];

    for (const item of input.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw NotFoundError('Producto', item.productId);

      const available = product.inventory?.quantity ?? 0;
      if (available < item.quantity) {
        throw ValidationError(`Stock insuficiente para "${product.name}". Disponible: ${available}`);
      }

      total += product.price * item.quantity;
      orderItems.push({ productId: item.productId, quantity: item.quantity, unitPrice: product.price });
    }

    const order = await this.orderRepo.create({
      customerId: input.customerId,
      items: orderItems,
      total: Math.round(total * 100) / 100,
      shippingAddr: input.shippingAddr,
      notes: input.notes,
    });

    try {
      const customer = await prisma.customer.findUnique({
        where: { id: input.customerId },
      });
      if (customer) {
        await sendOrderConfirmationEmail(order, customer, products);
      }
    } catch (err) {
      console.error('[MAILER ERROR] No se pudo enviar el correo de confirmación:', err);
    }

    return order;
  }

  async getOrdersByCustomer(customerId: string): Promise<OrderRecord[]> {
    return this.orderRepo.findByCustomerId(customerId);
  }

  async getOrderById(id: string): Promise<OrderRecord> {
    const order = await this.orderRepo.findById(id);
    if (!order) throw NotFoundError('Orden', id);
    return order;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<OrderRecord> {
    await this.getOrderById(id); // valida que exista
    return this.orderRepo.updateStatus(id, status);
  }
}
