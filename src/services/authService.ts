import { generateToken } from "../libs/jwt";
import { prisma } from "../libs/prisma";
import { LoginData, RegisterData } from "../schemas/user";
import { createUser, findUserByEmail } from "./user";
import bcrypt from "bcrypt";



export const register = async (data: RegisterData) => {
    const hasUser = await findUserByEmail(data.email);

    if (hasUser) throw new Error("Email já cadastrado");

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

    if (!hasUser) throw new Error("Email não cadastrado");

    const passwordMatch = await bcrypt.compare(data.password, hasUser.password);

    if (!passwordMatch) throw new Error("Credenciais inválidas");

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