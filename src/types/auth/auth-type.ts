export interface AuthModel {
    username?: string;
    email: string;
    password?: string;
    firebaseIdToken?: string
    authType: "EMAIL_PASSWORD"| "GOOGLE";

}
export interface AuthResponse{
    status:number;
    success:boolean;
    message:string;
    userId?:string
}