import { Device } from "@prisma/client";
import { prisma } from "../libs/prisma";
import { findLinkById, findLinkOwnedByUser } from "./link";


export const registerClick = async (linkId: number, country: string, device: Device) => {

    return await prisma.click.create({
        data: {
            country: country,
            device: device,
            linkId: linkId
        }
    })
}

export const analytics = async (linkId: number) => {

    const total = await prisma.click.count({ where: { linkId } });
    const country = await prisma.click.groupBy({ by: ['country'], where: { linkId }, _count: true });
    const device = await prisma.click.groupBy({ by: ['device'], where: { linkId }, _count: true })

    const byMonth = await prisma.$queryRaw`
    SELECT 
        TO_CHAR(DATE_TRUNC('month', "clickedAt"), 'YYYY-MM') as month,
        COUNT(*)::int as clicks
    FROM "Click"
    WHERE "linkId" = ${linkId}
    GROUP BY DATE_TRUNC('month', "clickedAt")
    ORDER BY DATE_TRUNC('month', "clickedAt")
`

    console.log(total)
    console.log(country)
    console.log(device)

    return {
        total,
        byCountry: country.map(country => ({ country: country.country, clicks: country._count })),
        byDevice: device.map(device => ({ device: device.device, clicks: device._count })),
        byMonth: byMonth
    }
}