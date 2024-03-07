import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import { PostController} from "../controller/post.controller";
import { protectedRoute } from "../middleware/auth.middleware";

export const postRouter = Router();
const postController = new PostController()
postRouter.route('/upload').post(upload.single('file'), postController.uploadUserPost);
postRouter.route('/getAllPosts').get(protectedRoute ,postController.getAllPosts);
postRouter.route('/getUserPosts/:userId').get(postController.getUserPosts);
postRouter.route('/getPostById/:postId').get(postController.getPostById);
postRouter.route('/updatePostCaption').put(postController.updatePostCaption);
postRouter.route('/deletePost/:userId/:postId').delete(postController.deletePosts);