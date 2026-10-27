/**
 * Single source of truth for all statutory, corporate, and legal entity details.
 * Any missing real-world value is maintained as a clearly marked placeholder here.
 */

export const LEGAL_CONFIG = {
  // Corporate Entity
  LEGAL_ENTITY_NAME: '[PLACEHOLDER: Legal Business Entity Name, e.g. Flirta Network Private Limited]',
  GSTIN: '[PLACEHOLDER: GSTIN Number, e.g. 07AAAAA0000A1Z5]',
  REGISTERED_ADDRESS: '[PLACEHOLDER: Complete Registered Corporate Office Address, Building, Street, City, State, PIN]',

  // Consumer Protection (E-Commerce) Rules, 2020: Grievance Redressal
  GRIEVANCE_OFFICER_NAME: '[PLACEHOLDER: Grievance Officer Full Name]',
  GRIEVANCE_EMAIL: 'grievance@flirta.network',
  GRIEVANCE_PHONE: '[PLACEHOLDER: Grievance Officer Direct Phone Number, e.g. +91 76004 09399]',
  GRIEVANCE_DESK_HOURS: 'Monday to Saturday, 10:00 AM – 6:00 PM IST',

  // Regulatory & Certification
  // If empty or null, system defaults to "12V 2A power adapter" without claiming registration.
  BIS_REG_NO: '',

  // Legal Jurisdiction for Dispute Resolution
  JURISDICTION: '[PLACEHOLDER: Designated Court Jurisdiction City & State, e.g. New Delhi, India]',

  // Customer Care Contact
  CARE_EMAIL: 'care@flirta.network',
  CARE_PHONE: '+91 76004 09399',
  CARE_HOURS: 'Mon–Sat, 10 AM–6 PM IST',
} as const;

export type LegalConfig = typeof LEGAL_CONFIG;
