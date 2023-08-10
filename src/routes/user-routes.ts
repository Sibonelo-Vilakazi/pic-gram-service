
import * as express from 'express';
import { all, one, remove, save } from '../controller/UserController';

export const userRouter = express.Router();


userRouter.route('').get(all)
userRouter.route('/:id').get(one)
userRouter.route('').post(save)
userRouter.route('/:id').delete(remove)