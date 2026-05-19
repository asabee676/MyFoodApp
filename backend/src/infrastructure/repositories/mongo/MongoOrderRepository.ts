import { Order } from '../../../core/entities/Order';
import { IOrderRepository } from '../../../core/repositories/IOrderRepository';

/**
 * MongoDB implementation stub.
 * Set DATABASE_PROVIDER=mongodb in .env to activate.
 */
export class MongoOrderRepository implements IOrderRepository {
  async create(_data: Omit<Order, 'id' | 'date'>): Promise<Order> { throw new Error('Not implemented'); }
  async findById(_id: string): Promise<Order | null> { throw new Error('Not implemented'); }
  async findByCustomerId(_cId: string): Promise<Order[]> { throw new Error('Not implemented'); }
  async findByRiderId(_rId: string): Promise<Order[]> { throw new Error('Not implemented'); }
  async findByRestaurantId(_rId: string): Promise<Order[]> { throw new Error('Not implemented'); }
  async findAll(): Promise<Order[]> { throw new Error('Not implemented'); }
  async update(_id: string, _updates: Partial<Order>): Promise<Order> { throw new Error('Not implemented'); }
}
