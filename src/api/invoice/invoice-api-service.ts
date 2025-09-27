
import { API_BASE_URI } from "@/src/config/app-config"
import { ApiGeneralRespose } from "@/src/types/common"
import { Invoice } from "@/src/types/invoice/invoice-type"
import { fetchWithTimeout } from "@/src/utils/utils"
export const createInvoiceAPI=async(payload:Invoice,header?:Record<string,string>):Promise<ApiGeneralRespose>=>{
    const createInvoiceResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/invoice/create_invoice`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...header
            },
            body: JSON.stringify(payload)
        }
    })
    return createInvoiceResponse

}