import { Country, ICountry, IState, State } from "country-state-city";
import { FormFields, GLOBALSTATUS, GlobalStatus, SearchQueryRequest } from "../types/common";
import { v4 as uuidv4 } from 'uuid';
import { Linking } from "react-native";
import { useUserStore } from "../store/user/user-store";
import { useCustomerStore } from "../store/customer/customer-store";
import { useOfferingStore } from "../store/offering/offering-store";
import { OfferingInfo, OrderType } from "../types/order/order-type";
import { isAfter, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { COUNTRY_CURRENCY_SYMBOLS } from "../constant/constants";


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


export const getCurrencySymbol = (countryCode: string): string => {
  return COUNTRY_CURRENCY_SYMBOLS[countryCode] || "$";
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
  let phoneUrl = `tel:${phoneNumber}`;
  Linking.openURL(phoneUrl);
}

export function openMessageBox(phoneNumber: string, message?: string) {
  // Encode the message (in case it has spaces or special characters)
  const encodedMessage = message ? encodeURIComponent(message) : "";
  const smsUrl = encodedMessage
    ? `sms:${phoneNumber}?body=${encodedMessage}`
    : `sms:${phoneNumber}`;

  Linking.openURL(smsUrl).catch((err) =>
    console.error("Failed to open message box:", err)
  );
}

export function openAddressInMap(address: string) {
  if (!address) return;

  const query = encodeURIComponent(address);
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;

  Linking.openURL(url).catch(err => {
    console.error("Failed to open map:", err);
  });
}

export async function openInBrowser(url: string) {
  try {
    if (!url) return;

    // Ensure the URL has a protocol
    const validUrl = url.startsWith("http") ? url : `https://${url}`;

    const supported = await Linking.canOpenURL(validUrl);
    if (supported) {
      await Linking.openURL(validUrl);
    } else {
      console.warn("Can't open this URL:", validUrl);
    }
  } catch (error) {
    console.error("Failed to open browser:", error);
  }
}

export function openEmailClient(email: string) {
  let emailUrl = `mailto:${email}`;
  Linking.openURL(emailUrl);
}

export function isAllLoadingFalse(loadingObj: any) {
  return Object.values(loadingObj).every(value => value === false);
}

export const resetAllStoreDetails = () => {
  useUserStore.getState().resetUserDetails()
  useCustomerStore.getState().resetCustomerDetailsInfo()
  useCustomerStore.getState().resetCustomerMetaInfoList()
  useOfferingStore.getState().resetPackage()
  useOfferingStore.getState().resetService()
}
export const isFilterApplied = (filters: SearchQueryRequest) => {
  if (!filters || !filters.filters) return false;

  const ignoredKeys = ["page", "pageSize", "userId"];

  return Object.entries(filters.filters).some(
    ([key, value]) =>
      !ignoredKeys.includes(key) &&
      value !== null &&
      value !== undefined &&
      value !== ""
  );
};

export const getNextStatus = (status: GlobalStatus) => {
  let nextStatus: GlobalStatus;

  switch (status) {
    case GlobalStatus.PENDING:
      nextStatus = GlobalStatus.IN_PROGRESS;
      break;
    case GlobalStatus.IN_PROGRESS:
      nextStatus = GlobalStatus.COMPLETED;
      break;
    case GlobalStatus.COMPLETED:
      nextStatus = GlobalStatus.DELIVERED;
      break;
    default:
      nextStatus = status; // CANCELLED/DELIVERED stay the same
  }
  return GLOBALSTATUS[nextStatus]; // return the object {label, color, icon}
};

export const getPercentageOfCompletion = (offeringInfo: OfferingInfo): number => {
  if (offeringInfo?.orderType == OrderType.PACKAGE) {
    return offeringInfo?.isCompleted ? 100 : 0
  }
  else {
    const completedServicesCount = offeringInfo?.services?.filter((service) => service?.isCompleted)?.length ?? 0;
    return Math.floor((completedServicesCount / (offeringInfo?.services?.length ?? 1)) * 100);
  }
}

type Period = "year" | "month" | "week";

interface ImprovementResult {
  change: number;     // raw % change
  formatted: string;  // "+25%" or "-10%"
}

export function calculateImprovement<T>(
  data: T[],
  dateKey: keyof T,
  period: Period
): ImprovementResult {
  if (!Array.isArray(data) || data.length === 0) {
    return { change: 0, formatted: "0%" };
  }

  const now = new Date();

  let currentCount = 0;
  let prevCount = 0;

  data.forEach((item) => {
    const value = item[dateKey];
    if (!value) return;

    const d = new Date(value as any);
    if (isNaN(d.getTime())) return; // invalid date guard

    if (period === "year") {
      if (d.getFullYear() === now.getFullYear()) currentCount++;
      else if (d.getFullYear() === now.getFullYear() - 1) prevCount++;
    }

    if (period === "month") {
      if (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth()
      ) {
        currentCount++;
      } else if (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() - 1
      ) {
        prevCount++;
      } else if (
        now.getMonth() === 0 && // January edge case
        d.getFullYear() === now.getFullYear() - 1 &&
        d.getMonth() === 11
      ) {
        prevCount++;
      }
    }

    if (period === "week") {
      const getWeek = (date: Date) => {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor(
          (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
        );
        return Math.ceil((days + startOfYear.getDay() + 1) / 7);
      };

      const thisWeek = getWeek(now);
      const lastWeek = thisWeek - 1;
      const dWeek = getWeek(d);

      if (d.getFullYear() === now.getFullYear() && dWeek === thisWeek) {
        currentCount++;
      } else if (d.getFullYear() === now.getFullYear() && dWeek === lastWeek) {
        prevCount++;
      } else if (
        lastWeek === 0 && // edge case: first week of the year
        d.getFullYear() === now.getFullYear() - 1 &&
        getWeek(d) === getWeek(new Date(d.getFullYear(), 11, 31))
      ) {
        prevCount++;
      }
    }
  });

  // Calculate %
  if (prevCount === 0 && currentCount === 0) {
    return { change: 0, formatted: "0%" };
  }
  if (prevCount === 0) {
    return { change: 100, formatted: "+100%" };
  }

  const change = ((currentCount - prevCount) / prevCount) * 100;
  const rounded = Math.round(change);

  return {
    change: rounded,
    formatted: `${rounded >= 0 ? "+" : ""}${rounded}%`
  };
}

export function getUpcomingByTimeframe<T>(
  data: T[],
  dateKey: keyof T,
  timeframe: Period
): T[] {
  const now = new Date();

  let start: Date;
  let end: Date;

  switch (timeframe) {
    case "week":
      start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
      end = endOfWeek(now, { weekStartsOn: 1 });
      break;
    case "month":
      start = startOfMonth(now);
      end = endOfMonth(now);
      break;
    case "year":
      start = startOfYear(now);
      end = endOfYear(now);
      break;
    default:
      throw new Error("Invalid timeframe");
  }

  return data?.filter((item) => {
    const dateVal = new Date(item[dateKey] as unknown as string);

    return (
      isAfter(dateVal, now) && // upcoming only
      dateVal >= start &&
      dateVal <= end
    );
  });
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function getMonthlyRevenue<T extends { [key: string]: any }>(
  data: T[],
  dateKey: keyof T,
  amountKey: keyof T
): { month: string; value: number }[] {
  const currentYear = new Date().getFullYear();

  // Initialize all months with 0
  const monthlyTotals: { [key: string]: number } = {};
  MONTH_NAMES.forEach((m) => (monthlyTotals[m] = 0));

  data.forEach((item) => {
    const dateValue = item[dateKey];
    if (!dateValue) return;

    const date = new Date(dateValue as any);

    // Only include data from the current year
    if (date.getFullYear() !== currentYear) return;

    const monthName = MONTH_NAMES[date.getMonth()];
    monthlyTotals[monthName] += Number(item[amountKey]) || 0;
  });

  // Convert to array format
  return MONTH_NAMES.map((month) => ({
    month,
    value: monthlyTotals[month],
  }));
}

export function isExpiringSoon(expiryDate: Date | string): boolean {
  if(!expiryDate) return false
  const now = new Date();
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;

  // Calculate difference in milliseconds
  const diffMs = expiry.getTime() - now.getTime();

  // Convert milliseconds to days
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays < 10;
}

export function generateRandomStringBasedType(length: number, inputType: string): string {
  // Prefix: INPUTTYPE + yyyyMMdd
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const prefix = inputType.toUpperCase() + yyyy + mm + dd;

  // Remaining random length
  const remainingLength = length - prefix.length;
  if (remainingLength < 0) {
    throw new Error("Length is too short for the risk format.");
  }

  const randomPart = getRandomAlphaNumeric(remainingLength);
  return prefix + randomPart;
}

// Helper function to generate random alphanumeric string
function getRandomAlphaNumeric(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Example usage:
export const isValidGST = (gst: string): boolean => {
  if(gst=="") return true
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst.trim().toUpperCase());
};
export const isValidPAN = (pan: string): boolean => {
  if(pan=="") return true
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.trim().toUpperCase());
};
