import { Rider } from '../entities/Rider';

export interface IRiderRepository {
  findById(id: string): Promise<Rider | null>;
  findByUserId(userId: string): Promise<Rider | null>;
  findAll(): Promise<Rider[]>;
  findOnline(): Promise<Rider[]>;
  create(rider: Omit<Rider, 'id' | 'createdAt'>): Promise<Rider>;
  update(id: string, updates: Partial<Rider>): Promise<Rider>;
}
