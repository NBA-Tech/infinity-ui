export interface GradientCardProps {
    colors?: string[],
    children: React.ReactNode,
    className?: string
    style?: any
}

interface FormField {
    key?:string;
    label: string;
    type: string;
    placeholder?: string;
    icon?: string;
    isDisabled?: boolean; // Optional disabled state
    value?:string; // Optional array of values
    renderItems?: () => React.ReactNode; // Optional function to render items
    onChange?: (value: string) => void; // Optional change handler
}
export interface FormFields {
  [key: number]: FormField[];
}