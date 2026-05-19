export interface Rider {
  id: string;
  userId: string;
  name: string;
  phoneNumber: string;
  vehicleInfo?: string;
  isOnline: boolean;
  currentLocation?: { latitude: number; longitude: number };
  rating: number;
  tripsCompleted: number;
  createdAt: Date;
}
