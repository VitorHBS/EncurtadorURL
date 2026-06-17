import { z } from "zod";


export const UserSchema = z.object({
    name: z.string().min(2).max(15),
    email: z.email(),
    password: z.string().min(4).max(20)
})

export type UserData = z.infer<typeof UserSchema>;