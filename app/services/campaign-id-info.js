
import prisma from "@/app/lib/prisma";

export async function getCampaignById(id) {
    return prisma.campaigns.findUnique({
        where: { campaign_id: BigInt(id) },
        include: {
            donations: {
                where: { status: "success" },
                orderBy: { donated_at: "desc" },
                take: 5,
            },
        },
    });
}