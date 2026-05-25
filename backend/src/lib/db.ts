import fs from 'fs';
import path from 'path';
import { MenuItem, Order, OrderStatus, Reservation, ReservationStatus, Review, User } from './types';

// Path to the database file
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Interface for the entire database structure
interface DatabaseSchema {
  users: User[];
  menuItems: MenuItem[];
  orders: Order[];
  reservations: Reservation[];
  reviews: Review[];
}

// Initial seed data
const initialData: DatabaseSchema = {
  users: [
    {
      id: 'admin-1',
      email: 'admin@brownsugar.com',
      name: 'Store Manager',
      role: 'admin',
      passwordHash: 'admin123' // Simple mock password for demo
    },
    {
      id: 'cust-1',
      email: 'customer@test.com',
      name: 'Rohan Sharma',
      role: 'customer',
      passwordHash: 'customer123'
    }
  ],
  menuItems: [
    {
      id: 'menu-1',
      name: 'Classic Cappuccino',
      description: 'Rich espresso topped with a smooth, thick layer of frothed milk and a touch of cinnamon powder.',
      price: 240,
      category: 'hot',
      image: '/images/cappuccino.png',
      isAvailable: true,
      ingredients: ['Double espresso', 'Steamed milk', 'Milk foam', 'Cinnamon dusting']
    },
    {
      id: 'menu-2',
      name: 'Iced Caramel Macchiato',
      description: 'Chilled milk marked with espresso shot, layered with sweet vanilla syrup and finished with buttery caramel drizzle.',
      price: 280,
      category: 'cold',
      image: '/images/iced_macchiato.png',
      isAvailable: true,
      ingredients: ['Espresso shot', 'Chilled milk', 'Ice cubes', 'Vanilla syrup', 'Caramel sauce']
    },
    {
      id: 'menu-3',
      name: 'Brown Sugar Hazelnut Frappé',
      description: 'A luxurious blended creamy coffee drink, infused with hazelnut syrup and our signature brown sugar, topped with whipped cream.',
      price: 320,
      category: 'specialty',
      image: '/images/hazelnut_frappe.png',
      isAvailable: true,
      ingredients: ['Blended espresso', 'Hazelnut syrup', 'Brown sugar syrup', 'Whipped cream', 'Chocolate shavings']
    },
    {
      id: 'menu-4',
      name: 'Golden Butter Croissant',
      description: 'Flaky, buttery, fresh-baked French pastry served with a unique warm brown sugar glaze on the side.',
      price: 180,
      category: 'bakery',
      image: '/images/croissant.png',
      isAvailable: true,
      ingredients: ['Unbleached wheat flour', 'Churned butter', 'Yeast', 'Brown sugar glaze']
    },
    {
      id: 'menu-5',
      name: 'Classic Americano',
      description: 'A smooth, full-bodied espresso lengthened with hot water, capturing the pure essence of our house-roasted single origin beans.',
      price: 180,
      category: 'hot',
      image: '/images/cappuccino.png', // Reusing cappuccino for menu illustration
      isAvailable: true,
      ingredients: ['Espresso shot', 'Hot water']
    },
    {
      id: 'menu-6',
      name: 'Spanish Cortado',
      description: 'Equal parts of double espresso and warm, textured milk to reduce acidity while highlighting coffee notes.',
      price: 220,
      category: 'hot',
      image: '/images/cappuccino.png',
      isAvailable: true,
      ingredients: ['Double espresso', 'Warm textured milk']
    },
    {
      id: 'menu-7',
      name: 'Cold Brew Cinnamon Tonic',
      description: 'Slow-steeped cold brew coffee served over ice, mixed with tonic water and accented with a dash of cinnamon syrup.',
      price: 260,
      category: 'cold',
      image: '/images/iced_macchiato.png',
      isAvailable: true,
      ingredients: ['18-hour cold brew', 'Tonic water', 'Cinnamon syrup', 'Ice', 'Orange wedge']
    },
    {
      id: 'menu-8',
      name: 'Trio of Warm Brownies',
      description: 'Rich, fudgy chocolate brownies made with brown sugar, served warm with a scoop of vanilla bean ice cream.',
      price: 210,
      category: 'bakery',
      image: '/images/croissant.png',
      isAvailable: true,
      ingredients: ['Fudge brownie', 'Dark chocolate', 'Brown sugar', 'Vanilla ice cream']
    }
  ],
  orders: [],
  reservations: [],
  reviews: [
    {
      id: 'rev-1',
      customerName: 'Aarav Mehta',
      rating: 5,
      comment: 'The Brown Sugar Hazelnut Frappé is to die for! Easily the best coffee house in town. The aesthetics are so soothing.',
      isApproved: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'rev-2',
      customerName: 'Ananya Roy',
      rating: 5,
      comment: 'Absolutely love their table booking option. Very professional service and delicious fresh croissants. A 10/10!',
      isApproved: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};

// Helper function to read the DB
export function readDb(): DatabaseSchema {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }

    const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading database:', error);
    return initialData;
  }
}

// Helper function to write to the DB
export function writeDb(data: DatabaseSchema): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database:', error);
  }
}

// Helper methods for specific models
export const db = {
  // Menu Operations
  getMenu: (): MenuItem[] => {
    return readDb().menuItems;
  },
  saveMenuItem: (item: MenuItem): void => {
    const database = readDb();
    const index = database.menuItems.findIndex(m => m.id === item.id);
    if (index >= 0) {
      database.menuItems[index] = item;
    } else {
      database.menuItems.push(item);
    }
    writeDb(database);
  },
  deleteMenuItem: (id: string): void => {
    const database = readDb();
    database.menuItems = database.menuItems.filter(m => m.id !== id);
    writeDb(database);
  },

  // Order Operations
  getOrders: (): Order[] => {
    return readDb().orders;
  },
  createOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt'>): Order => {
    const database = readDb();
    const newOrder: Order = {
      ...order,
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    database.orders.push(newOrder);
    writeDb(database);
    return newOrder;
  },
  updateOrderStatus: (id: string, status: OrderStatus): boolean => {
    const database = readDb();
    const order = database.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      writeDb(database);
      return true;
    }
    return false;
  },

  // Reservation Operations
  getReservations: (): Reservation[] => {
    return readDb().reservations;
  },
  createReservation: (reservation: Omit<Reservation, 'id' | 'status' | 'createdAt'>): Reservation => {
    const database = readDb();
    const newReservation: Reservation = {
      ...reservation,
      id: `res-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    database.reservations.push(newReservation);
    writeDb(database);
    return newReservation;
  },
  updateReservationStatus: (id: string, status: ReservationStatus): boolean => {
    const database = readDb();
    const reservation = database.reservations.find(r => r.id === id);
    if (reservation) {
      reservation.status = status;
      writeDb(database);
      return true;
    }
    return false;
  },

  // Review Operations
  getReviews: (includeUnapproved = false): Review[] => {
    const reviews = readDb().reviews;
    if (includeUnapproved) return reviews;
    return reviews.filter(r => r.isApproved);
  },
  createReview: (review: Omit<Review, 'id' | 'isApproved' | 'createdAt'>): Review => {
    const database = readDb();
    const newReview: Review = {
      ...review,
      id: `rev-${Math.floor(1000 + Math.random() * 9000)}`,
      isApproved: true, // Auto-approve for simplified demo (can toggle in admin)
      createdAt: new Date().toISOString()
    };
    database.reviews.push(newReview);
    writeDb(database);
    return newReview;
  },
  toggleReviewApproval: (id: string): boolean => {
    const database = readDb();
    const review = database.reviews.find(r => r.id === id);
    if (review) {
      review.isApproved = !review.isApproved;
      writeDb(database);
      return true;
    }
    return false;
  },
  deleteReview: (id: string): void => {
    const database = readDb();
    database.reviews = database.reviews.filter(r => r.id !== id);
    writeDb(database);
  },

  // User Operations
  getUsers: (): User[] => {
    return readDb().users;
  },
  findUserByEmail: (email: string): User | undefined => {
    return readDb().users.find(u => u.email === email);
  },
  createUser: (user: Omit<User, 'id' | 'role'>): User => {
    const database = readDb();
    const newUser: User = {
      ...user,
      id: `cust-${Math.floor(1000 + Math.random() * 9000)}`,
      role: 'customer'
    };
    database.users.push(newUser);
    writeDb(database);
    return newUser;
  }
};
