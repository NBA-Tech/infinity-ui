
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';
import { AuthModel } from './auth/auth-type';
export enum GlobalStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  DELIVERED = "DELIVERED",
}

// 2. Status metadata map
export const GLOBALSTATUS: Record<
  GlobalStatus,
  { key: string; label: string; color: string; icon: string }
> = {
  [GlobalStatus.PENDING]: {
    key: "PENDING",
    label: "Pending",
    color: "#F59E0B", // Amber 500 (warning)
    icon: "clock",
  },
  [GlobalStatus.IN_PROGRESS]: {
    key: "IN_PROGRESS",
    label: "In Progress",
    color: "#3B82F6", // Blue 500 (primary)
    icon: "clock",
  },
  [GlobalStatus.COMPLETED]: {
    key: "COMPLETED",
    label: "Completed",
    color: "#10B981", // Green 500 (success)
    icon: "check-circle",
  },
  [GlobalStatus.CANCELLED]: {
    key: "CANCELLED",
    label: "Cancelled",
    color: "#EF4444", // Red 500 (error)
    icon: "x-circle",
  },
  [GlobalStatus.DELIVERED]: {
    key: "DELIVERED",
    label: "Delivered",
    color: "#22C55E", // Green 500/600 (success, slightly different)
    icon: "check-circle",
  },
};


export interface GradientCardProps {
  colors?: string[],
  children: React.ReactNode,
  className?: string
  style?: any
}
export interface ApiGeneralRespose {
  status: number,
  success: boolean,
  message: string,
  data?: any
  page?: number
  pageSize?: number
  limit?: number
  total?: number
}

export enum SORT_ORDER {
  ASC = "ASC",
  DESC = "DESC"
}

export interface SearchQueryRequest {
  filters?: Object;
  page?: number;
  pageSize?: number;
  searchQuery?: string[] | string;
  searchField?: string[] | string;
  requiredFields?: string[];
  sortField?: string;
  sortOrder?: SORT_ORDER
  getAll?: boolean

}

export interface RootStackParamList extends ParamListBase {
  OneTimePassword: {authData:AuthModel,otpCode:string};
  useronboarding: undefined;
  OrderDetails: { orderId: string };
  InvoiceDetails: { invoiceId: string };
  Success: { text?: string };
  CreateInvoice: { invoiceId: string };
  CreateCustomer: { customerID: string };
  CustomerDetails: { customerID: string };
}

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


export interface FormField {
  parentKey?: string;
  key: string;
  style?: string;
  label: string;
  type: string;
  placeholder?: string;
  icon?: React.ReactNode;
  isDisabled?: boolean; // Optional disabled state
  value?: any; // Optional array of values
  isRequired?: boolean;
  dropDownItems?: Record<string, string>[];
  extraStyles?: object,
  isInvalid?: boolean;
  errorMessage?: string;
  isOpen?: boolean;
  isVisible?: boolean;
  isSearchable?: boolean;
  isLoading?: boolean;
  customComponent?: React.ReactNode;
  renderItems?: () => React.ReactNode; // Optional function to render items
  onChange?: {
    (value: any): void;
    (value: any, label: any): void;
  };
  onBlur?: (parentKey?: string, childKey?: string) => void;
  setIsOpen?: (value: boolean) => void;
}
export type FormFields = Record<string, FormField>;
