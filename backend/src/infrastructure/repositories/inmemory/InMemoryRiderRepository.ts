import { v4 as uuidv4 } from 'uuid';
import { Rider } from '../../../core/entities/Rider';
import { IRiderRepository } from '../../../core/repositories/IRiderRepository';

export class InMemoryRiderRepository implements IRiderRepository {
  private riders: Rider[] = [];

  async findById(id: string): Promise<Rider | null> {
    return this.riders.find(r => r.id === id) ?? null;
  }

  async findByUserId(userId: string): Promise<Rider | null> {
    return this.riders.find(r => r.userId === userId) ?? null;
  }

  async findAll(): Promise<Rider[]> {
    return [...this.riders];
  }

  async findOnline(): Promise<Rider[]> {
    return this.riders.filter(r => r.isOnline);
  }

  async create(data: Omit<Rider, 'id' | 'createdAt'>): Promise<Rider> {
    const rider: Rider = { ...data, id: uuidv4(), createdAt: new Date() };
    this.riders.push(rider);
    return rider;
  }

  async update(id: string, updates: Partial<Rider>): Promise<Rider> {
    const idx = this.riders.findIndex(r => r.id === id);
    if (idx === -1) throw new Error(`Rider ${id} not found`);
    this.riders[idx] = { ...this.riders[idx], ...updates };
    return this.riders[idx];
  }
}
