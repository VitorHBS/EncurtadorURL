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

    //erro desconhecido(bug, lib, etc)
    console.log(err);

    return res.status(500).json({
        status: "error",
        message: "Internal server error"
    })
}