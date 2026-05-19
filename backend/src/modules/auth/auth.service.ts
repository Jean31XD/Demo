import bcrypt from 'bcryptjs';
import type { ICustomerRepository, CustomerRecord } from '../../adapters/interfaces/ICustomerRepository.js';
import { signToken } from '../../utils/jwt.js';
import { AuthenticationError, ConflictError, ValidationError } from '../../utils/errors.js';

export interface AuthPayload {
  token: string;
  customer: Omit<CustomerRecord, 'password'>;
}

export class AuthService {
  constructor(private readonly customerRepo: ICustomerRepository) {}

  async login(email: string, password: string): Promise<AuthPayload> {
    const customer = await this.customerRepo.findByEmail(email.toLowerCase().trim());
    if (!customer) throw AuthenticationError('Credenciales incorrectas');

    const valid = await bcrypt.compare(password, customer.password);
    if (!valid) throw AuthenticationError('Credenciales incorrectas');

    const token = signToken({ customerId: customer.id, email: customer.email });
    const { password: _, ...safeCustomer } = customer;
    return { token, customer: safeCustomer };
  }

  async getById(id: string): Promise<Omit<CustomerRecord, 'password'> | null> {
    const customer = await this.customerRepo.findById(id);
    if (!customer) return null;
    const { password: _, ...safe } = customer;
    return safe;
  }

  async register(email: string, name: string, password: string): Promise<AuthPayload> {
    if (password.length < 8) throw ValidationError('La contraseña debe tener al menos 8 caracteres');

    const existing = await this.customerRepo.findByEmail(email.toLowerCase().trim());
    if (existing) throw ConflictError('Ya existe una cuenta con ese correo');

    const hash = await bcrypt.hash(password, 12);
    const customer = await this.customerRepo.create({
      email: email.toLowerCase().trim(),
      name: name.trim(),
      password: hash,
      phone: null,
    });

    const token = signToken({ customerId: customer.id, email: customer.email });
    const { password: _, ...safeCustomer } = customer;
    return { token, customer: safeCustomer };
  }
}
