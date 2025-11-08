
// Order Basic Info

import { SERVICETYPE } from "../offering/offering-type";


export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED'
}

export enum OrderType {
  SERVICE = 'SERVICE',
  PACKAGE = 'PACKAGE'
}

export interface QuotaionHtmlInfo{
  key:string;
  section:string;
}

export interface ServiceInfo{
  id:string;
  name:string;
  value:number;
  price?:number;
  isCompleted?: boolean
  serviceType?:SERVICETYPE
}

export interface Deliverable {
  id: string;                  // unique id
  name: string;                // folder or file name
  fileUrl?: string;            // only if type === "file"
}

export interface OfferingInfo {
  orderType: OrderType;
  packageId?: string;
  packageName?: string;
  services?: ServiceInfo[]
  packagePrice?: number;
  isCompleted?: boolean
}
export interface OrderBasicInfo {
  customerID: string;
  specialInstructions: string;
}

// Event Info
export interface EventInfo {
  eventTitle: string;
  eventDate: Date;         // matches java.util.Date
  eventTime: string;       // kept as string
  eventLocation: string;
  numberOfHours: number;
  eventType: string;
  services: string[];
}

// Order Model
export interface OrderModel {
  userId: string;
  orderId?: string;
  createdDate?: Date;
  updatedDate?: Date;
  status: OrderStatus;
  totalPrice: number;
  orderBasicInfo: OrderBasicInfo;
  eventInfo: EventInfo;
  offeringInfo: OfferingInfo;
  quotationHtmlInfo?: QuotaionHtmlInfo[]
  deliverables?:Deliverable[]
  totalAmountCanPay:number

}
