import { QueryRunner, Repository } from "typeorm";
import { CommentDto } from "../dtos/comment.dto";
import { Comments } from "../entity/Comments";
import { APIResponse } from "../interfaces/api.response";
import { Posts } from "../entity/Posts";
import { HttpStatusCode } from "../enum/http-status-code.enum";
import { plainToClass } from "class-transformer";


export class CommentService {

    commentRepo: Repository<Comments> = null;
    postRepo: Repository<Posts> = null;

    constructor(queryRunner: QueryRunner){
        this.commentRepo = queryRunner.manager.getRepository(Comments);
        this.postRepo = queryRunner.manager.getRepository(Posts);
    }


    async addPostComment (commentDto: CommentDto, userId: string): Promise<APIResponse<Comments>>{
        const response:APIResponse<Comments> = {
            result: null,
            error: null
        }

        const postData = await this.postRepo.findOne({
            where: {
                id: commentDto.postId
            }
        });

        if (!postData || !postData.isActive){
            response.error = {
                message: 'Failed to add comment for a post that does not exist',
                status: HttpStatusCode.BadRequest
            }

            return response;
        }

        const comment: Comments = plainToClass(Comments, commentDto);
        comment.userId = userId;

        await this.commentRepo.save(comment).then((res: Comments) => {
            response.result = res;
        }).catch((error) =>{
            response.error = {
                message: 'Failed to add a comment for this post',
                status: HttpStatusCode.BadRequest
            }
        });


        return response;
    }

    async deletePostComment ( commentId:string, userId: string ): Promise<APIResponse<string>>{
        const response: APIResponse<string> = {
            result: '',
            error: null
        }

        const commentExists = this.commentRepo.exist({
            where: {
                id: commentId,
                userId: userId,
                isActive: true
            }
        })

        if (!commentExists){
            response.error = {
                message: 'Can not remove a comment that does not exist',
                status: HttpStatusCode.BadRequest
            }   
            return response;
        } 

        this.commentRepo.update({id: commentId},{isActive: false} ).then((res) =>{
            response.result = 'Successfully removed a comment';
            
        }).catch((err) =>{
            response.error = {
                message: 'Something when wrong when trying to delete comment',
                status: HttpStatusCode.BadRequest
            }
        });


        return response;
    }
}