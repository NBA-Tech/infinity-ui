import { create } from "zustand";
import { UserModel } from "@/src/types/user/user-type";
import { ApiGeneralRespose } from "@/src/types/common";
import { getUserDetailsApi } from "@/src/services/user/user-service";

export interface UserStore {
  userDetails: UserModel | null;
  setUserDetails: (userDetails: UserModel) => void;
  getUserDetails: () => UserModel | null;
  deleteUserDetails: () => void;
  getUserDetailsUsingID: (userID: string,showToast: any) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  userDetails: null,

  setUserDetails: (userDetails: UserModel) => set({ userDetails }),

  getUserDetails: () => get().userDetails,

  deleteUserDetails: () => set({ userDetails: null }),

  getUserDetailsUsingID: async (userID,showToast) => {
    let userDetails = get().userDetails;
    if(!userDetails){

        const userDetailsApi: ApiGeneralRespose = await getUserDetailsApi(userID)
        if(!userDetailsApi?.success){
            showToast({
                type: "error",
                title: "Error",
                message: userDetailsApi?.message ?? "Something went wrong",
            })
        }
        else{
            set({ userDetails: userDetailsApi.data });
        }
    }
  },
}));
