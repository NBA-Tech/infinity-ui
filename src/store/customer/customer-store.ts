import { CustomerMetaModel, CustomerModel } from '@/src/types/customer/customer-type';
import { create } from 'zustand';

interface CustomerStore {
    customerMetaInfoList: CustomerMetaModel[];
    customerDetailsList: CustomerModel[];

    // Meta Info
    setCustomerMetaInfoList: (customerMetaInfoList: CustomerMetaModel[]) => void;
    getCustomerMetaInfoList: () => CustomerMetaModel[];
    updateCustomerMetaInfoList: (customerMetaInfo: CustomerMetaModel | CustomerMetaModel[]) => void;
    deleteCustomerMetaInfo: (customerMetaInfo: CustomerMetaModel | CustomerMetaModel[]) => void;

    // Details CRUD
    addCustomerDetailsInfo: (customerDetails: CustomerModel | CustomerModel[]) => void;
    getCustomerDetailsList: () => CustomerModel[];
    updateCustomerDetailsInfo: (customerDetails: CustomerModel | CustomerModel[]) => void;
    deleteCustomerDetailsInfo: (customerDetails: CustomerModel | CustomerModel[]) => void;
}

// ✅ Zustand Store (fully typed)
export const useCustomerStore = create<CustomerStore>((set, get) => ({
    customerMetaInfoList: [],
    customerDetailsList: [],

    // --- Meta Info ---
    setCustomerMetaInfoList: (list) => set({ customerMetaInfoList: list }),
    getCustomerMetaInfoList: () => get().customerMetaInfoList,

    updateCustomerMetaInfoList: (customerMetaInfo) =>
        set((state) => {
            const toUpdate = Array.isArray(customerMetaInfo) ? customerMetaInfo : [customerMetaInfo];

            const updated = state.customerMetaInfoList.map((c) => {
                const match = toUpdate.find((u) => u.customerID === c.customerID);
                return match ? { ...c, ...match } : c;
            });

            const existingIds = new Set(updated.map((c) => c.customerID));
            const newOnes = toUpdate.filter((u) => !existingIds.has(u.customerID));

            return { customerMetaInfoList: [...updated, ...newOnes] };
        }),

    deleteCustomerMetaInfo: (customerMetaInfo) =>
        set((state) => {
            const toDelete = Array.isArray(customerMetaInfo) ? customerMetaInfo : [customerMetaInfo];
            const deleteIds = new Set(toDelete.map((c) => c.customerID));

            const filtered = state.customerMetaInfoList.filter((c) => !deleteIds.has(c.customerID));
            return { customerMetaInfoList: filtered };
        }),

    // --- Add (single or array, avoids duplicates) ---
    addCustomerDetailsInfo: (customerDetails) =>
        set((state) => {
            const toAdd = Array.isArray(customerDetails) ? customerDetails : [customerDetails];
            const existingIds = new Set(state.customerDetailsList.map((c) => c.customerID));

            const merged = [
                ...state.customerDetailsList,
                ...toAdd.filter((c) => !existingIds.has(c.customerID)),
            ];

            return { customerDetailsList: merged };
        }),

    // --- Get ---
    getCustomerDetailsList: () => get().customerDetailsList,

    // --- Update (replace if exists, add if new) ---
    updateCustomerDetailsInfo: (customerDetails) =>
        set((state) => {
            const toUpdate = Array.isArray(customerDetails) ? customerDetails : [customerDetails];

            const updated = state.customerDetailsList.map((c) => {
                const match = toUpdate.find((u) => u.customerID === c.customerID);
                return match ? { ...c, ...match } : c;
            });

            const existingIds = new Set(updated.map((c) => c.customerID));
            const newOnes = toUpdate.filter((u) => !existingIds.has(u.customerID));

            return { customerDetailsList: [...updated, ...newOnes] };
        }),

    // --- Delete ---
    deleteCustomerDetailsInfo: (customerDetails) =>
        set((state) => {
            const toDelete = Array.isArray(customerDetails) ? customerDetails : [customerDetails];
            const deleteIds = new Set(toDelete.map((c) => c.customerID));

            const filtered = state.customerDetailsList.filter((c) => !deleteIds.has(c.customerID));
            return { customerDetailsList: filtered };
        }),
}));
