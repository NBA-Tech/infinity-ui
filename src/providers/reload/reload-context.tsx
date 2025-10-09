import React, { createContext, useState, useMemo, useContext } from "react";

interface ReloadContextType {
  reloadCustomer: boolean;
  reloadOrders: boolean;
  reloadInvoices: boolean;
  reloadActivity: boolean;
  triggerReloadCustomer: () => void;
  triggerReloadOrders: () => void;
  triggerReloadInvoices: () => void;
  triggerReloadActivity: () => void;
  resetAllReloads: () => void;
}

// 🔹 Context
export const ReloadContext = createContext<ReloadContextType | undefined>(undefined);

// 🔹 Provider
function ReloadProvider({ children }: { children: React.ReactNode }) {
  const [reloadCustomer, setReloadCustomer] = useState(false);
  const [reloadOrders, setReloadOrders] = useState(false);
  const [reloadInvoices, setReloadInvoices] = useState(false);
  const [reloadActivity, setReloadActivity] = useState(false);

  const triggerReloadCustomer = () => setReloadCustomer(prev => !prev);
  const triggerReloadOrders = () => setReloadOrders(prev => !prev);
  const triggerReloadInvoices = () => setReloadInvoices(prev => !prev);
  const triggerReloadActivity = () => setReloadActivity(prev => !prev);

  const resetAllReloads = () => {
    setReloadCustomer(false);
    setReloadOrders(false);
    setReloadInvoices(false);
    setReloadActivity(false);
  };

  // ✅ Memoize context value
  const value = useMemo(
    () => ({
      reloadCustomer,
      reloadOrders,
      reloadInvoices,
      reloadActivity,
      triggerReloadCustomer,
      triggerReloadOrders,
      triggerReloadInvoices,
      resetAllReloads,
      triggerReloadActivity
    }),
    [reloadCustomer, reloadOrders, reloadInvoices, reloadActivity]
  );

  return (
    <ReloadContext.Provider value={value}>
      {children}
    </ReloadContext.Provider>
  );
}

// 🔹 Hook for using the context
export const useReloadContext = (): ReloadContextType => {
  const context = useContext(ReloadContext);
  if (!context) {
    throw new Error("useReloadContext must be used within a ReloadProvider");
  }
  return context;
};

export default ReloadProvider;
