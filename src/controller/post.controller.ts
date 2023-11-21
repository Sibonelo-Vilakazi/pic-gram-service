import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { HttpStatusCode } from "../enum/http-status-code.enum";
import { PostService } from "../services/post.service";
import { plainToClass } from "class-transformer";
import { PostDto } from "../dtos/post.dto";


const queryRunner = AppDataSource.createQueryRunner();


export const uploadUserPost = async (req: Request, res: Response) => {

    try {
        
        await queryRunner.startTransaction();
        const postService = new PostService(queryRunner);
        // call Service
        const postData = plainToClass(PostDto, JSON.parse(req.body.data));

        const response = await postService.uploadThumbnail(postData, req);
        

        if(response.error){
            return res.status(response.error.status).json(response.error);
        }

        await queryRunner.commitTransaction();
        return res.json(response.result);
        
    } catch (error) {
        return res.status(HttpStatusCode.InternalServerError).json(error)
    }
}