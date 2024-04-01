import { Router } from "express";
import { CommentController } from "../controller/comment.controller";
import { protectedRoute } from "../middleware/auth.middleware";



export const commentRouter = Router();
const commentController = new CommentController();

commentRouter.route('').post(protectedRoute, commentController.addPostComment);
commentRouter.route('/:commentId').delete(protectedRoute, commentController.deletePostComment);
