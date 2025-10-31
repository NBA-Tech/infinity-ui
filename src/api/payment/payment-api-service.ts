import { API_BASE_URI } from "@/src/config/app-config"
import { ApiGeneralRespose } from "@/src/types/common"
import { PaymentRequestModel } from "@/src/types/payment/payment-request-type"
import { fetchWithTimeout } from "@/src/utils/utils"

export const generatePaymentLinkAPI=async (payload:PaymentRequestModel,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    console.log("comes")
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