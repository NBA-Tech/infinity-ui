import { OrderType } from "../order/order-type";

export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";


export interface InvoiceHtmlInfo {
  key:string;
  section:string;
}
export interface BillingInfo {
  name: string;
  email: string;
  mobileNumber: string;
  address: string;
}

export interface InvoiceItem {
  itemId: string;           // Optional: link to Service/Package
  itemName: string;
  itemType:OrderType
  quantity: number;         // total quantity (e.g., 20)
  unitPrice: number;        // price per unit
  total: number;            // quantity * unitPrice
  quantityPaid: number;     // how many units paid
  quantityRemaining: number;// auto = quantity - quantityPaid
  totalPaid: number;        // quantityPaid * unitPrice
}

export interface Invoice {
  invoiceId: string;
  orderId: string;           // Link to Order
  customerId: string;        // Link to Customer
  invoiceDate: Date;
  paymentType: string;
  dueDate: Date;
  status: InvoiceStatus;
  billingInfo: BillingInfo;
  items: InvoiceItem[];
  totalAmount: number;
  amountPaid: number;
  invoiceHtmlInfo?: InvoiceHtmlInfo[]
}
