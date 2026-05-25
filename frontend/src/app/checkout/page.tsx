'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    type: 'pickup' as 'pickup' | 'delivery',
    paymentMethod: 'upi' as 'upi' | 'card' | 'cod'
  });

  const [orderResult, setOrderResult] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpiSim, setShowUpiSim] = useState(false);
  const [upiSimStatus, setUpiSimStatus] = useState<'pending' | 'success'>('pending');

  const subtotal = getCartTotal();
  const gst = Math.round(subtotal * 0.05); // 5% GST on coffee house
  const deliveryFee = formData.type === 'delivery' ? 40 : 0;
  const total = subtotal + gst + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          address: formData.type === 'delivery' ? formData.address : undefined,
          type: formData.type,
          items: cart,
          totalAmount: total
        })
      });

      if (response.ok) {
        const result = await response.json();
        setOrderResult(result.order);
        clearCart();
      }
    } catch (err) {
      console.error('Error placing order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    if (formData.type === 'delivery' && !formData.address) return;

    if (formData.paymentMethod === 'upi') {
      setShowUpiSim(true);
      setUpiSimStatus('pending');
      // Simulate UPI payment confirmation in 2.5s
      setTimeout(() => {
        setUpiSimStatus('success');
        setTimeout(() => {
          setShowUpiSim(false);
          handlePlaceOrder();
        }, 1000);
      }, 2500);
    } else {
      handlePlaceOrder();
    }
  };

  return (
    <>
      <Header />

      <section className="section-padding" style={{ backgroundColor: 'var(--bg-cream)', minHeight: '80vh' }}>
        <div className="container">
          
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.8rem', color: 'var(--text-dark)', fontFamily: 'var(--font-serif)' }}>Checkout</h1>
            <p style={{ color: 'var(--text-muted)' }}>Review your items and complete your order.</p>
          </div>

          {orderResult ? (
            /* Order Receipt Confirmation Card */
            <div style={{
              maxWidth: '650px',
              margin: '0 auto',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-light)',
              overflow: 'hidden'
            }} id="order-receipt-ticket">
              <div style={{
                backgroundColor: 'var(--success)',
                color: '#FFFFFF',
                padding: '2.5rem 2rem',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '3rem' }}>🛍️</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginTop: '0.5rem' }}>Order Placed Successfully!</h2>
                <p style={{ color: 'var(--success-light)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                  Order Ticket: <strong>{orderResult.id}</strong>
                </p>
              </div>

              <div style={{ padding: '2.5rem 2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                  Receipt Details
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {orderResult.items.map((item: any) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                      <span>{item.name} <span style={{ color: 'var(--text-muted)' }}>x {item.quantity}</span></span>
                      <strong>₹{item.price * item.quantity}</strong>
                    </div>
                  ))}
                  
                  <hr style={{ borderColor: 'var(--border-light)', margin: '0.5rem 0' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>GST (5%)</span>
                    <span>₹{Math.round(orderResult.totalAmount - (orderResult.type === 'delivery' ? 40 : 0) - (orderResult.totalAmount / 1.05 * 0.05))}</span>
                  </div>
                  {orderResult.type === 'delivery' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <span>Delivery Fee</span>
                      <span>₹40</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '700', marginTop: '0.5rem' }}>
                    <span>Total Amount Paid</span>
                    <span style={{ color: 'var(--accent-caramel)' }}>₹{orderResult.totalAmount}</span>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--bg-cream)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  marginBottom: '2rem'
                }}>
                  <p><strong>Customer Name:</strong> {orderResult.customerName}</p>
                  <p><strong>Order Type:</strong> {orderResult.type === 'delivery' ? 'Delivery to Address' : 'Self Pickup at Store'}</p>
                  {orderResult.address && <p><strong>Address:</strong> {orderResult.address}</p>}
                  <p style={{ marginTop: '0.5rem' }}>
                    🍔 Status: <strong>{orderResult.status.toUpperCase()}</strong>. You can check order updates at the counter or wait for delivery!
                  </p>
                </div>

                <Link href="/menu" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                  Back to Menu
                </Link>
              </div>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Cart Alert */
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-light)'
            }}>
              <h2>Your Cart is Empty</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                Add delicious warm coffees and fresh bakery treats to get started.
              </p>
              <Link href="/menu" className="btn btn-accent">
                Go to Menu
              </Link>
            </div>
          ) : (
            /* Checkout Flow */
            <form onSubmit={handleSubmit} style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '3rem',
              alignItems: 'start'
            }} id="checkout-form">
              
              {/* Left Column: Details form */}
              <div style={{
                backgroundColor: '#FFFFFF',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)'
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Fulfillment Details</h3>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'pickup' })}
                    className="btn"
                    style={{
                      flex: 1,
                      backgroundColor: formData.type === 'pickup' ? 'var(--text-dark)' : 'transparent',
                      color: formData.type === 'pickup' ? 'var(--text-light)' : 'var(--text-dark)',
                      borderColor: 'var(--text-dark)'
                    }}
                  >
                    🏪 Self Pickup
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'delivery' })}
                    className="btn"
                    style={{
                      flex: 1,
                      backgroundColor: formData.type === 'delivery' ? 'var(--text-dark)' : 'transparent',
                      color: formData.type === 'delivery' ? 'var(--text-light)' : 'var(--text-dark)',
                      borderColor: 'var(--text-dark)'
                    }}
                  >
                    🛵 Home Delivery
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Name</label>
                  <input 
                    type="text" 
                    name="name"
                    className="form-input" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter full name" 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      className="form-input" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="Enter email" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      className="form-input" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      placeholder="Enter phone number" 
                      required 
                    />
                  </div>
                </div>

                {formData.type === 'delivery' && (
                  <div className="form-group animate-fade-in">
                    <label className="form-label">Delivery Address</label>
                    <textarea 
                      name="address"
                      className="form-textarea" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      placeholder="Enter complete house address, street, landmark, pincode" 
                      required 
                    />
                  </div>
                )}

                <h3 style={{ fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Payment Method</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { id: 'upi', title: 'UPI (GPay / PhonePe / Paytm)', desc: 'Simulate direct UPI transfer with QR' },
                    { id: 'card', title: 'Credit / Debit Card', desc: 'Mock Visa/Mastercard processing' },
                    { id: 'cod', title: formData.type === 'delivery' ? 'Cash on Delivery (COD)' : 'Cash at Counter', desc: 'Pay when you receive your order' }
                  ].map(method => (
                    <label key={method.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${formData.paymentMethod === method.id ? 'var(--accent-caramel)' : 'var(--border-light)'}`,
                      cursor: 'pointer',
                      backgroundColor: formData.paymentMethod === method.id ? 'rgba(192, 130, 97, 0.04)' : '#FFFFFF'
                    }}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method.id} 
                        checked={formData.paymentMethod === method.id}
                        onChange={handleInputChange}
                        style={{ accentColor: 'var(--accent-caramel)' }}
                      />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.95rem' }}>{method.title}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{method.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div style={{
                backgroundColor: '#FFFFFF',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
                position: 'sticky',
                top: '100px'
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Order Summary</h3>
                
                {/* Cart summary list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                      <span style={{ maxWidth: '70%' }}>{item.name} <span style={{ color: 'var(--text-muted)' }}>x {item.quantity}</span></span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <hr style={{ borderColor: 'var(--border-light)', marginBottom: '1.5rem' }} />

                {/* Totals */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyItems: 'space-between', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyItems: 'space-between', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>GST (5%)</span>
                    <span>₹{gst}</span>
                  </div>
                  {formData.type === 'delivery' && (
                    <div style={{ display: 'flex', justifyItems: 'space-between', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Delivery Fee</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                  )}
                  <hr style={{ borderColor: 'var(--border-light)', margin: '0.25rem 0' }} />
                  <div style={{ display: 'flex', justifyItems: 'space-between', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '700' }}>
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--accent-caramel)' }}>₹{total}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-accent" 
                  style={{ width: '100%', padding: '0.9rem' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Placing Order...' : `Pay ₹${total} & Place Order`}
                </button>
              </div>

            </form>
          )}

        </div>
      </section>

      {/* UPI Simulator Modal */}
      {showUpiSim && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(61, 37, 30, 0.6)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }} id="upi-simulator-modal">
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Scan QR to Pay</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Simulating Secure Merchant UPI Transfer
            </p>
            
            {/* Simulated QR Code Graphic */}
            <div style={{
              width: '180px',
              height: '180px',
              border: '8px solid var(--text-dark)',
              borderRadius: 'var(--radius-md)',
              margin: '0 auto 1.5rem auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              position: 'relative'
            }}>
              {/* QR Pattern Placeholder Mock */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
                width: '140px',
                height: '140px'
              }}>
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} style={{
                    backgroundColor: (i % 2 === 0 || i % 3 === 0) ? 'var(--text-dark)' : 'transparent',
                    borderRadius: '2px'
                  }} />
                ))}
              </div>
              <div style={{
                position: 'absolute',
                fontSize: '1.2rem',
                backgroundColor: '#FFFFFF',
                padding: '4px',
                borderRadius: '4px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                ☕
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>Amount Due: ₹{total}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {upiSimStatus === 'pending' ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid var(--accent-light)',
                    borderTopColor: 'var(--accent-caramel)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Waiting for UPI pin authorization...</span>
                </>
              ) : (
                <div style={{ color: 'var(--success)', fontWeight: '600', fontSize: '1rem' }}>
                  ✓ UPI Payment Verified!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
