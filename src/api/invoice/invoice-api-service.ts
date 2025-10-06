
import { API_BASE_URI } from "@/src/config/app-config"
import { ApiGeneralRespose, SearchQueryRequest } from "@/src/types/common"
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

export const getInvoiceListBasedOnFiltersAPI=async(payload:SearchQueryRequest,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const getInvoiceListBasedOnFiltersResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/invoice/get_invoice_based_on_filters`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return getInvoiceListBasedOnFiltersResponse
}

export const getInvoiceMetaInfoDetailsAPI=async(userId:string,headers?:Record<string,string>):Promise<ApiGeneralRespose>=>{
    const getInvoiceMetaInfoDetailsResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/invoice/get_invoices_meta_data?userId=${userId}`,
        options: {
            method: 'GET',
            headers
        },
    })
    return getInvoiceMetaInfoDetailsResponse
}

export const getInvoiceDetailsAPI=async(invoiceId:string,headers?:Record<string,string>):Promise<ApiGeneralRespose>=>{
    const getInvoiceDetailsResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/invoice/get_invoice_details?invoiceId=${invoiceId}`,
        options: {
            method: 'GET',
            headers
        },
    })
    return getInvoiceDetailsResponse
}

export const deleteInvoiceAPI=async(invoiceId:string,headers?:Record<string,string>):Promise<ApiGeneralRespose>=>{
    const deleteInvoiceResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/invoice/delete_invoice?invoiceId=${invoiceId}`,
        options: {
            method: 'DELETE',
            headers
        },
    })
    return deleteInvoiceResponse
}

export const updateInvoiceAPI=async(payload:Invoice,headers?:Record<string,string>):Promise<ApiGeneralRespose>=>{
    const updateInvoiceResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/invoice/update_invoice`,
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return updateInvoiceResponse
}