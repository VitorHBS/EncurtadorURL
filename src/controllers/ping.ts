import type { Request, Response } from "express"

export const ping = async (req: Request, res: Response) => {
    return res.json({ status: "pong" })
}