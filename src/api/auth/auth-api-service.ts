import { API_BASE_URI } from "@/src/config/app-config";
import { AuthModel, AuthResponse } from "@/src/types/auth/auth-type";
import { UserApiResponse } from "@/src/types/user/user-type";
import { fetchWithTimeout } from "@/src/utils/utils";

export const registerUser=async (payload:AuthModel):Promise<AuthResponse>=>{
    const registerUserRequest=await fetchWithTimeout({
        url:`${API_BASE_URI}/users/register_user`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    });
    const registerUserResponse=await registerUserRequest.json();
    return registerUserResponse
}

export const loginUser=async(payload:AuthModel):Promise<UserApiResponse>=>{
    const loginUserRequest=await fetchWithTimeout({
        url:`${API_BASE_URI}/users/login_user`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    });
    const loginUserResponse=await loginUserRequest.json();
    return loginUserResponse
}