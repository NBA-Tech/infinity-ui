export enum PAYMENT_STATUS {
    paid = "paid"
  }
  
  export enum PAYMENT_METHOD {
    CARD = "CARD",
    UPI = "UPI",
    NETBANKING = "NETBANKING",
    WALLET = "WALLET",
    CASHFREE = "CASHFREE",
    OTHER = "OTHER",
  }
  
  export interface PaymentModel {
    paymentId: string; // internal ID (e.g., PAY_12345)
    userId: string;
    amount: number; // BigDecimal → number in TS
    currency: string;
    linkId?: string; // optional, as sometimes links may not exist
    linkUrl?: string;
    cfPaymentId?: string;
    referenceId?: string;
    paymentStatus: PAYMENT_STATUS;
    paymentMethod: PAYMENT_METHOD;
    createdDate: string | Date;
    updatedDate?: string | Date;
    extraData?: Record<string, any>; // same as Map<String,Object> in Java
  }
  