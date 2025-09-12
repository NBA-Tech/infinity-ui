import { ApiGeneralRespose } from "../common";

export enum STATUS {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}
export enum OFFERINGTYPE{
    SERVICE = "SERVICE",
    OFFERING = "PACKAGE"
}
export interface OfferingModel{
    id?: string;
    customerID: string;
    createdDate?: Date;
    status: STATUS;
    type:OFFERINGTYPE;
}
export interface ServiceModel extends OfferingModel{
    serviceName:string;
    description:string;
    price:number;
    icon?:string;
    tags?:string[];
}
export interface PackageModel extends OfferingModel{
    packageName:string;
    description:string;
    price:number;
    calculatedPrice:boolean;
    additionalNotes?:string;
    serviceList:string[];
    icon?:string;
    tags?:string[];
}