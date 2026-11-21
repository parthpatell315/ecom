'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  MessageCircle,
  Clock,
  Send,
} from 'lucide-react';

export default function ComingSoonPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-[#070709] text-white flex flex-col justify-between overflow-hidden selection:bg-[#E61E2A]/20 selection:text-[#E61E2A]">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[-15%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#E61E2A]/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[15%] w-[450px] h-[450px] rounded-full bg-[#3B82F6]/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[350px] h-[350px] rounded-full bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />

      {/* Subtle Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Header / Brand Logo */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 shadow-lg bg-black flex items-center justify-center">
            <Image
              src="/wl-logo.png"
              alt="FLIRTA BY WHITELAYER"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <span className="font-semibold tracking-[0.2em] text-xs uppercase text-white/90">
            FLIRTA <span className="text-white/40 font-light">BY WHITELAYER</span>
          </span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Curating Studio Drop</span>
        </div>
      </header>

      {/* Central Hero Section */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-6 py-12 sm:py-20 flex flex-col items-center text-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.07] text-[11.5px] text-white/70 mb-8 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#E61E2A]" />
          <span className="tracking-widest uppercase font-medium text-[10.5px]">
            Private Studio Access
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08]">
          Crafting the Next Chapter in{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">
            Desk Sanctuaries.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          Our online storefront is temporarily closed while we curate our next limited-batch
          release of architectural desk models, ambient lighting, and precision accessories.
        </p>

        {/* VIP Early Access Card */}
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-2xl mb-8">
          <h2 className="text-sm font-semibold text-white/90 mb-1.5 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            Request VIP Launch Access
          </h2>
          <p className="text-xs text-white/50 mb-5 leading-relaxed">
            Get priority entry and early allocation before the collection goes public.
          </p>

          {submitted ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>You are on the VIP priority drop list. We will notify you first.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                placeholder="Enter email or WhatsApp number"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 rounded-2xl bg-[#E61E2A] hover:bg-[#d01723] active:scale-[0.98] text-white font-medium text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#E61E2A]/25 disabled:opacity-50 shrink-0"
              >
                {loading ? 'Joining...' : 'Notify Me'}
                <Send className="w-3 h-3" />
              </button>
            </form>
          )}

          {/* WhatsApp Direct Inquiries */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-center">
            <a
              href="https://wa.me/917600409399?text=Hello%20Flirta%20Studio%2C%20I%20would%20like%20to%20inquire%20about%20a%20private%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-[#25D366] hover:text-[#25D366]/80 font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Have an urgent inquiry? Chat on WhatsApp →</span>
            </a>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-white/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white/50" />
            <span>Studio Batch Authenticity</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-white/50" />
            <span>Pan-India Insured Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-white/50" />
            <span>Verified Orders Protected</span>
          </div>
        </div>
      </main>

      {/* Footer / Discrete Admin Access */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/30">
        <div>
          © {new Date().getFullYear()} FLIRTA BY WHITELAYER. All rights reserved.
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="hover:text-white/60 transition-colors flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            <span>Staff Portal</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
