// "use client"
// import prisma from "@/app/lib/prisma";

// export default async function UserCampaiginfo({ params }) {
//     const { campaign_Id } = await params;

//     // Fetch directly from database
//     const campaign = await prisma.campaigns.findUnique({
//         where: { campaign_id: BigInt(campaign_Id) }
//     });

//     // Render page layout...
// }

// app/services/campaign-id-info.js
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