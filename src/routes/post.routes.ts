import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import { PostController} from "../controller/post.controller";
import { protectedRoute } from "../middleware/auth.middleware";

export const postRouter = Router();
const postController = new PostController()
postRouter.route('/upload').post(protectedRoute, upload.single('file'), postController.uploadUserPost);
postRouter.route('/getAllPosts').get(protectedRoute ,postController.getAllPosts);
postRouter.route('/getUserPosts/:userId').get(protectedRoute,postController.getUserPosts);
postRouter.route('/getPostById/:postId').get(protectedRoute,postController.getPostById);
postRouter.route('/updatePostCaption').put(protectedRoute, postController.updatePostCaption);
postRouter.route('/deletePost/:userId/:postId').delete(protectedRoute,postController.deletePosts);
postRouter.route('/likeUnlikePost/:postId').put(protectedRoute,postController.likeUnlikePost);