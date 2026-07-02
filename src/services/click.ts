import { Device } from "@prisma/client";
import { prisma } from "../libs/prisma";
import { ClickEnumData } from "../schemas/click";
import { slugWithExpires } from "./link";




export const registerClick = async (slug: string, country: string, device: Device) => {

    const link = await slugWithExpires(slug)

    const click = await prisma.click.create({
        data: {
            country: country,
            device: device,
            linkId: link.id
        }
    })

    return click
}