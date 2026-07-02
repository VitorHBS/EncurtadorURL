import { z } from "zod";

export const ClickEnum = z.object({
    device: z.enum(["DESKTOP", "TABLET", "MOBILE"])
})

export type ClickEnumData = z.infer<typeof ClickEnum>;