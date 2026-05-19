import type { IOrderRepository, OrderRecord, CreateOrderInput, OrderStatus } from '../interfaces/IOrderRepository.js';
import prisma from './prisma.client.js';

export class PrismaOrderRepository implements IOrderRepository {

  private toRecord(o: any): OrderRecord {
    return {
      ...o,
      status: o.status as OrderStatus,
      items: o.items ?? [],
    };
  }

  async findById(id: string): Promise<OrderRecord | null> {
    const o = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    return o ? this.toRecord(o) : null;
  }

  async findByCustomerId(customerId: string): Promise<OrderRecord[]> {
    const rows = await prisma.order.findMany({
      where: { customerId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((o) => this.toRecord(o));
  }

  async create(data: CreateOrderInput): Promise<OrderRecord> {
    const o = await prisma.order.create({
      data: {
        customerId: data.customerId,
        total: data.total,
        status: 'PENDING',
        shippingAddr: data.shippingAddr ?? null,
        notes: data.notes ?? null,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { items: true },
    });
    return this.toRecord(o);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<OrderRecord> {
    const o = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
    return this.toRecord(o);
  }
}
