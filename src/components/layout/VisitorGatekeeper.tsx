'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthModal } from '@/components/auth/AuthModal';

/**
 * Gatekeeper component:
 * When in 404 lockdown mode, hides all storefront navigation, drawers, and footer for visitors.
 * Allows the /admin portal to function normally.
 */
export function VisitorGatekeeper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // If visitor: render only the 404 page (no navbar, footer, or store chrome)
  if (!isAdmin) {
    return (
      <main className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-white flex flex-col">
        {children}
      </main>
    );
  }

  // Admin route: render admin portal with auth modal support
  return (
    <>
      <main className="flex-1">{children}</main>
      <AuthModal />
    </>
  );
}
