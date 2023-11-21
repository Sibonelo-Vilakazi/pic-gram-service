import { IsNotEmpty, IsOptional } from "class-validator";

export class PostDto{

    @IsNotEmpty()
    userId: string

    @IsNotEmpty()
    imageUrl: string

    @IsOptional()
    caption: string;
}