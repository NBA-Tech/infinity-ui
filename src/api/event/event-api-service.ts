import { API_BASE_URI } from "@/src/config/app-config";
import { EventModel } from "@/src/types/event/event-type";
import { fetchWithTimeout } from "@/src/utils/utils";


export const createNewEventAPI=async(payload:EventModel,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const createNewEventResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/event/create_new_event`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return createNewEventResponse
}

export const getEventDetailsAPI=async (userId:string,eventDate:string,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const getEventDetailsResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/event/get_event_details?userId=${userId}&eventDate=${eventDate}`,
        options: {
            method: 'GET',
            headers
        },
    })
    return getEventDetailsResponse   
}

export const getEventBasedMonthYearAPI=async (month:number,year:number,userId:string,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const getEventBasedMonthYearResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/event/get_event_based_on_month_year?month=${month}&year=${year}&userId=${userId}`,
        options: {
            method: 'GET',
            headers
        },
    })
    return getEventBasedMonthYearResponse
}

export const updateEventAPI=async(payload:EventModel,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const updateEventResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/event/update_event_details`,
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return updateEventResponse
}

export const deleteEventAPI=async(eventId:string,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const deleteEventResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/event/delete_event_details?eventId=${eventId}`,
        options: {
            method: 'DELETE',
            headers
        },
    })
    return deleteEventResponse
}