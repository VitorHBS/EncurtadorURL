import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";
import { AppError } from "../utils/AppError";
import { findLinkOwnedByUser, slugWithExpires } from "../services/link";
import { analytics, registerClick } from "../services/click";
import { Device } from "@prisma/client";
import { ExtendedRequest } from "../types/ExtendedRequest";


export const countClick = asyncHandler(async (req: Request, res: Response) => {

    const slug = req.params.slug

    const hasSlug = await slugWithExpires(slug as string)

    try {
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

        await registerClick(hasSlug.id, geo?.country ?? "UNKNOWN", deviceType)

    } catch (e) {
        console.error("Falha ao registrar clique:", e)
    }

    return res.status(302).redirect(hasSlug.url)
});




export const analyticsCount = asyncHandler(async (req: ExtendedRequest, res: Response) => {

    const user = req.user!.id
    const link = req.params.id

    const linkUser = await findLinkOwnedByUser(Number(link), user)

    const data = await analytics(linkUser.id)

    console.log(data)

    return res.status(200).json({
        total: data.total,
        country: data.byCountry,
        device: data.byDevice,
        month: data.byMonth
    })
})