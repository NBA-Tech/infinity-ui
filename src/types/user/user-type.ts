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
  userSettingInfo?: UserSettingInfo;
  userAuthInfo?:AuthModel
}

export interface UserBusinessInfo {
  companyName: string;
  companyLogoURL?: string;
  businessType: string;
  businessPhoneNumber?: string;
  businessEmail?: string;
  websiteURL?: string;
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

export interface UserSettingInfo {
  currency: string;
  notificationPreference?: string;
}
