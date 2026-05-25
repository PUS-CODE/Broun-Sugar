'use client';

import React, { useState } from 'react';
import { MenuItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import styles from './CoffeeCard.module.css';

interface CoffeeCardProps {
  item: MenuItem;
}

export default function CoffeeCard({ item }: CoffeeCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(item);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const getBadgeStyle = (category: string) => {
    switch (category) {
      case 'hot': return styles.badgeHot;
      case 'cold': return styles.badgeCold;
      case 'specialty': return styles.badgeSpecialty;
      case 'bakery': return styles.badgeBakery;
      default: return '';
    }
  };

  const formatCategory = (category: string) => {
    if (category === 'hot') return 'Hot Coffee';
    if (category === 'cold') return 'Cold Brews';
    if (category === 'specialty') return 'House Specialty';
    return category;
  };

  return (
    <div className={styles.card} id={`menu-card-${item.id}`}>
      {/* Image & Category Badge */}
      <div className={styles.imageWrapper}>
        <span className={`${styles.badge} ${getBadgeStyle(item.category)}`}>
          {formatCategory(item.category)}
        </span>
        <img 
          src={item.image} 
          alt={item.name} 
          className={styles.cardImage} 
          loading="lazy" 
        />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{item.name}</h3>
        <p className={styles.description}>{item.description}</p>
        
        {/* Ingredients tags */}
        {item.ingredients && item.ingredients.length > 0 && (
          <div className={styles.ingredientsList}>
            {item.ingredients.map((ing, i) => (
              <span key={i} className={styles.ingredientTag}>{ing}</span>
            ))}
          </div>
        )}

        {/* Footer section (Price & Action) */}
        <div className={styles.footer}>
          <span className={styles.price}>
            <span className={styles.priceSymbol}>₹</span>
            {item.price}
          </span>
          
          <button 
            onClick={handleAddToCart}
            className={`${styles.addBtn} ${isAdded ? styles.successFeedback : ''}`}
            disabled={!item.isAvailable}
            id={`add-btn-${item.id}`}
          >
            {isAdded ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Added!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
