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
    const addNewServiceResponse=await addNewService.json();
    return addNewServiceResponse
}

export const getOfferingListAPI=async(customerID:string,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const getOfferingList=await fetchWithTimeout({
        url:`${API_BASE_URI}/offerings/get_all_offerings?customerID=${customerID}`,
        options: {
            method: 'GET',
            headers
        }
    })
    const getOfferingListResponse=await getOfferingList.json();
    return getOfferingListResponse
}