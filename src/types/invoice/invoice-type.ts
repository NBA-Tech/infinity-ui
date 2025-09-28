import { OrderType } from "../order/order-type";

export interface InvoiceHtmlInfo {
  key:string;
  section:string;
}
export interface BillingInfo {
  name: string;
  email: string;
  mobileNumber: string;
}

export interface InvoiceItem {
  itemId: string;           // Optional: link to Service/Package
  itemName: string;
  itemType:OrderType
  quantity: number;         // total quantity (e.g., 20)
  unitPrice: number;        // price per unit
  total: number;            // quantity * unitPrice
  quantityPaying: number;     // how many units paid
  amountPaying: number;        // quantityPaid * unitPrice
}

export interface Invoice {
  invoiceId: string;
  orderId: string;           // Link to Order
  orderName: string;
  customerId: string;        // Link to Customer
  userId: string;            // Link to User
  invoiceDate: Date;
  paymentType: string;
  dueDate: Date;
  billingInfo: BillingInfo;
  totalAmount: number;
  amoutPaid: number;
  quotationHtmlInfo?: InvoiceHtmlInfo[]
}
