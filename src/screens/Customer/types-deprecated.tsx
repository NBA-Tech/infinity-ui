export interface BasicInfoFields {
    label: string;
    placeholder: string;
    icon: React.ReactNode;
    type: string;
    style: string;
    isRequired: boolean;
    isDisabled: boolean;
    extraStyles?: object;
    dropDownItems?: Record<string, string>[];
    renderItems?: () => React.ReactNode;
    onChange?: (value: string) => void
}
export interface BasicInfo {
    name: BasicInfoFields;
    mobileNumber: BasicInfoFields;
    email: BasicInfoFields;
    notes: BasicInfoFields;
    leadSource: BasicInfoFields;

}

export interface BillingInfo {
    street: BasicInfoFields;
    city: BasicInfoFields;
    state: BasicInfoFields;
    zipCode: BasicInfoFields;
    country: BasicInfoFields;
}

