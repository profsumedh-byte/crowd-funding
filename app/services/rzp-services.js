"use server"

import crypto from "crypto";
import razorpay from "@/app/lib/rzp";
import prisma from "@/app/lib/prisma";
import { confirmDonation } from "@/app/services/campaign-services";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function createorder({ amount, currency, receipt, notes }) {
    try {
        const options = {
            amount: Math.round(amount * 100), // Convert amount to paise
            currency,
            receipt,
            notes,
        };

        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        throw new Error("Error creating order");
    }
}

export async function verifypayment(params) {
    // Support both client-side parameter naming conventions
    const razorpay_order_id = params.razorpay_order_id || params.order;
    const razorpay_payment_id = params.razorpay_payment_id || params.paymentid;
    const razorpay_signature = params.razorpay_signature || params.signature;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new Error("Missing payment verification details");
    }

    const secret = process.env.RZP_SECRET;

    try {
        // Standard Razorpay payment signature verification using crypto
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex");

        const isValidSignature = expectedSignature === razorpay_signature;

        if (isValidSignature) {
            // Find the pending donation with this Razorpay order ID
            const donation = await prisma.donations.findFirst({
                where: { payment_id: razorpay_order_id }
            });

            if (donation) {
                await confirmDonation({
                    donation_id: donation.donation_id,
                    payment_id: razorpay_payment_id
                });

                // Send donation notification email via Resend (non-blocking)
                import("resend").then(({ Resend }) => {
                    const resend = new Resend(process.env.RESEND_KEY);
                    resend.emails.send({
                        from: 'Resend <onboarding@resend.dev>',
                        to: 'prof.sumedh@gmail.com',
                        subject: 'New Donation Received!',
                        html: `<p>Congrats! You have received a new donation of <strong>₹${donation.amount}</strong> from <strong>${donation.donor_name}</strong>!</p>`
                    }).then((emailResponse) => {
                        console.log("Donation email sent successfully:", emailResponse);
                    }).catch((emailErr) => {
                        console.error("Failed to send donation email:", emailErr);
                    });
                }).catch((importErr) => {
                    console.error("Failed to import resend:", importErr);
                });

                return { status: 200, message: "payment updated in db" };
            } else {
                throw new Error(`Donation record not found for order: ${razorpay_order_id}`);
            }
        } else {
            throw new Error("Payment signature verification failed");
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw new Error(error.message || "Error verifying payment");
    }
}

export async function saveUserPaymentAccount({ email, phone, upi, contactId, fundAccountId, accountName }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            throw new Error("Unauthorized: No session found");
        }

        const user = await prisma.users.findUnique({
            where: { email: session.user.email },
            select: { user_id: true }
        });

        if (!user) {
            throw new Error("User not found in database");
        }

        const result = await prisma.user_payment_accounts.upsert({
            where: { user_id: user.user_id },
            update: {
                contact_id: contactId,
                fund_account_id: fundAccountId,
                account_name: accountName,
                email: email,
                phone: phone,
                upi_id: upi,
                updated_at: new Date()
            },
            create: {
                user_id: user.user_id,
                contact_id: contactId,
                fund_account_id: fundAccountId,
                account_name: accountName,
                email: email,
                phone: phone,
                upi_id: upi
            }
        });

        // Convert BigInt user_id to String for serialization in Next.js Server Actions
        return {
            ...result,
            user_id: result.user_id.toString()
        };
    } catch (error) {
        console.error("Error saving user payment account:", error);
        throw new Error(error.message || "Error saving user payment account");
    }
}