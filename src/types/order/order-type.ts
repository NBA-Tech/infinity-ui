
// Order Basic Info

import { ServiceInfo } from "../offering/offering-type";

export enum OrderStatus {
  NEW = 'NEW',
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

export interface StatusHistory{
  status:OrderStatus,
  changedAt:Date
}

export interface QuotaionHtmlInfo{
  key:string;
  section:string;
}

export interface OfferingInfo {
  orderType: OrderType;
  packageId?: string;
  services?: ServiceInfo[]
}
export interface OrderBasicInfo {
  customerID: string;
  pointOfContact: string;
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
  status: OrderStatus;
  totalPrice: number;
  updatedDate?: Date;
  orderBasicInfo: OrderBasicInfo;
  eventInfo: EventInfo;
  offeringInfo: OfferingInfo;
  quotationHtmlInfo?: QuotaionHtmlInfo[]
  statusHistory?:StatusHistory[]
  htmlCode?:string

}
