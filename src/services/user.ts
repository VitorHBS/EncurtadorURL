import { prisma } from "../libs/prisma";
import { RegisterData, UpdateData } from "../schemas/user";
import bcrypt from "bcrypt"
import { AppError } from "../utils/AppError";


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

export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } })
}

export const findUserById = async (id: number) => {
    return prisma.user.findUnique({ where: { id } })
}


export const editUser = async (userId: number, userData: UpdateData) => {

    let newPassword: string | undefined;

    const user = await findUserById(userId);

    if (!user) throw new AppError("Usuário não encontrado", 404);

    if (userData.password && !userData.currentPassword) throw new AppError("Precisa informar a senha atual", 400)

    if (userData.password && userData.currentPassword) {
        const samePassword = await bcrypt.compare(userData.currentPassword, user.password)
        if (!samePassword) throw new AppError("Senha atual incorreta", 400)
        newPassword = await bcrypt.hash(userData.password, 10)
    }

    if (userData.email) {
        const userWithEmail = await findUserByEmail(userData.email)
        if (userWithEmail && userWithEmail.id !== userId) throw new AppError("Email inválido, tente inserir outro", 400)
    }

    //utilitário do TypeScript que pega um tipo existente e torna todos os campos opcionais.
    const dataToUpdate: Partial<{name: string; email: string; password: string}> = {}

    if (userData.name) dataToUpdate.name = userData.name;
    if (userData.email) dataToUpdate.email = userData.email;
    if (newPassword) dataToUpdate.password = newPassword;

    const updateUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: dataToUpdate
    })

    return updateUser
}