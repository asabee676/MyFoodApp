import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { container } from '../../infrastructure/di/container';

const { restaurantRepo } = container;

const restaurantSchema = z.object({
  name: z.string().min(1),
  cuisine: z.array(z.string()).min(1),
  image: z.string().url(),
  rating: z.number().min(0).max(5).default(0),
  reviews: z.number().int().default(0),
  deliveryTime: z.string().default('30-45 min'),
  deliveryFee: z.number().min(0),
  minOrder: z.number().min(0),
  promo: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  address: z.string().min(1),
  menu: z.array(z.any()).default([]),
  status: z.enum(['active', 'inactive', 'pending']).default('pending'),
});

const menuItemSchema = z.object({
  category: z.string().min(1),
  name: z.string().min(1),
  desc: z.string().default(''),
  price: z.number().min(0),
  image: z.string().url().or(z.string().default('')),
});

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const restaurants = await restaurantRepo.findAll();
    // Public endpoint: filter active only unless admin/merchant
    const role = req.user?.role;
    const filtered = (role === 'admin' || role === 'merchant')
      ? restaurants
      : restaurants.filter(r => r.status === 'active');
    res.json({ success: true, data: filtered });
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const restaurant = await restaurantRepo.findById(req.params.id);
    if (!restaurant) {
      res.status(404).json({ success: false, message: 'Restaurant not found' });
      return;
    }
    res.json({ success: true, data: restaurant });
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = restaurantSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Validation error', errors: parsed.error.flatten().fieldErrors });
      return;
    }
    const restaurant = await restaurantRepo.create(parsed.data as any);
    res.status(201).json({ success: true, data: restaurant });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const restaurant = await restaurantRepo.update(req.params.id, req.body);
    res.json({ success: true, data: restaurant });
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await restaurantRepo.remove(req.params.id);
    res.json({ success: true, message: 'Restaurant deleted' });
  } catch (err) { next(err); }
}

export async function addMenuItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = menuItemSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
      return;
    }
    const item = await restaurantRepo.addMenuItem(req.params.id, parsed.data);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
}

export async function updateMenuItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await restaurantRepo.updateMenuItem(req.params.id, req.params.itemId, req.body);
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

export async function deleteMenuItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await restaurantRepo.deleteMenuItem(req.params.id, req.params.itemId);
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (err) { next(err); }
}
