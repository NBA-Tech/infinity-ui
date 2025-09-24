import { API_BASE_URI } from "@/src/config/app-config"
import { ApiGeneralRespose } from "@/src/types/common"
import { fetchWithTimeout } from "@/src/utils/utils"


export const getCustomerStatsAPI=async(userID?:string,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const getCustomerStatsResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/user_stats/get_customer_stats?userID=${userID}`,
        options: {
            method: 'GET',
            headers
        },
    })
    return getCustomerStatsResponse 
}