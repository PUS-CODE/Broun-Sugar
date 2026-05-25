import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Brown Sugar | Premium Coffee House',
  description: 'Experience the premium rich flavor of single-origin coffee and artisan bakery delights at Brown Sugar. Order online or book a table today.',
  keywords: 'coffee, cafe, brown sugar, table booking, order coffee online, cappuccino, espresso, bakery',
  authors: [{ name: 'Brown Sugar Coffee House' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
