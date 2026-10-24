import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-[#1A1714] text-[#FAF8F5] border-t border-[#2D2822] mt-auto" aria-label="Site Footer">
      {/* 4-Column Footer Container */}
      <div className="page-width py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Column 1: Brand & Socials */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base tracking-tight lowercase text-white">
              flirta<span className="text-[#E61E2A]">.network</span>
            </h4>
            <p className="text-xs text-[#A89F91] leading-relaxed max-w-xs">
              Precision 3D printed lifestyle products engineered for modern desks and sanctuary spaces. Handcrafted in India with 0.12mm layer precision. 100% Secure Instant UPI checkout available India-wide.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#2A241E] flex items-center justify-center text-[#FAF8F5] hover:text-[#E61E2A] hover:bg-white transition-all"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#2A241E] flex items-center justify-center text-[#FAF8F5] hover:text-[#E61E2A] hover:bg-white transition-all"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#2A241E] flex items-center justify-center text-[#FAF8F5] hover:text-[#E61E2A] hover:bg-white transition-all"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#E61E2A" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Shop Navigation */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#FAF8F5]">
              Shop Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#A89F91]">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?badge=bestseller" className="hover:text-[#E61E2A] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E61E2A]" />
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=lamps" className="hover:text-white transition-colors">
                  Ambient Lamps & Illumination
                </Link>
              </li>
              <li>
                <Link href="/shop?category=organizers" className="hover:text-white transition-colors">
                  Controller Stands & Docks
                </Link>
              </li>
              <li>
                <Link href="/shop?category=clocks" className="hover:text-white transition-colors">
                  Minimal Kinetic Clocks
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bundles" className="hover:text-[#E5C158] transition-colors">
                  Studio Pairings & Bundles
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help & Policies */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#FAF8F5]">
              Help & Policies
            </h4>
            <ul className="space-y-2 text-xs text-[#A89F91]">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Studio
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Craft & 0.12mm Additive Science
                </Link>
              </li>
              <li>
                <span className="cursor-default hover:text-white transition-colors">
                  Fast 2-5 Day Express Delivery
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-white transition-colors">
                  7-Day Transit Replacement Guarantee
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-white transition-colors">
                  100% Encrypted Instant UPI Checkout
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Support */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#FAF8F5]">
              Direct Support
            </h4>
            <div className="space-y-2 text-xs text-[#A89F91]">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#B45309]">Email</p>
                <a href="mailto:care@flirta.network" className="text-white hover:text-[#E61E2A] transition-colors font-medium">
                  care@flirta.network
                </a>
              </div>
              <div className="pt-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#B45309]">Studio Hours</p>
                <p className="text-[#FAF8F5]">Mon–Sat, 10 AM–6 PM IST</p>
              </div>
              <div className="pt-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#B45309]">Studio Location</p>
                <p className="text-[#FAF8F5]">New Delhi, India</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t border-[#2D2822] bg-[#141210] py-6">
        <div className="page-width flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C827A]">
          <p>© 2026 flirta.network. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Tag us <strong className="text-white">@flirta.network</strong> and use <strong className="text-[#E61E2A]">#YourFlirta</strong> to get featured.
          </p>
        </div>
      </div>
    </footer>
  );
}
