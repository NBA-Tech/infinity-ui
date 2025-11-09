// src/models/CustomerModel.ts




export enum LEADSOURCE {
  REFERRAL = "REFERRAL",
  WEBSITE = "WEBSITE",
  SOCIALMEDIA = "SOCIALMEDIA",
  WALKIN = "WALKIN",
  OTHERS = "OTHERS",
}

export interface CustomerBasicInfo {
  name: string;
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
  updatedDate?: Date;
  leadSource?: LEADSOURCE;
  customerBasicInfo: CustomerBasicInfo;
  customerBillingInfo: CustomerBillingInfo;
}

export interface CustomerApiResponse{
  status: number;
  success: boolean;
  message: string;
  data: CustomerModel[] | CustomerModel
}


//store data
export interface CustomerMetaModel extends CustomerBasicInfo{
  customerID?: string;
  userId?: string;
}