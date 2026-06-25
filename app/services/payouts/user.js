"use server"

import { saveUserPaymentAccount } from "@/app/services/rzp-services";

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
                    alert("Payment details stored in database successfully.");
                }

            } catch (error) {
                console.error(error.message, "error while creating/storing fundaccount");
               
            }
        }

    } catch (error) {
        console.error(error.message);
    }
}