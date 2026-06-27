"use server";

import prisma from "@/app/lib/prisma";
import crypto from "crypto";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
    await prisma.$transaction(async (tx) => {
        const donation = await tx.donations.findUnique({
            where: { donation_id: BigInt(donation_id) }
        });

        if (!donation) {
            throw new Error(`Donation record not found for id: ${donation_id}`);
        }

        // Only increment the campaign's current_amount if the donation is not already successful
        if (donation.status !== "success") {
            await tx.donations.update({
                where: { donation_id: BigInt(donation_id) },
                data: { status: "success", payment_id },
            });

            if (donation.campaign_id) {
                await tx.campaigns.update({
                    where: { campaign_id: donation.campaign_id },
                    data: {
                        current_amount: {
                            increment: donation.amount
                        }
                    }
                });
            }
        } else {
            // Already success, just update the payment_id if it has changed
            await tx.donations.update({
                where: { donation_id: BigInt(donation_id) },
                data: { payment_id },
            });
        }
    });

    return { success: true };
}

export async function claim_campaign_fund(id) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error("Unauthorized: No session found");
    }

    const email = session.user.email;
    const decoded = decodeURIComponent(email).trim();

    if (!id) {
        throw new Error("Campaign ID is required");
    }

    let campaignId;
    try {
        campaignId = BigInt(id);
    } catch (e) {
        throw new Error("Invalid Campaign ID");
    }

    // 1. Find user and their Cashfree payout details
    const user = await prisma.users.findUnique({
        where: { email: decoded },
        include: {
            cashfree_payment_accounts: true
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    // 2. Check for active linked Cashfree payment account
    const paymentAccount = user.cashfree_payment_accounts;
    if (!paymentAccount || paymentAccount.status !== "active" || !paymentAccount.beneficiary_id) {
        throw new Error("No active/verified Cashfree payment account linked. Please configure your payment details first.");
    }

    // 3. Find campaign and verify ownership
    const campaign = await prisma.campaigns.findUnique({
        where: { campaign_id: campaignId }
    });

    if (!campaign) {
        throw new Error("Campaign not found");
    }

    if (campaign.user_id !== user.user_id) {
        throw new Error("Unauthorized: You do not own this campaign");
    }

    // 4. Validate claimable amount
    const amountToClaim = parseFloat(campaign.current_amount);
    if (amountToClaim <= 0) {
        throw new Error("No funds available to claim for this campaign.");
    }

    // 5. Initiate the Cashfree Payout transfer
    const clientId = process.env.CASHFREE_CLIENT_ID;
    const publicKey = process.env.PUBLIC_CASHFREE_KEY;

    if (!clientId || !publicKey || !process.env.CASHFREE_SECRET) {
        throw new Error("Cashfree API configuration is missing in environment variables.");
    }

    const { generateSignature } = await import("./payouts/user");
    const { signature } = await generateSignature(clientId, publicKey);

    const url = "https://sandbox.cashfree.com/payout/transfers";
    const transferId = `tr_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;

    const data = {
        transfer_amount: amountToClaim,
        transfer_id: transferId,
        beneficiary_details: {
            beneficiary_id: paymentAccount.beneficiary_id
        },
        transfer_currency : "INR",
        transfer_mode : "upi"

    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-version": "2024-01-01",
                "x-client-id": clientId,
                "x-client-secret": process.env.CASHFREE_SECRET,
                "X-cf-signature": signature,
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            let errorText = `Response status: ${response.status}`;
            try {
                const errorJson = await response.json();
                errorText += ` - ${errorJson.message || JSON.stringify(errorJson)}`;
            } catch (e) {
                try {
                    const text = await response.text();
                    errorText += ` - ${text}`;
                } catch (_) { }
            }
            throw new Error(errorText);
        }

        const transferResult = await response.json();
        console.log("Cashfree Payout transfer initiated successfully:", transferResult);

        // 6. Reset campaign's current_amount in database
        await prisma.campaigns.update({
            where: { campaign_id: campaignId },
            data: {
                current_amount: 0
            }
        });

        return { success: true, message: "Funds successfully claimed and transferred!", transferId };
    } catch (error) {
        console.error("Error in claim_campaign_fund transfer:", error);
        throw new Error(error.message || "Failed to execute transfer with Cashfree");
    }
}