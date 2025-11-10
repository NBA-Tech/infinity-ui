import { ApiGeneralRespose } from "../common";

export enum STATUS {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export enum SERVICETYPE {
    SERVICE = "SERVICE",
    PACKAGE = "PACKAGE",
    DELIVERABLE = "DELIVERABLE"
}

export enum SERVICECATEGORY {
    PORTRAIT = "PORTRAIT",
    EVENT = "EVENT",
    COMMERCIAL = "COMMERCIAL",
    NATURE = "NATURE",
    SPECIALIZED = "SPECIALIZED",
    OTHER = "OTHER"
}
export enum SESSIONTYPE {
    SINGLE_SESSION = "SINGLE_SESSION",
    DOUBLE_SESSION = "DOUBLE_SESSION"
}
export interface ServiceInfo {
    id: string;
    name: string;
    value: number;
    price?: number;
}
export interface OfferingModel {
    id?: string;
    userId: string;
    createdDate?: Date;
    updatedDate?: Date;
    type: SERVICETYPE;
}
export interface ServiceModel extends OfferingModel {
    serviceName: string;
    description: string;
    price: number;
    serviceCategory: SERVICECATEGORY;
    sessionType?: SESSIONTYPE;
    quantity?: string;
}
export interface PackageModel extends OfferingModel {
    packageName: string;
    description: string;
    price: number;
    calculatedPrice: boolean;
    additionalNotes?: string;
    serviceList: ServiceInfo[];
}