import { ApiGeneralRespose } from "../common";
export enum OFFERINGTYPE {
    SERVICE = "SERVICE",
    PACKAGE = "PACKAGE"
}

export enum SERVICECATEGORY {
    PORTRAIT="PORTRAIT",
    EVENT="EVENT",
    COMMERCIAL="COMMERCIAL",
    NATURE="NATURE",
    SPECIALIZED="SPECIALIZED",
    OTHER="OTHER"
}
export interface ServiceInfo{
    id:string;
    name:string;
    value:number;
    price?:number;
    isCompleted?: boolean
}
export interface OfferingModel {
    id?: string;
    customerID: string;
    createdDate?: Date;
    type: OFFERINGTYPE;
}
export interface ServiceModel extends OfferingModel {
    serviceName: string;
    description: string;
    price: number;
    serviceCategory:SERVICECATEGORY;
    icon?: string;
    tags?: string[];
}
export interface PackageModel extends OfferingModel {
    packageName: string;
    description: string;
    price: number;
    calculatedPrice: boolean;
    additionalNotes?: string;
    serviceList: ServiceInfo[];
    icon?: string;
    tags?: string[];
}