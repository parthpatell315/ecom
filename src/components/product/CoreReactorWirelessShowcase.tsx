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
  Smartphone,
  BatteryCharging,
  Radio,
} from 'lucide-react';

export interface CoreReactorWirelessShowcaseProps {
  onBuyNow?: () => void;
}

export function CoreReactorWirelessShowcase({ onBuyNow }: CoreReactorWirelessShowcaseProps = {}) {
  const [isPhoneDocked, setIsPhoneDocked] = useState<boolean>(true);
  const [chargingWattage, setChargingWattage] = useState<'15W' | '10W' | '7.5W'>('15W');

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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#070D18] via-[#0F172A] to-[#080E1A] text-white p-6 sm:p-10 border border-cyan-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>WhiteLayer Studio Drop • Handcrafted in New Delhi, India</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white !text-white leading-tight">
              Core Reactor Wireless Edition • 15W Fast Qi Charger & Ambient Desk Light
            </h2>

            <p className="text-sm text-gray-200 !text-gray-200 leading-relaxed">
              Where high-energy electromagnetic reactor physics meets daily desktop utility. 15W Qi-certified magnetic fast wireless charging, tempered crystal glass top, 10 hand-wound copper inductors, and hypnotic cyan ambient breathing luminescence.
            </p>

            <div className="flex items-center gap-3 flex-wrap pt-2">
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 !text-cyan-400 tracking-tight">
                Rs. 1,999.00
              </span>
              <span className="text-base sm:text-lg text-gray-400 !text-gray-400 line-through">
                Rs. 4,999.00
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white !text-white text-xs font-black tracking-wider uppercase">
                60% OFF
              </span>
            </div>
          </div>

          {/* Batch Scarcity & Fast Order Card */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center text-center space-y-4 shrink-0 lg:w-80">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-cyan-400">
              <Cpu className="w-4 h-4" />
              <span>Studio Batch #01 • Wireless Run</span>
            </div>

            {/* Scarcity Meter */}
            <div className="w-full space-y-1.5 pt-1 text-left">
              <div className="flex justify-between text-[11px] font-semibold text-gray-300">
                <span className="text-amber-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  Only 18 Pieces Left in Stock
                </span>
                <span className="text-gray-400">82% Claimed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-full w-[82%]" />
              </div>
            </div>

            <div className="w-full pt-2">
              <button
                type="button"
                onClick={handleOrder}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white !text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Claim Wireless Edition (₹1,999)</span>
              </button>
            </div>

            <p className="text-[11px] text-gray-400 flex items-center gap-1.5 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>₹149 Partial COD Available • 7-Day Replacement</span>
            </p>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE WIRELESS CHARGING & GLOW SIMULATOR */}
      <section className="p-6 sm:p-10 rounded-3xl bg-[#0F172A] text-white border border-cyan-500/20 shadow-xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            Tactile Desktop Physics
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white !text-white">
            Dual-Function Simulator: 15W Qi Charger + Ambient Core
          </h3>
          <p className="text-sm text-gray-300">
            Dock your device to trigger high-speed inductive power transfer or enjoy hypnotic breathing cyan illumination in standby.
          </p>
        </div>

        {/* Simulator Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
          {/* Visual Display Screen */}
          <div className="relative aspect-square rounded-2xl bg-gradient-to-b from-[#070D18] to-[#0F172A] border border-cyan-500/30 overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl">
            {/* Outer Aura Halo */}
            <div
              className={`absolute inset-0 rounded-2xl transition-all duration-1000 ${
                isPhoneDocked
                  ? 'bg-gradient-to-t from-cyan-500/25 via-blue-500/10 to-transparent animate-pulse'
                  : 'bg-cyan-500/5'
              }`}
            />

            {/* Glowing Core Graphic Representation */}
            <div className="relative z-10 w-48 h-48 rounded-full border-4 border-cyan-400/50 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.4)]">
              {/* Internal Spoke Rings */}
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-cyan-300/40 animate-spin [animation-duration:30s]" />
              <div className="absolute inset-6 rounded-full border border-cyan-400/30" />
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-400 flex items-center justify-center shadow-[0_0_35px_rgba(34,211,238,0.8)]">
                {isPhoneDocked ? (
                  <BatteryCharging className="w-12 h-12 text-white animate-bounce" />
                ) : (
                  <Radio className="w-10 h-10 text-white animate-pulse" />
                )}
              </div>

              {/* Simulated Phone Overlay if Docked */}
              {isPhoneDocked && (
                <div className="absolute -top-6 w-36 h-56 rounded-3xl bg-slate-900/90 border-2 border-cyan-400 backdrop-blur-md p-3 flex flex-col items-center justify-between shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-12 h-2 rounded-full bg-slate-700" />
                  <div className="text-center space-y-1">
                    <Zap className="w-6 h-6 text-cyan-400 mx-auto fill-cyan-400 animate-pulse" />
                    <div className="text-xs font-mono font-bold text-cyan-300">
                      MagSafe {chargingWattage}
                    </div>
                    <div className="text-[10px] text-gray-400">93% Efficiency</div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-[88%]" />
                  </div>
                </div>
              )}
            </div>

            {/* Status Footer */}
            <div className="relative z-10 mt-6 text-center">
              <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300">
                {isPhoneDocked
                  ? `⚡ Active Qi Induction • ${chargingWattage} Fast Power`
                  : '💡 Standby Desk Sanctuary • Cyan Ambient Glow'}
              </span>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Test Operating State</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsPhoneDocked(true)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isPhoneDocked
                      ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-md shadow-cyan-500/20'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs">📱 Phone Docked</div>
                  <div className="text-[11px] text-gray-300 pt-1">
                    15W Fast Charge + Cyan Pulse
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPhoneDocked(false)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    !isPhoneDocked
                      ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-md shadow-cyan-500/20'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs">💡 Standby Desk Lamp</div>
                  <div className="text-[11px] text-gray-300 pt-1">
                    Soft Cyber Ambient Glow
                  </div>
                </button>
              </div>

              {/* Wattage Selector */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Adaptive Qi Power Profile
                </label>
                <div className="flex gap-2">
                  {(['15W', '10W', '7.5W'] as const).map((watt) => (
                    <button
                      key={watt}
                      type="button"
                      onClick={() => setChargingWattage(watt)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        chargingWattage === watt
                          ? 'bg-cyan-500 text-white shadow-sm'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {watt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>Thermal Safety</span>
                </div>
                <div className="text-xl font-black text-white">&lt;32°C</div>
                <p className="text-[11px] text-gray-400">Continuous cool charging</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Smart FOD Chip</span>
                </div>
                <div className="text-xl font-black text-white">100% Safe</div>
                <p className="text-[11px] text-gray-400">Foreign Object Detection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 5-LAYER ANATOMICAL ENGINEERING BREAKDOWN */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-600">
            Material Science & Electronics
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
            5-Layer High-Performance Architecture
          </h3>
          <p className="text-sm text-[#4B5563]">
            Precision engineered from pure enameled copper, tempered crystal, and aerospace biopolymers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              num: '01',
              title: 'Tempered Crystal Top',
              desc: 'High-permeability scratch-resistant optical glass surface for zero-loss inductive coupling.',
              tag: '93% Efficiency',
            },
            {
              num: '02',
              title: '15W Copper Coil',
              desc: 'Multi-strand pure enameled copper induction transmitter coil with magnetic centering ring.',
              tag: 'Pure Enameled Copper',
            },
            {
              num: '03',
              title: 'Smart FOD Microchip',
              desc: 'Continuous thermal regulation, over-voltage/current protection, and foreign object auto-cutoff.',
              tag: 'Active Safety IC',
            },
            {
              num: '04',
              title: 'Optical Halo Diffuser',
              desc: 'Uniform 360° light diffusion halo with cool-emitting cyan SMD LEDs (Zero harsh glare).',
              tag: 'Eye-Safe Luminescence',
            },
            {
              num: '05',
              title: '340g Weighted Base',
              desc: 'Counterbalanced obsidian pedestal with acoustic anti-skid silicone pads (Zero phone lift).',
              tag: '340g Counterweight',
            },
          ].map((layer) => (
            <div
              key={layer.num}
              className="p-5 rounded-2xl bg-white border border-black/10 hover:border-cyan-500/50 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-cyan-600">{layer.num}</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                  {layer.tag}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#111827]">{layer.title}</h4>
              <p className="text-xs text-[#4B5563] leading-relaxed">{layer.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. UNIVERSAL DEVICE COMPATIBILITY GRID */}
      <section className="p-6 sm:p-10 rounded-3xl bg-[#F8FAFC] border border-black/10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-700">
            Broad Ecosystem Compatibility
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
            Charges Flagships, Earbuds & All Qi Devices
          </h3>
          <p className="text-sm text-[#4B5563]">
            Engineered with magnetic auto-alignment for MagSafe devices and smart adaptive profiles for standard Qi hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Apple iPhone (MagSafe)',
              models: 'iPhone 16, 15, 14, 13, 12 Series & iPhone 8–11 (Qi)',
              power: 'Up to 15W Fast Charge',
            },
            {
              title: 'Samsung Galaxy',
              models: 'S24 Ultra, S23, S22, S21, Note 20, Z Fold & Z Flip Series',
              power: 'Up to 15W Adaptive Fast Charge',
            },
            {
              title: 'Google Pixel & Android',
              models: 'Pixel 9, 8, 7, 6 Pro, OnePlus Qi & Xiaomi Flagships',
              power: '10W / 15W Qi Certified',
            },
            {
              title: 'Wireless Earbuds',
              models: 'AirPods Pro 1/2, AirPods 3/4, Galaxy Buds Pro, Pixel Buds',
              power: '5W Trickle Charge',
            },
          ].map((device, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-black/[0.08] shadow-sm space-y-2.5"
            >
              <div className="flex items-center gap-2 text-cyan-700 font-bold text-sm">
                <Smartphone className="w-4 h-4 shrink-0" />
                <span>{device.title}</span>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">{device.models}</p>
              <div className="pt-2 border-t border-black/[0.06] text-[11px] font-mono font-bold text-emerald-700">
                {device.power}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PHYSICAL UNBOXING BREAKDOWN */}
      <section className="p-6 sm:p-10 rounded-3xl bg-[#0B0F17] text-white border border-cyan-500/30 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            Unboxing Experience
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white !text-white">
            What Arrives In Your Studio Package
          </h3>
          <p className="text-sm text-gray-300">
            Every piece is cushioned inside high-density laser-cut EVA foam for guaranteed damage-free air transit across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              item: 'Core Reactor Wireless 15W Charging Unit',
              desc: 'High-permeability tempered crystal surface with integrated copper coil and cyan halo.',
            },
            {
              item: '340g Weighted Obsidian Pedestal Stand',
              desc: 'Pre-assembled heavy alloy desktop dock with non-marking anti-skid silicone pads.',
            },
            {
              item: '1.5m Reinforced Braided USB-C Cable',
              desc: 'Tangle-resistant nylon braided Type-C cable rated for high-wattage fast charging.',
            },
            {
              item: 'WhiteLayer Certificate of Authenticity',
              desc: 'Individually serialized batch inspection card stamped in our New Delhi studio.',
            },
            {
              item: 'Dual-Language Quick Setup Guide',
              desc: 'Easy-to-follow diagrams for optimal coil alignment and fast charger recommendations.',
            },
            {
              item: 'Shockproof Acoustic EVA Packaging',
              desc: 'Heavy-duty laser-cut interior foam backed by our 7-day zero-cost replacement guarantee.',
            },
          ].map((box, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-cyan-400/40 transition-all"
            >
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{box.item}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{box.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INDIAN BUYER PROTECTION STRIP & PARTIAL COD */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-cyan-50 to-blue-50 border border-emerald-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-[#111827]">
                100% Risk-Free Indian Buyer Guarantee
              </h4>
              <p className="text-xs text-[#4B5563] pt-0.5">
                Pay only <strong>₹149 advance</strong> via UPI now to reserve your studio parcel. Pay remaining ₹1,850 on delivery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right text-xs">
              <div className="font-bold text-emerald-800 flex items-center gap-1 justify-end">
                <Truck className="w-3.5 h-3.5" />
                <span>BlueDart Air Express</span>
              </div>
              <div className="text-[#6B7280]">2–4 Days Transit Pan-India</div>
            </div>
            <button
              type="button"
              onClick={handleOrder}
              className="py-3 px-5 rounded-xl bg-[#111827] hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              Order with ₹149 Advance →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
