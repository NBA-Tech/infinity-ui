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

export const getCustomerDetailsAPI=async(customerID:string,headers?:Record<string,any>):Promise<CustomerApiResponse>=>{
    const getCustomerDetailsResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/customer/get_customer_details?customerID=${customerID}`,
        options: {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
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

export const getCustomerListBasedOnFilters=async(payload:SearchQueryRequest,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const getCustomerListBasedOnFiltersResponse=await fetchWithTimeout({
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
    return getCustomerListBasedOnFiltersResponse
}

export const updateCustomerAPI=async(payload:CustomerModel,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const updateCustomerResponse=await fetchWithTimeout({
        url:`${API_BASE_URI}/customer/update_customer_details`,
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return updateCustomerResponse
}