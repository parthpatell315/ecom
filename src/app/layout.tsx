import type { Metadata } from 'next';
import Script from 'next/script';
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
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

// Title <= 60 chars, description 140-160 chars, no emoji, no meta keywords
export const metadata: Metadata = {
  title: 'flirta.network — Precision Desk Sanctuaries',
  description:
    'Architectural ambient mood lighting, weighted controller stands, and modular desk accessories. Handcrafted in India with free insured air delivery nationwide.',
  authors: [{ name: 'flirta.network Studio' }],
  metadataBase: new URL('https://www.flirta.network'),
  alternates: {
    canonical: 'https://www.flirta.network',
  },
  openGraph: {
    title: 'flirta.network — Precision Desk Sanctuaries',
    description:
      'Architectural ambient mood lighting, weighted controller stands, and modular desk accessories. Handcrafted in India with free insured air delivery nationwide.',
    siteName: 'flirta.network',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'flirta.network — Precision Desk Sanctuaries',
    description:
      'Architectural ambient mood lighting, weighted controller stands, and modular desk accessories. Handcrafted in India with free insured air delivery nationwide.',
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
        {/* Meta Pixel NoScript Fallback */}
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
        {/* Official Meta Pixel (ID: 946508041872382) */}
        <Script
          id="meta-pixel-init"
          strategy="afterInteractive"
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
