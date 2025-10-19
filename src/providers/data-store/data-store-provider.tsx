import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Store = Record<string, any>;

interface DataStoreContextType {
  getItem: <T = any>(key: string) => T | undefined;
  setItem: (key: string, value: any) => Promise<void>;
  updateItem: (key: string, updaterFn: (prev: any) => any) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clearPersistedData: () => Promise<void>;
  isInitialized: boolean;
  store: Store;
  setStore: React.Dispatch<React.SetStateAction<Store>>;
}

const DataStoreContext = createContext<DataStoreContextType | null>(null);

interface ProviderProps {
  children: ReactNode;
  baseKey?: string;
  isPersist?: boolean;
}

const getStorageKey = (baseKey: string, itemKey: string) =>
  `${baseKey}:${itemKey}`;

export const DataStoreProvider: React.FC<ProviderProps> = ({
  children,
  baseKey = "@app",
  isPersist = true,
}) => {
  const [store, setStore] = useState<Store>({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isPersist) {
      setIsInitialized(true);
      return;
    }

    const loadPersistedData = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const appKeys = keys.filter((k) => k.startsWith(baseKey));
        const items = await AsyncStorage.multiGet(appKeys);
        const initialData: Store = {};

        items.forEach(([key, value]) => {
          const subKey = key.split(":")[1];
          try {
            initialData[subKey] = value ? JSON.parse(value) : null;
          } catch {
            initialData[subKey] = value;
          }
        });

        setStore(initialData);
        setIsInitialized(true);
      } catch (err) {
        console.error("Error loading persisted data:", err);
      }
    };

    loadPersistedData();
  }, [baseKey, isPersist]);

  const clearPersistedData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter((k) => k.startsWith(baseKey));
  
      if (appKeys.length > 0) {
        await AsyncStorage.multiRemove(appKeys);
        console.log(`🗑️ Cleared ${appKeys.length} persisted keys`);
      }
  
      // Optional: also clear from local state
      setStore({});
      setIsInitialized(false);
    } catch (err) {
      console.error('Error clearing persisted data:', err);
    }
  };

  const setItem = async (key: string, value: any) => {
    setStore((prev) => ({ ...prev, [key]: value }));
    if (isPersist) {
      try {
        await AsyncStorage.setItem(
          getStorageKey(baseKey, key),
          JSON.stringify(value)
        );
      } catch (err) {
        console.error(`Failed to persist ${key}:`, err);
      }
    }
  };

  const getItem = <T = any,>(key: string): T | undefined => store[key];

  const updateItem = async (
    key: string,
    updaterFn: (prev: any) => any
  ): Promise<void> => {
    setStore((prev) => {
      const updated = updaterFn(prev[key]);
      const next = { ...prev, [key]: updated };

      if (isPersist) {
        AsyncStorage.setItem(
          getStorageKey(baseKey, key),
          JSON.stringify(updated)
        ).catch((err) => console.error(`Failed to update ${key}:`, err));
      }

      return next;
    });
  };

  const removeItem = async (key: string) => {
    setStore((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

    if (isPersist) {
      try {
        await AsyncStorage.removeItem(getStorageKey(baseKey, key));
      } catch (err) {
        console.error(`Failed to remove ${key}:`, err);
      }
    }
  };

  return (
    <DataStoreContext.Provider
      value={{
        getItem,
        setItem,
        updateItem,
        removeItem,
        isInitialized,
        store,
        setStore,
        clearPersistedData
      }}
    >
      {children}
    </DataStoreContext.Provider>
  );
};

export const useDataStore = () => {
  const context = useContext(DataStoreContext);
  if (!context) {
    throw new Error("useDataStore must be used inside a DataStoreProvider");
  }
  return context;
};
