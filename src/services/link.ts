import { prisma } from "../libs/prisma";
import { LinkData, UpdateData } from "../schemas/link";
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
            ...(url && {url}),
            ...(expiresAt && {expiresAt})
        }
    })

    return updatedLink;
}