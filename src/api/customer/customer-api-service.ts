import { API_BASE_URI } from "@/src/config/app-config";
import { ApiGeneralRespose, SearchQueryRequest } from "@/src/types/common"
import { CustomerApiResponse, CustomerModel } from "@/src/types/customer/customer-type"
import { fetchWithTimeout } from "@/src/utils/utils";

export const addNewCustomerAPI=async(payload:CustomerModel,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const addNewCustomerResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/customer/add_customer`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return addNewCustomerResponse
    
}

export const getCustomerDetails=async(payload:SearchQueryRequest,headers?:Record<string,any>):Promise<CustomerApiResponse>=>{
    const getCustomerDetailsResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/customer/get_customers`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return getCustomerDetailsResponse
    

}

export const deleteCustomerAPI=async(customerID:string,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const deleteCustomerResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/customer/delete_customer?customerID=${customerID}`,
        options: {
            method: 'DELETE',
            headers
        },
    })
    return deleteCustomerResponse 
}