
import {Router} from 'express';
import { loginUser, registerUser } from '../controller/auth.controller';

export const authRouter = Router();

authRouter.route('/register').post(registerUser);
authRouter.route('/login').post(loginUser);
