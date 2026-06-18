import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import * as JWT from "jsonwebtoken";



export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    //erro conhecido
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    if (err instanceof JWT.TokenExpiredError) {
        return res.status(401).json({
            status: 'error',
            message: 'Access token has expired',
        })
    }

    if(err instanceof JWT.JsonWebTokenError) {
        return res.status(401).json({
            status: 'error',
            message: 'token is invalid'
        })
    }

    //erro desconhecido(bug, lib, etc)
    console.log(err);

    return res.status(500).json({
        status: "error",
        message: "Internal server error"
    })
}