'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartCount, getCartTotal } = useCart();
  const { user, logout } = useAuth();
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.navContainer}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo} id="nav-logo">
            <span>BROWN</span>
            <span className={styles.logoAccent}>SUGAR</span>
          </Link>

          {/* Desktop Navigation */}
          <nav>
            <ul className={styles.navLinks}>
              <li>
                <Link 
                  href="/" 
                  className={`${styles.navLink} ${pathname === '/' ? styles.activeLink : ''}`}
                  id="nav-link-home"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/menu" 
                  className={`${styles.navLink} ${pathname === '/menu' ? styles.activeLink : ''}`}
                  id="nav-link-menu"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link 
                  href="/book" 
                  className={`${styles.navLink} ${pathname === '/book' ? styles.activeLink : ''}`}
                  id="nav-link-book"
                >
                  Book Table
                </Link>
              </li>
              {user && user.role === 'admin' && (
                <li>
                  <Link 
                    href="/admin" 
                    className={`${styles.navLink} ${pathname === '/admin' ? styles.activeLink : ''}`}
                    id="nav-link-admin"
                  >
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Actions (Cart & User) */}
          <div className={styles.navActions}>
            {/* Cart trigger button */}
            <button 
              onClick={toggleCart} 
              className={styles.cartButton} 
              aria-label="Open Cart"
              id="cart-trigger-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {getCartCount() > 0 && (
                <span className={styles.cartBadge} id="cart-item-count">{getCartCount()}</span>
              )}
            </button>

            {/* User Session Info */}
            {user ? (
              <div className={styles.userButton}>
                <span id="user-display-name" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Hi, {user.name.split(' ')[0]}
                </span>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} id="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} id="login-link-btn">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Cart Slider Drawer */}
      <div 
        className={`${styles.cartOverlay} ${isCartOpen ? styles.cartOverlayActive : ''}`} 
        onClick={toggleCart}
        id="cart-overlay"
      />
      
      <div className={`${styles.cartDrawer} ${isCartOpen ? styles.cartDrawerActive : ''}`} id="cart-drawer-container">
        <div className={styles.cartHeader}>
          <h2>Shopping Cart</h2>
          <button onClick={toggleCart} className={styles.closeButton} aria-label="Close Cart" id="cart-close-btn">
            &times;
          </button>
        </div>

        <div className={styles.cartBody}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart} id="empty-cart-msg">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <p>Your cart is empty.</p>
              <Link href="/menu" onClick={toggleCart} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                View Coffee Menu
              </Link>
            </div>
          ) : (
            <div className={styles.cartItemsList} id="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <div className={styles.itemDetails}>
                    <h4 className={styles.itemName}>{item.name}</h4>
                    <span className={styles.itemPrice}>₹{item.price}</span>
                    <div className={styles.quantityControls}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                        className={styles.qtyBtn}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                        className={styles.qtyBtn}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className={styles.removeBtn}
                    aria-label="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.cartFooter}>
            <div className={styles.subtotalRow}>
              <span>Subtotal:</span>
              <span className={styles.subtotalPrice} id="cart-subtotal">₹{getCartTotal()}</span>
            </div>
            <button 
              onClick={handleCheckoutClick} 
              className="btn btn-accent checkoutBtn"
              id="checkout-btn"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
