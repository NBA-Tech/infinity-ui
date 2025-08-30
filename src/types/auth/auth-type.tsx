export interface AuthModel {
    username: string;
    email: string;
    password?: string;
    firebaseIdToken?: string
    authType: "EMAIL_PASSWORD"| "GOOGLE";

}