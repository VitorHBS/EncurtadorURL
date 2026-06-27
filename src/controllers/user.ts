import { Response } from "express";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateLinkSchema, UpdateLinkSchema } from "../schemas/link";
import { AppError } from "../utils/AppError";
import { createLink, deleteLink, findLinkOwnedByUser, findLinksByUser, updateLink } from "../services/link";



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

    return res.status(200).json({ linksUser })
});


export const updateURL = asyncHandler(async (req: ExtendedRequest, res: Response) => {

    if (!req.user) throw new AppError("Usuário não encontrado", 404);

    const user = req.user.id;

    if (!req.params.id) throw new AppError("sem params informado", 400)

    let id = req.params.id;

    const linkId = Number(id)

    const safeData = UpdateLinkSchema.safeParse(req.body);

    if (!safeData.success) throw new AppError("Dados inválidos", 400);

    const updatedURL = await updateLink(linkId, user, safeData.data)

    return res.status(200).json({ updatedURL })
})

export const deleteURL = asyncHandler(async (req: ExtendedRequest, res: Response) => {

    if (!req.user) throw new AppError("User não encontrado", 404)

    const user = req.user.id

    const id = req.params.id;

    if(!id) throw new AppError("id do link não fornecido", 400);

    const linkId = Number(id);

    const deleted = await deleteLink(linkId, user)

    return res.status(204).json(deleted)
})