'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BookPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM',
    guestCount: 2,
    specialRequests: ''
  });

  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [bookingResult, setBookingResult] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '08:30 AM', '10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', 
    '04:00 PM', '05:30 PM', '07:00 PM', '08:30 PM'
  ];

  // A mock list of tables in our cafe
  const cafeTables = [
    { id: 1, seats: 2, type: 'Window Nook', status: 'available' },
    { id: 2, seats: 2, type: 'Window Nook', status: 'available' },
    { id: 3, seats: 4, type: 'Bohemian Booth', status: 'available' },
    { id: 4, seats: 4, type: 'Bohemian Booth', status: 'reserved' },
    { id: 5, seats: 6, type: 'Family Table', status: 'available' },
    { id: 6, seats: 2, type: 'Espresso Bar Counter', status: 'available' },
    { id: 7, seats: 2, type: 'Espresso Bar Counter', status: 'available' },
    { id: 8, seats: 8, type: 'Board Meeting Table', status: 'available' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guestCount' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          date: formData.date,
          timeSlot: formData.timeSlot,
          guestCount: formData.guestCount,
          specialRequests: `Table Preferred: ${selectedTable ? 'Table #' + selectedTable : 'Any available'} | ${formData.specialRequests}`
        })
      });

      if (response.ok) {
        const result = await response.json();
        setBookingResult(result.reservation);
      }
    } catch (err) {
      console.error('Error reserving table:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      {/* Page Header */}
      <section style={{
        backgroundColor: 'var(--bg-card)',
        padding: '4rem 0 3rem 0',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div className="container animate-fade-in">
          <span style={{ color: 'var(--accent-caramel)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.9rem' }}>
            Reservations
          </span>
          <h1 style={{ fontSize: '2.8rem', color: 'var(--text-dark)', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
            Book a Coffee Table
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            Guarantee your spot for a morning coffee meet, an afternoon remote work sprint, or a cozy evening date. Select your preference below.
          </p>
        </div>
      </section>

      {/* Booking Form and Grid Layout */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-cream)' }}>
        <div className="container">
          
          {bookingResult ? (
            /* Reservation Confirmation Card */
            <div style={{
              maxWidth: '600px',
              margin: '2rem auto',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              border: '2px dashed var(--accent-caramel)',
              overflow: 'hidden'
            }} id="booking-confirmation-ticket">
              <div style={{
                backgroundColor: 'var(--text-dark)',
                color: 'var(--text-light)',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '3rem' }}>☕</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginTop: '0.5rem' }}>Reservation Confirmed</h2>
                <p style={{ color: 'var(--accent-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Booking ID: {bookingResult.id}
                </p>
              </div>

              <div style={{ padding: '2.5rem 2rem', color: 'var(--text-dark)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Guest Name</label>
                    <strong style={{ fontSize: '1.1rem' }}>{bookingResult.customerName}</strong>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Date</label>
                    <strong style={{ fontSize: '1.1rem' }}>{bookingResult.date}</strong>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Time Slot</label>
                    <strong style={{ fontSize: '1.1rem' }}>{bookingResult.timeSlot}</strong>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Guests</label>
                    <strong style={{ fontSize: '1.1rem' }}>{bookingResult.guestCount} People</strong>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--bg-cream)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  marginBottom: '2rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)'
                }}>
                  <strong>Note:</strong> Table bookings are held for a maximum of 15 minutes past the scheduled slot. For assistance, contact support at +91 98765 43210.
                </div>

                <button 
                  onClick={() => setBookingResult(null)} 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                >
                  Make Another Booking
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr',
              gap: '3rem',
              alignItems: 'start'
            }} id="table-booking-form">
              
              {/* Form inputs */}
              <div style={{
                backgroundColor: '#FFFFFF',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)'
              }}>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Guest Information</h3>
                
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    className="form-input" 
                    value={formData.name} 
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Select Date</label>
                    <input 
                      type="date" 
                      name="date"
                      className="form-input" 
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date} 
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Number of Guests</label>
                    <select 
                      name="guestCount"
                      className="form-select"
                      value={formData.guestCount}
                      onChange={handleInputChange}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Select Time Slot</label>
                  <select 
                    name="timeSlot"
                    className="form-select"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Special Requests (Optional)</label>
                  <textarea 
                    name="specialRequests"
                    className="form-textarea" 
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Birthday decoration, baby seat, quiet corner, etc."
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-accent" 
                  style={{ width: '100%', marginTop: '1rem' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Confirming booking...' : 'Confirm Table Booking'}
                </button>
              </div>

              {/* Interactive floor plan visualizer */}
              <div style={{
                backgroundColor: '#FFFFFF',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)'
              }}>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Select Floor Preference</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                  Tap a table on our shop map to request seating. (Green = Available, Red = Reserved).
                </p>

                {/* Simulated Floor Map Grid */}
                <div style={{
                  border: '2px solid var(--border-light)',
                  padding: '2rem 1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-cream)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1.5rem',
                  position: 'relative'
                }}>
                  {/* Entrance Label */}
                  <div style={{
                    gridColumn: 'span 3',
                    textAlign: 'center',
                    borderBottom: '2px dashed var(--border-light)',
                    paddingBottom: '0.75rem',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.1em'
                  }}>
                    Entrance & Espresso Bar
                  </div>

                  {cafeTables.map(table => {
                    const isReserved = table.status === 'reserved';
                    const isSelected = selectedTable === table.id;

                    return (
                      <div 
                        key={table.id}
                        onClick={() => !isReserved && setSelectedTable(isSelected ? null : table.id)}
                        style={{
                          backgroundColor: isReserved 
                            ? '#FFD1D1' 
                            : isSelected 
                            ? 'var(--accent-caramel)' 
                            : '#FFFFFF',
                          color: isSelected ? 'var(--text-light)' : 'var(--text-dark)',
                          border: `2px solid ${
                            isReserved 
                              ? 'var(--error)' 
                              : isSelected 
                              ? 'var(--accent-caramel-hover)' 
                              : 'var(--border-light)'
                          }`,
                          borderRadius: 'var(--radius-md)',
                          padding: '1.25rem 0.75rem',
                          textAlign: 'center',
                          cursor: isReserved ? 'not-allowed' : 'pointer',
                          transition: 'all var(--transition-fast)',
                          opacity: isReserved ? 0.7 : 1,
                          boxShadow: isSelected ? 'var(--shadow-md)' : 'none'
                        }}
                      >
                        <strong style={{ display: 'block', fontSize: '1rem' }}>T#{table.id}</strong>
                        <span style={{ fontSize: '0.8rem', display: 'block', marginTop: '2px', opacity: 0.9 }}>
                          {table.seats} Seats
                        </span>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          display: 'block', 
                          marginTop: '4px',
                          textTransform: 'uppercase',
                          fontWeight: '700',
                          opacity: 0.7
                        }}>
                          {table.type.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {selectedTable && (
                  <div style={{
                    marginTop: '1.5rem',
                    backgroundColor: 'rgba(192, 130, 97, 0.1)',
                    color: 'var(--accent-caramel-hover)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    textAlign: 'center',
                    border: '1px solid var(--accent-light)'
                  }} id="selected-table-notice">
                    You requested Table #{selectedTable} ({cafeTables.find(t => t.id === selectedTable)?.type})
                  </div>
                )}
              </div>

            </form>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}
