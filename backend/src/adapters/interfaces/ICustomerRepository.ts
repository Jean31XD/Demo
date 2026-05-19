/**
 * Puerto del repositorio de clientes.
 * Implementaciones: PrismaCustomerRepository, ERPCustomerAdapter (futuro)
 */

export interface CustomerRecord {
  id: string;
  email: string;
  name: string;
  password: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomerRepository {
  findById(id: string): Promise<CustomerRecord | null>;
  findByEmail(email: string): Promise<CustomerRecord | null>;
  findByIds(ids: string[]): Promise<CustomerRecord[]>;
  create(data: Pick<CustomerRecord, 'email' | 'name' | 'password' | 'phone'>): Promise<CustomerRecord>;
  update(id: string, data: Partial<Pick<CustomerRecord, 'name' | 'phone'>>): Promise<CustomerRecord>;
}
