import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { HttpStatusCode } from "../enum/http-status-code.enum";
import { PostService } from "../services/post.service";
import { plainToClass } from "class-transformer";
import { PostDto } from "../dtos/post.dto";
import { UpdatePostCaptionDto } from "../dtos/update-caption.dto";
import { QueryRunner } from "typeorm";




export class PostController {
    queryRunner = null;

    constructor(){}

     uploadUserPost = async (req: Request, res: Response) => {

        try {
            
             this.queryRunner = req['queryRunner'] as QueryRunner;
            const postService = new PostService(this.queryRunner);
            // call Service
            const postData = plainToClass(PostDto, JSON.parse(req.body.data));
    
            const response = await postService.uploadThumbnail(postData, req);
            
    
            if(response.error){
                return res.status(response.error.status).json(response.error);
            }
    
            await this.queryRunner.commitTransaction();
            return res.json(response.result);
            
        } catch (error) {
            return res.status(HttpStatusCode.InternalServerError).json(error)
        } finally{
            await this.queryRunner.release()
        }

    }
    
    
     getAllPosts = async (req: Request, res: Response) => {
        try{
            // service 
             this.queryRunner = req['queryRunner'] as QueryRunner;
            const postService = new PostService(this.queryRunner);
            // call Service
            const response = await postService.getAllPosts();
            
    
            if(response.error){
                return res.status(response.error.status).json(response.error);
            }
            return res.json(response.result);
        }catch(error){
            return res.status(HttpStatusCode.InternalServerError).json(error)
        } finally{
            await this.queryRunner.release()
        }
    }
    
     getUserPosts = async (req: Request, res: Response) => {
    
        try{
             this.queryRunner = req['queryRunner'] as QueryRunner;
            const userID = req.params.userId as string;
            const postService = new PostService(this.queryRunner);
            const response = await postService.getUserPosts(userID);
            if(response.error){
                return res.status(response.error.status).json(response.error);
            }
    
            return res.json(response.result);
        }catch(error){
            return res.status(HttpStatusCode.InternalServerError).json(error)
        } finally{
            await this.queryRunner.release()
        }
    }
    
     getPostById = async (req: Request, res: Response) => {
        try{
             this.queryRunner = req['queryRunner'] as QueryRunner;
            const postId = req.params.postId as string;
            const postService = new PostService(this.queryRunner);
            const response = await postService.getPostByID(postId);
            if(response.error){
                return res.status(response.error.status).json(response.error);
            }
    
            return res.json(response.result);
    
        }catch(error){
            return res.status(HttpStatusCode.InternalServerError).json(error)
        } finally{
            await this.queryRunner.release()
        }
    }
    
     deletePosts = async (req: Request, res: Response) => {
        try{
             this.queryRunner = req['queryRunner'] as QueryRunner;
            const userID = req.params.userId as string;
            const postID = req.params.postId as string;
            const postService = new PostService(this.queryRunner);
            // call Service
            const response = await postService.deletePost(postID, userID);
            if(response.error){
                return res.status(response.error.status).json(response.error);
            }
            await this.queryRunner.commitTransaction();
            return res.json(response.result);
        }catch(error){
            await this.queryRunner.rollbackTransaction();
            return res.status(HttpStatusCode.InternalServerError).json(error)
        } finally{
            await this.queryRunner.release()
        }
    
    }
    
     updatePostCaption = async (req: Request, res: Response) => {
        try{
             this.queryRunner = req['queryRunner'] as QueryRunner;
            const postService = new PostService(this.queryRunner);
            const updateCaption: UpdatePostCaptionDto = plainToClass(UpdatePostCaptionDto, req.body)
            const response = await postService.updateCaption(updateCaption);
            if(response.error){
                return res.status(response.error.status).json(response.error);
            }
    
            await this.queryRunner.commitTransaction();
            return res.json(response.result);
        }catch(error){
            await this.queryRunner.rollbackTransaction();
            return res.status(HttpStatusCode.InternalServerError).json(error);
        } finally{
            await this.queryRunner.release();
        }
    
    }
    
    
}

