import * as express from "express";
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { userRouter } from "./routes/user-routes"
import { authRouter } from "./routes/auth.route";
import { postRouter } from "./routes/post.routes";
import { initializeQueryRunnerMiddleware } from "./middleware/query-runner.middleware";
import { commentRouter } from "./routes/comment.route";
require('dotenv').config();

AppDataSource.initialize().then(async () => {

    // create express app
    const host = process.env.HOST ?? 'localhost';
    const port = process.env.PORT ? Number(process.env.PORT) : 3002;
    const app = express()
    app.use(express.json())
    app.use(initializeQueryRunnerMiddleware)
    app.use('/uploads', express.static('uploads'));
    app.use('/users', userRouter);
    app.use('/auth', authRouter);
    app.use('/post', postRouter);
    app.use('/comment', commentRouter);
    // start express server
    app.listen(port, host, () => {
        console.log(`[ ready ] http://${host}:${port}`);
    })

}).catch(error => console.log(error))
