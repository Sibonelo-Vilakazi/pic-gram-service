import { APIError } from "./error.error";

export interface APIResponse<T> {
    result: T;
    error: APIError
}