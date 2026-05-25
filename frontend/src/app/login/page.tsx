'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError(null);
    setSuccess(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!isLoginMode && !name) return;

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const url = isLoginMode ? '/api/auth' : '/api/signup';
    const payload = isLoginMode ? { email, password } : { name, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (isLoginMode) {
        login(data);
        if (data.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        setSuccess('Account created successfully! Logging you in...');
        setTimeout(() => {
          login(data);
          router.push('/');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <section className="section-padding flex-center" style={{ backgroundColor: 'var(--bg-cream)', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '3rem 2.5rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-light)'
          }} id="auth-form-container">
            
            {/* Tab toggles */}
            <div style={{
              display: 'flex',
              backgroundColor: 'var(--bg-cream)',
              borderRadius: 'var(--radius-md)',
              padding: '4px',
              marginBottom: '2rem'
            }}>
              <button
                type="button"
                onClick={() => isLoginMode || handleToggleMode()}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  border: 'none',
                  borderRadius: 'calc(var(--radius-md) - 2px)',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  backgroundColor: isLoginMode ? '#FFFFFF' : 'transparent',
                  color: isLoginMode ? 'var(--text-dark)' : 'var(--text-muted)',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isLoginMode ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => !isLoginMode || handleToggleMode()}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  border: 'none',
                  borderRadius: 'calc(var(--radius-md) - 2px)',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  backgroundColor: !isLoginMode ? '#FFFFFF' : 'transparent',
                  color: !isLoginMode ? 'var(--text-dark)' : 'var(--text-muted)',
                  transition: 'all var(--transition-fast)',
                  boxShadow: !isLoginMode ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                Sign Up
              </button>
            </div>

            <div className="text-center" style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '2.5rem' }}>☕</span>
              <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem' }}>
                {isLoginMode ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {isLoginMode ? 'Sign in to order coffee and view bookings.' : 'Register to join the Brown Sugar family.'}
              </p>
            </div>

            {error && (
              <div style={{
                backgroundColor: 'var(--error-light)',
                color: 'var(--error)',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: '500',
                marginBottom: '1.5rem',
                border: '1px solid rgba(168, 76, 76, 0.2)'
              }} id="auth-error-message">
                {error}
              </div>
            )}

            {success && (
              <div style={{
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: '500',
                marginBottom: '1.5rem',
                border: '1px solid rgba(78, 110, 88, 0.2)'
              }} id="auth-success-message">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLoginMode && (
                <div className="form-group animate-fade-in">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="E.g. Rohan Sharma" 
                    required 
                    id="auth-name-input"
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="name@example.com" 
                  required 
                  id="auth-email-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '2rem', position: 'relative' }}>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-input" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                    style={{ width: '100%', paddingRight: '2.75rem' }}
                    id="auth-password-input"
                  />
                  {/* Eye Toggle Icon Button */}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px'
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    id="auth-password-toggle-btn"
                  >
                    {showPassword ? (
                      /* Eye Off SVG */
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      /* Eye SVG */
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.9rem' }}
                disabled={isSubmitting}
                id="auth-submit-btn"
              >
                {isSubmitting 
                  ? (isLoginMode ? 'Authenticating...' : 'Registering...') 
                  : (isLoginMode ? 'Sign In' : 'Create Account')
                }
              </button>
            </form>



          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
