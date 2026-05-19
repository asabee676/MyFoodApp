import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Server as IOServer } from 'socket.io';
import { container } from '../../infrastructure/di/container';

const { orderRepo, restaurantRepo, userRepo } = container;

// Socket.io instance injected at startup
let io: IOServer | null = null;
export function setSocketServer(ioInstance: IOServer): void {
  io = ioInstance;
}

const createOrderSchema = z.object({
  restaurantId: z.string().min(1),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().int().min(1),
  })).min(1),
  total: z.number().positive(),
  deliveryAddress: z.string().min(1),
  deliveryCoordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
});

export async function createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Validation error', errors: parsed.error.flatten().fieldErrors });
      return;
    }

    const { restaurantId, items, total, deliveryAddress, deliveryCoordinates } = parsed.data;

    const [restaurant, customer] = await Promise.all([
      restaurantRepo.findById(restaurantId),
      userRepo.findById(req.user!.userId),
    ]);

    if (!restaurant) { res.status(404).json({ success: false, message: 'Restaurant not found' }); return; }
    if (!customer) { res.status(404).json({ success: false, message: 'Customer not found' }); return; }

    const order = await orderRepo.create({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phoneNumber,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      items,
      total,
      status: 'pending',
      deliveryAddress,
      deliveryCoordinates,
      riderId: null,
      riderName: null,
      riderPhone: null,
      estimatedTime: restaurant.deliveryTime,
    });

    // Emit to riders room so all online riders receive new order alert
    if (io) {
      io.to('room:riders').emit('order:new', order);
      console.log(`[Socket] order:new emitted → room:riders | orderId=${order.id}`);
    }

    res.status(201).json({ success: true, data: order });
  } catch (err) { next(err); }
}

export async function getClientOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orders = await orderRepo.findByCustomerId(req.user!.userId);
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
}

export async function getRiderOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orders = await orderRepo.findByRiderId(req.user!.userId);
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
}

export async function getMerchantOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orders = await orderRepo.findByRestaurantId(req.params.restaurantId);
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
}

export async function getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orders = await orderRepo.findAll();
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
}

export async function updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await orderRepo.findById(req.params.id);
    if (!order) { res.status(404).json({ success: false, message: 'Order not found' }); return; }

    const updatedOrder = await orderRepo.update(req.params.id, req.body);

    if (io) {
      // Notify the customer's room about any status change
      io.to(`room:order:${updatedOrder.id}`).emit('order:updated', updatedOrder);
      if (req.body.status) {
        io.to(`room:order:${updatedOrder.id}`).emit('order:status_updated', {
          orderId: updatedOrder.id,
          status: updatedOrder.status,
          riderName: updatedOrder.riderName,
          estimatedTime: updatedOrder.estimatedTime,
        });
        console.log(`[Socket] order:status_updated → room:order:${updatedOrder.id} | status=${updatedOrder.status}`);
      }
    }

    res.json({ success: true, data: updatedOrder });
  } catch (err) { next(err); }
}
