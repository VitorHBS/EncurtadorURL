import { Response } from "express";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateLinkSchema } from "../schemas/link";
import { AppError } from "../utils/AppError";
import { createLink, findLinksByUser } from "../services/link";
import { link } from "fs";



export const createURL = asyncHandler(async (req: ExtendedRequest, res: Response) => {

    if (!req.user) throw new AppError("Usuário não encontrado", 404);

    const userId = req.user.id;

    const safeData = CreateLinkSchema.safeParse(req.body);

    if (!safeData.success) throw new AppError("Dados inválidos", 400);

    const link = await createLink(safeData.data, userId);

    return res.status(201).json({
        status: "success",
        data: link
    });
});

export const findUrlsByUser = asyncHandler(async (req: ExtendedRequest, res: Response) => {

    if (!req.user) throw new AppError("Usuário não encontrado", 404);

    const userId = req.user.id;

    const linksUser = await findLinksByUser(userId);

    return res.status(200).json({linksUser})
});