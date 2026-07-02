import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";
import { AppError } from "../utils/AppError";
import { slugWithExpires } from "../services/link";
import { registerClick } from "../services/click";
import { Device } from "@prisma/client";
import { json } from "zod";


export const countClick = asyncHandler(async (req: Request, res: Response) => {

    const slug = req.params.slug

    const hasSlug = await slugWithExpires(slug as string)

    const parser = new UAParser(req.headers["user-agent"])
    const device = parser.getResult()
    let deviceType: Device;

    if (device.device.type === "tablet") {
        deviceType = Device.TABLET
    }
    else if (device.device.type === "mobile") {
        deviceType = Device.MOBILE
    }
    else {
        deviceType = Device.DESKTOP
    }

    if (!req.ip) throw new AppError("sem endereço de IP", 400)
    const geo = geoip.lookup(req.ip);

    const click = await registerClick(hasSlug.slug, geo?.country ?? "UNKNOWN", deviceType)

    return res.redirect(`http://${hasSlug.url}`)
});