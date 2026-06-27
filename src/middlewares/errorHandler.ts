import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";



export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    //erro conhecido
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }



    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            status: 'error',
            message: 'Access token has expired',
        })
    }

    if (err.name === "JsonWebTokenError") {
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