import { HttpStatusCode } from "../enum/http-status-code.enum";

export interface APIError{
    message: string;
    status: HttpStatusCode
}