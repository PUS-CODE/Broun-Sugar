import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--text-dark)',
      color: 'var(--text-light)',
      padding: '4rem 0 2rem 0',
      marginTop: 'auto',
      borderTop: '3px solid var(--accent-caramel)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              marginBottom: '1rem',
              color: '#FFFFFF'
            }}>
              BROWN<span style={{ color: 'var(--accent-caramel)' }}>SUGAR</span>
            </h3>
            <p style={{
              color: 'var(--accent-light)',
              maxWidth: '350px',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Roasting premium single-origin beans and craft-baking daily. Visit us for an unforgettable cozy environment and rich flavor profile.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {/* Mock Social Icons */}
              {['Instagram', 'Facebook', 'Twitter'].map(social => (
                <span key={social} style={{
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  color: 'var(--accent-light)',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-light)'}
                >
                  {social}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '1.25rem',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.03em'
            }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link href="/" style={{ color: 'var(--accent-light)', fontSize: '0.95rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-light)'}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" style={{ color: 'var(--accent-light)', fontSize: '0.95rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-light)'}>
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/book" style={{ color: 'var(--accent-light)', fontSize: '0.95rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-light)'}>
                  Book Table
                </Link>
              </li>
              <li>
                <Link href="/login" style={{ color: 'var(--accent-light)', fontSize: '0.95rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-light)'}>
                  Staff Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Timings & Contact */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '1.25rem',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.03em'
            }}>
              Hours & Location
            </h4>
            <p style={{ color: 'var(--accent-light)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              <strong>Mon - Fri:</strong> 8:00 AM - 10:00 PM
            </p>
            <p style={{ color: 'var(--accent-light)', fontSize: '0.95rem', marginBottom: '1rem' }}>
              <strong>Sat - Sun:</strong> 9:00 AM - 11:00 PM
            </p>
            <p style={{ color: 'var(--accent-light)', fontSize: '0.95rem', lineHeight: '1.4' }}>
              128, Park Street, Area 5,
              <br />
              Kolkata, WB 700016
            </p>
            <p style={{ color: 'var(--accent-light)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Phone: +91 98765 43210
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr style={{ borderColor: 'rgba(239, 227, 211, 0.1)', margin: '2rem 0' }} />

        {/* Copyright */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'var(--accent-light)',
          fontSize: '0.85rem'
        }}>
          <span>&copy; {new Date().getFullYear()} Brown Sugar Coffee House. All rights reserved.</span>
          <span>Made with ❤️ in Kolkata</span>
        </div>
      </div>

      <style jsx global>{`
        @media (max-grid-width: 768px) {
          footer div div {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
