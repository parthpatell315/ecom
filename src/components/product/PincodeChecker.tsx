'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, Truck, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { DELIVERY_PROMISE } from '@/config/shipping';

interface PincodeCheckerProps {
  className?: string;
}

export function PincodeChecker({ className = '' }: PincodeCheckerProps) {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string>('');
  const [isMetro, setIsMetro] = useState(false);

  // Load previously entered pincode
  useEffect(() => {
    try {
      const saved = localStorage.getItem('flirta_pincode_cache');
      if (saved && /^\d{6}$/.test(saved)) {
        setPincode(saved);
        calculateDelivery(saved);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const calculateDelivery = (code: string) => {
    // Metro postal prefixes: 11 (Delhi), 40 (Mumbai), 56 (Bengaluru), 60 (Chennai), 70 (Kolkata), 50 (Hyderabad)
    const metroPrefixes = ['11', '40', '56', '60', '70', '50', '38', '41'];
    const isTier1 = metroPrefixes.some((p) => code.startsWith(p));
    setIsMetro(isTier1);

    const today = new Date();
    // Dispatch in 1-2 days + transit
    const transitDays = isTier1 ? 3 : 4;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + transitDays);

    const formattedDate = targetDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    setDeliveryEstimate(formattedDate);
    setStatus('valid');
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.trim();
    if (!/^\d{6}$/.test(clean)) {
      setStatus('invalid');
      return;
    }

    setStatus('checking');
    setTimeout(() => {
      calculateDelivery(clean);
      try {
        localStorage.setItem('flirta_pincode_cache', clean);
      } catch {
        // ignore
      }
    }, 300);
  };

  return (
    <div className={`p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.06] text-xs ${className}`}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#E53935]" />
          <span>Delivery &amp; COD Availability</span>
        </span>
        <span className="text-[10.5px] text-[#86868B] font-medium">Pan-India Air</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
            setPincode(val);
            if (val.length === 6) {
              setStatus('idle');
            }
          }}
          placeholder="Enter 6-digit delivery PIN code"
          className="flex-1 h-9 px-3 bg-white border border-black/10 rounded-xl text-xs text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-1 focus:ring-[#1D1D1F]"
        />
        <button
          type="submit"
          disabled={pincode.length !== 6 || status === 'checking'}
          className="h-9 px-4 rounded-xl bg-[#1D1D1F] text-white font-semibold text-xs hover:bg-black transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1"
        >
          {status === 'checking' ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <span>Check</span>
          )}
        </button>
      </form>

      {status === 'invalid' && (
        <p className="text-[11px] text-red-600 mt-2 font-medium">
          Please enter a valid 6-digit Indian PIN code.
        </p>
      )}

      {status === 'valid' && (
        <div className="mt-3 pt-3 border-t border-black/[0.04] space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-1.5 text-[#1D1D1F] font-semibold text-[11.5px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              Delivery by <strong className="text-[#1D1D1F]">{deliveryEstimate}</strong> {isMetro ? '(Express Air)' : '(Standard Air)'}
            </span>
          </div>
          <p className="text-[10.5px] text-[#6E6E73] leading-relaxed">
            ✓ Free air shipping across India • ✓ Partial COD available with ₹149 advance
          </p>
        </div>
      )}

      {status === 'idle' && !pincode && (
        <p className="text-[10.5px] text-[#86868B] mt-2">
          {DELIVERY_PROMISE} with tracking via Bluedart Express.
        </p>
      )}
    </div>
  );
}

