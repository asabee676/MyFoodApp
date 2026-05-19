export interface MenuItem {
  id: string;
  category: string;
  name: string;
  desc: string;
  price: number;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  image: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  promo?: string | null;
  featured: boolean;
  tags: string[];
  address: string;
  menu: MenuItem[];
  status: 'active' | 'inactive' | 'pending';
}
