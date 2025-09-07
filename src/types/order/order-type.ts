
// Order Basic Info
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
  updatedDate?: Date;
  orderBasicInfo: OrderBasicInfo;
  eventInfo: EventInfo;
}
