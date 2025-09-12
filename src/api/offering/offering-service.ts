import { API_BASE_URI } from "@/src/config/app-config";
import { ApiGeneralRespose } from "@/src/types/common"
import { ServiceModel } from "@/src/types/offering/offering-type"
import { fetchWithTimeout } from "@/src/utils/utils";



export const addNewServiceAPI=async(payload:ServiceModel):Promise<ApiGeneralRespose>=>{
    const addNewService=await fetchWithTimeout({
        url:`${API_BASE_URI}/offerings/create_new_offering`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    })
    const addNewServiceResponse=await addNewService.json();
    return addNewServiceResponse
}