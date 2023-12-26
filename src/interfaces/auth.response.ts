import { Users } from "../entity/Users";

export interface AuthResponse{
    user: Users,
    accessToken: string,
}