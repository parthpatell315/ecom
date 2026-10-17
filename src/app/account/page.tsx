'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/currency';
import Link from 'next/link';
import Image from 'next/image';
import {
  User as UserIcon,
  Package,
  MapPin,
  Clock,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export default function AccountPage() {
  const { user, isLoading, openAuthModal, logout } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setProfileData(data.user);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingOrders(false));
    } else {
      setLoadingOrders(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-neutral-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mx-auto mb-4 text-neutral-400">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Sign in to your Account</h2>
        <p className="text-xs text-neutral-500 mb-6">
          Access your architectural commissions, order tracking numbers, and saved addresses.
        </p>
        <button
          onClick={openAuthModal}
          className="py-2.5 px-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium hover:bg-black dark:hover:bg-neutral-100 transition-colors"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-black/[0.06] dark:border-white/[0.08] mb-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Customer Sanctuary</span>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mt-1">
            {profileData?.name || user.name}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">{user.email}</p>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="py-2 px-4 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium border border-amber-500/20 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </Link>
          )}

          <button
            onClick={logout}
            className="py-2 px-4 rounded-full border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Orders History (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              Order Commissions & Tracking
            </h2>
            <Link href="/tracking" className="text-xs text-neutral-500 hover:text-black dark:hover:text-white">
              Public Tracking Tool →
            </Link>
          </div>

          {loadingOrders ? (
            <div className="py-12 text-center text-xs text-neutral-400">Loading order history...</div>
          ) : !profileData?.orders || profileData.orders.length === 0 ? (
            <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-black/5 dark:border-white/5 text-center">
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">No orders yet</p>
              <p className="text-xs text-neutral-500 mt-1 mb-4">You have not commissioned any architectural pieces yet.</p>
              <Link
                href="/shop"
                className="py-2 px-4 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium"
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {profileData.orders.map((ord: any) => (
                <div
                  key={ord.id}
                  className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/5 dark:border-white/5 text-xs">
                    <div>
                      <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{ord.orderNumber}</span>
                      <span className="text-neutral-400 ml-2">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {ord.status}
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {formatCurrency(ord.totalMinor)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Snapshot */}
                  <div className="space-y-3">
                    {ord.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                            {item.imageSnapshot && (
                              <Image src={item.imageSnapshot} alt={item.titleSnapshot} fill className="object-cover" sizes="40px" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-800 dark:text-neutral-200">{item.titleSnapshot}</p>
                            {item.variantNameSnapshot && (
                              <p className="text-[11px] text-neutral-400">{item.variantNameSnapshot} × {item.quantity}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-neutral-600 dark:text-neutral-400 font-mono">
                          {formatCurrency(item.totalMinor)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tracking reference if shipped */}
                  {ord.trackingNumber && (
                    <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs bg-neutral-50 dark:bg-neutral-900/60 p-2.5 rounded-xl">
                      <div>
                        <span className="text-neutral-400 block text-[10px]">Courier Tracking ID:</span>
                        <span className="font-mono text-neutral-800 dark:text-neutral-200">{ord.trackingNumber} ({ord.trackingCarrier || 'Blue Dart'})</span>
                      </div>
                      <Link
                        href={`/tracking?orderNumber=${ord.orderNumber}`}
                        className="text-neutral-900 dark:text-white font-medium hover:underline flex items-center gap-1"
                      >
                        Track <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Saved Addresses (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            Saved Studio Addresses
          </h2>

          <div className="space-y-4">
            {profileData?.addresses && profileData.addresses.length > 0 ? (
              profileData.addresses.map((addr: any) => (
                <div
                  key={addr.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs text-xs space-y-1"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{addr.fullName}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-semibold text-[#c5a059] uppercase tracking-wider">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400">{addr.addressLine1}</p>
                  {addr.addressLine2 && <p className="text-neutral-600 dark:text-neutral-400">{addr.addressLine2}</p>}
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  <p className="text-neutral-500 pt-2 font-mono">{addr.phone}</p>
                </div>
              ))
            ) : (
              <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-black/5 dark:border-white/5 text-xs text-neutral-500 text-center">
                Addresses provided during checkout will be preserved here for 1-click reordering.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
