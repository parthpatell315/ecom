import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import { FaqSection } from '@/components/home/FaqSection';
import { ArrowRight, ChevronRight, Truck, ShieldCheck, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch real products from PostgreSQL
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        variants: { orderBy: { name: 'asc' } },
      },
      orderBy: { reviewCount: 'desc' },
    });
  } catch (error) {
    console.error('HomePage: Failed to fetch products from database:', error);
  }

  const studioEditProducts = products.slice(0, 8);

  return (
    <div className="flex flex-col bg-white">
      {/* =========================================================================
          1. WHITELAYER STUDIO HERO - Warm Luxury & Precision Typography
          ========================================================================= */}
      <section className="wl-hero-dot-bg py-14 md:py-20 border-b border-[#ECE7DE]" aria-label="WhiteLayer Studio Hero">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Column: Editorial Value Proposition */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white border border-[#E5E0D5] px-3.5 py-1.5 rounded-full shadow-2xs mb-6">
                <span className="w-2 h-2 rounded-full bg-[#E61E2A] animate-pulse-dot" />
                <span className="text-[11px] font-semibold text-[#4A443C] tracking-wide uppercase">
                  FLIRTA.NETWORK STUDIO • 0.12MM LAYER PRECISION
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-semibold text-[#222225] tracking-[-0.03em] leading-[1.14] mb-5">
                Precision 3D Printed{' '}
                <span className="block text-[#E61E2A]">
                  Desk Sanctuaries
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-[15.5px] text-[#5C554B] leading-relaxed max-w-[500px] mb-8 font-normal">
                Architectural ambient mood lighting, weighted controller stands, and modular desk accessories. Handcrafted in India with 0.12mm precision.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
                <Link
                  href="/shop?badge=bestseller"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium text-sm bg-[#222225] text-white hover:bg-[#38383D] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Explore Bestsellers</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium text-sm bg-[#F3EFE8] text-[#222225] border border-[#D5CEBF] hover:bg-[#EAE4D9] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 shadow-2xs"
                >
                  <span>Custom 3D Printing</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-3.5 text-xs font-medium text-[#78716C] mt-6 select-none">
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span> Free Pan-India Delivery ₹999+
                </span>
                <span className="text-[#D6CEC2]">•</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span> 7-Day Transit Replacement
                </span>
                <span className="text-[#D6CEC2]">•</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span> Handcrafted in India
                </span>
              </div>
            </div>

            {/* Right Column: Featured Studio Stage Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[24px] border border-[#ECE7DE] overflow-hidden shadow-luxury shadow-luxury-hover transition-all duration-300 group">
                <Link href="/product/marvel-inspired-led-lightbox" className="block">
                  {/* Media Frame (Clean 16:10 Horizontal Aspect Ratio) */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F5F2EB]">
                    <Image
                      src="https://cdn.shopify.com/s/files/1/0992/7816/0178/files/ChatGPT_Image_Aug_24_2026_06_52_17_PM.png?v=1787577750"
                      alt="Marvel-Inspired LED Lightbox"
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 1024px) 100vw, 500px"
                    />
                    <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-[#222225] text-[10.5px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-[#E5E0D5]">
                      <span className="w-2 h-2 rounded-full bg-[#E61E2A]" />
                      <span>Studio Bestseller</span>
                    </div>
                  </div>

                  {/* Metadata Bar */}
                  <div className="p-5 flex items-start justify-between gap-4 border-t border-[#F5F2EB] bg-white">
                    <div>
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-[#B45309] block">
                        ICONIC LIGHTBOX
                      </span>
                      <h3 className="text-sm sm:text-[15px] font-medium text-[#222225] group-hover:text-[#E61E2A] transition-colors mt-0.5 line-clamp-1">
                        Marvel-Inspired LED Lightbox – Premium Room Lighting
                      </h3>
                      <p className="text-xs text-[#5C554B] mt-0.5">
                        Ambient cinematic glow • Precision illuminated display
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-semibold text-[#E61E2A]">Rs. 899.00</div>
                      <span className="text-xs font-medium text-[#222225] flex items-center gap-0.5 justify-end mt-1">
                        View Piece →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. THE STUDIO EDIT: MOST LOVED PRODUCTS
          ========================================================================= */}
      <section className="py-16 md:py-20 bg-white border-b border-[#ECE7DE]" aria-label="Most Loved Products">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-block py-1 px-3 rounded-full text-[10.5px] font-bold tracking-wider uppercase bg-[#FEF2F2] border border-[#FECACA] text-[#E61E2A] mb-2">
                THE STUDIO EDIT
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-[32px] font-semibold text-[#222225] tracking-tight">
                Most Loved Products
              </h2>
              <p className="text-xs sm:text-[13px] text-[#6B7280] mt-1">
                Pieces from the bench. Prices are the current selling price. Options are chosen on the product page.
              </p>
            </div>

            <Link
              href="/shop?badge=bestseller"
              className="text-sm font-semibold text-[#E61E2A] hover:underline flex items-center gap-1 group self-start sm:self-end"
            >
              <span>View bestsellers</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* 4-Column Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {studioEditProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. STUDIO PAIRINGS: PIECES THAT SIT WELL TOGETHER
          ========================================================================= */}
      <section className="py-16 md:py-20 bg-[#FAF8F5] border-b border-[#ECE7DE]" aria-label="Studio Pairings">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block py-1 px-3 rounded-full text-[10.5px] font-bold tracking-wider uppercase bg-[#FEF2F2] border border-[#FECACA] text-[#E61E2A] mb-2">
              STUDIO PAIRINGS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-[32px] font-semibold text-[#222225] tracking-tight">
              Pieces that sit well together
            </h2>
            <p className="text-xs sm:text-[13px] text-[#6B7280] mt-1.5">
              Each piece is sold on its own page, at its own price. The total below is both current prices added together.
            </p>
          </div>

          {/* 3 Combo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Combo 1 */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col justify-between shadow-luxury shadow-luxury-hover transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-medium tracking-wider uppercase bg-[#222225] text-white px-2.5 py-1 rounded">
                    PAIR
                  </span>
                  <span className="text-[10px] font-medium text-[#E61E2A] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    Save 40%
                  </span>
                </div>

                {/* Visual Duo Link */}
                <div className="flex items-center justify-center gap-3 py-4">
                  <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                      <Image
                        src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80"
                        alt="Wolverine Stand"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-gray-700 mt-2">Wolverine Claw</span>
                  </div>

                  <div className="text-lg font-bold text-gray-400 pb-4">+</div>

                  <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                      <Image
                        src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80"
                        alt="Deadpool Stand"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-gray-700 mt-2">Deadpool Hand</span>
                  </div>
                </div>

                <h3 className="text-[15px] font-medium text-[#222225] text-center mt-1">
                  Marvel Dual Controller Setup
                </h3>
                <p className="text-xs text-[#6B7280] text-center mt-1 leading-relaxed">
                  PS5 Controller Stand (Wolverine Claw) + Universal Controller Stand (Deadpool Hand).
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-semibold text-[#E61E2A]">Rs. 1,798.00</span>
                  <span className="text-xs text-gray-400 line-through ml-1.5">Rs. 2,998.00</span>
                </div>
                <Link
                  href="/shop?category=organizers"
                  className="px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider bg-[#222225] text-white hover:bg-[#38383D] transition-colors"
                >
                  View pair →
                </Link>
              </div>
            </div>

            {/* Combo 2 */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col justify-between shadow-luxury shadow-luxury-hover transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-medium tracking-wider uppercase bg-[#222225] text-white px-2.5 py-1 rounded">
                    BUNDLE B
                  </span>
                  <span className="text-[10px] font-medium text-[#E61E2A] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    Save 35%
                  </span>
                </div>

                {/* Visual Duo Link */}
                <div className="flex items-center justify-center gap-3 py-4">
                  <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                      <Image
                        src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80"
                        alt="Voronoi Lamp"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-gray-700 mt-2">Voronoi Lamp</span>
                  </div>

                  <div className="text-lg font-bold text-gray-400 pb-4">+</div>

                  <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                      <Image
                        src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80"
                        alt="Shadow Clock"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-gray-700 mt-2">Shadow Clock</span>
                  </div>
                </div>

                <h3 className="text-[15px] font-medium text-[#222225] text-center mt-1">
                  Creator Desk Sanctuary Suite
                </h3>
                <p className="text-xs text-[#6B7280] text-center mt-1 leading-relaxed">
                  Voronoi Geometric Desk Lamp + Fibonacci Spiral Shadow Clock in alabaster silk.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-semibold text-[#E61E2A]">Rs. 2,898.00</span>
                  <span className="text-xs text-gray-400 line-through ml-1.5">Rs. 4,498.00</span>
                </div>
                <Link
                  href="/shop?category=bundles"
                  className="px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider bg-[#222225] text-white hover:bg-[#38383D] transition-colors"
                >
                  View pair →
                </Link>
              </div>
            </div>

            {/* Combo 3 */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col justify-between shadow-luxury shadow-luxury-hover transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-medium tracking-wider uppercase bg-[#222225] text-white px-2.5 py-1 rounded">
                    BUNDLE C
                  </span>
                  <span className="text-[10px] font-medium text-[#E61E2A] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    Save 38%
                  </span>
                </div>

                {/* Visual Duo Link */}
                <div className="flex items-center justify-center gap-3 py-4">
                  <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                      <Image
                        src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80"
                        alt="Marvel Lamp"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-gray-700 mt-2">Marvel Lamp</span>
                  </div>

                  <div className="text-lg font-bold text-gray-400 pb-4">+</div>

                  <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                      <Image
                        src="https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=400&q=80"
                        alt="Flip Calendar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-gray-700 mt-2">Flip Calendar</span>
                  </div>
                </div>

                <h3 className="text-[15px] font-medium text-[#222225] text-center mt-1">
                  Studio Light & Time Duo
                </h3>
                <p className="text-xs text-[#6B7280] text-center mt-1 leading-relaxed">
                  Marvel LED Lightbox Lamp + Aesthetic Flip Perpetual Calendar for everyday desk elevation.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-semibold text-[#E61E2A]">Rs. 1,848.00</span>
                  <span className="text-xs text-gray-400 line-through ml-1.5">Rs. 2,998.00</span>
                </div>
                <Link
                  href="/shop?category=bundles"
                  className="px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider bg-[#222225] text-white hover:bg-[#38383D] transition-colors"
                >
                  View pair →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CINEMATIC DISPATCH & EXPRESS DELIVERY BANNER
          ========================================================================= */}
      <section className="py-8 bg-white" aria-label="Delivery Assurance">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1F2023] via-[#242428] to-[#2E2822] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-luxury">
            <div className="max-w-xl">
              <span className="text-[10px] font-medium tracking-widest uppercase text-[#D49842] block mb-1">
                EXPRESS DISPATCH
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Dispatched from our New Delhi Studio
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed font-normal">
                Every piece is individually inspected, cushioned in acoustic foam, and handed over to BlueDart &amp; Delhivery for insured 2–5 day express transit.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-gray-200">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#E61E2A]" />
                <span>19,000+ Pincodes</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#E61E2A]" />
                <span>24-Hour Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#E61E2A]" />
                <span>7-Day Replacement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. NOTES (CUSTOMER REVIEWS)
          ========================================================================= */}
      <section className="py-16 md:py-20 bg-[#F3F4F6] border-b border-[#E5E7EB]" aria-label="Customer Reviews">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#E61E2A] block mb-1">
                FROM THE STUDIO
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-[32px] font-semibold text-[#222225] tracking-tight">
                Notes
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-medium text-[#222225] hover:text-[#E61E2A] flex items-center gap-1 group transition-colors"
            >
              <span>View All Products</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Note 1 */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-luxury shadow-luxury-hover transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] bg-[#F7F7F7]">
                  <Image
                    src="https://www.whitelayer.in/cdn/shop/files/2025-01-05_a3485e175d82f.webp?v=1788522980&width=600"
                    alt="Bhumit Rabadiya Lumi Ambient Lamp Setup"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
                <div className="p-4">
                  <div className="text-amber-500 text-xs tracking-wider mb-1.5">★★★★★</div>
                  <h4 className="text-xs sm:text-[13px] font-semibold text-[#222225] mb-1">Meticulous Precision!</h4>
                  <p className="text-xs text-[#5C554B] leading-relaxed line-clamp-3">
                    Thank you for crafting a product that perfectly matched our studio desk setup. Your attention to 0.12mm precision made all the difference!
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-medium text-[11px]">
                  B
                </div>
                <div>
                  <h5 className="text-xs font-medium text-[#222225]">Bhumit Rabadiya</h5>
                  <span className="text-[10px] text-[#6B7280]">Lumi Ambient Lamp</span>
                </div>
              </div>
            </div>

            {/* Note 2 */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-luxury shadow-luxury-hover transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] bg-[#F7F7F7]">
                  <Image
                    src="https://www.whitelayer.in/cdn/shop/files/5b684c50-8a64-11f0-983d-e727e880e6f2.webp?v=1788522567&width=600"
                    alt="Janak Chauhan Fibonacci Spiral Shadow Clock Setup"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
                <div className="p-4">
                  <div className="text-amber-500 text-xs tracking-wider mb-1.5">★★★★★</div>
                  <h4 className="text-xs sm:text-[13px] font-semibold text-[#222225] mb-1">Unreal Unboxing Experience</h4>
                  <p className="text-xs text-[#5C554B] leading-relaxed line-clamp-3">
                    Just few weeks back I ordered the Fibonacci Spiral Shadow Clock and believe me I had an amazing unboxing experience. The casting is unreal!
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-medium text-[11px]">
                  J
                </div>
                <div>
                  <h5 className="text-xs font-medium text-[#222225]">Janak Chauhan</h5>
                  <span className="text-[10px] text-[#6B7280]">Fibonacci Clock</span>
                </div>
              </div>
            </div>

            {/* Note 3 */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-luxury shadow-luxury-hover transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] bg-[#F7F7F7]">
                  <Image
                    src="https://www.whitelayer.in/cdn/shop/files/2024-09-05_89fc5290a0339.webp?v=1788518045&width=600"
                    alt="Utsav Nathvani Modular Desk Organizer Setup"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
                <div className="p-4">
                  <div className="text-amber-500 text-xs tracking-wider mb-1.5">★★★★★</div>
                  <h4 className="text-xs sm:text-[13px] font-semibold text-[#222225] mb-1">Synonymous with Quality</h4>
                  <p className="text-xs text-[#5C554B] leading-relaxed line-clamp-3">
                    It won&apos;t be wrong to say flirta.network is synonymous with great desk experiences. You can trust their high-density biopolymer quality blindly.
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#059669] text-white flex items-center justify-center font-medium text-[11px]">
                  U
                </div>
                <div>
                  <h5 className="text-xs font-medium text-[#222225]">Utsav Nathvani</h5>
                  <span className="text-[10px] text-[#6B7280]">Modular Organizer</span>
                </div>
              </div>
            </div>

            {/* Note 4 */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-luxury shadow-luxury-hover transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] bg-[#F7F7F7]">
                  <Image
                    src="https://www.whitelayer.in/cdn/shop/files/e12703e512a238f6.jpg?v=1786604701&width=600"
                    alt="Deep Patel PS5 Controller Stand Setup"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
                <div className="p-4">
                  <div className="text-amber-500 text-xs tracking-wider mb-1.5">★★★★★</div>
                  <h4 className="text-xs sm:text-[13px] font-semibold text-[#222225] mb-1">Solid Weighted Stability</h4>
                  <p className="text-xs text-[#5C554B] leading-relaxed line-clamp-3">
                    The PS5 controller stand has solid weighted stability and zero wobble. Fast express shipping across India, friendly support, and unmatched matte finish.
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-medium text-[11px]">
                  D
                </div>
                <div>
                  <h5 className="text-xs font-medium text-[#222225]">Deep Patel</h5>
                  <span className="text-[10px] text-[#6B7280]">PS5 Controller Stand</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. EXPLORE BY CATEGORY: BENTO GRID
          ========================================================================= */}
      <section className="py-16 md:py-20 bg-white border-b border-[#ECE7DE]" aria-label="Collections Showcase">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#E61E2A] block mb-1">
                CURATED COLLECTIONS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-[32px] font-semibold text-[#222225] tracking-tight">
                Explore by Category
              </h2>
              <p className="text-xs sm:text-[13px] text-[#6B7280] mt-1">
                Discover handcrafted 3D printed lamps, desk setups, shadow clocks, and modular organizers.
              </p>
            </div>

            <Link
              href="/shop"
              className="text-xs font-medium text-[#222225] hover:text-[#E61E2A] flex items-center gap-1 group self-start sm:self-end transition-colors"
            >
              <span>View All Collections</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Bento 1: Our Best Sellers */}
            <Link
              href="/shop?badge=bestseller"
              className="relative aspect-[16/10] md:aspect-auto md:min-h-[260px] rounded-2xl overflow-hidden group shadow-luxury border border-[#E5E7EB]"
            >
              <Image
                src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80"
                alt="Our Best Sellers"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute top-3.5 left-3.5">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-[#E61E2A] text-white px-2.5 py-0.5 rounded shadow-xs">
                  BESTSELLER
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-medium text-white/80 block">Desk pieces</span>
                <h3 className="text-lg font-semibold mt-0.5">Our Best Sellers</h3>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#F3DA7A] mt-1 group-hover:translate-x-0.5 transition-transform">
                  Explore Collection →
                </span>
              </div>
            </Link>

            {/* Bento 2: Modular GAMES */}
            <Link
              href="/shop?category=organizers"
              className="relative aspect-[16/10] md:aspect-auto md:min-h-[260px] rounded-2xl overflow-hidden group shadow-luxury border border-[#E5E7EB]"
            >
              <Image
                src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"
                alt="Modular GAMES"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute top-3.5 left-3.5">
                <span className="text-[10px] font-medium tracking-widest uppercase bg-[#B91C1C] text-white px-2.5 py-0.5 rounded shadow-xs">
                  BOARD GAMES
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-medium text-white/80 block">Interactive</span>
                <h3 className="text-lg font-semibold mt-0.5">Modular GAMES</h3>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#F3DA7A] mt-1 group-hover:translate-x-0.5 transition-transform">
                  Explore →
                </span>
              </div>
            </Link>

            {/* Bento 3: Unique Clocks */}
            <Link
              href="/shop?category=clocks"
              className="relative aspect-[16/10] md:aspect-auto md:min-h-[260px] rounded-2xl overflow-hidden group shadow-luxury border border-[#E5E7EB]"
            >
              <Image
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
                alt="Unique Clocks"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute top-3.5 left-3.5">
                <span className="text-[10px] font-medium tracking-widest uppercase bg-white/95 text-[#222225] px-2.5 py-0.5 rounded shadow-xs">
                  MINIMAL
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-medium text-white/80 block">Kinetic time</span>
                <h3 className="text-lg font-semibold mt-0.5">Unique Clocks</h3>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#F3DA7A] mt-1 group-hover:translate-x-0.5 transition-transform">
                  Explore →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. THE BENCH STANDARD: 0.12MM ADDITIVE SCIENCE
          ========================================================================= */}
      <section className="py-14 bg-[#FAF8F5] border-b border-[#ECE7DE]" aria-label="Studio Bench Standards">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E0D5] flex items-center justify-center flex-shrink-0 text-[#E61E2A] font-bold text-xs shadow-2xs">
                0.12
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#222225]">0.12mm Precision</h4>
                <p className="text-xs text-[#5C554B] mt-1 leading-relaxed">
                  Micro-bead additive manufacturing eliminating visible layer lines for a seamless satin touch.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E0D5] flex items-center justify-center flex-shrink-0 text-[#E61E2A] shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#222225]">Eco Biopolymers</h4>
                <p className="text-xs text-[#5C554B] mt-1 leading-relaxed">
                  Crafted exclusively with sustainable, plant-derived cornstarch and sugarcane biopolymers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E0D5] flex items-center justify-center flex-shrink-0 text-[#E61E2A] shadow-2xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#222225]">24-Hour Dispatch</h4>
                <p className="text-xs text-[#5C554B] mt-1 leading-relaxed">
                  Inspected under studio light, hand-buffed, and shipped with expedited air tracking across India.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E0D5] flex items-center justify-center flex-shrink-0 text-[#E61E2A] shadow-2xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#222225]">Acoustic Foam Pack</h4>
                <p className="text-xs text-[#5C554B] mt-1 leading-relaxed">
                  Suspended in custom-cut acoustic high-density foam for guaranteed zero-breakage arrival.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. FAQ ACCORDION
          ========================================================================= */}
      <FaqSection />
    </div>
  );
}
