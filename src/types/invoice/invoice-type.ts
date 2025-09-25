export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

export interface BillingInfo {
  name: string;
  email: string;
  mobileNumber: string;
  address: string;
}

export interface InvoiceItem {
  itemId: string;           // Optional: link to Service/Package
  description: string;      // e.g., "Camera Rental"
  quantity: number;         // total quantity (e.g., 20)
  unitPrice: number;        // price per unit
  total: number;            // quantity * unitPrice
  quantityPaid: number;     // how many units paid
  quantityRemaining: number;// auto = quantity - quantityPaid
}

export interface PaymentItem {
  itemId: string;           // link to InvoiceItem
  itemDescription: string;  // redundant but useful for reporting
  quantityPaid: number;     // e.g., 10
  amountPaid: number;       // qty * unitPrice
}

export interface PaymentHistory {
  paymentDate: Date;
  amount: number;
  paymentMethod: string;    // e.g., CASH, UPI, CARD
  transactionId: string;
  paymentItems: PaymentItem[];
}

export interface Invoice {
  invoiceId: string;
  orderId: string;           // Link to Order
  customerId: string;        // Link to Customer
  invoiceDate: Date;
  dueDate: Date;
  status: InvoiceStatus;
  billingInfo: BillingInfo;
  items: InvoiceItem[];
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  paymentHistory: PaymentHistory[];
}
