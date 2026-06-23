import { prisma } from "../libs/prisma";
import { LinkData } from "../schemas/link";
import { AppError } from "../utils/AppError";
import { generateSlug } from "./slug";
import { findUserById } from "./user";

export const createLink = async ({ url, expiresAt }: LinkData, userId: number) => {
    let slug = await generateSlug();


    let hasLink = await prisma.link.findUnique({
        where: { slug }
    })

    while (hasLink) {
        slug = await generateSlug();


        hasLink = await prisma.link.findUnique({
            where: { slug }
        })
    }

    const user = await findUserById(userId);

    if (!user) throw new AppError("usuário nao encontrado", 404)

    const link = await prisma.link.create({
        data: {
            slug: slug,
            url: url,
            expiresAt: expiresAt,
            user: {
                connect: {
                    id: user.id
                }
            }
        }
    })

    return link
}