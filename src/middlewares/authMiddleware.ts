import { NextFunction, Response } from "express";
import { ExtendedRequest } from "../types/ExtendedRequest";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { findUserById } from "../services/user";

dotenv.config();


export const Auth = {
    private: async (req: ExtendedRequest, res: Response, next: NextFunction) => {

        if (!req.headers.authorization) return res.status(401).json({ error: "Token não fornecido" })

        const [authType, token] = req.headers.authorization.split(" ");

        if (authType !== "Bearer" || !token) {
            return res.status(401).json({ error: "Formato de token inválido" })
        }

        try {
            const decoded = JWT.verify(
                token,
                process.env.JWT_SECRET_KEY as string
            );

            if (typeof (decoded) !== "object") return res.status(400).json({ error: "tipo do decoded incorreto" })

            const user = await findUserById(decoded.id);

            if (!user) return res.status(401).json({ error: "usuário não existe" })

            req.user = user;

            next();
        } catch (error) {
            return res.status(401).json({ error: "Token inválido ou expirado" })
        }
    }
}