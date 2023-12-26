export interface CustomTokenOptions{
    userId: string,
    payload: CustomPayload,
    expiry : string ,
    secrete: string
}


export interface CustomPayload {
    userId: string,
    email: string
}





