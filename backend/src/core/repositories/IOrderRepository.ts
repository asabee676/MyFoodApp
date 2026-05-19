import { Order } from '../entities/Order';

export interface IOrderRepository {
  create(order: Omit<Order, 'id' | 'date'>): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByCustomerId(customerId: string): Promise<Order[]>;
  findByRiderId(riderId: string): Promise<Order[]>;
  findByRestaurantId(restaurantId: string): Promise<Order[]>;
  findAll(): Promise<Order[]>;
  update(id: string, updates: Partial<Order>): Promise<Order>;
}
