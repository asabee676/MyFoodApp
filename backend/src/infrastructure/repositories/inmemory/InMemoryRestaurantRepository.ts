import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { Restaurant, MenuItem } from '../../../core/entities/Restaurant';
import { IRestaurantRepository } from '../../../core/repositories/IRestaurantRepository';

function loadSeedData(): Restaurant[] {
  // Try multiple paths — supports running from backend/ or from workspace root
  const candidates = [
    path.resolve(__dirname, '../../../../../myapp/data/sample-restaurants.json'),
    path.resolve(process.cwd(), '../myapp/data/sample-restaurants.json'),
    path.resolve(process.cwd(), 'myapp/data/sample-restaurants.json'),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const raw = JSON.parse(fs.readFileSync(p, 'utf-8'));
      const restaurants: Restaurant[] = (raw.restaurants as any[]).map((r: any) => ({
        id: r.id,
        name: r.name,
        cuisine: r.cuisine,
        image: r.image,
        rating: r.rating,
        reviews: r.reviews,
        deliveryTime: r.deliveryTime,
        deliveryFee: r.deliveryFee,
        minOrder: r.minOrder,
        promo: r.promo ?? null,
        featured: r.featured,
        tags: r.tags,
        address: r.address,
        menu: (r.menu as any[]).map((m: any) => ({
          id: m.id,
          category: m.category,
          name: m.name,
          desc: m.desc,
          price: m.price,
          image: m.image,
        })),
        status: 'active' as const,
      }));
      console.log(`[InMemoryRestaurantRepo] Seeded ${restaurants.length} restaurants from: ${p}`);
      return restaurants;
    }
  }
  console.warn('[InMemoryRestaurantRepo] sample-restaurants.json not found — starting with empty store.');
  return [];
}

export class InMemoryRestaurantRepository implements IRestaurantRepository {
  private restaurants: Restaurant[] = loadSeedData();

  async findAll(): Promise<Restaurant[]> {
    return [...this.restaurants];
  }

  async findById(id: string): Promise<Restaurant | null> {
    return this.restaurants.find(r => r.id === id) ?? null;
  }

  async create(data: Omit<Restaurant, 'id'>): Promise<Restaurant> {
    const restaurant: Restaurant = { ...data, id: uuidv4() };
    this.restaurants.push(restaurant);
    return restaurant;
  }

  async update(id: string, updates: Partial<Restaurant>): Promise<Restaurant> {
    const idx = this.restaurants.findIndex(r => r.id === id);
    if (idx === -1) throw new Error(`Restaurant ${id} not found`);
    this.restaurants[idx] = { ...this.restaurants[idx], ...updates };
    return this.restaurants[idx];
  }

  async remove(id: string): Promise<void> {
    const idx = this.restaurants.findIndex(r => r.id === id);
    if (idx === -1) throw new Error(`Restaurant ${id} not found`);
    this.restaurants.splice(idx, 1);
  }

  async addMenuItem(restaurantId: string, itemData: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const idx = this.restaurants.findIndex(r => r.id === restaurantId);
    if (idx === -1) throw new Error(`Restaurant ${restaurantId} not found`);
    const item: MenuItem = { ...itemData, id: uuidv4() };
    this.restaurants[idx].menu.push(item);
    return item;
  }

  async updateMenuItem(restaurantId: string, itemId: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const rIdx = this.restaurants.findIndex(r => r.id === restaurantId);
    if (rIdx === -1) throw new Error(`Restaurant ${restaurantId} not found`);
    const mIdx = this.restaurants[rIdx].menu.findIndex(m => m.id === itemId);
    if (mIdx === -1) throw new Error(`MenuItem ${itemId} not found`);
    this.restaurants[rIdx].menu[mIdx] = { ...this.restaurants[rIdx].menu[mIdx], ...updates };
    return this.restaurants[rIdx].menu[mIdx];
  }

  async deleteMenuItem(restaurantId: string, itemId: string): Promise<void> {
    const rIdx = this.restaurants.findIndex(r => r.id === restaurantId);
    if (rIdx === -1) throw new Error(`Restaurant ${restaurantId} not found`);
    const mIdx = this.restaurants[rIdx].menu.findIndex(m => m.id === itemId);
    if (mIdx === -1) throw new Error(`MenuItem ${itemId} not found`);
    this.restaurants[rIdx].menu.splice(mIdx, 1);
  }
}
