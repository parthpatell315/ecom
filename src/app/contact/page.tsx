'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-neutral-800 dark:text-neutral-200">
      <div className="mb-12 text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Studio Concierge</span>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mt-1">
          Contact the Studio
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          Questions regarding custom architectural pieces, bulk creator desk setups, or order tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Contact Info (5 Cols) */}
        <div className="md:col-span-5 space-y-6 text-xs">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Studio Headquarters</h3>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#c5a059] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">flirta.network Studio</p>
                <p className="text-neutral-500 mt-0.5">Indiranagar Creative Tech Corridor, Bengaluru, Karnataka 560038, India</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
              <div>
                <p className="font-mono text-neutral-900 dark:text-white">care@flirta.network</p>
                <p className="text-[11px] text-neutral-400">Response within 24 hours</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
              <div>
                <p className="font-mono text-neutral-900 dark:text-white">+91 98765 43210</p>
                <p className="text-[11px] text-neutral-400">Mon - Sat, 10am - 7pm IST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form (7 Cols) */}
        <div className="md:col-span-7">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-base font-semibold text-neutral-900 dark:text-white">Message Dispatched</h4>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Thank you for reaching out. Our design concierge team will respond directly to your email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Arjun Mehta"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="arjun@example.com"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Custom studio commission inquiry"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can our design engineering studio assist you?"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-black dark:hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2"
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
