import React from 'react';
import Link from 'next/link';
import { LEGAL_CONFIG } from '@/config/legal';
import { SOCIALS } from '@/config/social';
import { DELIVERY_PROMISE } from '@/config/shipping';

export function Footer() {
  return (
    <footer className="w-full bg-[#1A1714] text-[#FAF8F5] border-t border-[#2D2822] mt-auto" aria-label="Site Footer">
      {/* 4-Column Footer Container */}
      <div className="page-width py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Column 1: Brand & Socials */}
          <div className="space-y-4">
            <div>
              <span className="font-semibold text-base tracking-tight lowercase text-white block">
                flirta<span className="text-[#E61E2A]">.network</span>
              </span>
            </div>
            <p className="text-xs text-[#A89F91] leading-relaxed max-w-xs">
              Precision engineered lifestyle illumination and desk architecture pieces. Designed for ambient sanctuary workspaces across India.
            </p>

            {/* Config-Driven Socials: Only render if valid URL is provided */}
            <div className="flex items-center gap-3 pt-2">
              {SOCIALS.whatsapp && (
                <a
                  href={SOCIALS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  aria-label="WhatsApp Support"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>
              )}
              {SOCIALS.instagram && (
                <a
                  href={SOCIALS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#2A241E] flex items-center justify-center text-[#FAF8F5] hover:text-[#E61E2A] hover:bg-white transition-all"
                  aria-label="Instagram @flirtabywhitelayer"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}
              {SOCIALS.facebook && (
                <a
                  href={SOCIALS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#2A241E] flex items-center justify-center text-[#FAF8F5] hover:text-[#E61E2A] hover:bg-white transition-all"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              )}
              {SOCIALS.youtube && (
                <a
                  href={SOCIALS.youtube}
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
              )}
            </div>
          </div>

          {/* Column 2: Shop Navigation */}
          <div className="space-y-3">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-[#FAF8F5]">
              Shop Collections
            </h2>
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
                <Link href="/shop?category=stands" className="hover:text-white transition-colors">
                  Device Stands & Docks
                </Link>
              </li>
              <li>
                <Link href="/shop?category=clocks" className="hover:text-white transition-colors">
                  Kinetic Timepieces
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bundles" className="hover:text-[#E5C158] transition-colors">
                  Studio Pairings & Bundles
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Statutory Policies & Grievance */}
          <div className="space-y-3">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-[#FAF8F5]">
              Policies & Compliance
            </h2>
            <ul className="space-y-2 text-xs text-[#A89F91]">
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/grievance" className="hover:text-white transition-colors">
                  Grievance Redressal Officer
                </Link>
              </li>
              <li>
                <span className="cursor-default text-[#736B63] block pt-1">
                  {DELIVERY_PROMISE}
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Support & Legal Entity */}
          <div className="space-y-3">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-[#FAF8F5]">
              Customer Care & Studio
            </h2>
            <div className="space-y-2 text-xs text-[#A89F91]">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#B45309]">WhatsApp Support</p>
                <a
                  href={SOCIALS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-medium flex items-center gap-1.5 mt-0.5 hover:text-emerald-400 transition-colors"
                >
                  <span className="w-4 h-4 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="white">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </span>
                  <span>{LEGAL_CONFIG.CARE_PHONE}</span>
                </a>
              </div>
              <div className="pt-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#B45309]">Care Email</p>
                <a href={`mailto:${LEGAL_CONFIG.CARE_EMAIL}`} className="text-white hover:text-[#E61E2A] transition-colors font-medium">
                  {LEGAL_CONFIG.CARE_EMAIL}
                </a>
              </div>
              <div className="pt-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#B45309]">Support Hours</p>
                <p className="text-[#FAF8F5]">{LEGAL_CONFIG.CARE_HOURS}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Entity & Statutory Line */}
        <div className="mt-10 pt-6 border-t border-[#2D2822] text-[11px] text-[#8C827A] space-y-1">
          <p>
            Sold by <strong className="text-white font-medium">{LEGAL_CONFIG.LEGAL_ENTITY_NAME}</strong> • GSTIN: <span className="font-mono text-neutral-300">{LEGAL_CONFIG.GSTIN}</span>
          </p>
          <p>
            Registered Corporate Office: {LEGAL_CONFIG.REGISTERED_ADDRESS}
          </p>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t border-[#2D2822] bg-[#141210] py-6">
        <div className="page-width flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C827A]">
          <p>© 2026 flirta.network. All rights reserved.</p>
          {SOCIALS.instagram && (
            <p className="text-center sm:text-right">
              Follow us on <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-semibold">Instagram</a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
