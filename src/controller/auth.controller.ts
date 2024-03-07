import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../enum/http-status-code.enum";
import { AppDataSource } from "../data-source";
import { AuthService } from "../services/auth.service";
import { AuthDto } from "../dtos/auth.dto";
import { plainToClass } from "class-transformer";
import {validate} from 'class-validator';
import { QueryRunner } from "typeorm";

export class AuthController {
    queryRunner: QueryRunner = null;
    constructor() {}

    registerUser = async (req: Request, res: Response, next: NextFunction) =>{
        try{
            /// await this.queryRunner.startTransaction();
            this.queryRunner = req['queryRunner'] as QueryRunner;
            const user = plainToClass(AuthDto, req.body)
            
            const errors = await validate(user);
            if( errors.length > 0){
                return res.status(HttpStatusCode.BadRequest).json(errors.map((item) => item.constraints))
            }
            const authService = new AuthService(this.queryRunner);
            
            const response = await authService.register(user);
    
            if(response.error){
                return res.status(HttpStatusCode.BadRequest).json(response.error);
            }
            await this.queryRunner.commitTransaction();
            return res.json(response.result);
        }catch(error){
            return res.status(HttpStatusCode.InternalServerError).json(error);
        } finally{
            await this.queryRunner.release()
        }
    }
    
    
    loginUser = async (req: Request, res: Response, next: NextFunction) =>{
        try{
    
            this.queryRunner = req['queryRunner'] as QueryRunner;
            const user = plainToClass(AuthDto, req.body)
            
            const errors = await validate(user);
            if( errors.length > 0){
                return res.status(HttpStatusCode.BadRequest).json(errors.map((item) => item.constraints))
            }
            const authService = new AuthService(this.queryRunner);
            
            const response = await authService.login(user);
    
            if(response.error){
                return res.status(HttpStatusCode.BadRequest).json(response.error);
            }
            await this.queryRunner.commitTransaction();
            return res.json(response.result);
        }catch(error){
            return res.status(HttpStatusCode.InternalServerError).json(error);
        } finally{
            await this.queryRunner.release()
        }
    }
}
