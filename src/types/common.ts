
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
  message: string
}

export interface RootStackParamList extends ParamListBase {
  onetimepassword: undefined;
  useronboarding: undefined;
}

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


interface FormField {
  parentKey?: string;
  key?: string;
  label: string;
  type: string;
  placeholder?: string;
  icon?: string;
  isDisabled?: boolean; // Optional disabled state
  value?: string; // Optional array of values
  renderItems?: () => React.ReactNode; // Optional function to render items
  onChange?: (value: string) => void; // Optional change handler
}
export interface FormFields {
  [key: number]: FormField[];
}