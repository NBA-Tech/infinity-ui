import { Country, ICountry, IState, State } from "country-state-city";


type FetchWithTimeoutParams = {
  url: string;
  options?: RequestInit;
  timeout?: number;
  maxRetries?: number;
};
export const getCountries = ():ICountry[] => {
    return Country.getAllCountries();
}

export const getStates = (countryCode: string):IState[] => {
    return State.getStatesOfCountry(countryCode);
}





export const fetchWithTimeout = async ({
  url,
  options = {},
  timeout = 20000,
  maxRetries = 5,
}: FetchWithTimeoutParams) => {
  console.log(url)
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timer);

      // Check if the HTTP status is OK (2xx)
      if (!response.ok) {
        return {
          json: async () => ({
            success: false,
            message: `HTTP Error: ${response.statusText}`,
            status_code: response.status,
          }),
        };
      }

      // Return actual response if all goes well
      return response;

    } catch (error) {
      const isTimeout = error?.name === 'AbortError';

      if (isTimeout && attempt < maxRetries - 1) {
        console.warn(`Timeout attempt ${attempt + 1}, retrying...`);
        attempt++;
        continue;
      }

      console.log("Fetch error:", error);

      return {
        json: async () => ({
          success: false,
          message: isTimeout
            ? 'Request timed out. Please try again.'
            : error?.message || 'Network or server error',
          status_code: isTimeout ? 408 : 500,
          isTimeout,
        }),
      };
    }
  }

  // Shouldn't reach here, but just in case
  return {
    json: async () => ({
      success: false,
      message: 'Unknown error occurred',
      status_code: 500,
    }),
  };
};

