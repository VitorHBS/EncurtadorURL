import { z } from "zod";

export const CreateLinkSchema = z.object({
    url: z.string().url("Erro na URL, formato inválido"),
    expiresAt: z.string().datetime().or(z.coerce.date()).transform(val => {
        if (typeof val === 'string') {
            return new Date(val);
        }
        return val;
    })
})

export type LinkData = z.infer<typeof CreateLinkSchema>;
