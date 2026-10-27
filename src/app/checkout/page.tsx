'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/currency';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  Lock,
  Tag,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
  Smartphone,
  IndianRupee,
  Zap,
} from 'lucide-react';
import { UpiPaymentModal } from '@/components/checkout/UpiPaymentModal';
import { trackPixelEvent } from '@/components/analytics/MetaPixel';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCoupon = searchParams.get('coupon') || '';

  const { items, subtotalMinor, refreshCart, isLoaded } = useCart();
  const { user } = useAuth();

  // Contact & Shipping Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Karnataka',
    postalCode: '',
    country: 'India',
    notes: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.email,
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // Coupon state
  const [couponCode, setCouponCode] = useState(initialCoupon);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountMinor: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Order & Payment state
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'PARTIAL_COD'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [activeUpiOrder, setActiveUpiOrder] = useState<{
    orderNumber: string;
    amountMinor: number;
    totalOrderMinor?: number;
    isPartialCod?: boolean;
    codBalanceMinor?: number;
    customerEmail?: string;
    customerPhone?: string;
    upiPayload: any;
  } | null>(null);

  useEffect(() => {
    if (initialCoupon && subtotalMinor > 0) {
      validateCoupon(initialCoupon);
    }
  }, [initialCoupon, subtotalMinor]);

  const validateCoupon = async (code: string) => {
    setIsValidatingCoupon(true);
    setCouponError(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), subtotalMinor }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountMinor: data.coupon.discountMinor,
        });
      } else {
        setCouponError(data.error || 'Invalid coupon');
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError('Failed to validate coupon');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const discountMinor = appliedCoupon ? appliedCoupon.discountMinor : 0;
  // Free Express Delivery for all orders (Prepaid ₹999 total, Partial COD ₹249 advance + ₹750 doorstep balance)
  const shippingMinor = 0;
  const finalTotalMinor = Math.max(0, subtotalMinor - discountMinor + shippingMinor);

  // Fire InitiateCheckout Meta Pixel Event
  useEffect(() => {
    if (isLoaded && items.length > 0) {
      trackPixelEvent('InitiateCheckout', {
        num_items: items.length,
        value: finalTotalMinor / 100,
        currency: 'INR',
      });
    }
  }, [isLoaded, items.length, finalTotalMinor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (!/^\d{6}$/.test(formData.postalCode.trim())) {
      setCheckoutError('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      setCheckoutError('Please enter a valid 10-digit mobile phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      // Capture UTM & Attribution parameters from URL
      const utmSource = searchParams.get('utm_source');
      const utmMedium = searchParams.get('utm_medium');
      const utmCampaign = searchParams.get('utm_campaign');
      const fbclid = searchParams.get('fbclid');

      const attributionParts = [
        utmSource ? `utm_source=${utmSource}` : '',
        utmMedium ? `utm_medium=${utmMedium}` : '',
        utmCampaign ? `utm_campaign=${utmCampaign}` : '',
        fbclid ? `fbclid=${fbclid}` : '',
      ].filter(Boolean);

      const combinedNotes = [
        formData.notes,
        attributionParts.length > 0 ? `[Attribution: ${attributionParts.join(', ')}]` : '',
      ].filter(Boolean).join(' | ');

      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestEmail: formData.email,
          guestPhone: formData.phone,
          guestName: formData.fullName,
          shippingAddress: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          couponCode: appliedCoupon?.code || null,
          notes: combinedNotes,
          paymentGateway: paymentMethod,
          clientItems: items.map((it) => ({
            productId: it.productId,
            variantId: it.variantId,
            quantity: it.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setCheckoutError(data.error || 'Failed to create order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Cache placed order in sessionStorage for zero-latency receipt & Pixel tracking
      if (typeof window !== 'undefined' && data.orderNumber) {
        try {
          sessionStorage.setItem(
            `flirta_order_${data.orderNumber}`,
            JSON.stringify({
              orderNumber: data.orderNumber,
              totalMinor: data.totalOrderMinor || data.amountMinor || finalTotalMinor,
              subtotalMinor: subtotalMinor,
              shippingMinor: shippingMinor,
              discountMinor: discountMinor,
              isPartialCod: data.isPartialCod || paymentMethod === 'PARTIAL_COD',
              codBalanceMinor: data.codBalanceMinor,
              customerEmail: formData.email,
              customerPhone: formData.phone,
              customerName: formData.fullName,
              items: items.map((it) => ({
                productId: it.productId,
                variantId: it.variantId,
                quantity: it.quantity,
                titleSnapshot: it.title,
                variantNameSnapshot: it.variantName,
                unitPriceMinor: it.unitPriceMinor,
                totalMinor: it.unitPriceMinor * it.quantity,
                imageSnapshot: it.image,
              })),
            })
          );
        } catch {
          // ignore
        }
      }

      // Open Direct UPI QR & Payment Modal
      if (data.upi) {
        setActiveUpiOrder({
          orderNumber: data.orderNumber,
          amountMinor: data.amountMinor,
          totalOrderMinor: data.totalOrderMinor,
          isPartialCod: data.isPartialCod,
          codBalanceMinor: data.codBalanceMinor,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          upiPayload: data.upi,
        });
        return;
      }

      // Direct COD order completion fallback
      if (data.gateway === 'COD' || (!data.upi && data.orderNumber)) {
        router.push(
          `/order-success?orderNumber=${encodeURIComponent(data.orderNumber)}&gateway=COD&email=${encodeURIComponent(formData.email)}`
        );
        return;
      }

      setCheckoutError('Payment gateway could not be initialized.');
    } catch (err) {
      console.error('Order creation error:', err);
      setCheckoutError('Network error while initiating checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#D9232D] mb-3" />
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Loading your bag...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your Bag is Empty</h2>
        <p className="text-xs text-gray-500 mb-6">Add architectural pieces to your cart before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="py-2.5 px-6 rounded-full bg-[#D9232D] text-white text-xs font-bold"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFBFD] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Checkout Header */}
        <div className="mb-10 text-center max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#D9232D] uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Studio Checkout</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Express Delivery & Payment
          </h1>
        </div>

        {checkoutError && (
          <div className="max-w-4xl mx-auto mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{checkoutError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact and Shipping Address Form (7 Cols) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleInitiatePayment} id="checkout-form" className="space-y-6">
              {/* Customer Details */}
              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center justify-between">
                  <span>1. Contact Information</span>
                  {!user && (
                    <span className="text-xs font-normal text-gray-400">
                      Guest checkout enabled
                    </span>
                  )}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Arjun Mehta"
                      className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D9232D] focus:border-[#D9232D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="arjun@studio.com"
                      className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D9232D] focus:border-[#D9232D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mobile Phone (for Courier Dispatch) *
                    </label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98200 12345"
                      className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D9232D] focus:border-[#D9232D]"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900 mb-4">
                  2. Shipping Destination
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Street Address / Studio Suite *
                    </label>
                    <input
                      type="text"
                      required
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="402, Lotus Grandeur, 100 Feet Road"
                      className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D9232D] focus:border-[#D9232D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Apartment, floor, or landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      placeholder="Indiranagar, Near Metro"
                      className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D9232D]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Bengaluru"
                        className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">State *</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-300"
                      >
                        <option value="Karnataka">Karnataka</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi NCR</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Other">Other State</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">PIN Code *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="560038"
                        className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-300 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Leave with concierge or ring studio bell."
                      className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#D9232D]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method: Choose between Full UPI or Partial COD */}
              <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">
                      3. Select Payment Option
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Zero convenience fees • Instant confirmation
                    </p>
                  </div>
                  <span className="text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dynamic QR</span>
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Option 1: Full Payment via UPI */}
                  <div
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'UPI'
                        ? 'border-[#D9232D] bg-[#FFF8F8]/60 shadow-xs ring-1 ring-[#D9232D]/10'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          paymentMethod === 'UPI' ? 'border-[#D9232D]' : 'border-gray-300'
                        }`}
                      >
                        {paymentMethod === 'UPI' && (
                          <div className="w-2 h-2 rounded-full bg-[#D9232D]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
                              ⚡ Prepaid UPI (Recommended)
                            </span>
                            <span className="text-[9.5px] uppercase font-bold tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded">
                              Save ₹99 COD Fee
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-extrabold text-[#D9232D] shrink-0">
                            {formatCurrency(finalTotalMinor)}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-gray-600 leading-relaxed">
                          Pay flat <strong>₹999</strong> via dynamic UPI QR code. <strong>Free 3–5 Day Express Air Delivery</strong>, priority 24h studio packaging, zero platform fees.
                        </p>
                        <div className="mt-2 text-[10.5px] text-emerald-700 font-semibold flex items-center gap-1.5 flex-wrap">
                          <Smartphone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Instant auto-verification via GPay, PhonePe, Paytm, CRED &amp; all UPI apps</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Partial COD (₹249 Advance via UPI) */}
                  <div
                    onClick={() => setPaymentMethod('PARTIAL_COD')}
                    className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'PARTIAL_COD'
                        ? 'border-[#D9232D] bg-[#FFF8F8]/60 shadow-xs ring-1 ring-[#D9232D]/10'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          paymentMethod === 'PARTIAL_COD' ? 'border-[#D9232D]' : 'border-gray-300'
                        }`}
                      >
                        {paymentMethod === 'PARTIAL_COD' && (
                          <div className="w-2 h-2 rounded-full bg-[#D9232D]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-gray-900">
                              Partial COD
                            </span>
                            <span className="text-[9.5px] uppercase font-bold tracking-wider bg-amber-600 text-white px-2 py-0.5 rounded">
                              Pay ₹249 Advance
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-extrabold text-[#D9232D] shrink-0">
                            ₹249 Now + {formatCurrency(Math.max(0, finalTotalMinor - 24900))} Doorstep
                          </span>
                        </div>
                        <p className="text-[11.5px] text-gray-600 leading-relaxed">
                          Pay ₹249 advance now via UPI QR to reserve your piece. Pay remaining balance of {formatCurrency(Math.max(0, finalTotalMinor - 24900))} in cash or UPI when courier delivers to your hands (Total {formatCurrency(finalTotalMinor)} with zero extra fees).
                        </p>

                        {/* Clean 2-Row Breakdown Box */}
                        <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] space-y-1">
                          <div className="flex items-center justify-between text-amber-900">
                            <span className="font-medium flex items-center gap-1">
                              <Zap className="w-3 h-3 text-[#D9232D]" /> Advance Reservation Fee:
                            </span>
                            <strong className="font-bold text-[#D9232D]">₹249.00</strong>
                          </div>
                          <div className="flex items-center justify-between text-amber-900 pt-1 border-t border-amber-500/15">
                            <span className="font-medium flex items-center gap-1">
                              <Truck className="w-3 h-3 text-amber-700" /> Balance on Doorstep:
                            </span>
                            <strong className="font-bold text-gray-900">{formatCurrency(Math.max(0, finalTotalMinor - 24900))}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Action in Brand Red */}
              {checkoutError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 sm:py-4 px-5 rounded-2xl bg-[#D9232D] hover:bg-[#b91c1c] active:scale-[0.98] transition-all text-white shadow-lg shadow-[#D9232D]/20 disabled:opacity-50 cursor-pointer flex flex-col items-center justify-center gap-0.5 select-none touch-manipulation"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Generating Exact Amount UPI QR...</span>
                  </div>
                ) : paymentMethod === 'PARTIAL_COD' ? (
                  <>
                    <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold">
                      <Lock className="w-4 h-4 text-white/90" />
                      <span>Pay ₹249 Advance via UPI</span>
                    </div>
                    <span className="text-[11px] text-white/85 font-medium">
                      Balance {formatCurrency(Math.max(0, finalTotalMinor - 24900))} on Doorstep Delivery
                    </span>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm sm:text-base font-bold">
                    <Lock className="w-4 h-4 text-white/90" />
                    <span>Proceed to UPI Payment • {formatCurrency(finalTotalMinor)}</span>
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Right: Order Summary Breakdown (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900 mb-4">
                  Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h3>

                {/* Items List */}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1 divide-y divide-gray-100 scrollbar-thin">
                  {items.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-200">
                        {item.image && (
                          <Image src={item.image} alt={item.title} fill className="object-cover" sizes="60px" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-gray-900 truncate">{item.title}</h4>
                        {item.variantName && (
                          <p className="text-[11px] text-gray-500">{item.variantName} × {item.quantity}</p>
                        )}
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        {formatCurrency(item.totalMinor)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="mt-6 pt-5 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. LAUNCH10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 py-2 px-3 text-xs uppercase tracking-wider rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#D9232D]"
                    />
                    <button
                      type="button"
                      onClick={() => validateCoupon(couponCode)}
                      disabled={isValidatingCoupon || !couponCode.trim()}
                      className="py-2 px-4 rounded-lg bg-[#D9232D] text-white text-xs font-bold hover:bg-[#b91c1c] disabled:opacity-50 transition-colors"
                    >
                      {isValidatingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-600 font-medium mt-1">{couponError}</p>}
                  {appliedCoupon && (
                    <div className="mt-2 text-xs text-emerald-700 font-semibold flex justify-between items-center bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Coupon {appliedCoupon.code} applied
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedCoupon(null);
                          setCouponCode('');
                        }}
                        className="text-[10px] text-gray-400 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Calculations */}
                <div className="mt-6 pt-5 border-t border-gray-200 space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotalMinor)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Promotional Discount</span>
                      <span>-{formatCurrency(discountMinor)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Studio Insured Express Delivery</span>
                    <span className="font-bold text-emerald-700">{shippingMinor === 0 ? 'FREE' : formatCurrency(shippingMinor)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Payable Total</span>
                    <span className="text-base text-[#D9232D]">{formatCurrency(finalTotalMinor)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Assurances */}
              <div className="p-4 rounded-2xl bg-[#FFF5F6] border border-[#D9232D]/15 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D9232D] flex-shrink-0" />
                  <span>0% Fee Direct UPI • 256-bit Bank Grade Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#D9232D] flex-shrink-0" />
                  <span>Express courier tracking dispatched within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct UPI Modal Overlay */}
      {activeUpiOrder && (
        <UpiPaymentModal
          orderNumber={activeUpiOrder.orderNumber}
          amountMinor={activeUpiOrder.amountMinor}
          totalOrderMinor={activeUpiOrder.totalOrderMinor}
          isPartialCod={activeUpiOrder.isPartialCod}
          codBalanceMinor={activeUpiOrder.codBalanceMinor}
          customerEmail={activeUpiOrder.customerEmail}
          customerPhone={activeUpiOrder.customerPhone}
          upiPayload={activeUpiOrder.upiPayload}
          onClose={() => setActiveUpiOrder(null)}
        />
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-gray-400">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
