import { getCustomerListBasedOnFilters } from '@/src/api/customer/customer-api-service';
import { ApiGeneralRespose, SearchQueryRequest } from '@/src/types/common';
import { CustomerApiResponse, CustomerMetaModel, CustomerModel } from '@/src/types/customer/customer-type';
import { toCustomerMetaModelList } from '@/src/utils/customer/customer-mapper';
import { create } from 'zustand';

interface CustomerStore {
    customerMetaInfoList: CustomerMetaModel[];
    customerDetailsList: CustomerModel[];

    // Meta Info
    setCustomerMetaInfoList: (customerMetaInfoList: CustomerMetaModel[]) => void;
    getCustomerMetaInfoList: () => CustomerMetaModel[];
    updateCustomerMetaInfoList: (customerMetaInfo: CustomerMetaModel | CustomerMetaModel[]) => void;
    deleteCustomerMetaInfo: (customerIDs: string | string[]) => void;
    loadCustomerMetaInfoList: (userID: string, payload?: SearchQueryRequest, headers?: Record<string, any>, showToast?: any) => Promise<ApiGeneralRespose>
    resetCustomerMetaInfoList: () => void;

    // Details CRUD
    setCustomerDetailsInfo: (customerDetailsList: CustomerModel[]) => void; // ✅ new
    addCustomerDetailsInfo: (customerDetails: CustomerModel | CustomerModel[]) => void;
    getCustomerDetailsList: () => CustomerModel[];
    updateCustomerDetailsInfo: (customerDetails: CustomerModel | CustomerModel[]) => void;
    deleteCustomerDetailsInfo: (customerDetails: CustomerModel | CustomerModel[]) => void;
    resetCustomerDetailsInfo: () => void;
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
    loadCustomerMetaInfoList: async (
        userID: string,
        payload?: SearchQueryRequest,
        headers?: Record<string, any>,
        showToast?: any
    ): Promise<any> => {
        let customerMetaData = get().getCustomerMetaInfoList();
        if (!userID) {
            showToast?.({
                type: "error",
                title: "Error",
                message: "User not found",
            });
            return [];
        }

        if (customerMetaData?.length > 0) {
            return customerMetaData.map((customer) => ({
                label: `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim(),
                value: customer.customerID ?? "",
            }));
        }

        const payloadToUse: SearchQueryRequest = payload ?? {
            filters: { userID },
            getAll: true,
            requiredFields: [
                "customerBasicInfo.firstName",
                "customerBasicInfo.lastName",
                "_id",
                "customerBasicInfo.mobileNumber",
                "customerBasicInfo.email",
            ],
        };

        try {
            const customerListResponse: ApiGeneralRespose = await getCustomerListBasedOnFilters(payloadToUse, headers);

            if (!customerListResponse?.success) {
                showToast?.({
                    type: "error",
                    title: "Error",
                    message: customerListResponse?.message ?? "Something went wrong",
                });
                return [];
            }

            if (!customerListResponse?.data?.length) return [];

            const metaList = toCustomerMetaModelList(customerListResponse.data);
            set({ customerMetaInfoList: metaList });

            return metaList.map((customer) => ({
                label: `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim(),
                value: customer.customerID ?? "",
            }));
        } catch (err) {
            showToast?.({
                type: "error",
                title: "Error",
                message: (err as Error).message ?? "Something went wrong",
            });
            return [];
        }
    },
    resetCustomerMetaInfoList() {
        set({ customerMetaInfoList: [] });
    },


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
    resetCustomerDetailsInfo() {
        set({ customerDetailsList: [] });
    }
}));
