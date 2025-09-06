import { API_BASE_URI } from "@/src/config/app-config";
import { ApiGeneralRespose, SearchQueryRequest } from "@/src/types/common"
import { CustomerApiResponse, CustomerModel } from "@/src/types/customer/customer-type"
import { fetchWithTimeout } from "@/src/utils/utils";

export const addNewCustomerAPI=async(payload:CustomerModel):Promise<ApiGeneralRespose>=>{
    const addNewCustomer=await fetchWithTimeout({
        url:`${API_BASE_URI}/customer/add_customer`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    })
    const addNewCustomerResponse=await addNewCustomer.json();
    console.log(addNewCustomerResponse)
    return addNewCustomerResponse
    
}

export const getCustomerDetails=async(payload:SearchQueryRequest):Promise<CustomerApiResponse>=>{
    const getCustomerDetails=await fetchWithTimeout({
        url:`${API_BASE_URI}/customer/get_customers`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    })
    const getCustomerDetailsResponse=await getCustomerDetails.json();
    console.log(getCustomerDetailsResponse)
    return getCustomerDetailsResponse
    

}