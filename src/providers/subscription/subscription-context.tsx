import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { useDataStore } from '../data-store/data-store-provider';
import { getSubscriptionDetailsUsingUserIdAPI } from '@/src/api/subscription/subscription-api-service';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { SubscriptionModel } from '@/src/types/subscription/subscription-type-';
import { useAuth } from '@/src/context/auth-context/auth-context';
type SubscriptionContextType = {
    isSubscribed: boolean;
    subscriptionDetails: SubscriptionModel
    setSubscriptionStatus: (status: boolean) => void;
};

const SubscriptionContext = createContext<SubscriptionContextType>({
    isSubscribed: false,
    subscriptionDetails: {} as SubscriptionModel,
    setSubscriptionStatus: () => { },
});

type Props = {
    children: ReactNode;
};

export const SubscriptionProvider: React.FC<Props> = ({ children }) => {
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionModel>();
    const { isInitialized, getItem } = useDataStore();
    const { isAuthenticated } = useAuth()
    const showToast = useToastMessage()

    const setSubscriptionStatus = (status: boolean) => {
        setIsSubscribed(status);
    };

    const getLicenseDetails = async (userId: string) => {
        const subscriptionDetails = await getSubscriptionDetailsUsingUserIdAPI(userId)
        if (!subscriptionDetails?.success) {
            return showToast({ type: "error", title: "Error", message: subscriptionDetails?.message ?? "Something went wrong" });
        }
        setSubscriptionDetails(subscriptionDetails?.data)
    }

    useEffect(() => {
        if (!isInitialized) return
        const userId = getItem('USERID');
        getLicenseDetails(userId)
    }, [isInitialized, isAuthenticated])

    useEffect(() => {
        const currDate = new Date()
        const subscriptionEndDate = new Date(subscriptionDetails?.endDate)
        if (currDate > subscriptionEndDate) {
            setIsSubscribed(false)
        }
        else {
            setIsSubscribed(true)
        }
    }, [subscriptionDetails])

    return (
        <SubscriptionContext.Provider value={{ isSubscribed, subscriptionDetails, setSubscriptionStatus }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

// Custom hook for easier usage
export const useSubscription = () => useContext(SubscriptionContext);
