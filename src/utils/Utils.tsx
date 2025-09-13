import { Country, ICountry, IState, State } from "country-state-city";
import { FormFields } from "../types/common";
import { v4 as uuidv4 } from 'uuid';


type FetchWithTimeoutParams = {
  url: string;
  options?: RequestInit;
  timeout?: number;
  maxRetries?: number;
};
export const getCountries = (): ICountry[] => {
  return Country.getAllCountries();
}

export const getStates = (countryCode: string): IState[] => {
  return State.getStatesOfCountry(countryCode);
}



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
      const value = values[field.key];

      // Handle empty string, null, undefined, 0, empty array
      const isEmpty =
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0) ||
        Number.isNaN(value) || value === 0;

      if (isEmpty) {
        console.log(field)
        return {
          success: false,
          message: `Please enter ${field.label}`,
        };
      }
    }
  }

  return { success: true };
};


export const fetchWithTimeout = async ({
  url,
  options = {},
  timeout = 20000,
  maxRetries = 5,
}: FetchWithTimeoutParams): Promise<any> => {
  let attempt = 0;
  console.log(url)

  while (attempt < maxRetries) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timer);

      // Parse JSON safely
      let data: any = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        return data;
      }

      return data;
    } catch (error: any) {
      const isTimeout = error?.name === "AbortError";

      if (isTimeout && attempt < maxRetries - 1) {
        console.warn(`Timeout attempt ${attempt + 1}, retrying...`);
        attempt++;
        continue;
      }

      return {
        success: false,
        message: isTimeout
          ? "Request timed out. Please try again."
          : error?.message || "Network or server error",
        status_code: isTimeout ? 408 : 500,
        isTimeout,
      };
    }
  }

  return {
    success: false,
    message: "Unknown error occurred",
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

    if (section === "") {
      // direct scalar update
      updated = {
        ...prev,
        [key]: value as any,
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
      if (value === "" || value === null || value === undefined || Number.isNaN(value) || value <= 0) {
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
