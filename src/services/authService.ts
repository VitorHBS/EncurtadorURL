import { Request } from "express";
import { generateToken } from "../libs/jwt";
import { prisma } from "../libs/prisma";
import { LoginData, RegisterData } from "../schemas/user";
import { AppError } from "../utils/AppError";
import { createUser, findUserByEmail, findUserById } from "./user";
import bcrypt from "bcrypt";
import { TokenPayload } from "../types/token-payload";



export const register = async (data: RegisterData) => {
    const hasUser = await findUserByEmail(data.email);

    if (hasUser) throw new AppError("Email já cadastrado", 401);

    const newUser = await createUser(data);

    return {
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }
    };
}

export const login = async (data: LoginData) => {

    const hasUser = await findUserByEmail(data.email);

    if (!hasUser) throw new AppError("Credenciais inválidas", 401);

    const passwordMatch = await bcrypt.compare(data.password, hasUser.password);

    if (!passwordMatch) throw new AppError("Credenciais inválidas", 401);

    const token = await generateToken(hasUser.id);

    return {
        user: {
            id: hasUser.id,
            name: hasUser.name,
            email: hasUser.email
        },
        token
    };

}

