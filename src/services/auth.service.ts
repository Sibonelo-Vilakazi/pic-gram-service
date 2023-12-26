import { QueryRunner, Repository } from "typeorm";
import { Users } from "../entity/Users";
import { APIResponse } from "../interfaces/api.response";
import { AuthDto } from "../dtos/auth.dto";
import { HttpStatusCode } from "../enum/http-status-code.enum";
import { plainToClass } from "class-transformer";
import { compare, hash } from "bcrypt";
import * as dotenv from 'dotenv';
import { CustomTokenOptions } from "../interfaces/custom-token-options";
import { SignOptions, sign } from "jsonwebtoken";
import { AuthResponse } from "../interfaces/auth.response";

dotenv.config();
export class AuthService  {

    userRepo: Repository<Users> = null; 
    constructor(private queryRunner: QueryRunner){
        this.userRepo = this.queryRunner.manager.getRepository(Users);
    }

    async register(userData: AuthDto): Promise<APIResponse<Users>>{ 
        
        const response: APIResponse<Users> ={
            result: null,
            error: undefined
        }

        const user = await this.userRepo.findOne( {
            where: {
                email: userData.email,
                isActive: true
                
            }
        });

        if (user) {
            response.error = {
                message: 'This username already exists',
                status: HttpStatusCode.BadRequest
            }

            return response
        }

        const newUser = plainToClass(Users, userData);
        newUser.password = await hash(userData.password, parseInt(process.env.SALT));
        await this.userRepo.save(newUser)
        response.result = newUser;
        delete newUser.password;
        delete newUser.isActive;
        return response;
    }

    async login(userData: AuthDto): Promise<APIResponse<AuthResponse>>{ 
        
        const response: APIResponse<AuthResponse> ={
            result: null,
            error: undefined
        }

        const user = await this.userRepo.findOne( {
            where: {
                email: userData.email,
                isActive: true
                
            }
        });

        if (!user || !(await compare(userData.password , user.password))) {
            response.error = {
                message: 'Username or password is incorrect',
                status: HttpStatusCode.BadRequest
            }

            return response
        }

        delete user.password;
        delete user.isActive;
        const customToken: CustomTokenOptions = {
            expiry: '1h',
            payload: {
                userId: user.id,
                email: user.email
            },
            secrete: process.env.SECRET_KEY,
            userId: user.id
        }
        const customRefresh = {...customToken};
        customRefresh.secrete = process.env.REFRESH_SECRET_KEY;
        customRefresh.expiry = '1d';

        const result: AuthResponse ={
            user: user,
            accessToken: await this.generateAccessToken(customToken),
            refreshToken: await this.generateRefreshToken(customRefresh)
        }
        response.result = result;
        
        return response;
    }

    async generateToken(customToken: CustomTokenOptions): Promise<APIResponse<string>>{
        const response: APIResponse<string> ={
            result: null,
            error: undefined
        }


        const signOption: SignOptions = {
            expiresIn: customToken.expiry,
            audience: customToken.userId
        };

        if (!customToken.secrete || customToken.secrete === '') {
            throw new Error('Secrete key can not be null');
        }


        const token = sign(customToken.payload, customToken.secrete, signOption);


        response.result = token;
        return response;
    }

    async generateAccessToken(customToken: CustomTokenOptions): Promise<string>{
        const response = await this.generateToken(customToken);
        return response.result;
    } 

    async generateRefreshToken(customToken: CustomTokenOptions): Promise<string>{
        const response = await this.generateToken(customToken);
        return response.result;
    } 

    
}