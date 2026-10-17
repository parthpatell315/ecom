import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Cpu, Leaf, Compass, Shield, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About flirta.network — Computational 3D Additive Architecture',
  description: 'Our philosophy of generative mathematical form, carbon-neutral biopolymers, and silent precision timekeeping.',
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Design Philosophy</span>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white mt-1">
          Form dictated by mathematics.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-3 leading-relaxed">
          flirta.network was founded with a singular mandate: to bridge generative algorithms and physical living spaces through precision additive manufacturing.
        </p>
      </div>

      {/* Hero Visual */}
      <div className="relative rounded-3xl overflow-hidden aspect-[16/9] mb-16 border border-black/[0.08] dark:border-white/[0.08] shadow-md">
        <Image
          src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1400&q=85"
          alt="flirta.network generative lighting design"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-8 text-white">
          <p className="text-xs sm:text-sm text-neutral-200 max-w-xl">
            Lumi Studio Ambient Lamp during a 38-hour continuous zero-support print cycle at 0.12mm layer precision.
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <div id="materials" className="space-y-12 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Sustainable Science</span>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white mt-1">
              Carbon-Neutral European Biopolymers
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed">
              We reject petroleum-based styrenes and non-recyclable ABS. Every flirta.network piece is printed in high-purity polylactic biopolymers synthesized from renewable corn starch and sugarcane bagasse. The resulting material possesses a tactile ceramic-like weight with an ultra-matte, non-reflective light diffusion surface.
            </p>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-black/5 dark:border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
              alt="Biopolymer light diffusion"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div id="process" className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
          <div className="md:order-2">
            <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Additive Journey</span>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white mt-1">
              The 38-Hour Additive Journey
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed">
              Each piece undergoes 20 to 44 hours of unbroken additive manufacturing. Micro-Swiss hardened nozzles deposit molten biopolymer beads at 0.12mm layer heights, resulting in zero visible stringing and porcelain-smooth geometric contours that cannot be injection-molded.
            </p>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 md:order-1">
            <Image
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
              alt="Fibonacci Shadow Clock"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 sm:p-12 rounded-3xl bg-neutral-50 dark:bg-neutral-900/40 border border-black/5 dark:border-white/5 text-center">
        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">Curate your workstation sanctuary</h3>
        <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-md mx-auto mb-6">
          Explore our collection of generative lamps, silent kinetic clocks, and perpetual desk architecture.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 py-3 px-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-black dark:hover:bg-neutral-100 transition-colors"
        >
          Browse All Studio Pieces <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
