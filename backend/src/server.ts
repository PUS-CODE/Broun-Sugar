import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { db } from './lib/db';
import { MenuItem, OrderStatus, ReservationStatus } from './lib/types';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Authentication / Session Endpoint
app.post('/api/auth', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.findUserByEmail(email);

    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'An error occurred during authentication' });
  }
});

// User Registration Endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser = db.createUser({
      name,
      email,
      passwordHash: password // In mock system, passwords are saved plain
    });

    return res.json({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'An error occurred during registration' });
  }
});

// Get Users List (Admin Only)
app.get('/api/users', async (req, res) => {
  try {
    const users = db.getUsers();
    // Return users without passwords for security
    const safeUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role
    }));
    return res.json(safeUsers);
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// Menu Endpoints
app.get('/api/menu', async (req, res) => {
  try {
    const items = db.getMenu();
    return res.json(items);
  } catch (error) {
    console.error('Get menu error:', error);
    return res.status(500).json({ error: 'Failed to retrieve menu' });
  }
});

app.post('/api/menu', async (req, res) => {
  try {
    const item: MenuItem = req.body;
    if (!item.name || !item.price || !item.category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    db.saveMenuItem(item);
    return res.json({ success: true, item });
  } catch (error) {
    console.error('Save menu error:', error);
    return res.status(500).json({ error: 'Failed to save menu item' });
  }
});

app.delete('/api/menu', async (req, res) => {
  try {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: 'ID parameter is required' });
    }
    db.deleteMenuItem(id);
    return res.json({ success: true });
  } catch (error) {
    console.error('Delete menu error:', error);
    return res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

// Order Endpoints
app.get('/api/orders', async (req, res) => {
  try {
    const orders = db.getOrders();
    return res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, address, type, items, totalAmount } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !type || !items || !items.length || !totalAmount) {
      return res.status(400).json({ error: 'Missing required checkout details' });
    }

    const order = db.createOrder({
      customerName,
      customerEmail,
      customerPhone,
      address,
      type,
      items,
      totalAmount
    });

    return res.json({ success: true, order });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

app.patch('/api/orders', async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ error: 'Missing ID or status' });
    }

    const updated = db.updateOrderStatus(id, status as OrderStatus);
    if (updated) {
      return res.json({ success: true });
    } else {
      return res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Update order error:', error);
    return res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Reservation Endpoints
app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = db.getReservations();
    return res.json(reservations);
  } catch (error) {
    console.error('Get reservations error:', error);
    return res.status(500).json({ error: 'Failed to retrieve reservations' });
  }
});

app.post('/api/reservations', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, date, timeSlot, guestCount, specialRequests } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !date || !timeSlot || !guestCount) {
      return res.status(400).json({ error: 'Missing required booking details' });
    }

    const reservation = db.createReservation({
      customerName,
      customerEmail,
      customerPhone,
      date,
      timeSlot,
      guestCount: Number(guestCount),
      specialRequests
    });

    return res.json({ success: true, reservation });
  } catch (error) {
    console.error('Create reservation error:', error);
    return res.status(500).json({ error: 'Failed to make reservation' });
  }
});

app.patch('/api/reservations', async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ error: 'Missing ID or status' });
    }

    const updated = db.updateReservationStatus(id, status as ReservationStatus);
    if (updated) {
      return res.json({ success: true });
    } else {
      return res.status(404).json({ error: 'Reservation not found' });
    }
  } catch (error) {
    console.error('Update reservation error:', error);
    return res.status(500).json({ error: 'Failed to update reservation' });
  }
});

// Review Endpoints
app.get('/api/reviews', async (req, res) => {
  try {
    const includeUnapproved = req.query.all === 'true';
    const reviews = db.getReviews(includeUnapproved);
    return res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    return res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { customerName, rating, comment } = req.body;

    if (!customerName || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required review fields' });
    }

    const review = db.createReview({
      customerName,
      rating: Number(rating),
      comment
    });

    return res.json({ success: true, review });
  } catch (error) {
    console.error('Create review error:', error);
    return res.status(500).json({ error: 'Failed to create review' });
  }
});

app.patch('/api/reviews', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Missing review ID' });
    }

    const updated = db.toggleReviewApproval(id);
    if (updated) {
      return res.json({ success: true });
    } else {
      return res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    console.error('Toggle review approval error:', error);
    return res.status(500).json({ error: 'Failed to toggle review approval' });
  }
});

app.delete('/api/reviews', async (req, res) => {
  try {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: 'ID parameter is required' });
    }
    db.deleteReview(id);
    return res.json({ success: true });
  } catch (error) {
    console.error('Delete review error:', error);
    return res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Brown Sugar Coffee API' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`☕ Brown Sugar Backend running on http://localhost:${PORT}`);
});
