import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../enum/http-status-code.enum";
import { QueryRunner } from "typeorm";
import { CommentService } from "../services/comment.service";
import { plainToClass } from "class-transformer";
import { CommentDto } from "../dtos/comment.dto";
import { validate } from "class-validator";


export class CommentController{

    queryRunner: QueryRunner = null;
    constructor(){}
    

    addPostComment = async (req: Request, res: Response, next: NextFunction) =>{

        try {
            this.queryRunner = req['queryRunner'] as QueryRunner;
            const commentData = plainToClass(CommentDto, req.body);
            const errors = await validate(commentData);
            if(errors.length > 0){
                return res.status(HttpStatusCode.BadRequest).json(errors.map((item) => item.constraints))
            }

            const commentService = new CommentService(this.queryRunner);
            const userId = req['userId'];
            const comment = await commentService.addPostComment(commentData, userId);

            await this.queryRunner.commitTransaction();
            return res.json(comment);
        } catch (error) {
            return res.status(HttpStatusCode.InternalServerError).json(error);
        } finally{
            await this.queryRunner.release();
        }
    }


    deletePostComment = async (req: Request, res: Response, next: NextFunction) =>{

        try {
            this.queryRunner = req['queryRunner'] as QueryRunner;
            const commentId = req.params['commentId'];
            console.log(commentId)
            const commentService = new CommentService(this.queryRunner);
            const userId = req['userId'];
            const comment = await commentService.deletePostComment(commentId, userId);

            await this.queryRunner.commitTransaction();
            return res.json(comment);
        } catch (error) {
            return res.status(HttpStatusCode.InternalServerError).json(error);
        } finally{
            await this.queryRunner.release();
        }
    }
}