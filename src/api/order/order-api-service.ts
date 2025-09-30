import { API_BASE_URI } from "@/src/config/app-config"
import { ApiGeneralRespose, SearchQueryRequest } from "@/src/types/common"
import { OrderModel, OrderStatus, OrderType } from "@/src/types/order/order-type"
import { fetchWithTimeout } from "@/src/utils/utils"

export const saveNewOrderAPI=async(payload:OrderModel,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const saveNewOrderResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/order/create_new_order`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return saveNewOrderResponse
}

export const getOrderDataListAPI=async(payload:SearchQueryRequest,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const getOrderDataListResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/order/get_orders_based_on_filters`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return getOrderDataListResponse

}

export const deleteOrderAPI=async(orderID:string,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const deleteOrderResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/order/delete_order?orderID=${orderID}`,
        options: {
            method: 'DELETE',
            headers
        }
    })
    return deleteOrderResponse
}

export const getOrderDetailsAPI=async(orderID:string,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const getOrderDetailsResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/order/get_order_details?orderId=${orderID}`,
        options: {
            method: 'GET',
            headers
        },
    })
    return getOrderDetailsResponse
}

export const updateOrderDetailsAPI=async(payload:OrderModel,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const updateOrderDetailsResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/order/update_order_details`,
        options: {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return updateOrderDetailsResponse
}

export const updateServiceCompletionStatus=async(orderId:string,offerId:string,isCompleted:boolean,orderType:OrderType,headers?:Record<string,string>):Promise<ApiGeneralRespose>=>{
     const updateServiceCompletionResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/order/update_service_completion?orderId=${orderId}&offerId=${offerId}&isCompleted=${isCompleted}&orderType=${orderType}`,
        options: {
            method: 'GET',
            headers
        },
    })
    return updateServiceCompletionResponse
}
export const getOrderMetaDataAPI=async(userId:string,headers?:Record<string,string>):Promise<ApiGeneralRespose>=>{
    const getOrderMetaDataResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/order/get_order_meta_data?userId=${userId}`,
        options: {
            method: 'GET',
            headers
        },
    })
    return getOrderMetaDataResponse
}