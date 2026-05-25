'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CoffeeCard from '@/components/CoffeeCard';
import { MenuItem, Review } from '@/lib/types';

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  // Fetch initial data
  useEffect(() => {
    // Fetch menu for featured items (take top 3)
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFeaturedItems(data.slice(0, 3));
        }
        setIsLoadingMenu(false);
      })
      .catch(err => {
        console.error('Error fetching menu:', err);
        setIsLoadingMenu(false);
      });

    // Fetch approved reviews
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReviews(data);
        }
      })
      .catch(err => console.error('Error fetching reviews:', err));
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: newReview.name,
          rating: newReview.rating,
          comment: newReview.comment
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Add new review to local state
        setReviews(prev => [result.review, ...prev]);
        setNewReview({ name: '', rating: 5, comment: '' });
        setReviewSuccess(true);
        setTimeout(() => setReviewSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #F5EFEB 0%, #E6CCB2 100%)',
        padding: '8rem 0 6rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Floating background decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(192, 130, 97, 0.1)',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(61, 37, 30, 0.04)',
          zIndex: 1
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <span style={{
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: 'var(--accent-caramel)',
                display: 'block',
                marginBottom: '1rem'
              }}>
                Welcome to Brown Sugar
              </span>
              <h1 style={{
                fontSize: '4rem',
                color: 'var(--text-dark)',
                marginBottom: '1.5rem',
                lineHeight: '1.15'
              }}>
                Premium Beans. <br />
                Cozy Spaces. <br />
                <span style={{ color: 'var(--accent-caramel)', fontStyle: 'italic' }}>Perfection</span> in Every Sip.
              </h1>
              <p style={{
                fontSize: '1.15rem',
                color: 'var(--text-muted)',
                marginBottom: '2.5rem',
                maxWidth: '550px'
              }}>
                Nestled in the heart of Kolkata, Brown Sugar brings you artisanal hand-roasted coffee, fresh pastries, and a warm workspace. Crafted with precision, loved by locals.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/menu" className="btn btn-accent btn-lg" style={{ fontSize: '1.05rem', padding: '0.9rem 2.2rem' }}>
                  Explore Menu
                </Link>
                <Link href="/book" className="btn btn-secondary btn-lg" style={{ fontSize: '1.05rem', padding: '0.9rem 2.2rem' }}>
                  Book a Table
                </Link>
              </div>
            </div>

            {/* Coffee Hero Image */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                position: 'relative',
                width: '320px',
                height: '320px',
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                background: 'var(--text-dark)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '5px solid #FFFFFF'
              }}>
                <img 
                  src="/images/cappuccino.png" 
                  alt="Signature Coffee" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Value Propositions */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Why Coffee Lovers Choose Us</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              We dedicate hours to sourcing and roasting beans to offer you the ultimate brew.
            </p>
          </div>

          <div className="grid-3">
            {[
              {
                title: 'Single-Origin Beans',
                desc: '100% Arabica beans ethically sourced from the rich terrains of Chikmagalur, roasted in-house to peak complexity.',
                icon: '🌱'
              },
              {
                title: 'Artisan Baking',
                desc: 'Every croissant and brownie is baked fresh in our kitchen starting at 4:00 AM, using organic brown sugar.',
                icon: '🥐'
              },
              {
                title: 'Warm Ambience',
                desc: 'A light-brown aesthetic with high-speed internet, power sockets, and cozy corners perfect for reading or working.',
                icon: '🛋️'
              }
            ].map((prop, idx) => (
              <div key={idx} style={{
                backgroundColor: 'var(--bg-cream)',
                padding: '2.5rem 2rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                transition: 'transform var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>{prop.icon}</span>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', fontFamily: 'var(--font-serif)' }}>{prop.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-cream)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3rem'
          }}>
            <div>
              <span style={{ color: 'var(--accent-caramel)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Customer Favorites
              </span>
              <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>Signature Creations</h2>
            </div>
            <Link href="/menu" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              View Full Menu
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

          {isLoadingMenu ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>Loading signature brews...</div>
          ) : (
            <div className="grid-3">
              {featuredItems.map(item => (
                <CoffeeCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem'
          }}>
            {/* Display Reviews */}
            <div>
              <span style={{ color: 'var(--accent-caramel)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Testimonials
              </span>
              <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '2.5rem' }}>What Our Guests Say</h2>

              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No reviews yet. Be the first to share your thoughts!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '450px', overflowY: 'auto', paddingRight: '1rem' }}>
                  {reviews.map((rev) => (
                    <div key={rev.id} style={{
                      backgroundColor: 'var(--bg-cream)',
                      padding: '1.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '1rem' }}>{rev.customerName}</strong>
                        <div style={{ color: '#FFB84C' }}>
                          {'★'.repeat(rev.rating)}
                          {'☆'.repeat(5 - rev.rating)}
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic' }}>
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Review Form */}
            <div style={{
              backgroundColor: 'var(--bg-cream)',
              padding: '2.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              height: 'fit-content'
            }}>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Share Your Experience</h3>
              
              {reviewSuccess && (
                <div style={{
                  backgroundColor: 'var(--success-light)',
                  color: 'var(--success)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Thank you! Your review has been submitted and displayed.
                </div>
              )}

              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newReview.name} 
                    onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                    placeholder="Enter your name" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <select 
                    className="form-select"
                    value={newReview.rating} 
                    onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  >
                    <option value={5}>5 Stars - Outstanding</option>
                    <option value={4}>4 Stars - Great</option>
                    <option value={3}>3 Stars - Good</option>
                    <option value={2}>2 Stars - Average</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Thoughts</label>
                  <textarea 
                    className="form-textarea" 
                    value={newReview.comment} 
                    onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Tell us what you liked about Brown Sugar..." 
                    required 
                  />
                </div>

                <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
