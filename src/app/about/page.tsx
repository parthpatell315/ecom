import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Cpu, Leaf, Compass, Shield, ArrowRight, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About flirta.network — Precision 3D Printed Lifestyle Products',
  description: 'Crafted layer by layer with 0.12mm precision in renewable biopolymers. Ambient lighting, desk architecture, and floating displays.',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen text-[#111827]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF2F2] text-[#E61E2A] text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Made Layer By Layer</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111827] mt-1">
            Precision 3D Printed Lifestyle Products.
          </h1>
          <p className="text-sm sm:text-base text-[#6E6E73] mt-3 leading-relaxed">
            flirta.network was founded to transform everyday desks and living spaces into futuristic sanctuaries through advanced additive manufacturing and ambient illumination.
          </p>
        </div>

        {/* Hero Visual */}
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] mb-16 border border-black/[0.08] shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1400&q=85"
            alt="flirta.network generative lighting design"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6 sm:p-10 text-white">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E61E2A] bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-md">
                0.12mm Layer Resolution
              </span>
              <p className="text-sm sm:text-base text-white/90 max-w-xl mt-2 font-medium">
                Every ambient lamp, magnetic levitation display, and kinetic desk piece undergoes unbroken precision additive manufacturing in our studio.
              </p>
            </div>
          </div>
        </div>

        {/* Studio Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="p-5 rounded-2xl bg-[#F9FAFB] border border-black/[0.06] text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#111827] block">0.12mm</span>
            <span className="text-xs text-[#6E6E73] font-semibold mt-1 block">Layer Resolution</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#F9FAFB] border border-black/[0.06] text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#111827] block">100%</span>
            <span className="text-xs text-[#6E6E73] font-semibold mt-1 block">Made in India</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#F9FAFB] border border-black/[0.06] text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#111827] block">24-Hour</span>
            <span className="text-xs text-[#6E6E73] font-semibold mt-1 block">Bench Testing</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#F9FAFB] border border-black/[0.06] text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#111827] block">7-Day</span>
            <span className="text-xs text-[#6E6E73] font-semibold mt-1 block">Free Replacement</span>
          </div>
        </div>

        {/* Core Principles */}
        <div className="space-y-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#E61E2A] font-bold">
                Sustainable Materials
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-[#111827] mt-1">
                Eco-Friendly European Biopolymers
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563] mt-3 leading-relaxed">
                We avoid petroleum-based styrenes and non-recyclable ABS. Every flirta.network piece is printed in high-purity polylactic biopolymers synthesized from renewable plant resources like sugarcane and corn starch. The resulting material possesses a tactile ceramic-like weight with an ultra-matte, non-reflective light diffusion surface.
              </p>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-black/[0.08] shadow-xs">
              <Image
                src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
                alt="Biopolymer light diffusion"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
            <div className="md:order-2">
              <span className="text-xs uppercase tracking-wider text-[#E61E2A] font-bold">
                Additive Craftsmanship
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-[#111827] mt-1">
                The 38-Hour Additive Journey
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563] mt-3 leading-relaxed">
                Each piece undergoes 20 to 44 hours of unbroken additive manufacturing. Hardened precision nozzles deposit molten biopolymer beads at 0.12mm layer heights, resulting in zero visible stringing and porcelain-smooth geometric contours that cannot be produced via traditional injection molding.
              </p>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-black/[0.08] shadow-xs md:order-1">
              <Image
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
                alt="Precision 3D printed desk sculpture"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#F9FAFB] border border-black/[0.08] text-center">
          <h3 className="text-2xl font-bold text-[#111827]">Transform your workstation sanctuary</h3>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-2 max-w-md mx-auto mb-6">
            Explore our collection of magnetic floating sculptures, ambient LED lamps, and modular desk architecture.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 py-3 px-8 rounded-xl bg-[#E61E2A] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#C81420] transition-colors shadow-sm"
          >
            <span>Browse All Studio Pieces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
