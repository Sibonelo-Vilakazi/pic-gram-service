import { QueryRunner } from 'typeorm';
import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { QueryExpressionMap } from 'typeorm/query-builder/QueryExpressionMap';
import { UserService } from '../services/user-service';
import { HttpStatusCode } from '../enum/http-status-code.enum';


    const queryRunner: QueryRunner = AppDataSource.createQueryRunner();

    const userService: UserService = new UserService(queryRunner)
    
    export const all = async (request: Request, response: Response, next: NextFunction) => {
        try{
            const users = await userService.getUsers();
            return response.status(HttpStatusCode.OK).json(users)
        }catch(error){
            return response.status(HttpStatusCode.InternalServerError).json(error)
        }
    }

    export const  one = async (request: Request, response: Response, next: NextFunction) => {
        
        try{
            const id = parseInt(request.params.id)
            const user = await userService.getUserById(id);
            return response.status(HttpStatusCode.OK).json(user)
        }catch(error){
            return response.status(HttpStatusCode.InternalServerError).json(error)
        }
    }

    export const save  = async (request: Request, response: Response, next: NextFunction) => {
        

        try{
            const { firstName, lastName, age } = request.body;
            const user = Object.assign(new User(), {
                firstName,
                lastName,
                age
            })
            const result = await userService.createUser(user);
            return response.status(HttpStatusCode.OK).json(result)
        }catch(error){
            return response.status(HttpStatusCode.InternalServerError).json(error)
        }
    }

    export const remove = async (request: Request, response: Response, next: NextFunction) => {
        
        try{
            const id = parseInt(request.params.id)
            const user = await userService.remove(id);
            return response.status(HttpStatusCode.OK).json(user)
        }catch(error){
            return response.status(HttpStatusCode.InternalServerError).json(error)
        }
    }
