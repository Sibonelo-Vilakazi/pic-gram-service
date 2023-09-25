import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../enum/http-status-code.enum";
import { AppDataSource } from "../data-source";
import { AuthService } from "../services/auth.service";
import { AuthDto } from "../dtos/auth.dto";
import { plainToClass } from "class-transformer";
import {validate} from 'class-validator';

const queryRunner = AppDataSource.createQueryRunner();
export const registerUser = async (req: Request, res: Response, next: NextFunction) =>{
    try{

        await queryRunner.startTransaction();
        const user = plainToClass(AuthDto, req.body)
        
        const errors = await validate(user);
        if( errors.length > 0){
            return res.status(HttpStatusCode.BadRequest).json(errors.map((item) => item.constraints))
        }
        const authService = new AuthService(queryRunner);
        
        const response = await authService.register(user);

        if(response.error){
            return res.status(HttpStatusCode.BadRequest).json(response.error);
        }
        await queryRunner.commitTransaction();
        return res.json(response.result);
    }catch(error){
        return res.status(HttpStatusCode.InternalServerError).json(error);
    }
}


export const loginUser = async (req: Request, res: Response, next: NextFunction) =>{
    try{

        await queryRunner.startTransaction();
        const user = plainToClass(AuthDto, req.body)
        
        const errors = await validate(user);
        if( errors.length > 0){
            return res.status(HttpStatusCode.BadRequest).json(errors.map((item) => item.constraints))
        }
        const authService = new AuthService(queryRunner);
        
        const response = await authService.login(user);

        if(response.error){
            return res.status(HttpStatusCode.BadRequest).json(response.error);
        }
        await queryRunner.commitTransaction();
        return res.json(response.result);
    }catch(error){
        return res.status(HttpStatusCode.InternalServerError).json(error);
    }
}