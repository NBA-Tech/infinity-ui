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

export const getInvestmentDetailsUsingOrderIdAPI=(orderId:string,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const getInvestmentDetailsResponse=fetchWithTimeout({
        url:`${API_BASE_URI}/investment/get_investment_by_order_id?orderId=${orderId}`,
        options: {
            method: 'GET',
            headers
        }
    })
    return getInvestmentDetailsResponse
}

export const getInvestmentDetailsUsingUserIdAPI=(userId:string,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const getInvestmentDetailsResponse=fetchWithTimeout({
        url:`${API_BASE_URI}/investment/get_investment_details?userId=${userId}`,
        options: {
            method: 'GET',
            headers
        }
    })
    return getInvestmentDetailsResponse
}

export const getInvestmentDetailsUsingInvestmentIdAPI=(investmentId:string,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const getInvestmentDetailsResponse=fetchWithTimeout({
        url:`${API_BASE_URI}/investment/get_investment_by_investment_id?investmentId=${investmentId}`,
        options: {
            method: 'GET',
            headers
        }
    })
    return getInvestmentDetailsResponse
}

export const updateInvestmentDetailsApi=(payload:InvestmentModel,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const updateInvestmentDetailsResponse=fetchWithTimeout({
        url:`${API_BASE_URI}/investment/update_investment`,
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(payload)
        }
    })
    return updateInvestmentDetailsResponse
}

export const deleteInvestmentAPI=(investmentId:string,headers?:Record<string,any>):Promise<ApiGeneralRespose>=>{
    const deleteInvestmentResponse=fetchWithTimeout({
        url:`${API_BASE_URI}/investment/delete_investment?investmentId=${investmentId}`,
        options: {
            method: 'DELETE',
            headers
        }
    })
    return deleteInvestmentResponse
}