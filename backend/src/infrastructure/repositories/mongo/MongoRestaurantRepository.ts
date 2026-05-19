import { Restaurant, MenuItem } from '../../../core/entities/Restaurant';
import { IRestaurantRepository } from '../../../core/repositories/IRestaurantRepository';

/**
 * MongoDB implementation stub.
 * Set DATABASE_PROVIDER=mongodb in .env to activate.
 */
export class MongoRestaurantRepository implements IRestaurantRepository {
  async findAll(): Promise<Restaurant[]> { throw new Error('Not implemented'); }
  async findById(_id: string): Promise<Restaurant | null> { throw new Error('Not implemented'); }
  async create(_data: Omit<Restaurant, 'id'>): Promise<Restaurant> { throw new Error('Not implemented'); }
  async update(_id: string, _updates: Partial<Restaurant>): Promise<Restaurant> { throw new Error('Not implemented'); }
  async remove(_id: string): Promise<void> { throw new Error('Not implemented'); }
  async addMenuItem(_rId: string, _item: Omit<MenuItem, 'id'>): Promise<MenuItem> { throw new Error('Not implemented'); }
  async updateMenuItem(_rId: string, _iId: string, _u: Partial<MenuItem>): Promise<MenuItem> { throw new Error('Not implemented'); }
  async deleteMenuItem(_rId: string, _iId: string): Promise<void> { throw new Error('Not implemented'); }
}
