import { QueryRunner, Repository } from "typeorm";
import { Users } from "../entity/Users";
import { Posts } from "../entity/Posts";
import { PostDto } from "../dtos/post.dto";
import { APIResponse } from "../interfaces/api.response";
import { HttpStatusCode } from "../enum/http-status-code.enum";
import { plainToClass } from "class-transformer";
import { UpdatePostCaptionDto } from "../dtos/update-caption.dto";
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)
export class PostService{


    private userRepo : Repository<Users> = null;
    private postRepo: Repository<Posts> = null;


    constructor( private queryRunner: QueryRunner ){
        this.userRepo = this.queryRunner.manager.getRepository(Users);
        this.postRepo = this.queryRunner.manager.getRepository(Posts);

    }


    async uploadThumbnail (postData: PostDto, req: any): Promise<APIResponse<Posts>> {

        const response: APIResponse<Posts> = {
            result: null,
            error: undefined
        }

        const user = await this.userRepo.exist({
            where: {
                id: postData.userId,
                isActive: true
            }
        });

        if (!user) {
            response.error = {
                message: "Can not post for a user that does not exist",
                status: HttpStatusCode.BadRequest
            }

            return response;
        }

        postData.imageUrl = req.file.filename
        const post: Posts = plainToClass(Posts, postData);


        const res = await this.postRepo.save(post).then(() =>{
            response.result = post;
            return response;
        }).catch(async () =>{
            await unlinkAsync(req.file.path);
            return response;

        });
        
        return res;
    }

    async getAllPosts (): Promise<APIResponse<Posts[]>> {
        const response: APIResponse<Posts[]> = {
            result: null,
            error: undefined
        }

        const posts: Posts[] = await this.postRepo.find({
            where: {
                isActive: true
            }
        });
        response.result = posts;

        return response;
    }

    async getPostByID (postId: string): Promise<APIResponse<Posts>> {
        const response: APIResponse<Posts> = {
            result: null,
            error: undefined
        }

        const post: Posts = await this.postRepo.findOne({
            where: {
                isActive: true,
                id: postId
            }
        });

        response.result = post;
        return response;
    }

    async deletePost (postId: string, userId: string): Promise<APIResponse<Posts>> {
        const response: APIResponse<Posts> = {
            result: null,
            error: undefined
        };

        const post = await this.postRepo.findOne({
            where: {
                id: postId,
                isActive: true
            }
        });

        if (!post){
            // error 
            response.error = {
                message: 'Can not delete a post that does not exist',
                status: HttpStatusCode.BadRequest
            }

            return response;
        }else if (post.userId !== userId){
            response.error = {
                message: 'You can not remove content that is not yours',
                status: HttpStatusCode.BadRequest
            }

            return response;
        }

        post.isActive = false;
        await this.postRepo.update(post.id, post);
        response.result = post;
        return response;
    }


    async getUserPosts (userId: string): Promise<APIResponse<Posts[]>> {
        const response: APIResponse<Posts[]> = {
            result: null,
            error: undefined
        }

        const posts: Posts[] = await this.postRepo.find({
            where: {
                isActive: true,
                userId: userId
            }
        });

        response.result = posts;
        return response;
    }

    async updateCaption (postCaption: UpdatePostCaptionDto): Promise<APIResponse<Posts>> {
        const response: APIResponse<Posts> = {
            result: null,
            error: undefined
        };

        const post = await this.postRepo.findOne({
            where: {
                id: postCaption.postId,
                isActive: true
            }
        });

        if (!post){
            // error 
            response.error = {
                message: 'Can not update a post that does not exist',
                status: HttpStatusCode.BadRequest
            }

            return response;
        } else if (post.userId !== postCaption.userId){
            response.error = {
                message: 'You can not update content that is not yours',
                status: HttpStatusCode.BadRequest
            }
            return response
        }

        post.caption = postCaption.caption;
        await this.postRepo.update(post.id, post);
        response.result = post;
        return response;
    }

}