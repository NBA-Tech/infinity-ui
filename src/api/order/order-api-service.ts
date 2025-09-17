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