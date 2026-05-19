import { Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/di/container';

const { orderRepo, restaurantRepo, userRepo } = container;

export async function getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [orders, restaurants, users] = await Promise.all([
      orderRepo.findAll(),
      restaurantRepo.findAll(),
      userRepo.findAll(),
    ]);

    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.total, 0);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

    const activeRestaurants = restaurants.filter(r => r.status === 'active').length;
    const pendingRestaurants = restaurants.filter(r => r.status === 'pending').length;

    const totalClients = users.filter(u => u.role === 'client').length;
    const totalRiders = users.filter(u => u.role === 'rider').length;

    // Last 7 days orders by day
    const now = new Date();
    const ordersByDay: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      ordersByDay[key] = 0;
    }
    orders.forEach(o => {
      const key = new Date(o.date).toISOString().split('T')[0];
      if (key in ordersByDay) ordersByDay[key]++;
    });

    res.json({
      success: true,
      data: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        activeRestaurants,
        pendingRestaurants,
        totalRestaurants: restaurants.length,
        totalClients,
        totalRiders,
        totalUsers: users.length,
        recentOrders: orders.slice(0, 10),
        ordersByDay,
      },
    });
  } catch (err) { next(err); }
}
