"use server"

import crypto from "crypto";
import razorpay from "@/app/lib/rzp";
import prisma from "@/app/lib/prisma";
import { confirmDonation } from "@/app/services/campaign-services";

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