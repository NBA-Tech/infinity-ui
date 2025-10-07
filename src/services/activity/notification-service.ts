import { API_BASE_URI } from "@/src/config/app-config";
import { Notification } from "@/src/types/activity/user-activity-type";
import { ApiGeneralRespose } from "@/src/types/common";
import { fetchWithTimeout } from "@/src/utils/utils";


export const createNewNotificationAPI=async(payload:Notification,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const createNewNotificationResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/user_activity/create_new_notification`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return createNewNotificationResponse
    
}