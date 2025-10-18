import { API_BASE_URI } from "@/src/config/app-config";
import { UserActivity } from "@/src/types/activity/user-activity-type";
import { ApiGeneralRespose } from "@/src/types/common";
import { fetchWithTimeout } from "@/src/utils/utils";


export const createNewActivityAPI=async(payload:UserActivity,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const createNewActivityResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/user_activity_notification/create_new_activity`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return createNewActivityResponse
}

export const getActivityDataAPI=async(userId:string,topLimit:number,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const getActivityDataResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/user_activity_notification/get_activity_data_list?userId=${userId}&topLimit=${topLimit}`,
        options: {
            method: 'GET',
            headers
        },
    })
    return getActivityDataResponse
}