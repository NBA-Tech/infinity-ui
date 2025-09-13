import { create } from "zustand";
import { OfferingModel, PackageModel, ServiceModel } from "@/src/types/offering/offering-type";

// Union type for offerings
type Offering = ServiceModel | PackageModel;

interface OfferingStore {
    offeringList: Offering[];

    // CRUD
    setOfferingList: (offeringList: Offering[]) => void;
    getOfferingList: () => Offering[];
    addOfferingDetailsInfo: (offering: Offering | Offering[]) => void;
    updateOfferingDetailsInfo: (offering: Offering | Offering[]) => void;
    deleteOfferingDetailsInfo: (offering: Offering | Offering[]) => void;
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
            const existingIds = new Set(state.offeringList.map((o) => o.id)); // assuming `id` exists in both models

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

            const updated = state.offeringList.map((o) => {
                const match = toUpdate.find((u) => u.id === o.id);
                return match ? { ...o, ...match } : o;
            });

            const existingIds = new Set(updated.map((o) => o.id));
            const newOnes = toUpdate.filter((u) => !existingIds.has(u.id));

            return { offeringList: [...updated, ...newOnes] };
        }),

    // --- Delete ---
    deleteOfferingDetailsInfo: (offering) =>
        set((state) => {
            const toDelete = Array.isArray(offering) ? offering : [offering];
            const deleteIds = new Set(toDelete.map((o) => o.id));

            const filtered = state.offeringList.filter((o) => !deleteIds.has(o.id));
            return { offeringList: filtered };
        }),
}));
