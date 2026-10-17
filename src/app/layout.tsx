import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { AuthModal } from '@/components/auth/AuthModal';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'flirta.network — Precision 3D Printed Desk Sanctuaries',
  description:
    'Architectural ambient mood lighting, weighted controller stands, and modular desk accessories. Handcrafted in India with 0.12mm precision.',
  keywords: [
    'flirta.network',
    'flirta',
    '3D printed lamps',
    'ambient lighting',
    'desk setups',
    'controller stand',
    'perpetual calendar',
    'kinetic clocks',
    'desk architecture',
  ],
  authors: [{ name: 'flirta.network Studio' }],
  openGraph: {
    title: 'flirta.network — Precision 3D Printed Desk Sanctuaries',
    description:
      'Architectural ambient mood lighting, weighted controller stands, and modular desk accessories. Handcrafted in India with 0.12mm precision.',
    siteName: 'flirta.network',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#222225] font-sans antialiased selection:bg-[#E61E2A]/15 selection:text-[#E61E2A]">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <AuthModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
