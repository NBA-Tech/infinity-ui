import { create } from "zustand";
import { ServiceModel, PackageModel } from "@/src/types/offering/offering-type";
import { getOfferingListAPI } from "@/src/api/offering/offering-service";

export interface OfferingStore {
  serviceData: ServiceModel[];
  packageData: PackageModel[];

  loadOfferings: (userID: string, showToast?: any) => Promise<void>;

  // --- Service CRUD ---
  setServiceData: (list: ServiceModel[]) => void;
  getServiceData: () => ServiceModel[];
  addService: (service: ServiceModel | ServiceModel[]) => void;
  updateService: (service: ServiceModel | ServiceModel[]) => void;
  deleteService: (service: ServiceModel | ServiceModel[] | string | string[]) => void;

  // --- Package CRUD ---
  setPackageData: (list: PackageModel[]) => void;
  getPackageData: () => PackageModel[];
  addPackage: (pkg: PackageModel | PackageModel[]) => void;
  updatePackage: (pkg: PackageModel | PackageModel[]) => void;
  deletePackage: (pkg: PackageModel | PackageModel[] | string | string[]) => void;
}

export const useOfferingStore = create<OfferingStore>((set, get) => ({
  serviceData: [],
  packageData: [],

  // --- Load offerings from API ---
  loadOfferings: async (userID: string, showToast?: any) => {
    if (!userID) {
      showToast?.({ type: "error", title: "Error", message: "User not found" });
      return;
    }

    if (!get().serviceData.length && !get().packageData.length) {
      try {
        const offeringData = await getOfferingListAPI(userID);
        if (!offeringData?.success) {
          showToast?.({
            type: "error",
            title: "Error",
            message: offeringData?.message ?? "Something went wrong",
          });
          return;
        }

        const { services, packages } = offeringData.data ?? {};
        set({
          serviceData: services ?? [],
          packageData: packages ?? [],
        });
      } catch (err: any) {
        showToast?.({ type: "error", title: "Error", message: err?.message ?? "Something went wrong" });
      }
    }
  },

  // --- Service Methods ---
  setServiceData: (list) => set({ serviceData: list }),
  getServiceData: () => get().serviceData,

  addService: (service) =>
    set((state) => {
      const toAdd = Array.isArray(service) ? service : [service];
      const existingIds = new Set(state.serviceData.map((s) => s.id));
      return { serviceData: [...state.serviceData, ...toAdd.filter((s) => !existingIds.has(s.id))] };
    }),

  updateService: (service) =>
    set((state) => {
      const toUpdate = Array.isArray(service) ? service : [service];
      const updatedList = state.serviceData.map((s) => {
        const match = toUpdate.find((u) => u.id === s.id);
        return match ? { ...s, ...match } : s;
      });
      const existingIds = new Set(updatedList.map((s) => s.id));
      const newItems = toUpdate.filter((u) => !existingIds.has(u.id));
      return { serviceData: [...updatedList, ...newItems] };
    }),

  deleteService: (service) =>
    set((state) => {
      const ids = Array.isArray(service)
        ? service.map((s) => (typeof s === "object" ? s.id : s))
        : [typeof service === "object" ? service.id : service];
      const deleteIds = new Set(ids);
      return { serviceData: state.serviceData.filter((s) => !deleteIds.has(s.id)) };
    }),

  // --- Package Methods ---
  setPackageData: (list) => set({ packageData: list }),
  getPackageData: () => get().packageData,

  addPackage: (pkg) =>
    set((state) => {
      const toAdd = Array.isArray(pkg) ? pkg : [pkg];
      const existingIds = new Set(state.packageData.map((p) => p.id));
      return { packageData: [...state.packageData, ...toAdd.filter((p) => !existingIds.has(p.id))] };
    }),

  updatePackage: (pkg) =>
    set((state) => {
      const toUpdate = Array.isArray(pkg) ? pkg : [pkg];
      const updatedList = state.packageData.map((p) => {
        const match = toUpdate.find((u) => u.id === p.id);
        return match ? { ...p, ...match } : p;
      });
      const existingIds = new Set(updatedList.map((p) => p.id));
      const newItems = toUpdate.filter((u) => !existingIds.has(u.id));
      return { packageData: [...updatedList, ...newItems] };
    }),

  deletePackage: (pkg) =>
    set((state) => {
      const ids = Array.isArray(pkg)
        ? pkg.map((p) => (typeof p === "object" ? p.id : p))
        : [typeof pkg === "object" ? pkg.id : pkg];
      const deleteIds = new Set(ids);
      return { packageData: state.packageData.filter((p) => !deleteIds.has(p.id)) };
    }),
}));
