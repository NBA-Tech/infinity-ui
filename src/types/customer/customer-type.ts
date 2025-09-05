// src/models/CustomerModel.ts

export enum STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum GENDER {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum LEADSOURCE {
  REFERRAL = "REFERRAL",
  WEBSITE = "WEBSITE",
  SOCIALMEDIA = "SOCIALMEDIA",
  WALKIN = "WALKIN",
  OTHERS = "OTHERS",
}

export interface CustomerBasicInfo {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  notes?: string;
}

export interface CustomerBillingInfo {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CustomerModel {
  customerID?: string;
  userId: string;
  createdDate?: Date;
  status?: STATUS;
  leadSource?: LEADSOURCE;
  gender?: GENDER;
  customerBasicInfo: CustomerBasicInfo;
  customerBillingInfo: CustomerBillingInfo;
}
