import { IsNotEmpty } from "class-validator";

export class CommentDto{
    @IsNotEmpty()
    postId: string
    @IsNotEmpty()
    commentText: string;

}