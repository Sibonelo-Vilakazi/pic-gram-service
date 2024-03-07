import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../enum/http-status-code.enum";
import { AppDataSource } from "../data-source";
import { QueryRunner } from "typeorm";


export async function initializeQueryRunnerMiddleware( req: Request, res: Response, next: NextFunction) {
        try{
            const queryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            req['queryRunner'] = queryRunner as QueryRunner;
            next();
        }catch(error ){
            res.status(HttpStatusCode.InternalServerError).send('Internal Server Error');
        }
}