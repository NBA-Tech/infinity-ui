import { API_BASE_URI } from "@/src/config/app-config";
import { ApiGeneralRespose } from "@/src/types/common";
import { InvestmentModel } from "@/src/types/investment/investment-type";
import { fetchWithTimeout } from "@/src/utils/utils";


export const addUpdateInvestmentAPI=(payload:InvestmentModel,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const addInvestmentResponse=fetchWithTimeout({
        url:`${API_BASE_URI}/investment/create_new_investment`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return addInvestmentResponse
}