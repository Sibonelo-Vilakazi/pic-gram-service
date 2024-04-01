import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../enum/http-status-code.enum";
import { verify } from "jsonwebtoken";


export async function protectedRoute (req: Request, res: Response, next: NextFunction){

    const headers = req.headers.authorization;

    let token = '';

    if(headers && headers.startsWith('Bearer')){
        token = headers.split(' ')[1];
    }

    if(!token){
        return res.status(HttpStatusCode.Unauthorized).json();
    }

    verify(token, process.env.SECRET_KEY, (err, data) =>{
        if(err){
            return res.status(HttpStatusCode.Forbidden).json();
        }

        req['userId'] = data['userId'];

        next();
    });
}