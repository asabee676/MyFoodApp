export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'client' | 'rider' | 'admin' | 'merchant';
  phoneNumber?: string;
  createdAt: Date;
}
