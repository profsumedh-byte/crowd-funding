"use server"
import prisma from "@/app/lib/prisma";
import crypto from "crypto";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function saveCashfreeUserPaymentAccount({ email, phone, upi_id, beneficiary, account_name, status }) {
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

        const result = await prisma.cashfree_payment_accounts.upsert({
            where: { user_id: user.user_id },
            update: {
                account_name: account_name,
                email: email,
                phone: phone,
                upi_id: upi_id,
                status : status,
                beneficiary_id : beneficiary,
                updated_at: new Date()
                
            },
            create: {
                user_id: user.user_id,
                account_name: account_name,
                email: email,
                phone: phone,
                upi_id: upi_id,
                status : status,
                beneficiary_id : beneficiary
                
            }
        });

        return {
            ...result,
            user_id: result.user_id.toString()
        };

    } catch (error) {
        console.error("Error in saveCashfreeUserPaymentAccount:", error);
        throw error;
    }

}