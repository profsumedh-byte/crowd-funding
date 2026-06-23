"use server";

import prisma from "@/app/lib/prisma";

export async function createCampaign(data) {
    await prisma.campaigns.create({ data });
    return { success: true, message: "Campaign created" };
}

export async function getUserCampaigns(email) {
    if (!email) return [];
    const decoded = decodeURIComponent(email).trim();

    const user = await prisma.users.findUnique({
        where: {
            email: decoded
        }
    });
    if (!user) return [];
    
    const campaignsList = await prisma.campaigns.findMany({
        where: { user_id: user.user_id },
        orderBy: { created_at: "desc" }
    });

    return campaignsList.map(camp => ({
        id: camp.campaign_id.toString(),
        title: camp.title,
        about: camp.about,
        goal: "₹" + parseFloat(camp.goal_amount).toLocaleString("en-IN"),
        raised: "₹" + parseFloat(camp.current_amount).toLocaleString("en-IN"),
        status: camp.status === "active" ? "Active" : "Completed",
        banner: camp.cover_image
    }));
}

export async function createDonation({ campaign_id, donor_name, amount, message, status = "pending", payment_id }) {
    if (!payment_id) {
        throw new Error("Payment ID (or Order ID) is required to create a donation.");
    }
    
    const result = await prisma.$transaction(async (tx) => {
        const donation = await tx.donations.create({
            data: {
                campaign_id: BigInt(campaign_id),
                donor_name,
                amount,
                message: message ?? null,
                payment_id,
                status,
            },
        });

        // Only increment campaign's current_amount if the status is immediately success
        if (status === "success") {
            await tx.campaigns.update({
                where: { campaign_id: BigInt(campaign_id) },
                data: {
                    current_amount: {
                        increment: amount,
                    },
                },
            });
        }

        return donation;
    });

    return { success: true, donation_id: result.donation_id.toString() };
}

// Call this from your Razorpay webhook / payment verification route
export async function confirmDonation({ donation_id, payment_id }) {
    await prisma.$transaction([
        prisma.donations.update({
            where: { donation_id: BigInt(donation_id) },
            data: { status: "success", payment_id },
        }),
        // Keep current_amount in sync with confirmed donations
        prisma.$executeRaw`
            UPDATE campaigns
            SET current_amount = (
                SELECT COALESCE(SUM(amount), 0)
                FROM donations
                WHERE campaign_id = (
                    SELECT campaign_id FROM donations WHERE donation_id = ${BigInt(donation_id)}
                )
                AND status = 'success'
            )
            WHERE campaign_id = (
                SELECT campaign_id FROM donations WHERE donation_id = ${BigInt(donation_id)}
            )
        `,
    ]);

    return { success: true };
}