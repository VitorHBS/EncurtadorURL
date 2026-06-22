import { z } from "zod";

export const CreateLinkSchema = z.object({
    url: z.url(),
    slug: z.string(),
    expiresAt: z.date()
})

export const UpdateLinkSchema = z.object({
    url: z.url(),
    expiresAt: z.date()
})