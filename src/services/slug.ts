import { nanoid } from "nanoid";
import { prisma } from "../libs/prisma";

export const generateSlug = async () => {
    const slug = await nanoid(8)

    return slug;
}
