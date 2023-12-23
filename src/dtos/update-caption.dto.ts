import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class UpdatePostCaptionDto{

    @IsNotEmpty()
    @IsUUID()
    userId: string

    @IsNotEmpty()
    @IsUUID()
    postId: string;
    @IsOptional()
    caption: string;
}