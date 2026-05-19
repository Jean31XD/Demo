import type { ICustomerRepository, CustomerRecord } from '../interfaces/ICustomerRepository.js';
import prisma from './prisma.client.js';

export class PrismaCustomerRepository implements ICustomerRepository {

  async findById(id: string): Promise<CustomerRecord | null> {
    return prisma.customer.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<CustomerRecord | null> {
    return prisma.customer.findUnique({ where: { email } });
  }

  async findByIds(ids: string[]): Promise<CustomerRecord[]> {
    const rows = await prisma.customer.findMany({ where: { id: { in: ids } } });
    const map = new Map(rows.map((c) => [c.id, c]));
    return ids.map((id) => map.get(id)!).filter(Boolean);
  }

  async create(data: Pick<CustomerRecord, 'email' | 'name' | 'password' | 'phone'>): Promise<CustomerRecord> {
    return prisma.customer.create({ data });
  }

  async update(id: string, data: Partial<Pick<CustomerRecord, 'name' | 'phone'>>): Promise<CustomerRecord> {
    return prisma.customer.update({ where: { id }, data });
  }
}
