
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';
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
  { label: string; color: string; icon: string }
> = {
  [GlobalStatus.PENDING]: {
    label: "PENDING",
    color: "warning",
    icon: "clock",
  },
  [GlobalStatus.IN_PROGRESS]: {
    label: "IN PROGRESS",
    color: "primary",
    icon: "clock",
  },
  [GlobalStatus.COMPLETED]: {
    label: "COMPLETED",
    color: "success",
    icon: "check-circle",
  },
  [GlobalStatus.CANCELLED]: {
    label: "CANCELLED",
    color: "error",
    icon: "close-circle",
  },
  [GlobalStatus.DELIVERED]: {
    label: "DELIVERED",
    color: "success",
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
  onetimepassword: undefined;
  useronboarding: undefined;
  OrderDetails: { orderId: string };
  InvoiceDetails: { invoiceId: string };
  Success: { text?: string };
  CreateInvoice: { invoiceId: string };
  CreateCustomer: { customerID: string };
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
