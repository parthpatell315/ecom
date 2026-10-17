'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, openCart } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-2xs">
      {/* 1. WhiteLayer Authentic Ticker Announcement Bar */}
      <div className="bg-[#1D1D20] text-[#F3F4F6] text-[11px] font-medium tracking-wider uppercase py-2 overflow-hidden border-b border-[#2A2A2E] select-none">
        <div className="flex animate-marquee whitespace-nowrap">
          <div className="flex items-center gap-6 pr-6">
            <span>Free delivery on orders ₹999+</span>
            <span className="text-[#9CA3AF]">•</span>
            <span>7-day replacement if damaged</span>
            <span className="text-[#9CA3AF]">•</span>
            <span>100% Secure PayU Checkout</span>
            <span className="text-[#9CA3AF]">•</span>
            <span>Made in India with 0.12mm precision</span>
            <span className="text-[#9CA3AF]">•</span>
            <span>Use code <strong className="text-white underline decoration-[#E61E2A]">LAUNCH10</strong> for 10% Off</span>
            <span className="text-[#9CA3AF]">•</span>
          </div>
          <div className="flex items-center gap-6 pr-6" aria-hidden="true">
            <span>Free delivery on orders ₹999+</span>
            <span className="text-[#9CA3AF]">•</span>
            <span>7-day replacement if damaged</span>
            <span className="text-[#9CA3AF]">•</span>
            <span>100% Secure PayU Checkout</span>
            <span className="text-[#9CA3AF]">•</span>
            <span>Made in India with 0.12mm precision</span>
            <span className="text-[#9CA3AF]">•</span>
            <span>Use code <strong className="text-white underline decoration-[#E61E2A]">LAUNCH10</strong> for 10% Off</span>
            <span className="text-[#9CA3AF]">•</span>
          </div>
        </div>
      </div>

      {/* 2. Main Clean Header */}
      <div className="border-b border-[#EEEEEE] bg-white">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[66px] flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Single-Line Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-gray-700 hover:text-black rounded-md"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Official flirta.network Circular Monogram & Wordmark */}
            <Link href="/" className="flex items-center gap-2.5 group select-none" aria-label="flirta.network">
              <div className="w-8 h-8 rounded-full bg-[#1D1D20] text-white flex items-center justify-center font-medium text-xs tracking-tight group-hover:scale-105 transition-transform shadow-xs">
                fn
              </div>
              <span className="font-semibold text-lg sm:text-[19px] tracking-tight text-[#1D1D20] leading-none">
                flirta<span className="text-[#E61E2A]">.network</span>
              </span>
            </Link>
          </div>

          {/* Center: Clean Rounded Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-[340px] mx-4 relative items-center"
            role="search"
          >
            <input
              type="search"
              name="q"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-3.5 pr-9 py-2 text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#1D1D20] placeholder:text-[#9CA3AF] focus:bg-white focus:outline-none focus:border-[#1D1D20] transition-all font-normal"
            />
            <button
              type="submit"
              className="absolute right-2.5 text-[#6B7280] hover:text-[#1D1D20] transition-colors p-1"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right: Exactly 4 Clean Nav Links + Cart Icon */}
          <div className="flex items-center gap-6 sm:gap-8">
            <nav className="hidden lg:flex items-center gap-7 text-[13.5px]">
              <Link
                href="/"
                className={`transition-colors ${
                  pathname === '/'
                    ? 'text-[#E61E2A] font-semibold'
                    : 'text-[#333333] hover:text-[#E61E2A] font-medium'
                }`}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className={`transition-colors ${
                  pathname === '/shop'
                    ? 'text-[#E61E2A] font-semibold'
                    : 'text-[#333333] hover:text-[#E61E2A] font-medium'
                }`}
              >
                Shop
              </Link>
              <Link
                href="/contact"
                className={`transition-colors ${
                  pathname === '/contact'
                    ? 'text-[#E61E2A] font-semibold'
                    : 'text-[#333333] hover:text-[#E61E2A] font-medium'
                }`}
              >
                Contact
              </Link>
              <Link
                href="/about"
                className={`transition-colors ${
                  pathname === '/about'
                    ? 'text-[#E61E2A] font-semibold'
                    : 'text-[#333333] hover:text-[#E61E2A] font-medium'
                }`}
              >
                About Us
              </Link>
            </nav>

            {/* Cart Icon Trigger with Badge */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-full text-[#1D1D20] hover:text-[#E61E2A] hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#1D1D20] text-white text-[9.5px] font-medium flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#EEEEEE] p-4 space-y-3 text-sm font-semibold animate-slideDown shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-3.5 pr-9 py-2 text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg"
            />
            <button type="submit" className="absolute right-2.5 top-2 text-[#6B7280]">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1D1D20] border-b border-gray-100 font-medium"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1D1D20] border-b border-gray-100 font-medium"
          >
            Shop All
          </Link>
          <Link
            href="/shop?badge=bestseller"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#E61E2A] border-b border-gray-100 font-medium"
          >
            Bestsellers
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1D1D20] border-b border-gray-100 font-medium"
          >
            Contact
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1D1D20] font-medium"
          >
            About Us
          </Link>
        </div>
      )}
    </header>
  );
}
