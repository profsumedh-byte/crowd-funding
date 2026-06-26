"use server"


import { saveUserPaymentAccount } from "@/app/services/rzp-services";
import { saveCashfreeUserPaymentAccount } from "../cashfree_payouts";
import crypto from 'crypto';

const clientId = process.env.CASHFREE_CLIENT_ID;
const publicKey = process.env.PUBLIC_CASHFREE_KEY;
export async function generateSignature(clientId, publicKey) {
    const timestamp = Math.floor(Date.now() / 1000);

    const data = `${clientId}.${timestamp}`;

    const signature = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(data)
    ).toString("base64");

    return {
        signature,
        timestamp,
    };
}

export async function user_payment_account(formData) {
    const email = formData.get("email")
    const phone = formData.get("phone")
    const upi = formData.get("upi")
    const name = formData.get("acc_name")

    console.log(email, phone, upi)

    // Base64 encode credentials for Razorpay API Basic Auth
    const auth = Buffer.from(
        `${process.env.NEXT_PUBLIC_RZP_KEY}:${process.env.RZP_SECRET}`
    ).toString("base64");

    // 1. Contact Creation
    const contactUrl = "https://api.razorpay.com/v1/contacts";
    try {
        const response = await fetch(contactUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${auth}`
            },
            body: JSON.stringify({
                name: name,
                email: email,
                contact: phone,
                type: "vendor",
                notes: {
                    notes_key_1: "Tea, Earl Grey, Hot"
                }
            }),
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const contact = await response.json();
        console.log("Contact created successfully:", contact);

        // 2. Fund Account Creation
        if (contact && contact.id) {
            try {
                const contact_id = contact.id;
                const fundUrl = "https://api.razorpay.com/v1/fund_accounts";
                const fund_res = await fetch(fundUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Basic ${auth}`,
                    },
                    body: JSON.stringify({
                        account_type: "vpa",
                        contact_id: contact_id,
                        vpa: {
                            address: upi
                        }
                    }),
                });

                if (!fund_res.ok) {
                    throw new Error(`Response status: ${fund_res.status}`);
                }

                const fund_acc_details = await fund_res.json();
                console.log("Fund account created successfully:", fund_acc_details);

                // 3. Storing in database
                if (fund_acc_details && fund_acc_details.id) {
                    await saveUserPaymentAccount({
                        email: email,
                        phone: phone,
                        upi: upi,
                        contactId: contact_id,
                        fundAccountId: fund_acc_details.id,
                        accountName: name
                    });
                    console.log("Payment details stored in database successfully.");
                }

            } catch (error) {
                console.error(error.message, "error while creating/storing fundaccount");

            }
        }

    } catch (error) {
        console.error(error.message);
    }
}

// writing this function because the payout of razorpay needs business to be registered
// In this functionn we test it with a sandbox

export async function cashfree_payment_account(formData) {

    const email = formData.get("email")
    const phone = formData.get("phone")
    const upi = formData.get("upi")
    const name = formData.get("acc_name")

    try {
        const { signature, timestamp } = await generateSignature(clientId, publicKey);

        const url = "https://sandbox.cashfree.com/payout/beneficiary"
        const data = {
            beneficiary_id: crypto.randomUUID().replace(/-/g, "_"),
            beneficiary_name: name,
            beneficiary_instrument_details: {
                vpa: upi
            },
            beneficiary_contact_details: {
                beneficiary_email: email,
                beneficiary_phone: phone
            }
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-version": "2024-01-01",
                "x-client-id": clientId,
                "x-client-secret": process.env.CASHFREE_SECRET,
                "X-CF-Signature": signature, 
            },
            body: JSON.stringify(data)
        })

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

        const benificiary = await response.json();
        console.log("Beneficiary created successfully:", benificiary);

        if (benificiary && benificiary.beneficiary_status === "VERIFIED") {
            await saveCashfreeUserPaymentAccount({
                email: email,
                phone: phone,
                upi_id: upi,
                beneficiary: benificiary.beneficiary_id,
                account_name: name,
                status: "active"
            });
            console.log("Payment details stored in database successfully.");
            return { success: true };
        } else {
            return { success: false, error: `Beneficiary status: ${benificiary?.beneficiary_status || "UNKNOWN"}` };
        }

    } catch (error) {
        console.error(error.message);
        return { success: false, error: error.message };
    }
}