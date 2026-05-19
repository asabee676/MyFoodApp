import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { User } from '../../../core/entities/User';
import { IUserRepository } from '../../../core/repositories/IUserRepository';

const SEED_USERS: Omit<User, 'id' | 'createdAt'>[] = [
  { email: 'admin@kaledash.com',    passwordHash: bcrypt.hashSync('Admin1234!', 10),    name: 'KaleDash Admin',   role: 'admin' },
  { email: 'client@kaledash.com',   passwordHash: bcrypt.hashSync('Client1234!', 10),   name: 'Test Client',      role: 'client' },
  { email: 'rider@kaledash.com',    passwordHash: bcrypt.hashSync('Rider1234!', 10),    name: 'Kwame Asante',     role: 'rider',    phoneNumber: '+233 24 000 0001' },
  { email: 'merchant@kaledash.com', passwordHash: bcrypt.hashSync('Merchant1234!', 10), name: 'Mama\'s Kitchen',  role: 'merchant', phoneNumber: '+233 24 000 0002' },
];

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = SEED_USERS.map(u => ({
    ...u,
    id: uuidv4(),
    createdAt: new Date(),
  }));

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  async create(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user: User = { ...data, id: uuidv4(), createdAt: new Date() };
    this.users.push(user);
    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error(`User ${id} not found`);
    this.users[idx] = { ...this.users[idx], ...updates };
    return this.users[idx];
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }
}
