import { Country, ICountry, IState, State } from "country-state-city";
import { FormFields } from "../types/common";
import { v4 as uuidv4 } from 'uuid';
import { Linking } from "react-native";

export const getCountries = (): ICountry[] => {
  return Country.getAllCountries();
}

export const getStates = (countryCode: string): IState[] => {
  return State.getStatesOfCountry(countryCode);
}
export const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};




export const checkValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !emailRegex.test(email);
}

export const checkPasswordStrength = (password: string) => {
  const issues = [];

  if (password.length < 8) issues.push("at least 8 characters");
  if (!/[A-Z]/.test(password)) issues.push("1 uppercase letter");
  if (!/[a-z]/.test(password)) issues.push("1 lowercase letter");
  if (!/\d/.test(password)) issues.push("1 digit");
  if (!/[@$!%*?&]/.test(password)) issues.push("1 symbol");

  if (issues.length === 0) {
    return "Strong password";
  }

  return `Password must contain ${issues.join(", ")}`;
};

export const generateRandomString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const validateValues = (values: any, formFields: FormFields) => {
  for (const key in formFields) {
    const field = formFields[key];

    if (field.isRequired) {
      let value;

      // Check if parentKey exists
      if (field.parentKey) {
        value = values?.[field.parentKey]?.[field.key];
      } else {
        value = values?.[field.key];
      }

      // Handle empty string, null, undefined, 0, empty array, NaN
      const isEmpty =
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0) ||
        Number.isNaN(value) ||
        value === 0;

      if (isEmpty) {
        return {
          success: false,
          message: `Please enter ${field.label}`,
        };
      }
    }
  }

  return { success: true };
};



type FetchWithTimeoutParams = {
  url: string;
  options?: RequestInit;
  timeout?: number;
  maxRetries?: number;
  responseType?: 'json' | 'text'; // <--- new prop
};

export const fetchWithTimeout = async ({
  url,
  options = {},
  timeout = 20000,
  maxRetries = 5,
  responseType = 'json', // default to json
}: FetchWithTimeoutParams): Promise<any> => {
  let attempt = 0;
  console.log(url);

  while (attempt < maxRetries) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timer);

      // Parse response based on type
      let data: any = null;
      try {
        if (responseType === 'json') {
          data = await response.json();
        } else if (responseType === 'text') {
          data = await response.text();
        }
      } catch (e) {
        console.error(`Error parsing ${responseType}:`, e);
        data = null;
      }

      if (!response.ok) {
        return data;
      }

      return data;
    } catch (error: any) {
      const isTimeout = error?.name === 'AbortError';

      if (isTimeout && attempt < maxRetries - 1) {
        console.warn(`Timeout attempt ${attempt + 1}, retrying...`);
        attempt++;
        continue;
      }

      return {
        success: false,
        message: isTimeout
          ? 'Request timed out. Please try again.'
          : error?.message || 'Network or server error',
        status_code: isTimeout ? 408 : 500,
        isTimeout,
      };
    }
  }

  return {
    success: false,
    message: 'Unknown error occurred',
    status_code: 500,
  };
};


export const patchState = (
  section: string,
  key: string,
  value: any,
  isRequired: boolean = true,
  setState: React.Dispatch<React.SetStateAction<any>>,
  setErrors: React.Dispatch<React.SetStateAction<any>>,
  errorMessage: string = "This field is required"
) => {
  setState((prev: any) => {
    let updated;

    if (!section) {
      // direct scalar update
      updated = {
        ...prev,
        [key]: value,
      };
    } else if (!key) {
      // replace the whole object under section
      updated = {
        ...prev,
        [section]: value,
      };
    } else {
      // nested object update
      updated = {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      };
    }

    // --- Validation ---
    if (key && isRequired) {
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        Number.isNaN(value) ||
        value <= 0
      ) {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          [key]: errorMessage,
        }));
      } else {
        setErrors((prevErrors: any) => {
          const { [key]: _, ...rest } = prevErrors;
          return rest;
        });
      }
    }

    return updated;
  });
};


// Generic clearState with default values
export const clearState = <T extends Record<string, any>>(
  state: T,
  setState: React.Dispatch<React.SetStateAction<T>>,
  defaults: Partial<T> = {} // optional defaults to preserve
) => {
  const clearedState = Object.keys(state).reduce((acc, key) => {
    const value = state[key as keyof T];

    if (Array.isArray(value)) acc[key as keyof T] = [] as any;
    else if (typeof value === "string") acc[key as keyof T] = "" as any;
    else if (typeof value === "number") acc[key as keyof T] = 0 as any;
    else if (typeof value === "boolean") acc[key as keyof T] = false as any;
    else acc[key as keyof T] = null as any;

    return acc;
  }, {} as T);

  // Merge defaults on top
  setState({ ...clearedState, ...defaults });
};


export function escapeHtmlForJson(html: string): string {
  return html
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/"/g, '\\"')   // Escape double quotes
    .replace(/\n/g, '\\n')  // Escape newlines
    .replace(/\r/g, '\\r')  // Escape carriage returns
    .replace(/\t/g, '\\t')  // Escape tabs
    .replace(/\f/g, '\\f')  // Escape form feeds
    .replace(/\b/g, '\\b'); // Escape backspace
}

export function openDaialler(phoneNumber: string) {
  console.log(phoneNumber)
  let phoneUrl = `tel:${phoneNumber}`;
  Linking.openURL(phoneUrl);
}

export function openEmailClient(email: string) {
  let emailUrl = `mailto:${email}`;
  Linking.openURL(emailUrl);
}

export function isAllLoadingFalse(loadingObj: any) {
  return Object.values(loadingObj).every(value => value === false);
}