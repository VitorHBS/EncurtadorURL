import { prisma } from "../libs/prisma";
import { LinkData, UpdateData } from "../schemas/link";
import { AppError } from "../utils/AppError";
import { generateSlug } from "./slug";

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

    const link = await prisma.link.create({
        data: {
            slug: slug,
            url: url,
            expiresAt: expiresAt,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    })

    return link
}

export const findLinksByUser = async (userId: number) => {
    return await prisma.link.findMany({ where: { userId } })
}

export const findLinkById = async (linkId: number) => {
    return await prisma.link.findUnique({where: {id: linkId}})
}


export const slugWithExpires = async (slug: string) => {
    const hasSlug = await prisma.link.findFirst({
        where: {
            slug: slug,
        }
    })

    if (!hasSlug) throw new AppError("Slug inexistente", 404);
    if(hasSlug.expiresAt <= new Date()) throw new AppError("Link Expirado", 410)

    return hasSlug
}


// Função reutilizável para update e delete, acha o id do link e do user
export const findLinkOwnedByUser = async (linkId: number, userId: number) => {
    const link = await prisma.link.findUnique({
        where: {
            id: linkId,
            userId: userId
        }
    });

    if (!link) throw new AppError("Link não existe", 404);

    return link;
}

export const updateLink = async (linkId: number, userId: number, { url, expiresAt }: UpdateData) => {

    const link = await findLinkOwnedByUser(linkId, userId);

    const updatedLink = await prisma.link.update({
        where: {
            id: link.id
        },
        data: {
            ...(url && { url }),
            ...(expiresAt && { expiresAt })
        }
    })

    return updatedLink;
}

export const deleteLink = async (linkId: number, userId: number) => {
    const link = await findLinkOwnedByUser(linkId, userId);

    return await prisma.link.delete({
        where: {
            id: link.id
        }
    })
}

