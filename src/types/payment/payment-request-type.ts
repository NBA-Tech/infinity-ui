// src/models/payment/PaymentRequestModel.ts

export interface PaymentRequestModel {
    linkId?: string; // custom link ID (like "my_link_id_001")
    linkAmount: number; // payment amount
    linkCurrency?: string; // e.g., "INR"
    linkPurpose: string; // description (e.g., "Payment for Service X")
  
    linkExpiryTime?: string; // ISO date string
    linkAutoReminders?: boolean; // send reminders
    linkPartialPayments?: boolean; // allow partial payments
    linkMinimumPartialAmount?: number; // minimum partial payment amount
  
    linkNotes?: Record<string, string>; // optional key-value pairs
    orderSplits?: Record<string, any>; // optional vendor split
  
    linkMeta?: Record<string, any>; // notify_url, return_url, etc.
    linkNotify?: Record<string, any>; // email/sms notify
  
    customerDetails?: Record<string, any>; // email, phone, name, id
  }
  