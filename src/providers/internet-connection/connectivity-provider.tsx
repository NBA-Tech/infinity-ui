import React, { createContext, useState, useEffect, ReactNode } from "react";
import NetInfo, { NetInfoSubscription, NetInfoState } from "@react-native-community/netinfo";

interface ConnectivityContextType {
  isConnected: boolean;
}

export const ConnectivityContext = createContext<ConnectivityContextType>({
  isConnected: true,
});

interface ConnectivityProviderProps {
  children: ReactNode;
}

export const ConnectivityProvider: React.FC<ConnectivityProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe: NetInfoSubscription = NetInfo.addEventListener(
      (state: NetInfoState) => {
        setIsConnected(!!state.isConnected);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ConnectivityContext.Provider value={{ isConnected }}>
      {children}
    </ConnectivityContext.Provider>
  );
};
