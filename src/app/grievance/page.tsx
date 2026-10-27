import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, Phone, MapPin, Clock, FileText } from 'lucide-react';
import { LEGAL_CONFIG } from '@/config/legal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grievance Redressal — flirta.network',
  description: 'Designated Grievance Officer details and escalation mechanism under the Consumer Protection (E-Commerce) Rules, 2020.',
};

export default function GrievancePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-neutral-800">
      <div className="mb-10 text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#E61E2A] font-semibold">Statutory Compliance</span>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mt-1">
          Grievance Redressal Mechanism
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          Under Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm leading-relaxed">
        {/* Officer Card */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <ShieldCheck className="w-5 h-5 text-[#E61E2A]" />
            <h2 className="text-base font-semibold text-neutral-900">
              Designated Grievance Redressal Officer
            </h2>
          </div>

          <p className="text-neutral-600">
            In compliance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, the contact details of the Grievance Officer for <strong>{LEGAL_CONFIG.LEGAL_ENTITY_NAME}</strong> (operating flirta.network) are detailed below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block">Officer Name</span>
              <span className="text-sm font-semibold text-neutral-900 mt-0.5 block">{LEGAL_CONFIG.GRIEVANCE_OFFICER_NAME}</span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block">Direct Contact Email</span>
              <a href={`mailto:${LEGAL_CONFIG.GRIEVANCE_EMAIL}`} className="text-sm font-semibold text-[#E61E2A] hover:underline mt-0.5 block">
                {LEGAL_CONFIG.GRIEVANCE_EMAIL}
              </a>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block">Helpline / Phone</span>
              <span className="text-sm font-semibold text-neutral-900 mt-0.5 block">{LEGAL_CONFIG.GRIEVANCE_PHONE}</span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block">Office Hours</span>
              <span className="text-sm font-semibold text-neutral-900 mt-0.5 block">{LEGAL_CONFIG.GRIEVANCE_DESK_HOURS}</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block">Registered Corporate Office</span>
            <p className="text-xs text-neutral-700 mt-0.5 font-medium">{LEGAL_CONFIG.REGISTERED_ADDRESS}</p>
            <p className="text-xs text-neutral-500 mt-0.5">GSTIN: <span className="font-mono text-neutral-700">{LEGAL_CONFIG.GSTIN}</span></p>
          </div>
        </section>

        {/* Redressal Timelines */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#E61E2A]" />
            Redressal Process & Timelines
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-neutral-600">
            <li>
              <strong>Acknowledgement:</strong> The Grievance Officer will acknowledge the receipt of any consumer complaint within <strong>48 hours</strong> of receipt with a unique grievance ticket number.
            </li>
            <li>
              <strong>Resolution:</strong> The consumer grievance will be addressed and resolved within a period of <strong>one month (30 days)</strong> from the date of receipt of the complaint, as mandated by the E-Commerce Rules.
            </li>
            <li>
              <strong>First Line Support:</strong> For standard delivery tracking, order status, or pre-purchase inquiries, consumers may reach our general support desk at <a href={`mailto:${LEGAL_CONFIG.CARE_EMAIL}`} className="text-[#E61E2A] underline">{LEGAL_CONFIG.CARE_EMAIL}</a> for a faster response within 24 hours.
            </li>
          </ul>
        </section>

        {/* Applicable Law & Jurisdiction */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#E61E2A]" />
            Governing Law & Legal Jurisdiction
          </h2>
          <p className="text-neutral-600">
            Any dispute arising out of or related to purchases made on flirta.network shall be governed by and construed in accordance with the laws of the Republic of India. Subject to the grievance redressal mechanism outlined above, the courts at <strong>{LEGAL_CONFIG.JURISDICTION}</strong> shall have exclusive jurisdiction over all legal proceedings.
          </p>
        </section>
      </div>
    </div>
  );
}
