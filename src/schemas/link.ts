import { z } from "zod";

export const CreateLinkSchema = z.object({
    url: z.url({message: "Erro na URL, formato inválido"}),
    expiresAt: z.coerce.date({message: "data inválida"})

})

export type LinkData = z.infer<typeof CreateLinkSchema>;
