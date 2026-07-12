import { Device } from "@prisma/client";
import { prisma } from "../libs/prisma";


export const registerClick = async (linkId: number, country: string, device: Device) => {

    return await prisma.click.create({
        data: {
            country: country,
            device: device,
            linkId: linkId
        }
    })
}