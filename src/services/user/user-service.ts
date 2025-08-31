import { API_BASE_URI } from "@/src/config/app-config";
import { ApiGeneralRespose } from "@/src/types/common";
import { UserModel } from "@/src/types/user/user-type";
import { fetchWithTimeout } from "@/src/utils/utils";

export const updateBusinessDetailsApi=async (payload:UserModel):Promise<ApiGeneralRespose>=>{
    const updateBusinessDetails=await fetchWithTimeout({
        url:`${API_BASE_URI}/users/update_business_details`,
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    })
    const updateBusinessDetailsResponse=await updateBusinessDetails.json();
    return updateBusinessDetailsResponse

}