import { create } from "zustand";
import { UserModel } from "@/src/types/user/user-type";

export interface UserStore {
  userDetails: UserModel | null;
  setUserDetails: (userDetails: UserModel) => void;
  getUserDetails: () => UserModel | null;
  deleteUserDetails: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  userDetails: null,

  setUserDetails: (userDetails: UserModel) => set({ userDetails }),

  getUserDetails: () => get().userDetails,

  deleteUserDetails: () => set({ userDetails: null }),
}));
