import { create } from "zustand";
import { OfferingModel, PackageModel, ServiceModel } from "@/src/types/offering/offering-type";

// Union type for offerings
type Offering = ServiceModel | PackageModel;

export interface OfferingStore {
    offeringList: Offering[];

    // CRUD
    setOfferingList: (offeringList: Offering[]) => void;
    getOfferingList: () => Offering[];
    addOfferingDetailsInfo: (offering: Offering | Offering[]) => void;
    updateOfferingDetailsInfo: (offering: Offering | Offering[]) => void;
    deleteOfferingDetailsInfo: (offering: Offering | Offering[] | string | string[]) => void;
}

export const useOfferingStore = create<OfferingStore>((set, get) => ({
    offeringList: [],

    // --- Set full list ---
    setOfferingList: (list) => set({ offeringList: list }),

    // --- Get full list ---
    getOfferingList: () => get().offeringList,

    // --- Add (single or array, avoids duplicates) ---
    addOfferingDetailsInfo: (offering) =>
        set((state) => {
            const toAdd = Array.isArray(offering) ? offering : [offering];
            const existingIds = new Set(state.offeringList.map((o) => o.id));
            const merged = [
                ...state.offeringList,
                ...toAdd.filter((o) => !existingIds.has(o.id)),
            ];
            return { offeringList: merged };
        }),

    // --- Update (replace if exists, add if new) ---
    updateOfferingDetailsInfo: (offering) =>
        set((state) => {
            const toUpdate = Array.isArray(offering) ? offering : [offering];
            const updatedList = state.offeringList.map((o) => {
                const match = toUpdate.find((u) => u.id === o.id);
                return match ? { ...o, ...match } : o;
            });

            // Add new items that were not in the original list
            const existingIds = new Set(updatedList.map((o) => o.id));
            const newItems = toUpdate.filter((u) => !existingIds.has(u.id));

            return { offeringList: [...updatedList, ...newItems] };
        }),

    // --- Delete (accepts object, array, or raw id/string) ---
    deleteOfferingDetailsInfo: (offering) =>
        set((state) => {
            const ids = Array.isArray(offering)
                ? offering.map(o => (typeof o === "object" ? o.id : o))
                : [typeof offering === "object" ? offering.id : offering];

            const deleteIds = new Set(ids);
            const filtered = state.offeringList.filter((o) => !deleteIds.has(o.id));
            return { offeringList: filtered };
        }),

}));
