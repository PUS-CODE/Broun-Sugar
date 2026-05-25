'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CoffeeCard from '@/components/CoffeeCard';
import { MenuItem, CoffeeCategory } from '@/lib/types';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMenuItems(data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load menu items:', err);
        setIsLoading(false);
      });
  }, []);

  const categories = [
    { id: 'all', label: 'Full Menu' },
    { id: 'hot', label: 'Hot Coffee' },
    { id: 'cold', label: 'Cold Brews' },
    { id: 'specialty', label: 'House Specialty' },
    { id: 'bakery', label: 'Fresh Bakery' }
  ];

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <>
      <Header />

      {/* Menu Header Hero */}
      <section style={{
        backgroundColor: 'var(--bg-card)',
        padding: '5rem 0 4rem 0',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div className="container animate-fade-in">
          <span style={{ color: 'var(--accent-caramel)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.9rem' }}>
            Hand-Crafted Selections
          </span>
          <h1 style={{ fontSize: '3rem', color: 'var(--text-dark)', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Our Coffee House Menu
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            Explore our curated menu of slow-steeped cold brews, signature lattes, and fresh flaky baked croissants. Custom prepared to your specifications.
          </p>
        </div>
      </section>

      {/* Main Menu Grid & Filters */}
      <section className="section-padding" style={{ minHeight: '60vh' }}>
        <div className="container">
          
          {/* Categories Tab Selector */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3.5rem',
            flexWrap: 'wrap'
          }} id="menu-category-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="btn"
                style={{
                  backgroundColor: activeCategory === cat.id ? 'var(--text-dark)' : '#FFFFFF',
                  color: activeCategory === cat.id ? 'var(--text-light)' : 'var(--text-dark)',
                  border: `1px solid ${activeCategory === cat.id ? 'transparent' : 'var(--border-light)'}`,
                  padding: '0.6rem 1.4rem',
                  fontSize: '0.9rem',
                  borderRadius: 'var(--radius-md)'
                }}
                id={`cat-tab-${cat.id}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Loading Indicator */}
          {isLoading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4rem 0',
              color: 'var(--text-muted)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--accent-light)',
                borderTopColor: 'var(--accent-caramel)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
              }} />
              <span>Grinding fresh beans for the menu...</span>
            </div>
          ) : (
            <>
              {/* Menu items display grid */}
              {filteredItems.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 0' }}>
                  No menu items found in this category.
                </div>
              ) : (
                <div className="grid-4" id="menu-items-grid">
                  {filteredItems.map(item => (
                    <CoffeeCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}
