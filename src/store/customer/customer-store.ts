import { CustomerMetaModel, CustomerModel } from '@/src/types/customer/customer-type';
import { create } from 'zustand';

interface CustomerStore {
    customerMetaInfoList: CustomerMetaModel[];
    customerDetailsList: CustomerModel[];

    // Meta Info
    setCustomerMetaInfoList: (customerMetaInfoList: CustomerMetaModel[]) => void;
    getCustomerMetaInfoList: () => CustomerMetaModel[];
    updateCustomerMetaInfoList: (customerMetaInfo: CustomerMetaModel | CustomerMetaModel[]) => void;
    deleteCustomerMetaInfo: (customerIDs: string | string[]) => void;

    // Details CRUD
    setCustomerDetailsInfo: (customerDetailsList: CustomerModel[]) => void; // ✅ new
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

    deleteCustomerMetaInfo: (customerIDs: string | string[]) =>
        set((state) => {
            const idsToDelete = new Set(Array.isArray(customerIDs) ? customerIDs : [customerIDs]);
            console.log(state.customerMetaInfoList)

            const filtered = state.customerMetaInfoList.filter(
                (c) => !idsToDelete.has(c.customerID)
            );

            return { customerMetaInfoList: filtered };
        }),

    // --- Details ---
    setCustomerDetailsInfo: (list) => set({ customerDetailsList: list }), // ✅ replace entire list

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

    getCustomerDetailsList: () => get().customerDetailsList,

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

    deleteCustomerDetailsInfo: (customerDetails) =>
        set((state) => {
            const toDelete = Array.isArray(customerDetails) ? customerDetails : [customerDetails];
            const deleteIds = new Set(toDelete.map((c) => c.customerID));

            const filtered = state.customerDetailsList.filter((c) => !deleteIds.has(c.customerID));
            return { customerDetailsList: filtered };
        }),
}));
