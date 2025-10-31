
export interface SubscriptionModel {
  subscriptionId: string;
  userId: string;
  planDetails: Plan;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatus;
  isTrialUsed: boolean;
}

export interface Plan {
  planId: string;
  planName: string;
  planDescription: string;
  durationInDays: number;
  price: number;
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}
