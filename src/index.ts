import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { User } from "./entity/User"
import { userRouter } from "./routes/user-routes"
require('dotenv').config();

AppDataSource.initialize().then(async () => {

    // create express app
    const host = process.env.HOST ?? 'localhost';
    const port = process.env.PORT ? Number(process.env.PORT) : 3002;
    const app = express()
    app.use(express.json())
    app.use('/users', userRouter)
    // start express server
    app.listen(port, host, () => {
        console.log(`[ ready ] http://${host}:${port}`);
    })

}).catch(error => console.log(error))
