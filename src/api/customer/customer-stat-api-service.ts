import { API_BASE_URI } from "@/src/config/app-config"
import { ApiGeneralRespose, SearchQueryRequest } from "@/src/types/common"
import { fetchWithTimeout } from "@/src/utils/utils"


export const getCustomerStatsAPI=async(payload:SearchQueryRequest,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const getCustomerStatsResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/user_stats/get_customer_stats`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return getCustomerStatsResponse
}