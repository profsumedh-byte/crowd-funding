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