export interface GradientCardProps {
    colors?: string[],
    children: React.ReactNode,
    className?: string
    style?: any
}

interface FormField {
    label: string;
    type: string;
    placeholder: string;
    icon?: string;
    values?: string[]; // Optional array of values
}
export interface FormFields {
  [key: number]: FormField[];
}