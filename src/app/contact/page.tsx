'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { LEGAL_CONFIG } from '@/config/legal';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-neutral-800">
      <div className="mb-12 text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#E61E2A] font-semibold">Studio Concierge</span>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mt-1">
          Contact the Studio
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          Questions regarding ambient illumination pieces, order tracking, or corporate studio gifts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Contact Info (5 Cols) */}
        <div className="md:col-span-5 space-y-6 text-xs">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-neutral-900">Registered Office</h2>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#E61E2A] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-neutral-900">{LEGAL_CONFIG.LEGAL_ENTITY_NAME}</p>
                <p className="text-neutral-500 mt-0.5">{LEGAL_CONFIG.REGISTERED_ADDRESS}</p>
                <p className="text-[11px] text-neutral-400 mt-1">GSTIN: {LEGAL_CONFIG.GSTIN}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#E61E2A] flex-shrink-0" />
              <div>
                <a href={`mailto:${LEGAL_CONFIG.CARE_EMAIL}`} className="font-mono text-neutral-900 hover:text-[#E61E2A] transition-colors">
                  {LEGAL_CONFIG.CARE_EMAIL}
                </a>
                <p className="text-[11px] text-neutral-400">Response within 24 hours</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#E61E2A] flex-shrink-0" />
              <div>
                <p className="font-mono text-neutral-900">{LEGAL_CONFIG.CARE_PHONE}</p>
                <p className="text-[11px] text-neutral-400">{LEGAL_CONFIG.CARE_HOURS}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form (7 Cols) */}
        <div className="md:col-span-7">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-base font-semibold text-neutral-900">Message Dispatched</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Thank you for reaching out. Our support concierge will respond directly to your email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Arjun Mehta"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="arjun@example.com"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Order inquiry or custom lighting commission"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can our customer care team assist you today?"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
