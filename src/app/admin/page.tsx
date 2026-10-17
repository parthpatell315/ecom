'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/currency';
import {
  ShieldCheck,
  Package,
  Layers,
  TrendingUp,
  AlertTriangle,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Edit2,
  Save,
  X,
  ExternalLink,
  Loader2,
  Lock,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminPage() {
  const { user, isLoading: isAuthLoading, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Edit Tracking Modal state
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newTrackingNumber, setNewTrackingNumber] = useState('');
  const [newTrackingCarrier, setNewTrackingCarrier] = useState('Blue Dart Air');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  // Edit Product Stock Modal state
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newStockCount, setNewStockCount] = useState<number>(0);
  const [newPriceRupees, setNewPriceRupees] = useState<number>(0);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [overviewRes, ordersRes, productsRes] = await Promise.all([
        fetch('/api/admin/overview'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/products'),
      ]);

      const [overviewData, ordersData, productsData] = await Promise.all([
        overviewRes.json(),
        ordersRes.json(),
        productsRes.json(),
      ]);

      if (overviewData.success) setStats(overviewData.stats);
      if (ordersData.success) setOrders(ordersData.orders || []);
      if (productsData.success) setProducts(productsData.products || []);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchAdminData();
    }
  }, [user]);

  if (isAuthLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-neutral-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  // RBAC Access Guard
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto py-28 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Restricted Administrative Console
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Access requires authenticated administrative credentials. Please sign in with your operations staff account.
        </p>
        <button
          onClick={openAuthModal}
          className="py-2.5 px-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium"
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  // Update order status & tracking
  const handleSaveOrderUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    setIsUpdatingOrder(true);
    try {
      const res = await fetch(`/api/admin/orders/${editingOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: newTrackingNumber.trim() || null,
          trackingCarrier: newTrackingCarrier.trim() || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingOrder(null);
        await fetchAdminData();
      }
    } catch (err) {
      console.error('Failed to update order:', err);
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  // Update product stock & price
  const handleSaveProductUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsUpdatingProduct(true);
    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockCount: newStockCount,
          priceMinor: Math.round(newPriceRupees * 100),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingProduct(null);
        await fetchAdminData();
      }
    } catch (err) {
      console.error('Failed to update product:', err);
    } finally {
      setIsUpdatingProduct(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    const matchesSearch =
      !orderSearch.trim() ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.guestEmail?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.guestName?.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-black/[0.06] dark:border-white/[0.08] mb-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">flirta.network Command Center</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              OPERATIONS ACTIVE
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mt-1">
            Studio Admin Console
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Logged in as {user.name} ({user.email}) • Production Database Connected
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-full text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-1.5 px-4 rounded-full transition-all ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-[#1f1f1f] text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            KPI Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-1.5 px-4 rounded-full transition-all ${
              activeTab === 'orders'
                ? 'bg-white dark:bg-[#1f1f1f] text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Order Management ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-1.5 px-4 rounded-full transition-all ${
              activeTab === 'inventory'
                ? 'bg-white dark:bg-[#1f1f1f] text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Catalog & Stock ({products.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-neutral-400">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <span className="text-xs">Connecting to PostgreSQL engine...</span>
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-10 animate-fade-in">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Total Sales Revenue</span>
                  <p className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                    {formatCurrency(stats.totalRevenueMinor)}
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Verified Gateway Settlements</p>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Total Orders</span>
                  <p className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                    {stats.totalOrders}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1">{stats.confirmedOrders} confirmed orders</p>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Active Catalog</span>
                  <p className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                    {stats.productsCount} Pieces
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1">Lamps, Clocks, Calendars</p>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Low Stock Alerts</span>
                  <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">
                    {stats.lowStockCount}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1">Pieces with &le; 5 units</p>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Recent Studio Commissions</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-neutral-500 hover:text-black dark:hover:text-white font-medium"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-black/5 dark:border-white/5 text-neutral-400 pb-2">
                        <th className="py-2.5 font-medium">Order Reference</th>
                        <th className="py-2.5 font-medium">Customer</th>
                        <th className="py-2.5 font-medium">Items</th>
                        <th className="py-2.5 font-medium">Status</th>
                        <th className="py-2.5 font-medium">Total</th>
                        <th className="py-2.5 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                          <td className="py-3 font-mono font-medium text-neutral-900 dark:text-neutral-100">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3 text-neutral-700 dark:text-neutral-300">
                            <div>{ord.guestName || 'Guest'}</div>
                            <div className="text-[11px] text-neutral-400">{ord.guestEmail}</div>
                          </td>
                          <td className="py-3 text-neutral-500">{ord.items?.length || 0} pieces</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                            {formatCurrency(ord.totalMinor)}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                setEditingOrder(ord);
                                setNewStatus(ord.status);
                                setNewTrackingNumber(ord.trackingNumber || '');
                                setNewTrackingCarrier(ord.trackingCarrier || 'Blue Dart Air');
                              }}
                              className="py-1 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#121212] p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08]">
                <div className="relative flex-1 w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by order #, email, or customer..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  {['ALL', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        orderStatusFilter === st
                          ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                          : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Orders Table */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-black/5 dark:border-white/5 text-neutral-400 pb-2">
                      <th className="py-2.5 font-medium">Order Number</th>
                      <th className="py-2.5 font-medium">Date</th>
                      <th className="py-2.5 font-medium">Customer Details</th>
                      <th className="py-2.5 font-medium">Destination</th>
                      <th className="py-2.5 font-medium">Items</th>
                      <th className="py-2.5 font-medium">Status</th>
                      <th className="py-2.5 font-medium">Tracking</th>
                      <th className="py-2.5 font-medium">Total</th>
                      <th className="py-2.5 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                        <td className="py-3 font-mono font-medium text-neutral-900 dark:text-neutral-100">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 text-neutral-500 whitespace-nowrap">
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>
                        <td className="py-3 text-neutral-700 dark:text-neutral-300">
                          <p className="font-medium">{ord.guestName || 'Guest'}</p>
                          <p className="text-[11px] text-neutral-400">{ord.guestEmail}</p>
                          <p className="text-[11px] text-neutral-400 font-mono">{ord.guestPhone}</p>
                        </td>
                        <td className="py-3 text-neutral-500 max-w-[150px] truncate">
                          {ord.shippingAddress?.city}, {ord.shippingAddress?.state} ({ord.shippingAddress?.postalCode})
                        </td>
                        <td className="py-3 text-neutral-500">{ord.items?.length || 0}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              ord.status === 'DELIVERED'
                                ? 'bg-blue-500/10 text-blue-500'
                                : ord.status === 'SHIPPED'
                                ? 'bg-purple-500/10 text-purple-500'
                                : 'bg-emerald-500/10 text-emerald-500'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 font-mono text-neutral-500">
                          {ord.trackingNumber ? (
                            <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                              {ord.trackingNumber}
                            </span>
                          ) : (
                            <span className="text-neutral-400 text-[10px]">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 font-bold text-neutral-900 dark:text-neutral-100">
                          {formatCurrency(ord.totalMinor)}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setEditingOrder(ord);
                              setNewStatus(ord.status);
                              setNewTrackingNumber(ord.trackingNumber || '');
                              setNewTrackingCarrier(ord.trackingCarrier || 'Blue Dart Air');
                            }}
                            className="py-1 px-3 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[11px] font-medium hover:bg-black dark:hover:bg-neutral-100 transition-colors"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATALOG & INVENTORY ADJUSTMENTS */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-black/5 dark:border-white/5 text-neutral-400 pb-2">
                      <th className="py-2.5 font-medium">Piece Title</th>
                      <th className="py-2.5 font-medium">SKU</th>
                      <th className="py-2.5 font-medium">Category</th>
                      <th className="py-2.5 font-medium">Variants</th>
                      <th className="py-2.5 font-medium">Stock Count</th>
                      <th className="py-2.5 font-medium">Selling Price</th>
                      <th className="py-2.5 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                        <td className="py-3 flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                            {p.images && p.images[0]?.url && (
                              <Image src={p.images[0].url} alt={p.title} fill className="object-cover" sizes="40px" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-neutral-100">{p.title}</p>
                            <p className="text-[11px] text-neutral-400">{p.tagline}</p>
                          </div>
                        </td>
                        <td className="py-3 font-mono text-neutral-500">{p.sku}</td>
                        <td className="py-3 text-neutral-600 dark:text-neutral-400">{p.category?.name}</td>
                        <td className="py-3 text-neutral-500">{p.variants?.length || 0} finishes</td>
                        <td className="py-3">
                          <span
                            className={`font-semibold ${
                              p.stockCount <= 5 ? 'text-amber-500' : 'text-emerald-500'
                            }`}
                          >
                            {p.stockCount} in batch
                          </span>
                        </td>
                        <td className="py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                          {formatCurrency(p.priceMinor)}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setNewStockCount(p.stockCount);
                              setNewPriceRupees(Math.round(p.priceMinor / 100));
                            }}
                            className="py-1 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1.5 ml-auto"
                          >
                            <Edit2 className="w-3 h-3" />
                            Adjust
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL 1: EDIT ORDER STATUS & TRACKING */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setEditingOrder(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-6 shadow-2xl z-10 animate-fade-in text-xs">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-black/5 dark:border-white/5">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Update Commission #{editingOrder.orderNumber}
                </h3>
                <p className="text-[11px] text-neutral-400">Customer: {editingOrder.guestName} ({editingOrder.guestEmail})</p>
              </div>
              <button onClick={() => setEditingOrder(null)} className="text-neutral-400 hover:text-black dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOrderUpdate} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Lifecycle Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING (In Studio 3D Print)</option>
                  <option value="SHIPPED">SHIPPED (With Courier)</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Airway Bill / Tracking Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. BD-8492049102"
                  value={newTrackingNumber}
                  onChange={(e) => setNewTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 font-mono rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Courier Carrier
                </label>
                <input
                  type="text"
                  value={newTrackingCarrier}
                  onChange={(e) => setNewTrackingCarrier(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="py-2 px-4 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingOrder}
                  className="py-2 px-5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium"
                >
                  {isUpdatingOrder ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PRODUCT STOCK & PRICE */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setEditingProduct(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-6 shadow-2xl z-10 animate-fade-in text-xs">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-black/5 dark:border-white/5">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Adjust Piece: {editingProduct.title}
                </h3>
                <p className="text-[11px] text-neutral-400">SKU: {editingProduct.sku}</p>
              </div>
              <button onClick={() => setEditingProduct(null)} className="text-neutral-400 hover:text-black dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProductUpdate} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Batch Stock Units Available
                </label>
                <input
                  type="number"
                  min={0}
                  value={newStockCount}
                  onChange={(e) => setNewStockCount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Selling Price (₹ INR)
                </label>
                <input
                  type="number"
                  min={1}
                  value={newPriceRupees}
                  onChange={(e) => setNewPriceRupees(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-semibold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="py-2 px-4 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingProduct}
                  className="py-2 px-5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium"
                >
                  {isUpdatingProduct ? 'Updating...' : 'Save Stock & Price'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
