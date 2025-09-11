
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';

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
}

export enum SORT_ORDER {
  ASC = "ASC",
  DESC = "DESC"
}

export interface SearchQueryRequest{
  filters?:Object;
  page?:number;
  pageSize?:number;
  searchQuery?:string;
  searchField?:string;
  requiredFields?:string[];
  sortField?:string;
  sortOrder?:SORT_ORDER
  getAll?:boolean

}

export interface RootStackParamList extends ParamListBase {
  onetimepassword: undefined;
  useronboarding: undefined;
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
  value?: string; // Optional array of values
  isRequired?: boolean;
  dropDownItems?: Record<string, string>[];
  extraStyles?: object,
  isInvalid?: boolean;
  errorMessage?: string;
  isOpen?: boolean;
  isVisible?: boolean;
  customComponent?: React.ReactNode;
  renderItems?: () => React.ReactNode; // Optional function to render items
  onChange?: (value: any) => void; // Optional change handler
  onBlur?: (parentKey?:string,childKey?:string) => void;
  setIsOpen?: (value: boolean) => void;
}
export type FormFields = Record<string, FormField>;
