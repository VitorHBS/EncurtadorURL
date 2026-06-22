import { NextFunction, Response } from "express";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { verifyRequest } from "../services/authService";



export const privateRoute = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const user = await verifyRequest(req);

    if (!user) {
        return res.status(401).json({ error: "Acesso negado" });
    }

    const userNoPassword = {
        id: user.id,
        name: user.name,
        email: user.email
    }

    req.user = userNoPassword;

    next();
}