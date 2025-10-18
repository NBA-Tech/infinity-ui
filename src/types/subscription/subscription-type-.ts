
export interface SubscriptionModel {
  subscriptionId: string;
  userId: string;
  planDetails: Plan;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatus;
}

export interface Plan {
  planName: string;
  planDescription: string;
  durationInDays: number;
  price: number;
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
  TRIAL = "TRIAL",
}
