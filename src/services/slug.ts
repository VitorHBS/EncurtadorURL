import { nanoid } from "nanoid";

export const generateSlug = async () => {
    const slug = await nanoid(8)

    return slug;
}