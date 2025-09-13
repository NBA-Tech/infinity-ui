import { API_BASE_URI } from "@/src/config/app-config";
import { ApiGeneralRespose } from "@/src/types/common"
import { PackageModel, ServiceModel } from "@/src/types/offering/offering-type"
import { fetchWithTimeout } from "@/src/utils/utils";

export const addNewServiceAPI=async(payload:ServiceModel | PackageModel,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const addNewService=await fetchWithTimeout({
        url:`${API_BASE_URI}/offerings/create_new_offering`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return addNewService
}

export const getOfferingListAPI=async(customerID:string,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const getOfferingList=await fetchWithTimeout({
        url:`${API_BASE_URI}/offerings/get_all_offerings?customerID=${customerID}`,
        options: {
            method: 'GET',
            headers
        }
    })
    return getOfferingList
}

export const deleteOfferingApi=async(offeringID:string,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const deleteOffering=await fetchWithTimeout({
        url:`${API_BASE_URI}/offerings/delete_offering?offeringID=${offeringID}`,
        options: {
            method: 'DELETE',
            headers
        }
    })
    return deleteOffering
}

export const updateOfferingServiceAPI=async(payload:ServiceModel | PackageModel,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const updateOfferingService=await fetchWithTimeout({
        url:`${API_BASE_URI}/offerings/update_offering`,
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return updateOfferingService
}