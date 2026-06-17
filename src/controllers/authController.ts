import { Request, Response } from "express";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { z } from "zod";
import { RegisterSchema } from "../schemas/user";
import { register } from "../services/authService";



export const signup = async (req: ExtendedRequest, res: Response) => {

    const safeData = RegisterSchema.safeParse(req.body);

    if (!safeData.success) return res.status(400).json({ error: z.treeifyError(safeData.error) })

    const newUser = await register(safeData.data);

    return res.status(201).json(newUser)
}

export const signin = async (req: ExtendedRequest, res: Response) => {

}