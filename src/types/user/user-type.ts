import { AuthModel } from "../auth/auth-type";

export interface UserApiResponse{
  message: string;
  status: number;
  success: boolean;
  userInfo: UserModel
}

export interface UserModel {
  userId?: string;
  onboarded?: boolean;
  userBusinessInfo?: UserBusinessInfo;
  userBillingInfo?: UserBillingInfo;
  userAuthInfo?:AuthModel
  currencyIcon?:string
}

export interface UserBusinessInfo {
  companyName: string;
  companyLogoURL?: string;
  businessType: string;
  businessPhoneNumber?: string;
  businessEmail?: string;
  websiteURL?: string;
  termsAndConditions?: string;
}

export interface UserBillingInfo {
  gstNumber?: string;
  panNumber?: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  address: string;
}
