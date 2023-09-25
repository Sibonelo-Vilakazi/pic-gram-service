import { QueryRunner, Repository } from "typeorm";
import { Users } from "../entity/Users";
import { APIResponse } from "../interfaces/api.response";
import { AuthDto } from "../dtos/auth.dto";
import { HttpStatusCode } from "../enum/http-status-code.enum";
import { plainToClass } from "class-transformer";
import { compare, hash } from "bcrypt";
import * as dotenv from 'dotenv';

dotenv.config();
export class AuthService  {

    userRepo: Repository<Users> = null;
    saltRounds 
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

    async login(userData: AuthDto): Promise<APIResponse<Users>>{ 
        
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

        if (!user || !(await compare(userData.password , user.password))) {
            response.error = {
                message: 'Username or password is incorrect',
                status: HttpStatusCode.BadRequest
            }

            return response
        }

        delete user.password;
        delete user.isActive;
        response.result = user;
        
        return response;
    }
}