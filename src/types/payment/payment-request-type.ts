export interface PaymentRequestModel {
  amount: number;              // Double amount
  currency: string;            // String currency
  email: string;               // String email
  phone: string;               // String phone
  referenceId: string;         // String referenceId
  description: string;         // String description
  expiresAt: string;           // String (ISO date)
  notifyUser: boolean;         // boolean notifyUser
  returnUrl: string;           // String returnUrl
}
