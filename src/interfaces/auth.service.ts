import { Client } from "./clients.services";
import { responseObj } from "./global";

// the client login credentioal
export interface ClientCredentioal {
    email: string;
    password: string;
} 
// when use authentecation is succeed
export interface IntSuccess extends responseObj{
    currentClient: Client;
} 
// when use authentecation is faild
export interface AuthFaild extends responseObj{
    error: true;
    data: String;
}
// when use authentecation is succeed
export interface LoginSuccess extends responseObj{
    token: string,
    client: Client
}
// new User Regestration data
export interface UserRegestrationData {
    username: string, 
    password: string, 
    email: string
}
// SignUp Succeded Interface
export interface SignUpSuccess {
    token: string;
    client: Client
}