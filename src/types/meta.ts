/**
 * Type definitions for Meta Pixel & Conversions API (CAPI) Integration
 * Target Pixel / Dataset ID: 1429779105956526
 */

export type MetaStandardEventName =
  | 'PageView'
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase';

export type MetaCustomEventName =
  | 'PartialPayment'
  | string;

export type MetaEventName = MetaStandardEventName | MetaCustomEventName;

export interface MetaContentItem {
  id: string;
  quantity: number;
  item_price: number;
  title?: string;
  brand?: string;
  category?: string;
}

export interface MetaUserData {
  em?: string[]; // SHA-256 hashed lowercase emails
  ph?: string[]; // SHA-256 hashed phone numbers with country code
  fn?: string[]; // SHA-256 hashed first names
  ln?: string[]; // SHA-256 hashed last names
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string; // _fbp cookie value
  fbc?: string; // _fbc cookie value
  external_id?: string[]; // SHA-256 hashed customer / order ID
  country?: string[]; // 'in' hashed
}

export interface MetaCustomData {
  value?: number;
  currency?: string;
  order_id?: string;
  payment_type?: 'partial' | 'full';
  content_name?: string;
  content_category?: string;
  content_type?: 'product' | 'product_group';
  content_ids?: string[];
  contents?: MetaContentItem[];
  num_items?: number;
  status?: string;
  payment_id?: string;
  installment_number?: number;
  remaining_balance?: number;
  total_order_value?: number;
  [key: string]: any;
}

export interface MetaServerEventPayload {
  event_name: MetaEventName;
  event_time: number; // Unix timestamp in seconds
  event_id: string; // Deduplication ID shared between browser and server
  event_source_url: string;
  action_source: 'website' | 'system_generated' | 'other';
  user_data: MetaUserData;
  custom_data?: MetaCustomData;
  opt_out?: boolean;
}

export interface MetaCapiResponse {
  events_received?: number;
  messages?: string[];
  fbtrace_id?: string;
  error?: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
}

export interface MetaCapiResult {
  success: boolean;
  eventId: string;
  eventName: string;
  status: 'SENT' | 'DUPLICATE_SKIPPED' | 'FAILED' | 'DISABLED';
  eventsReceived?: number;
  error?: string;
  response?: any;
}
