import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { AuthModal } from '@/components/auth/AuthModal';
import { MetaPixel } from '@/components/analytics/MetaPixel';

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
        {/* Official Meta Pixel (ID: 946508041872382) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '946508041872382');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=946508041872382&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#222225] font-sans antialiased selection:bg-[#E61E2A]/15 selection:text-[#E61E2A]">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <AuthModal />
            <MetaPixel />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
