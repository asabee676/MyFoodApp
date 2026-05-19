import { v4 as uuidv4 } from 'uuid';
import { Order } from '../../../core/entities/Order';
import { IOrderRepository } from '../../../core/repositories/IOrderRepository';

export class InMemoryOrderRepository implements IOrderRepository {
  private orders: Order[] = [];

  async create(data: Omit<Order, 'id' | 'date'>): Promise<Order> {
    const order: Order = { ...data, id: uuidv4(), date: new Date() };
    this.orders.push(order);
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.find(o => o.id === id) ?? null;
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    return this.orders.filter(o => o.customerId === customerId);
  }

  async findByRiderId(riderId: string): Promise<Order[]> {
    return this.orders.filter(o => o.riderId === riderId);
  }

  async findByRestaurantId(restaurantId: string): Promise<Order[]> {
    return this.orders.filter(o => o.restaurantId === restaurantId);
  }

  async findAll(): Promise<Order[]> {
    return [...this.orders].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async update(id: string, updates: Partial<Order>): Promise<Order> {
    const idx = this.orders.findIndex(o => o.id === id);
    if (idx === -1) throw new Error(`Order ${id} not found`);
    this.orders[idx] = { ...this.orders[idx], ...updates };
    return this.orders[idx];
  }
}
