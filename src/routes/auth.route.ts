
import {Router} from 'express';
import { AuthController } from '../controller/auth.controller';

const authController = new AuthController();

export const authRouter = Router();

authRouter.route('/register').post(authController.registerUser);
authRouter.route('/login').post(authController.loginUser);
