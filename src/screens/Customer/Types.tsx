export interface BasicInfoFields {
    label: string;
    placeholder: string;
    icon: React.ReactNode;
    type: string;
    style: string;
    isRequired: boolean;
    isDisabled: boolean;
    extraStyles?: object;
    renderItems?: () => React.ReactNode;
}
export interface BasicInfo {
    firstName: BasicInfoFields;
    lastName: BasicInfoFields;
    mobileNumber: BasicInfoFields;
    email: BasicInfoFields;
    notes: BasicInfoFields;

}

export interface BillingInfo {
    street: BasicInfoFields;
    city: BasicInfoFields;
    state: BasicInfoFields;
    zipCode: BasicInfoFields;
    country: BasicInfoFields;
}

