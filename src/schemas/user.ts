import { z } from "zod";


export const RegisterSchema = z.object({
    name: z.string().min(2).max(15),
    email: z.email(),
    password: z.string()
        .min(8, "Mínimo 8 caracteres")
        .regex(/[A-Z]/, "Precisa letra maiúscula")
        .regex(/[0-9]/, "Precisa número")
})

export type RegisterData = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
    email: z.email(),
    password: z.string()
        .min(8, "Mínimo 8 caracteres")
        .regex(/[A-Z]/, "Precisa letra maiúscula")
        .regex(/[0-9]/, "Precisa número")
})

export type LoginData = z.infer<typeof LoginSchema>;