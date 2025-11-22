import React, { createContext, useState, ReactNode, useContext, useEffect, useCallback } from 'react';
import { useDataStore } from '../data-store/data-store-provider';
import { getSubscriptionDetailsUsingUserIdAPI } from '@/src/api/subscription/subscription-api-service';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { SubscriptionModel } from '@/src/types/subscription/subscription-type-';
import { useAuth } from '@/src/context/auth-context/auth-context';

type SubscriptionContextType = {
  isSubscribed: boolean;
  isLoading: boolean;
  subscriptionDetails: SubscriptionModel;
  setSubscriptionStatus: (status: boolean) => void;
  refetchSubscription: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType>({
  isSubscribed: false,
  isLoading: false,
  subscriptionDetails: {} as SubscriptionModel,
  setSubscriptionStatus: () => {},
  refetchSubscription: async () => {},
});

type Props = {
  children: ReactNode;
};

export const SubscriptionProvider: React.FC<Props> = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionModel>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isInitialized, getItem } = useDataStore();
  const { isAuthenticated } = useAuth();
  const showToast = useToastMessage();

  const setSubscriptionStatus = (status: boolean) => setIsSubscribed(status);

  const getLicenseDetails = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      const subscriptionDetails = await getSubscriptionDetailsUsingUserIdAPI(userId);

      if (!subscriptionDetails?.success) {
        setIsSubscribed(false);
        setSubscriptionDetails({} as SubscriptionModel);
        // showToast({
        //   type: "error",
        //   title: "Error",
        //   message: subscriptionDetails?.message ?? "Something went wrong",
        // });
        setIsLoading(false);
        return;
      }

      setSubscriptionDetails(subscriptionDetails?.data);
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
      setIsSubscribed(false);
    }
    finally {
      setIsLoading(false);
    }
  }, []);

  // 🔁 Public refetch function (for other screens to trigger)
  const refetchSubscription = useCallback(async () => {
    const userId = getItem('USERID');
    if (!userId) return;
    await getLicenseDetails(userId);
  }, [getItem, getLicenseDetails]);

  useEffect(() => {
    const userId = getItem('USERID');
    if (!isInitialized || !isAuthenticated || !userId) return;
    getLicenseDetails(userId);
  }, [isInitialized, isAuthenticated, getLicenseDetails]);

  useEffect(() => {
    if (!subscriptionDetails || !Object.keys(subscriptionDetails).length) return;

    const currDate = new Date();
    const subscriptionEndDate = new Date(subscriptionDetails?.endDate);

    setIsSubscribed(currDate <= subscriptionEndDate);
  }, [subscriptionDetails]);

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        isLoading,
        subscriptionDetails: subscriptionDetails ?? ({} as SubscriptionModel),
        setSubscriptionStatus,
        refetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

// Custom hook for easier usage
export const useSubscription = () => useContext(SubscriptionContext);
