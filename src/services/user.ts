import { prisma } from "../libs/prisma";
import { RegisterData } from "../schemas/user";
import bcrypt from "bcrypt"


export const createUser = async (data: RegisterData) => {

    const hashedPassword = await bcrypt.hash(data.password, 10)

    return prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword
        }
    })
}