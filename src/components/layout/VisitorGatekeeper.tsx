'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WishlistDrawer } from '@/components/wishlist/WishlistDrawer';
import { AuthModal } from '@/components/auth/AuthModal';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';

/**
 * Gatekeeper component:
 * When in Coming Soon mode, hides the storefront navigation, drawers, and footer for visitors.
 * Allows the /admin portal to function normally.
 */
export function VisitorGatekeeper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // If visitor: Coming soon mode is active (render clean focused view)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#070709] text-white flex flex-col">
        {children}
      </div>
    );
  }

  // Admin route: render admin portal with full tools
  return (
    <>
      <main className="flex-1">{children}</main>
      <AuthModal />
    </>
  );
}
