import { Restaurant, MenuItem } from '../entities/Restaurant';

export interface IRestaurantRepository {
  findAll(): Promise<Restaurant[]>;
  findById(id: string): Promise<Restaurant | null>;
  create(restaurant: Omit<Restaurant, 'id'>): Promise<Restaurant>;
  update(id: string, updates: Partial<Restaurant>): Promise<Restaurant>;
  remove(id: string): Promise<void>;
  addMenuItem(restaurantId: string, item: Omit<MenuItem, 'id'>): Promise<MenuItem>;
  updateMenuItem(restaurantId: string, itemId: string, updates: Partial<MenuItem>): Promise<MenuItem>;
  deleteMenuItem(restaurantId: string, itemId: string): Promise<void>;
}
