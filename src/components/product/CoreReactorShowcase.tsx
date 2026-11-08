'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle2,
  Clock,
  Layers,
  Flame,
  Award,
  Sliders,
  Cpu,
  Thermometer,
  Eye,
  Check,
} from 'lucide-react';

export interface CoreReactorShowcaseProps {
  onBuyNow?: () => void;
}

export function CoreReactorShowcase({ onBuyNow }: CoreReactorShowcaseProps = {}) {
  const [activeLightingMode, setActiveLightingMode] = useState<'steady' | 'breathing'>('breathing');

  const handleOrder = () => {
    if (onBuyNow) {
      onBuyNow();
      return;
    }
    const addBtn = document.getElementById('MainAddToCartBtn');
    if (addBtn) {
      addBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      addBtn.classList.add('animate-bounce');
      setTimeout(() => addBtn.classList.remove('animate-bounce'), 1000);
    } else {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full mt-16 space-y-16 text-[#1D1D1F]">
      {/* 1. STUDIO ORIGIN & CRAFTSMANSHIP BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B0F17] via-[#111827] to-[#0A0D14] text-white p-6 sm:p-10 border border-cyan-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>WhiteLayer Studio Drop • Handcrafted in New Delhi, India</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white !text-white leading-tight">
              Core Reactor Desk Sanctuary • 0.12mm Micro-Precision
            </h2>

            <p className="text-sm text-gray-200 !text-gray-200 leading-relaxed">
              Individually crafted with 10 hand-wound copper-core micro inductors, crystal optical display dome, laser-etched energy halo, and 380g weighted obsidian pedestal.
            </p>

            <div className="flex items-center gap-3 flex-wrap pt-2">
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 !text-cyan-400 tracking-tight">
                Rs. 1,499.00
              </span>
              <span className="text-base sm:text-lg text-gray-400 !text-gray-400 line-through">
                Rs. 2,999.00
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white !text-white text-xs font-black tracking-wider uppercase">
                50% OFF
              </span>
            </div>
          </div>

          {/* Batch Scarcity & Fast Order Card */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center text-center space-y-4 shrink-0 lg:w-80">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-cyan-400">
              <Cpu className="w-4 h-4" />
              <span>Studio Batch #04 • Limited</span>
            </div>

            {/* Scarcity Meter */}
            <div className="w-full space-y-1.5 pt-1 text-left">
              <div className="flex justify-between text-[11px] font-semibold text-gray-300">
                <span className="text-amber-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  Only 15 Pieces in Stock
                </span>
                <span className="text-gray-400">85% Claimed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-full w-[85%]" />
              </div>
            </div>

            <button
              type="button"
              onClick={handleOrder}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E61E2A] to-[#C81420] hover:brightness-110 active:scale-98 transition-all text-white font-bold text-sm shadow-lg shadow-red-600/30 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>ORDER CORE REACTOR • ₹1,499</span>
              <Zap className="w-4 h-4 fill-current" />
            </button>

            <span className="text-[10.5px] text-gray-400">
              ⚡ Free BlueDart Air Express • Partial COD (₹149 Advance)
            </span>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE LIGHTING MODE SIMULATOR */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#0F172A] text-white space-y-8 border border-cyan-900/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
              Dual Optical Atmospheres
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white !text-white">
              Steady Luminescence vs Cinematic Breathing Pulse
            </h3>
            <p className="text-sm text-gray-200 !text-gray-200">
              Toggle between deep focused workspace ambient light or rhythmic living breathing energy simulation via the concealed rear capacitive sensor.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-3 bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setActiveLightingMode('breathing')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeLightingMode === 'breathing'
                  ? 'bg-cyan-500 text-gray-950 shadow-md font-extrabold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping" />
              <span>Breathing Pulse Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveLightingMode('steady')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeLightingMode === 'steady'
                  ? 'bg-white text-gray-950 shadow-md font-extrabold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Steady Core Cyan</span>
            </button>
          </div>
        </div>

        {/* Live Visual Showcase Banner with Real Photo */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-black border border-cyan-500/20">
          <Image
            src="/images/core-reactor/reactor-1.webp"
            alt="Core Reactor Desk Light Ambient Illumination"
            fill
            className={`object-cover transition-opacity duration-700 ${
              activeLightingMode === 'breathing' ? 'animate-pulse opacity-95' : 'opacity-100'
            }`}
            sizes="(max-width: 1024px) 100vw, 1140px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-6">
            <div className="flex items-center gap-2.5 text-xs font-medium text-cyan-200">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>
                {activeLightingMode === 'breathing'
                  ? 'Cinematic 4-Second Breathing Pulse: Simulates rhythmic energy output for calming desk focus.'
                  : 'Steady Core Cyan Luminescence: Constant cold-light ambient glow for photography & nighttime typing.'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 5-LAYER ANATOMICAL ENGINEERING BREAKDOWN */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#E61E2A] font-bold">
            Anatomical Architecture
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
            Inside the WhiteLayer Core Reactor
          </h3>
          <p className="text-sm text-gray-600">
            Meticulously assembled by hand with 5 distinct physical layers to replicate authentic reactor engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-6 sm:p-10 rounded-3xl bg-[#F9FAFB] border border-gray-200">
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">01</span>
              <div>
                <strong className="block text-sm font-bold text-gray-900">Crystal Optical Display Dome</strong>
                <span className="text-xs text-gray-600">Heavy-gauge scratch-resistant acrylic chamber that protects delicate internal coils from dust and moisture.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">02</span>
              <div>
                <strong className="block text-sm font-bold text-gray-900">10x Hand-Wound Copper Inductors</strong>
                <span className="text-xs text-gray-600">Genuine high-purity enameled copper micro-coils hand-wound over radial brackets with brushed gold metallic hardware.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">03</span>
              <div>
                <strong className="block text-sm font-bold text-gray-900">Frosted Optical Diffuser Halo</strong>
                <span className="text-xs text-gray-600">Laser-etched high-density acrylic diffuser plate that scatters LED photons uniformly with zero glaring hotspots.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">04</span>
              <div>
                <strong className="block text-sm font-bold text-gray-900">0.12mm Micro-Layered Chassis</strong>
                <span className="text-xs text-gray-600">Additive manufacturing body in renewable matte biopolymer with structural heat dissipation vents.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">05</span>
              <div>
                <strong className="block text-sm font-bold text-gray-900">380g Weighted Obsidian Stand</strong>
                <span className="text-xs text-gray-600">Heavy counterweighted alloy base with anti-skid silicone pads and integrated braided USB-C cable channel.</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-gray-200 shadow-inner">
            <Image
              src="/images/core-reactor/reactor-2.webp"
              alt="Anatomical View of Core Reactor Details"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
        </div>
      </section>

      {/* 4. LABORATORY STRESS-TESTING & TECHNICAL SPECIFICATIONS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Lab Testing Benchmarks */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-4">
          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Studio Quality &amp; Thermal Benchmarks</span>
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Every Core Reactor unit undergoes a 12-hour continuous thermal and electronic bench calibration before packaging:
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <Thermometer className="w-4 h-4 text-emerald-600" />
                <span>Cold-to-Touch</span>
              </div>
              <p className="text-[11px] text-gray-500">Stays under 28°C after 72 hours of 24/7 continuous operation.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-700 font-bold">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>0.12mm Accuracy</span>
              </div>
              <p className="text-[11px] text-gray-500">Tight tolerances ensure seamless alignment between coils and ring.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-700 font-bold">
                <Zap className="w-4 h-4 text-purple-600" />
                <span>Safe 5V 1A USB-C</span>
              </div>
              <p className="text-[11px] text-gray-500">Works with laptops, power banks, monitors, or USB phone chargers.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>50,000h Lifespan</span>
              </div>
              <p className="text-[11px] text-gray-500">Solid-state cold SMD light emitting diodes rated for 10+ years.</p>
            </div>
          </div>
        </div>

        {/* Technical Specs Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-4">
          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#E61E2A]" />
            <span>Technical Specifications</span>
          </h4>
          <div className="divide-y divide-gray-100 text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Craft &amp; Origin</span>
              <strong className="text-gray-900">WhiteLayer Studio, New Delhi, India</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Layer Precision</span>
              <strong className="text-gray-900">0.12mm Additive Micro-Layering</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Dimensions</span>
              <strong className="text-gray-900">120mm (Diameter) x 140mm (Height with Stand)</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Total Unit Weight</span>
              <strong className="text-gray-900">380g Counterbalanced Weighted Base</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Coil Details</span>
              <strong className="text-gray-900">10x Hand-Wound High-Purity Enameled Copper</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Display Chamber</span>
              <strong className="text-gray-900">Optical Scratch-Resistant Crystal Acrylic</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Power Connection</span>
              <strong className="text-gray-900">5V 1A USB Type-C (1.5m Braided Cable Included)</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PHYSICAL UNBOXING BREAKDOWN */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#F8FAFC] border border-gray-200 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#E61E2A] font-bold">
            Studio Packaging
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
            What Arrives In Your Studio Package
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Pre-assembled and ready to plug in immediately. No DIY assembly required.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-2 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-xs">1</span>
            <strong className="block text-sm font-bold text-gray-900">Core Reactor Unit</strong>
            <p className="text-gray-600">Fully assembled inside the pre-fitted crystal optical acrylic dust dome.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-2 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-xs">2</span>
            <strong className="block text-sm font-bold text-gray-900">Weighted Stand</strong>
            <p className="text-gray-600">380g counterbalanced obsidian alloy pedestal with non-slip silicone feet.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-2 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-xs">3</span>
            <strong className="block text-sm font-bold text-gray-900">Braided Type-C Cable</strong>
            <p className="text-gray-600">1.5m heavy-duty black braided nylon power cable with reinforced connectors.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-2 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-xs">4</span>
            <strong className="block text-sm font-bold text-gray-900">Studio Certificate</strong>
            <p className="text-gray-600">Numbered WhiteLayer Certificate of Authenticity &amp; 0.12mm Calibration Card.</p>
          </div>
        </div>
      </section>

      {/* 6. HIGH-TRUST BUYER PROTECTION STRIP */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-gray-700">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-sm text-gray-900">Free Air Express</strong>
              <span>Dispatched within 24h via BlueDart / Delhivery Pan-India</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-sm text-gray-900">Partial COD Available</strong>
              <span>Pay ₹149 advance via UPI, pay ₹1,350 at doorstep</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-sm text-gray-900">7-Day Replacement</strong>
              <span>100% zero-cost replacement if damaged during courier transit</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <strong className="block text-sm text-gray-900">100% Studio Tested</strong>
              <span>12-hour continuous thermal and electronic bench testing before dispatch</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
