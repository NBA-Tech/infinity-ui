import { API_BASE_URI } from "@/src/config/app-config";
import { ApiGeneralRespose } from "@/src/types/common";
import { SubscriptionModel } from "@/src/types/subscription/subscription-type-";
import { fetchWithTimeout } from "@/src/utils/utils";



export const addOrUpdateSubscriptionDetailsAPI = async (payload: SubscriptionModel, headers?: Record<string, any>): Promise<ApiGeneralRespose> => {
    const addOrUpdateSubscriptionDetailsResponse = await fetchWithTimeout({
        url: `${API_BASE_URI}/subscription/add_or_update_subscription_details`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return addOrUpdateSubscriptionDetailsResponse

}

export const getSubscriptionDetailsUsingUserIdAPI = async (userId: string, headers?: Record<string, any>): Promise<ApiGeneralRespose> => {
    const getSubscriptionDetailsUsingUserIdResponse = await fetchWithTimeout({
        url: `${API_BASE_URI}/subscription/get_subscription_details_by_user_id?userId=${userId}`,
        options: {
            method: 'GET',
            headers
        }
    })
    return getSubscriptionDetailsUsingUserIdResponse
}