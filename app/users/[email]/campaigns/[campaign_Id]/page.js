"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Script from "next/script";
import UserCampaignPage from "@/app/components/UserCampaignPage";
import { createDonation } from "@/app/services/campaign-services";
import { createorder } from "@/app/services/rzp-services";
import { verifypayment } from "@/app/services/rzp-services";

// Converts a UTC ISO string to a relative time label like "2h ago" or "3d ago"
function getRelativeTime(isoString) {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
}

// Extracts 1–2 uppercase initials from a donor name for the avatar
function getInitials(name = "") {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
}

// Formats a Decimal/string amount as a locale string with no trailing zeros
function fmtAmount(amount) {
    return parseFloat(amount).toLocaleString("en-IN");
}

// Computes "X days left" or "Ended" from an ISO end-date string
function getTimeLeft(createdAt) {
    // Campaigns don't store an end date in the schema; derive 30-day window from created_at
    const end = new Date(new Date(createdAt).getTime() + 30 * 24 * 60 * 60 * 1000);
    const diffMs = end - Date.now();
    if (diffMs <= 0) return "Ended";
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `${days} day${days !== 1 ? "s" : ""}`;
}

function getEndDateText(createdAt) {
    const end = new Date(new Date(createdAt).getTime() + 30 * 24 * 60 * 60 * 1000);
    return `ends ${end.toLocaleDateString("en-IN", { month: "long", day: "numeric" })}`;
}

// Derives a tagline from the about text (first sentence, max 120 chars)
function deriveTagline(about = "") {
    const first = about.split(/[.!?]/)[0].trim();
    return first.length > 120 ? first.slice(0, 117) + "…" : first;
}

export default function CampaignDetailPage() {
    const params = useParams();
    const campaignId = params.campaign_Id || params.campaign_id;
    const { data: session } = useSession();
    const router = useRouter();

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [paymentForm, setPaymentForm] = useState({
        donorname: "",
        donoramount: "",
        donormessage: "",
    });

    const fetchCampaign = useCallback(async () => {
        try {
            if (!campaignId) {
                throw new Error("Missing campaign ID");
            }
            const res = await fetch(`/api/campaigns/${campaignId}`);
            if (!res.ok) {
                const { error: msg } = await res.json();
                throw new Error(msg || "Failed to load campaign");
            }
            const data = await res.json();
            setCampaign(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [campaignId]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCampaign();
    }, [fetchCampaign]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "donoramount" && !/^\d*\.?\d*$/.test(value)) return;
        setPaymentForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const amount = parseFloat(paymentForm.donoramount);
        const message = paymentForm.donormessage;
        if (!paymentForm.donorname.trim() || isNaN(amount) || amount <= 0) return;

        try {
            // 1. Create order on the server
            const order = await createorder({ 
                amount, 
                currency: 'INR', 
                receipt: paymentForm.donorname, 
                notes: { message } 
            });

            if (!order || !order.id) {
                alert("Failed to initiate payment order. Please try again.");
                return;
            }

            // 2. Create pending donation record in the database
            const result = await createDonation({
                campaign_id: campaignId,
                donor_name: paymentForm.donorname.trim(),
                amount,
                message: paymentForm.donormessage.trim() || null,
                status: "pending",
                payment_id: order.id, // Store the order ID as placeholder
            });

            if (!result.success) {
                alert("Failed to initialize donation record.");
                return;
            }

            // 3. Set up Razorpay Options
            const options = {
                key: process.env.NEXT_PUBLIC_RZP_KEY,
                amount: order.amount,
                currency: order.currency,
                name: process.env.NEXT_PUBLIC_COMPANY_NAME || "Crowd Funding",
                description: message || "Campaign Donation",
                order_id: order.id,
                prefill: {
                    name: session?.user?.name || "",
                    email: session?.user?.email || "",
                },
                handler: function (response) {
                    const order = response.razorpay_order_id;
                    const paymentid = response.razorpay_payment_id;
                    const signature = response.razorpay_signature;

                    verifypayment({ order, paymentid, signature })
                        .then(data => {
                            if (data.status === 200) {
                                alert("Thank you! Your donation was successful.");
                                setPaymentForm({ donorname: "", donoramount: "", donormessage: "" });
                                fetchCampaign();
                            } else {
                                alert("Payment verification failed");
                            }
                        })
                        .catch(error => {
                            console.error("Error:", error);
                            alert("Error verifying payment");
                        });
                },
                theme: {
                    color: "#F1B812", // Accent color 
                }
            };

            // 4. Open Razorpay Checkout Modal
            if (typeof window !== "undefined" && window.window.Razorpay) {
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else if (typeof window !== "undefined" && window.Razorpay) {
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                alert("Razorpay checkout could not be loaded. Please refresh the page.");
            }
        } catch (err) {
            console.error("Payment flow error:", err);
            alert("An error occurred during payment processing: " + err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cubist-bg flex items-center justify-center">
                <p className="font-sans text-cubist-charcoal/60 text-sm uppercase tracking-widest animate-pulse">
                    Loading campaign…
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-cubist-bg flex flex-col items-center justify-center gap-4">
                <p className="font-sans text-cubist-charcoal text-sm uppercase tracking-widest">
                    {error}
                </p>
                <button
                    onClick={() => router.back()}
                    className="text-xs underline text-cubist-charcoal/60 uppercase tracking-widest"
                >
                    Go back
                </button>
            </div>
        );
    }

    // Shape raw DB data into the prop contract UserCampaignPage expects
    const goal = parseFloat(campaign.goal_amount);
    const raised = parseFloat(campaign.current_amount);
    const backers = campaign.donations?.length ?? 0;

    const donors = (campaign.donations ?? []).map((d) => ({
        name: d.donor_name,
        amount: parseFloat(d.amount),
        time: getRelativeTime(d.donated_at),
        avatar: getInitials(d.donor_name),
    }));

    const campaignProp = {
        title: campaign.title,
        tagline: deriveTagline(campaign.about),
        category: campaign.status === "active" ? "Active" : "Completed",
        about: campaign.about,
        goal,
        raised,
        backers,
        timeLeft: getTimeLeft(campaign.created_at),
        endDateText: getEndDateText(campaign.created_at),
        cover_image: campaign.cover_image ?? null,
        donors,
    };

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <UserCampaignPage
                campaign={campaignProp}
                paymentForm={paymentForm}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />
        </>
    );
}