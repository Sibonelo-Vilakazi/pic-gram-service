import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { HttpStatusCode } from "../enum/http-status-code.enum";
import { PostService } from "../services/post.service";
import { plainToClass } from "class-transformer";
import { PostDto } from "../dtos/post.dto";
import { UpdatePostCaptionDto } from "../dtos/update-caption.dto";


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


export const getAllPosts = async (req: Request, res: Response) => {
    try{
        // service 
        await queryRunner.startTransaction();
        const postService = new PostService(queryRunner);
        // call Service
        const response = await postService.getAllPosts();
        

        if(response.error){
            return res.status(response.error.status).json(response.error);
        }
        return res.json(response.result);
    }catch(error){
        return res.status(HttpStatusCode.InternalServerError).json(error)
    }
}

export const getUserPosts = async (req: Request, res: Response) => {

    try{
        await queryRunner.startTransaction();
        const userID = req.params.userId as string;
        const postService = new PostService(queryRunner);
        const response = await postService.getUserPosts(userID);
        if(response.error){
            return res.status(response.error.status).json(response.error);
        }

        return res.json(response.result);
    }catch(error){
        return res.status(HttpStatusCode.InternalServerError).json(error)
    }
}

export const getPostById = async (req: Request, res: Response) => {
    try{
        await queryRunner.startTransaction();
        const postId = req.params.postId as string;
        const postService = new PostService(queryRunner);
        const response = await postService.getPostByID(postId);
        if(response.error){
            return res.status(response.error.status).json(response.error);
        }

        return res.json(response.result);

    }catch(error){
        return res.status(HttpStatusCode.InternalServerError).json(error)
    }
}

export const deletePosts = async (req: Request, res: Response) => {
    try{
        await queryRunner.startTransaction();
        const userID = req.params.userId as string;
        const postID = req.params.postId as string;
        const postService = new PostService(queryRunner);
        // call Service
        const response = await postService.deletePost(postID, userID);
        if(response.error){
            return res.status(response.error.status).json(response.error);
        }
        await queryRunner.commitTransaction();
        return res.json(response.result);
    }catch(error){
        await queryRunner.rollbackTransaction();
        return res.status(HttpStatusCode.InternalServerError).json(error)
    }

}

export const updatePostCaption = async (req: Request, res: Response) => {
    try{
        await queryRunner.startTransaction();
        const postService = new PostService(queryRunner);
        const updateCaption: UpdatePostCaptionDto = plainToClass(UpdatePostCaptionDto, req.body)
        const response = await postService.updateCaption(updateCaption);
        if(response.error){
            return res.status(response.error.status).json(response.error);
        }

        await queryRunner.commitTransaction();
        return res.json(response.result);
    }catch(error){
        await queryRunner.rollbackTransaction();
        return res.status(HttpStatusCode.InternalServerError).json(error)
    }

}

