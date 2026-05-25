'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Order, Reservation, Review, MenuItem, CoffeeCategory } from '@/lib/types';

export default function AdminPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'menu' | 'reviews' | 'users'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<{id: string; name: string; email: string; role: string}[]>([]);

  // Menu item form state
  const [menuForm, setMenuForm] = useState({
    id: '',
    name: '',
    description: '',
    price: 150,
    category: 'hot' as CoffeeCategory,
    image: '/images/cappuccino.png',
    ingredients: '',
    isAvailable: true
  });
  const [isEditingMenu, setIsEditingMenu] = useState(false);

  // Fetch stats and lists on mount/auth success
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchOrders();
      fetchReservations();
      fetchReviews();
      fetchMenu();
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = () => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setRegisteredUsers(data); });
  };

  const fetchOrders = () => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setOrders(data.reverse()); });
  };

  const fetchReservations = () => {
    fetch('/api/reservations')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setReservations(data.reverse()); });
  };

  const fetchReviews = () => {
    fetch('/api/reviews?all=true')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setReviews(data.reverse()); });
  };

  const fetchMenu = () => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setMenuItems(data); });
  };

  // Order actions
  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (response.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // Reservation actions
  const handleUpdateReservationStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (response.ok) fetchReservations();
    } catch (err) {
      console.error(err);
    }
  };

  // Review actions
  const handleToggleReviewApproval = async (id: string) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (response.ok) fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      const response = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
      if (response.ok) fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  // Menu CRUD actions
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: menuForm.id || `menu-${Math.floor(1000 + Math.random() * 9000)}`,
        name: menuForm.name,
        description: menuForm.description,
        price: Number(menuForm.price),
        category: menuForm.category,
        image: menuForm.image,
        isAvailable: menuForm.isAvailable,
        ingredients: menuForm.ingredients ? menuForm.ingredients.split(',').map(s => s.trim()) : []
      };

      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchMenu();
        resetMenuForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditMenuClick = (item: MenuItem) => {
    setMenuForm({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      ingredients: item.ingredients ? item.ingredients.join(', ') : '',
      isAvailable: item.isAvailable
    });
    setIsEditingMenu(true);
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const response = await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
      if (response.ok) fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  const resetMenuForm = () => {
    setMenuForm({
      id: '',
      name: '',
      description: '',
      price: 150,
      category: 'hot',
      image: '/images/cappuccino.png',
      ingredients: '',
      isAvailable: true
    });
    setIsEditingMenu(false);
  };

  // Auth Protection Check
  if (isAuthLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading dashboard authorization...
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <>
        <Header />
        <section className="section-padding flex-center" style={{ backgroundColor: 'var(--bg-cream)', minHeight: '70vh' }}>
          <div className="text-center" style={{ maxWidth: '500px', padding: '3rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '3rem' }}>🚫</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>Access Denied</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              You must be logged in as an administrator to access the Store Manager dashboard.
            </p>
            <Link href="/login" className="btn btn-primary">
              Log In as Admin
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <section style={{ backgroundColor: 'var(--bg-cream)', minHeight: '85vh', padding: '3rem 0' }}>
        <div className="container">
          
          {/* Dashboard Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--text-dark)', fontFamily: 'var(--font-serif)' }}>Store Manager Panel</h1>
              <p style={{ color: 'var(--text-muted)' }}>Fulfill orders, confirm reservations, edit coffee menus, and moderate customer reviews.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
                👤 Role: <strong>{user.name}</strong>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
            {[
              { label: 'Active Orders', count: orders.filter(o => o.status === 'pending' || o.status === 'preparing').length, color: 'var(--accent-caramel)', icon: '🛍️' },
              { label: 'Pending Bookings', count: reservations.filter(r => r.status === 'confirmed').length, color: '#4E6E58', icon: '📅' },
              { label: 'Menu Items', count: menuItems.length, color: 'var(--text-dark)', icon: '☕' },
              { label: 'Submitted Reviews', count: reviews.length, color: '#C08261', icon: '⭐' },
              { label: 'Registered Users', count: registeredUsers.filter(u => u.role === 'customer').length, color: '#5B8DB8', icon: '👤' }
            ].map((stat, i) => (
              <div key={i} style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
                  <strong style={{ fontSize: '2rem', color: stat.color }}>{stat.count}</strong>
                </div>
                <span style={{ fontSize: '1.8rem' }}>{stat.icon}</span>
              </div>
            ))}
          </div>

          {/* Tab Selector Links */}
          <div style={{ display: 'flex', borderBottom: '2px solid var(--border-light)', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {[
              { id: 'orders', label: '🛍️ Orders' },
              { id: 'reservations', label: '📅 Table Bookings' },
              { id: 'menu', label: '☕ Edit Menu' },
              { id: 'reviews', label: '⭐ Reviews' },
              { id: 'users', label: '👤 Registered Users' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '1rem 0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  color: activeTab === tab.id ? 'var(--text-dark)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab.id ? '3px solid var(--accent-caramel)' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content 1: Orders */}
          {activeTab === 'orders' && (
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }} id="admin-orders-tab">
              <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Incoming Customer Orders</h2>
              {orders.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>No orders placed yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {orders.map(order => (
                    <div key={order.id} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--bg-cream)', paddingBottom: '0.75rem' }}>
                        <div>
                          <strong>Order ID: {order.id}</strong> | Name: {order.customerName} | Phone: {order.customerPhone}
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                            Placed at: {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{
                            padding: '0.3rem 0.6rem',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            borderRadius: '4px',
                            backgroundColor: order.status === 'completed' ? 'var(--success-light)' : order.status === 'cancelled' ? 'var(--error-light)' : 'rgba(192, 130, 97, 0.1)',
                            color: order.status === 'completed' ? 'var(--success)' : order.status === 'cancelled' ? 'var(--error)' : 'var(--accent-caramel-hover)'
                          }}>
                            {order.status.toUpperCase()}
                          </span>
                          
                          {/* Status Actions */}
                          <select 
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="form-select"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Ordered Items:</strong>
                          <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.95rem' }}>
                            {order.items.map((item, idx) => (
                              <li key={idx} style={{ marginBottom: '0.25rem' }}>
                                • {item.name} <strong>x {item.quantity}</strong> (₹{item.price} each)
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p><strong>Fulfillment Type:</strong> {order.type.toUpperCase()}</p>
                          {order.address && <p><strong>Delivery Address:</strong> {order.address}</p>}
                          <p style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>Total Receipt: <strong>₹{order.totalAmount}</strong></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content 2: Reservations */}
          {activeTab === 'reservations' && (
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }} id="admin-reservations-tab">
              <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Table Booking Requests</h2>
              {reservations.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>No reservations registered yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem', minWidth: '700px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem' }}>Guest Name</th>
                        <th style={{ padding: '0.75rem' }}>Date & Time</th>
                        <th style={{ padding: '0.75rem' }}>Guests</th>
                        <th style={{ padding: '0.75rem' }}>Special Request / Table Pref</th>
                        <th style={{ padding: '0.75rem' }}>Status</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map(res => (
                        <tr key={res.id} style={{ borderBottom: '1px solid var(--bg-cream)' }}>
                          <td style={{ padding: '1rem 0.75rem' }}>
                            <strong>{res.customerName}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>{res.customerPhone} | {res.customerEmail}</span>
                          </td>
                          <td style={{ padding: '1rem 0.75rem' }}>
                            {res.date}
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-caramel)', display: 'block' }}>{res.timeSlot}</span>
                          </td>
                          <td style={{ padding: '1rem 0.75rem' }}><strong>{res.guestCount}</strong> People</td>
                          <td style={{ padding: '1rem 0.75rem', maxWidth: '250px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {res.specialRequests || '-'}
                          </td>
                          <td style={{ padding: '1rem 0.75rem' }}>
                            <span style={{
                              padding: '0.2rem 0.5rem',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              borderRadius: '4px',
                              backgroundColor: res.status === 'confirmed' ? 'var(--success-light)' : res.status === 'seated' ? 'rgba(192, 130, 97, 0.1)' : 'var(--error-light)',
                              color: res.status === 'confirmed' ? 'var(--success)' : res.status === 'seated' ? 'var(--accent-caramel)' : 'var(--error)'
                            }}>
                              {res.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                            {res.status === 'confirmed' && (
                              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                <button 
                                  onClick={() => handleUpdateReservationStatus(res.id, 'seated')}
                                  className="btn btn-secondary" 
                                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                >
                                  Seated
                                </button>
                                <button 
                                  onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')}
                                  className="btn btn-secondary" 
                                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: 'var(--error)', borderColor: 'var(--error)' }}
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab Content 3: Menu Custom Editor */}
          {activeTab === 'menu' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }} id="admin-menu-tab">
              {/* Menu items list */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Coffee & Bakery Menu List</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {menuItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--bg-cream)', paddingBottom: '1rem' }}>
                      <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '1rem' }}>{item.name}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                          Category: {item.category.toUpperCase()} | Price: <strong>₹{item.price}</strong>
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEditMenuClick(item)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteMenuItem(item.id)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: 'var(--error)', borderColor: 'var(--error)' }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Menu item form */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', height: 'fit-content' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  {isEditingMenu ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h3>

                <form onSubmit={handleSaveMenuItem}>
                  <div className="form-group">
                    <label className="form-label">Item Name</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={menuForm.name} 
                      onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} 
                      placeholder="e.g. Cinnamon Latte" 
                      required 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Price (INR)</label>
                      <input 
                        type="number" 
                        className="form-input"
                        value={menuForm.price} 
                        onChange={e => setMenuForm({ ...menuForm, price: Number(e.target.value) })} 
                        placeholder="200" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select 
                        className="form-select"
                        value={menuForm.category} 
                        onChange={e => setMenuForm({ ...menuForm, category: e.target.value as any })}
                      >
                        <option value="hot">Hot Coffee</option>
                        <option value="cold">Cold Brews</option>
                        <option value="specialty">House Specialty</option>
                        <option value="bakery">Fresh Bakery</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Item Description</label>
                    <textarea 
                      className="form-textarea"
                      value={menuForm.description} 
                      onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} 
                      placeholder="Enter detailed taste profile description..." 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Image Asset Path</label>
                    <select
                      className="form-select"
                      value={menuForm.image}
                      onChange={e => setMenuForm({ ...menuForm, image: e.target.value })}
                    >
                      <option value="/images/cappuccino.png">Cappuccino Delight Image</option>
                      <option value="/images/iced_macchiato.png">Iced Macchiato Image</option>
                      <option value="/images/hazelnut_frappe.png">Hazelnut Frappe Image</option>
                      <option value="/images/croissant.png">Croissant Bakery Image</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ingredients (Comma separated)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={menuForm.ingredients} 
                      onChange={e => setMenuForm({ ...menuForm, ingredients: e.target.value })} 
                      placeholder="Espresso, Steamed milk, Cocoa" 
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                    <button type="submit" className="btn btn-accent" style={{ flex: 1 }}>
                      {isEditingMenu ? 'Update Item' : 'Create Item'}
                    </button>
                    {isEditingMenu && (
                      <button type="button" onClick={resetMenuForm} className="btn btn-secondary">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tab Content 4: Reviews approval moderator */}
          {activeTab === 'reviews' && (
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }} id="admin-reviews-tab">
              <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Moderate Customer Reviews</h2>
              
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>No reviews submitted yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {reviews.map(rev => (
                    <div key={rev.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'start', borderBottom: '1px solid var(--bg-cream)', paddingBottom: '1.25rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <strong>{rev.customerName}</strong>
                          <div style={{ color: '#FFB84C', fontSize: '0.9rem' }}>
                            {'★'.repeat(rev.rating)}
                            {'☆'.repeat(5 - rev.rating)}
                          </div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-dark)', fontStyle: 'italic', fontSize: '0.95rem' }}>
                          "{rev.comment}"
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button 
                          onClick={() => handleToggleReviewApproval(rev.id)} 
                          className="btn" 
                          style={{
                            backgroundColor: rev.isApproved ? 'var(--success-light)' : 'rgba(61, 37, 30, 0.05)',
                            color: rev.isApproved ? 'var(--success)' : 'var(--text-muted)',
                            border: 'none',
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}
                        >
                          {rev.isApproved ? 'Approved & Visible' : 'Hidden / Unapproved'}
                        </button>
                        <button 
                          onClick={() => handleDeleteReview(rev.id)} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'var(--error)', borderColor: 'var(--error)' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content 5: Registered Users */}
          {activeTab === 'users' && (
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }} id="admin-users-tab">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)' }}>Registered Customers</h2>
                <span style={{ backgroundColor: 'var(--bg-cream)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Total: <strong style={{ color: 'var(--text-dark)' }}>{registeredUsers.filter(u => u.role === 'customer').length} customers</strong>
                </span>
              </div>

              {registeredUsers.filter(u => u.role === 'customer').length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>👤</span>
                  <p>No customers have registered yet. Share the Sign Up page to get started!</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left' }}>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Name</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>User ID</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registeredUsers.filter(u => u.role === 'customer').map((u, idx) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--bg-cream)', transition: 'background var(--transition-fast)' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-cream)')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                backgroundColor: 'var(--accent-light)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-dark)'
                              }}>
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <strong>{u.name}</strong>
                            </div>
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                          <td style={{ padding: '1rem' }}>
                            <code style={{ fontSize: '0.8rem', backgroundColor: 'var(--bg-cream)', padding: '0.2rem 0.4rem', borderRadius: '4px', color: 'var(--text-muted)' }}>
                              {u.id}
                            </code>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              padding: '0.25rem 0.6rem',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              borderRadius: '4px',
                              backgroundColor: 'var(--success-light)',
                              color: 'var(--success)'
                            }}>
                              CUSTOMER
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}
