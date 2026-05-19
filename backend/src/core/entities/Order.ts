export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'heading_to_restaurant'
  | 'at_restaurant'
  | 'heading_to_customer'
  | 'at_customer'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  deliveryAddress: string;
  deliveryCoordinates?: { latitude: number; longitude: number };
  riderId?: string | null;
  riderName?: string | null;
  riderPhone?: string | null;
  date: Date;
  estimatedTime?: string;
}
