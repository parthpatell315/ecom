'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Zap,
  Mic,
  Radio,
  Fingerprint,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle2,
  Clock,
  Layers,
  Flame,
  Volume2,
  Eye,
  Award,
} from 'lucide-react';

export interface MK5ShowcaseProps {
  onBuyNow?: () => void;
}

export function MK5Showcase({ onBuyNow }: MK5ShowcaseProps = {}) {
  const [activeMode, setActiveMode] = useState<'voice' | 'remote' | 'touch'>('voice');
  const [activeEyeColor, setActiveEyeColor] = useState<'white' | 'red'>('white');

  // Real-time 24-Hour countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 48,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClaim = () => {
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
      {/* 1. DIWALI 24-HOUR FLASH SALE BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#0B0F17] text-white p-6 sm:p-10 border border-amber-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Diwali Festive Flash Sale • Flat 90% OFF</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white !text-white leading-tight">
              MK 5 Black Edition 1:1 Life-Size Wearable Helmet
            </h2>

            <p className="text-sm text-gray-200 !text-gray-200 leading-relaxed">
              Subsidized festive batch strictly limited to <strong className="text-white !text-white font-bold">24 Hours</strong>. Movie-grade mechanized multi-segment opening, dual combat LED eyes, and 3-way control matrix (Voice + Wireless Remote + Touch).
            </p>

            <div className="flex items-center gap-3 flex-wrap pt-2">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 !text-amber-400 tracking-tight">
                Rs. 2,499.00
              </span>
              <span className="text-base sm:text-lg text-gray-400 !text-gray-400 line-through">
                Rs. 24,999.00
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white !text-white text-xs font-black tracking-wider uppercase">
                90% OFF
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white !text-white text-xs font-black tracking-wider">
                ⚡ ₹1,949 PREPAID (EXTRA ₹550 OFF)
              </span>
            </div>
          </div>

          {/* Countdown & Urgent Purchase Box */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center text-center space-y-4 shrink-0 lg:w-80">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-amber-400">
              <Clock className="w-4 h-4" />
              <span>Offer Closes In</span>
            </div>

            {/* Countdown Flip Digits */}
            <div className="grid grid-cols-3 gap-2.5 w-full">
              <div className="bg-black/60 rounded-xl p-2.5 border border-white/10">
                <span className="block text-2xl sm:text-3xl font-black text-white font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Hours</span>
              </div>
              <div className="bg-black/60 rounded-xl p-2.5 border border-white/10">
                <span className="block text-2xl sm:text-3xl font-black text-white font-mono">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Mins</span>
              </div>
              <div className="bg-black/60 rounded-xl p-2.5 border border-white/10">
                <span className="block text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Secs</span>
              </div>
            </div>

            {/* Stock Scarcity Indicator */}
            <div className="w-full space-y-1.5 pt-1 text-left">
              <div className="flex justify-between text-[11px] font-semibold text-gray-300">
                <span className="text-red-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                  Only 4 Units Left in Stock
                </span>
                <span className="text-gray-400">92% Claimed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full w-[92%]" />
              </div>
            </div>

            <button
              type="button"
              onClick={handleClaim}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E61E2A] to-[#C81420] hover:brightness-110 active:scale-98 transition-all text-white font-bold text-sm shadow-lg shadow-red-600/30 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>CLAIM NOW (₹1,949 PREPAID / ₹2,499 COD)</span>
              <Zap className="w-4 h-4 fill-current" />
            </button>
            <span className="text-[10.5px] text-gray-400">
              ⚡ Extra ₹550 OFF on Prepaid UPI • ₹149 Partial COD Option
            </span>
          </div>
        </div>
      </section>

      {/* 2. 3 INTERACTIVE ACTIVATION MODES */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#E61E2A] font-bold">
            Triple Control Architecture
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
            3 Seamless Ways to Command Your Armor
          </h3>
          <p className="text-sm text-gray-600">
            Engineered with an intelligent onboard microprocessor to respond immediately to your voice, wireless remote, or touch.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveMode('voice')}
            className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeMode === 'voice'
                ? 'bg-[#111827] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Voice Command</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('remote')}
            className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeMode === 'remote'
                ? 'bg-[#111827] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>2.4G Wireless Remote</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('touch')}
            className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeMode === 'touch'
                ? 'bg-[#111827] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>Ear Touch Sensor</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#F9FAFB] border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            {activeMode === 'voice' && (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                  <Mic className="w-3.5 h-3.5" /> Bilingual Voice Recognition
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-[#111827]">
                  Speak &amp; Command Hands-Free
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Equipped with sensitive front-facing microphone arrays. Simply speak directly to the helmet to execute smooth motorized actions with authentic AI voice responses:
                </p>
                <div className="space-y-2 pt-2 text-xs sm:text-sm font-mono text-gray-800">
                  <div className="p-3 rounded-xl bg-white border border-gray-200 flex items-center justify-between">
                    <span>🗣️ &quot;Jarvis, open the mask&quot;</span>
                    <span className="text-emerald-600 font-bold">→ 6-Plate Segmented Open</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-gray-200 flex items-center justify-between">
                    <span>🗣️ &quot;Jarvis, close the mask&quot;</span>
                    <span className="text-emerald-600 font-bold">→ Motorized Face Lock</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-gray-200 flex items-center justify-between">
                    <span>🗣️ &quot;Start combat mode&quot;</span>
                    <span className="text-red-600 font-bold">→ Red Eye Overdrive</span>
                  </div>
                </div>
              </>
            )}

            {activeMode === 'remote' && (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                  <Radio className="w-3.5 h-3.5" /> 2.4GHz Wireless Frequency
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-[#111827]">
                  Ergonomic Pocket Remote Control
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Keep the compact wireless remote in your pocket or hand during events, cosplay, or display. One click triggers segmented transformation, eye mode switches, and volume control up to 10 meters away with zero latency.
                </p>
                <ul className="space-y-2 pt-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Instant button for segmented multi-plate transformation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Independent eye illumination toggle (White / Red / Off)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Battery powered (2x AAA) with auto-sleep power saving</span>
                  </li>
                </ul>
              </>
            )}

            {activeMode === 'touch' && (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <Fingerprint className="w-3.5 h-3.5" /> Capacitive Bilateral Touch
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-[#111827]">
                  Discreet Touch Sensors in Ear Armor
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  No remote? No problem. Concealed capacitive touch plates are integrated into both left and right ear covers. A subtle tap on the side of your helmet triggers immediate response:
                </p>
                <div className="space-y-2 pt-2 text-xs sm:text-sm text-gray-800">
                  <div className="p-3 rounded-xl bg-white border border-gray-200 flex items-center justify-between">
                    <span className="font-semibold">Tap Left Ear Cover</span>
                    <span className="text-blue-600 font-bold">Multi-Segment Plate Opening</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-gray-200 flex items-center justify-between">
                    <span className="font-semibold">Tap Right Ear Cover</span>
                    <span className="text-blue-600 font-bold">Unified Smooth Closing</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-gray-200 shadow-inner">
            <Image
              src={
                activeMode === 'voice'
                  ? '/images/mk5-helmet/helmet-5.webp'
                  : activeMode === 'remote'
                  ? '/images/mk5-helmet/helmet-9.webp'
                  : '/images/mk5-helmet/helmet-6.webp'
              }
              alt="MK 5 Control Mode Demonstration"
              fill
              className="object-cover transition-all duration-500"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
        </div>
      </section>

      {/* 3. DUAL COMBAT EYE ILLUMINATION VISUALIZER */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#0F172A] text-white space-y-8 border border-blue-900/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-bold">
              Combat Optical Lenses
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white !text-white">
              Dual-Mode Glowing LED Eyes
            </h3>
            <p className="text-sm text-gray-200 !text-gray-200">
              High-lumen optical LED diffusers deliver eye-safe interior glow with exceptional exterior brightness. Toggle between calm standby and combat battle modes.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setActiveEyeColor('white')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeEyeColor === 'white'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-200 border border-cyan-400" />
              <span>Standby Cool White</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveEyeColor('red')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeEyeColor === 'red'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-red-400 border border-red-200" />
              <span>Combat Red Overdrive</span>
            </button>
          </div>
        </div>

        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-black border border-white/10">
          <Image
            src={
              activeEyeColor === 'white'
                ? '/images/mk5-helmet/helmet-3.jpg'
                : '/images/mk5-helmet/helmet-1.webp'
            }
            alt="Dual Mode LED Eyes"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1140px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-200">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>
                {activeEyeColor === 'white'
                  ? 'Cool White Optical Mode: Clear visibility for indoor & nighttime wear.'
                  : 'Combat Red Overdrive: Fierce battle protocol look activated via Jarvis command.'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MOTORIZED MULTI-SEGMENT FACEPLATE BREAKDOWN */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-100 border border-gray-200">
          <Image
            src="/images/mk5-helmet/helmet-2.jpg"
            alt="Multi-Segment Motorized Plate Mechanism"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 600px"
          />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#E61E2A] font-bold">
              Servo-Driven Engineering
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
              Multi-Piece Segmented Plate Transformation
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Unlike cheap knockoffs that flip the entire face up as a single heavy chunk, the <strong>MK 5 Black Edition</strong> uses dual precision high-torque micro-servos to articulate <strong>6 independent faceplate segments</strong>:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <strong className="block text-sm font-bold text-gray-900">Dual Micro Servos</strong>
              <span className="text-gray-600">Smooth high-torque gear system built to withstand 10,000+ open/close cycles without jamming.</span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <strong className="block text-sm font-bold text-gray-900">Synchronized Articulation</strong>
              <span className="text-gray-600">Forehead, cheekbones, and chin armor plates glide open sequentially in 1.2 seconds.</span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <strong className="block text-sm font-bold text-gray-900">Acoustic Sound FX</strong>
              <span className="text-gray-600">Built-in speaker produces authentic mechanical transformation and servo whirs during every cycle.</span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <strong className="block text-sm font-bold text-gray-900">Auto Anti-Pinch Failsafe</strong>
              <span className="text-gray-600">Smart sensors halt servo pressure automatically if resistance is detected when closing.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 1:1 LIFE-SIZE WEARABILITY & SIZING GUIDE */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#F8FAFC] border border-gray-200 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-emerald-600 font-bold">
            Ergonomic Fit Architecture
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
            Crafted for Teenagers &amp; Adults (Up to 62cm)
          </h3>
          <p className="text-sm text-gray-600">
            Engineered as a true 1:1 life-size scale wearable prop with soft internal foam padding and breathable ventilation channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              62cm
            </div>
            <h4 className="text-base font-bold text-gray-900">Universal Head Sizing</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Accommodates head circumferences up to 62 cm (24.4 inches). Suitable for adults and teenagers with plenty of temple and crown clearance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              Air
            </div>
            <h4 className="text-base font-bold text-gray-900">Breathable Airflow Slits</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Discreet ventilation slits along the jawline prevent fogging of eye lenses and maintain cool interior circulation during cosplay.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              EVA
            </div>
            <h4 className="text-base font-bold text-gray-900">Soft Memory Foam Lining</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              High-density cushioned foam pads on forehead, cheeks, and nape ensure comfortable long-duration wear with zero pressure points.
            </p>
          </div>
        </div>
      </section>

      {/* 6. TECHNICAL SPECIFICATIONS & WHAT'S IN THE BOX */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Specs Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-4">
          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#E61E2A]" />
            <span>Technical Specifications</span>
          </h4>
          <div className="divide-y divide-gray-100 text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Scale</span>
              <strong className="text-gray-900">1:1 Life-Size Wearable Collectible</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Head Circumference</span>
              <strong className="text-gray-900">Fits up to 62 cm (24.4 inches)</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Color &amp; Finish</span>
              <strong className="text-gray-900">Stealth Electroplated Obsidian Black</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Control Modes</span>
              <strong className="text-gray-900">Voice Command + 2.4G Remote + Ear Touch</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Eye Illumination</span>
              <strong className="text-gray-900">Dual Mode LED (Cool White &amp; Combat Red)</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Faceplate Motor</span>
              <strong className="text-gray-900">Dual High-Torque Micro Servos (6-Segment)</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Power Requirements</span>
              <strong className="text-gray-900">4x AA (Helmet) + 2x AAA (Remote)</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Material</span>
              <strong className="text-gray-900">High-Impact ABS Polymer + Metal Hardware</strong>
            </div>
          </div>
        </div>

        {/* What's In The Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-4">
          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>What&apos;s Included In The Box</span>
          </h4>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
              <div>
                <strong className="block text-gray-900">MK 5 Black Edition 1:1 Wearable Helmet</strong>
                <span className="text-gray-500">Fully assembled motorized unit ready for battery insertion</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
              <div>
                <strong className="block text-gray-900">2.4GHz Wireless Remote Controller</strong>
                <span className="text-gray-500">Pocket-sized multi-function ergonomic remote</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
              <div>
                <strong className="block text-gray-900">Velvet Protective Storage Dust Bag</strong>
                <span className="text-gray-500">Plush drawstring cover for desktop or shelf protection</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-[11px] shrink-0">4</span>
              <div>
                <strong className="block text-gray-900">Microfiber Studio Cleaning Cloth</strong>
                <span className="text-gray-500">Lint-free cloth for maintaining the electroplated sheen</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-[11px] shrink-0">5</span>
              <div>
                <strong className="block text-gray-900">Illustrated Guide &amp; Voice Commands Cheat Sheet</strong>
                <span className="text-gray-500">Step-by-step operation guide with all command phrases</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HIGH-TRUST BUYER PROTECTION STRIP */}
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
              <span>Pay ₹149 advance via UPI, pay balance at doorstep</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-sm text-gray-900">7-Day Replacement</strong>
              <span>Zero-cost replacement if damaged during courier transit</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <strong className="block text-sm text-gray-900">100% Genuine Quality</strong>
              <span>18-point servo and electronics calibration before dispatch</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

