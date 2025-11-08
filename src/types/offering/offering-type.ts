import { ApiGeneralRespose } from "../common";

export enum STATUS{
    ACTIVE="ACTIVE",
    INACTIVE="INACTIVE"
}

export enum OFFERINGTYPE {
    SERVICE = "SERVICE",
    PACKAGE = "PACKAGE"
}

export enum SERVICETYPE{
    SERVICE = "SERVICE",
    DELIVERABLE = "DELIVERABLE"
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
    serviceType?:SERVICETYPE
}
export interface OfferingModel {
    id?: string;
    customerID: string;
    createdDate?: Date;
    updatedDate?: Date;
    type: OFFERINGTYPE;
}
export interface ServiceModel extends OfferingModel {
    serviceName: string;
    description: string;
    price: number;
    serviceCategory:SERVICECATEGORY;
    serviceType?:SERVICETYPE
}
export interface PackageModel extends OfferingModel {
    packageName: string;
    description: string;
    price: number;
    calculatedPrice: boolean;
    additionalNotes?: string;
    serviceList: ServiceInfo[];
}