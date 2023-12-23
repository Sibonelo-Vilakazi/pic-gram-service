import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import { deletePosts, getAllPosts, getPostById, getUserPosts, updatePostCaption, uploadUserPost } from "../controller/post.controller";

export const postRouter = Router();

postRouter.route('/upload').post(upload.single('file'), uploadUserPost);
postRouter.route('/getAllPosts').get(getAllPosts);
postRouter.route('/getUserPosts/:userId').get(getUserPosts);
postRouter.route('/getPostById/:postId').get(getPostById);
postRouter.route('/updatePostCaption').put(updatePostCaption);
postRouter.route('/deletePost/:userId/:postId').delete(deletePosts);