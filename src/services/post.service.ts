import { QueryRunner, Repository } from "typeorm";
import { Users } from "../entity/Users";
import { Posts } from "../entity/Posts";
import { PostDto } from "../dtos/post.dto";
import { APIResponse } from "../interfaces/api.response";
import { HttpStatusCode } from "../enum/http-status-code.enum";
import { plainToClass } from "class-transformer";
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
}