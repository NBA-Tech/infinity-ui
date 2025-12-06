import { API_BASE_URI } from "@/src/config/app-config"
import { ApiGeneralRespose } from "@/src/types/common"
import { PaymentRequestModel } from "@/src/types/payment/payment-request-type"
import { PaymentModel } from "@/src/types/payment/payment-type"
import { fetchWithTimeout } from "@/src/utils/utils"

export const generatePaymentLinkAPI=async (payload:PaymentRequestModel,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const generatePaymentLinkResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/payment/create_payment_link`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return generatePaymentLinkResponse
}
export const savePaymentTransactionAPI=async(paymentId:string,userId:string,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const savePaymentTransactionResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/payment/save_payment_transaction?paymentId=${paymentId}&userId=${userId}`,
    })
    return savePaymentTransactionResponse
}

export const getTransactionListAPI=async(userId:string,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const getPaymentListResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/payment/get_payment_list?userId=${userId}`,
        options: {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        }
    })
    return getPaymentListResponse
}