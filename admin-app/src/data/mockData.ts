export interface Restaurant {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  orders: number;
  revenue: number;
  rating: number;
  category: string;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  restaurantName: string;
  amount: number;
  status: 'delivered' | 'processing' | 'cancelled' | 'pending';
  date: string;
}

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'KFC Ghana',
    status: 'active',
    orders: 1240,
    revenue: 45200,
    rating: 4.5,
    category: 'Fast Food',
    image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '2',
    name: 'Burger King',
    status: 'active',
    orders: 850,
    revenue: 32100,
    rating: 4.2,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '3',
    name: 'Papaye',
    status: 'inactive',
    orders: 2100,
    revenue: 68000,
    rating: 4.8,
    category: 'Local Dishes',
    image: 'https://images.unsplash.com/photo-1562601579-599dec554e8d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '4',
    name: 'Sushi Zen',
    status: 'pending',
    orders: 0,
    revenue: 0,
    rating: 0,
    category: 'Japanese',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=200'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-7721',
    customerName: 'Abel Smith',
    restaurantName: 'KFC Ghana',
    amount: 125.50,
    status: 'delivered',
    date: '2026-05-16 14:30'
  },
  {
    id: 'ORD-7722',
    customerName: 'John Doe',
    restaurantName: 'Burger King',
    amount: 85.00,
    status: 'processing',
    date: '2026-05-16 15:15'
  },
  {
    id: 'ORD-7723',
    customerName: 'Sarah Wilson',
    restaurantName: 'Papaye',
    amount: 210.20,
    status: 'pending',
    date: '2026-05-16 16:00'
  },
  {
    id: 'ORD-7724',
    customerName: 'Michael Brown',
    restaurantName: 'KFC Ghana',
    amount: 45.90,
    status: 'cancelled',
    date: '2026-05-16 16:30'
  }
];

export const stats = [
  { label: 'Total Revenue', value: '$145,200', change: '+12.5%', up: true, icon: 'DollarSign' },
  { label: 'Total Orders', value: '4,280', change: '+18.2%', up: true, icon: 'ShoppingBag' },
  { label: 'Active Restaurants', value: '86', change: '+4.1%', up: true, icon: 'Utensils' },
  { label: 'New Customers', value: '1,240', change: '-2.4%', up: false, icon: 'Users' }
];
