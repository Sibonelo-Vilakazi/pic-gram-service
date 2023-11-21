import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import { uploadUserPost } from "../controller/post.controller";



export const postRouter = Router();


postRouter.route('/upload').post(upload.single('file'), uploadUserPost)