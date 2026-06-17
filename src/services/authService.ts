import { generateToken } from "../libs/jwt";
import { prisma } from "../libs/prisma";
import { UserData } from "../schemas/user";
import { createUser } from "./user";


export const register = async (data: UserData) => {
    const hasUser = await prisma.user.findUnique({
        where: { email: data.email }
    });

    if (hasUser) throw new Error("Email já cadastrado");

    const newUser = await createUser(data);

    const token = await generateToken(newUser.id);

    return {
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        },
        token
    };
}