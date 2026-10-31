import React from 'react';
import Link from 'next/link';
import { LEGAL_CONFIG } from '@/config/legal';
import { SOCIALS } from '@/config/social';
import { DELIVERY_PROMISE } from '@/config/shipping';

export function Footer() {
  return (
    <footer className="w-full bg-[#F5F5F7] text-[#6E6E73] border-t border-black/[0.08] mt-auto font-sans" aria-label="Site Footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Footnote Disclaimers (Apple Style) */}
        <div className="pb-8 border-b border-black/[0.08] text-[11px] leading-relaxed space-y-2 text-[#86868B]">
          <p>
            * Free Pan-India Air Delivery is provided on all orders. Cash on Delivery is supported via Partial COD (₹149 Advance via secure UPI, balance payable in cash or UPI at doorstep).
          </p>
          <p>
            Every electromagnetic levitation base and illumination piece undergoes 24-hour continuous bench-testing prior to dispatch. 7-Day transit replacement guarantee applies to all orders in accordance with our return guidelines.
          </p>
        </div>

        {/* Directory Grid */}
        <div className="py-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-xs">
          {/* Brand & Mission */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full border border-black/60 flex items-center justify-center text-[10px] font-black text-[#111827]">
                WL
              </span>
              <span className="font-extrabold text-sm tracking-wide text-[#111827] uppercase">
                FLIRTA BY WHITELAYER
              </span>
            </div>
            <p className="text-[#6E6E73] leading-relaxed text-[11px]">
              Precision engineered lifestyle illumination and desk architecture pieces. Designed for ambient sanctuary workspaces across India.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-1">
              {SOCIALS.whatsapp && (
                <a
                  href={SOCIALS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#1D1D1F] transition-colors"
                  aria-label="WhatsApp Concierge"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>
              )}
              {SOCIALS.instagram && (
                <a
                  href={SOCIALS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#1D1D1F] transition-colors"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h3 className="font-semibold text-xs text-[#1D1D1F] tracking-tight">
              Collections
            </h3>
            <ul className="space-y-2 text-[#6E6E73]">
              <li>
                <Link href="/shop" className="hover:text-[#E61E2A] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=lamps" className="hover:text-[#E61E2A] transition-colors">
                  Ambient Lamps
                </Link>
              </li>
              <li>
                <Link href="/shop?category=stands" className="hover:text-[#E61E2A] transition-colors">
                  Stands &amp; Docks
                </Link>
              </li>
              <li>
                <Link href="/shop?category=clocks" className="hover:text-[#E61E2A] transition-colors">
                  Desk Clocks
                </Link>
              </li>
              <li>
                <Link href="/shop?category=games" className="hover:text-[#E61E2A] transition-colors">
                  Board Games &amp; Collectibles
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Orders */}
          <div className="space-y-3">
            <h3 className="font-semibold text-xs text-[#1D1D1F] tracking-tight">
              Customer Support
            </h3>
            <ul className="space-y-2 text-[#6E6E73]">
              <li>
                <Link href="/tracking" className="hover:text-[#E61E2A] transition-colors font-medium text-[#111827]">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#E61E2A] transition-colors">
                  Help &amp; FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E61E2A] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#E61E2A] transition-colors">
                  About Our Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-3">
            <h3 className="font-semibold text-xs text-[#1D1D1F] tracking-tight">
              Policies
            </h3>
            <ul className="space-y-2 text-[#6E6E73]">
              <li>
                <Link href="/shipping-policy" className="hover:text-[#E61E2A] transition-colors">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#E61E2A] transition-colors">
                  7-Day Replacement Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#E61E2A] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#E61E2A] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/grievance" className="hover:text-[#E61E2A] transition-colors">
                  Grievance Officer
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <h3 className="font-semibold text-xs text-[#1D1D1F] tracking-tight">
              Studio Helpdesk
            </h3>
            <div className="space-y-2 text-[#6E6E73] text-[11px]">
              <div>
                <span className="block text-[#86868B]">WhatsApp Concierge</span>
                <a
                  href={SOCIALS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#1D1D1F] hover:text-[#E61E2A] transition-colors"
                >
                  {LEGAL_CONFIG.CARE_PHONE}
                </a>
              </div>
              <div>
                <span className="block text-[#86868B]">Care Email</span>
                <a
                  href={`mailto:${LEGAL_CONFIG.CARE_EMAIL}`}
                  className="font-medium text-[#1D1D1F] hover:text-[#E61E2A] transition-colors"
                >
                  {LEGAL_CONFIG.CARE_EMAIL}
                </a>
              </div>
              <div>
                <span className="block text-[#86868B]">Support Hours</span>
                <span className="text-[#1D1D1F]">{LEGAL_CONFIG.CARE_HOURS}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Statutory & Compliance Box */}
        <div className="pt-6 border-t border-black/[0.08] text-[11px] text-[#86868B] space-y-1">
          <p>
            Sold and fulfilled by <strong className="font-medium text-[#1D1D1F]">{LEGAL_CONFIG.LEGAL_ENTITY_NAME}</strong> • GSTIN: <span className="font-mono text-[#1D1D1F]">{LEGAL_CONFIG.GSTIN}</span>
          </p>
          <p>
            Registered Corporate Office: {LEGAL_CONFIG.REGISTERED_ADDRESS}
          </p>
        </div>

        {/* Apple-style Bottom Line */}
        <div className="mt-6 pt-4 border-t border-black/[0.08] flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[11px] text-[#86868B]">
          <p>
            Copyright © {new Date().getFullYear()} flirta.network. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/privacy-policy" className="hover:text-[#1D1D1F] transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-[#1D1D1F] transition-colors">Terms of Use</Link>
            <span>|</span>
            <Link href="/shipping-policy" className="hover:text-[#1D1D1F] transition-colors">Sales &amp; Refunds</Link>
            <span>|</span>
            <Link href="/grievance" className="hover:text-[#1D1D1F] transition-colors">Legal</Link>
            <span>|</span>
            <span>India</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
