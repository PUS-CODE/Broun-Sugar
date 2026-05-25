export type CoffeeCategory = 'hot' | 'cold' | 'specialty' | 'bakery';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in INR
  category: CoffeeCategory;
  image: string; // generated image or placeholder URL
  isAvailable: boolean;
  ingredients?: string[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'cancelled';
export type OrderType = 'delivery' | 'pickup';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address?: string;
  type: OrderType;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export type ReservationStatus = 'confirmed' | 'seated' | 'cancelled';

export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM", "4:30 PM"
  guestCount: number;
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  isApproved: boolean; // toggleable by admin
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  passwordHash: string; // simple hashed/plain password for mock logins
}
