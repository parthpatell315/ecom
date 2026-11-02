/**
 * Single source of truth for all statutory, corporate, and legal entity details.
 * Genuine, transparent business details for Flirta by WhiteLayer (flirta.network).
 */

export const LEGAL_CONFIG = {
  // Corporate Entity Details
  LEGAL_ENTITY_NAME: 'Flirta Studio (Operated by Parth Patel)',
  GSTIN: 'Exempted under Section 22 of CGST Act (Turnover below threshold)',
  IS_GST_REGISTERED: false,
  REGISTERED_ADDRESS: 'Flirta Studio, S.G. Highway, Bodakdev, Ahmedabad, Gujarat - 380054, India',

  // Consumer Protection (E-Commerce) Rules, 2020: Grievance Redressal
  GRIEVANCE_OFFICER_NAME: 'Parth Patel (Head of Operations)',
  GRIEVANCE_EMAIL: 'grievance@flirta.network',
  GRIEVANCE_PHONE: '+91 76004 09399',
  GRIEVANCE_DESK_HOURS: 'Monday to Saturday, 10:00 AM – 6:00 PM IST',

  // Regulatory & Power Specs
  POWER_ADAPTER_SPEC: 'Standard Indian 2-Pin 220V/12V Power Adapter Included',
  BIS_REG_NO: '',

  // Legal Jurisdiction for Dispute Resolution
  JURISDICTION: 'Ahmedabad, Gujarat, India',

  // Customer Care Contact
  CARE_EMAIL: 'care@flirta.network',
  CARE_PHONE: '+91 76004 09399',
  CARE_HOURS: 'Mon–Sat, 10 AM–6 PM IST',
} as const;

export type LegalConfig = typeof LEGAL_CONFIG;
