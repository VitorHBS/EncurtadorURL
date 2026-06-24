import { Request, Response } from "express";
import { LoginSchema, RegisterSchema } from "../schemas/user";
import { login, register } from "../services/authService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";



export const signup = asyncHandler(async (req: Request, res: Response) => {

    const safeData = RegisterSchema.safeParse(req.body);

    if (!safeData.success) throw new AppError("Dados inválidos", 400)

    const newUser = await register(safeData.data);

    return res.status(201).json(newUser)
});

export const signin = asyncHandler(async (req: Request, res: Response) => {

    const safeData = LoginSchema.safeParse(req.body);

    if (!safeData.success) throw new AppError("Dados inválidos", 400)

    const user = await login(safeData.data);

    return res.status(200).json(user);
})