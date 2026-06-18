import { NextFunction, Response } from "express";
import { ExtendedRequest } from "../types/ExtendedRequest";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { findUserById } from "../services/user";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

dotenv.config();


export const Auth = {
    private: asyncHandler(async (req: ExtendedRequest, res: Response, next: NextFunction) => {

        if (!req.headers.authorization) throw new AppError("Token não fornecido", 401)

        const [authType, token] = req.headers.authorization.split(" ");

        if (authType !== "Bearer" || !token) {
            throw new AppError("Formato de token inválido", 401)
        }

        const decoded = JWT.verify(
            token,
            process.env.JWT_SECRET_KEY as string
        );

        if (typeof (decoded) !== "object") throw new AppError("Tipo decoded incorreto", 401)

        const user = await findUserById(decoded.id);

        if (!user) throw new AppError("Usuário inexistente", 401);

        const userNoPassword = {
            id: user.id,
            name: user.name,
            email: user.email
        }

        req.user = userNoPassword;

        next();
    })
}