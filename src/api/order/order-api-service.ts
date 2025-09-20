import { API_BASE_URI } from "@/src/config/app-config"
import { ApiGeneralRespose, SearchQueryRequest } from "@/src/types/common"
import { OrderModel } from "@/src/types/order/order-type"
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
        }
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