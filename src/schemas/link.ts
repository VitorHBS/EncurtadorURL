import { z } from "zod";

export const CreateLinkSchema = z.object({
    url: z.url({message: "Erro na URL, formato inválido"}),
    expiresAt: z.coerce.date({message: "data inválida"})

})

export type LinkData = z.infer<typeof CreateLinkSchema>;


export const UpdateLinkSchema = z.object({
    url: z.url({message: "Erro na URL, formato inválido"}).optional(),
    expiresAt: z.coerce.date({message: "data inválida"}).optional()
})

export type UpdateData = z.infer<typeof UpdateLinkSchema>;


