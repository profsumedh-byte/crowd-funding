"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import CampaignStatsCard from "@/app/components/CampaignStatsCard";
import { useSession } from "next-auth/react";
import ClaimFundButton from "@/app/components/ClaimFundButton";

/**
 * UserCampaignPage - Pure presentational page component for campaign detail view.
 * 
 * @param {Object} props
 * @param {Object} props.campaign - Campaign details object
 * @param {string} props.campaign.title - Title of the campaign
 * @param {string} props.campaign.tagline - Short description or tagline
 * @param {string} props.campaign.category - Tag category for the campaign
 * @param {string} props.campaign.about - Main narrative/about text
 * @param {number} props.campaign.goal - Funding goal target amount
 * @param {number} props.campaign.raised - Total amount raised so far
 * @param {number} props.campaign.backers - Total supporter backers count
 * @param {string} props.campaign.timeLeft - Days/hours remaining (e.g., "12 days")
 * @param {string} props.campaign.endDateText - End date text (e.g., "ends july 2nd")
 * @param {Array<Object>} props.campaign.donors - List of donor contributions
 * @param {string} props.campaign.donors[].name - Donor name or initials
 * @param {number} props.campaign.donors[].amount - Amount pledged
 * @param {string} props.campaign.donors[].time - Relative time (e.g., "2h ago")
 * @param {string} props.campaign.donors[].avatar - Initials/Avatar abbreviation
 * @param {Object} [props.paymentForm] - Form input values { donorname, donoramount, donormessage }
 * @param {function} [props.onChange] - Input change callback
 * @param {function} [props.onSubmit] - Backing form submission callback
 */
export default function UserCampaignPage({
    campaign,
    paymentForm,
    onChange,
    onSubmit
}) {
    const { data: session } = useSession();
    const userid = session?.user?.id;
    const params = useParams();
    const campaign_id = params?.campaign_Id || params?.campaign_id;

    const email = params?.email || "email";

    const [isClaiming, setIsClaiming] = useState(false);
    const [localPaymentForm, setLocalPaymentForm] = useState({ donorname: "", donoramount: "", donormessage: "" });

    const handleClaim = async () => {
        setIsClaiming(true);
        try {
            const response = await fetch(`/api/campaigns/${campaign_id}`, {
                method: "POST"
            });
            const res = await response.json();
            if (response.ok && res?.success) {
                alert(res.message || "Funds claimed successfully!");
                // Reload the page to reflect 0 balance
                window.location.reload();
            } else {
                alert(res?.error || "Failed to claim funds.");
            }
        } catch (err) {
            alert(err.message || "An error occurred while claiming funds.");
        } finally {
            setIsClaiming(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === "donoramount" && !/^\d*\.?\d*$/.test(value)) {
            return;
        }
        setLocalPaymentForm((prev) => ({ ...prev, [name]: value }));
    };

    const activePaymentForm = onChange ? paymentForm : localPaymentForm;
    const activeOnChange = onChange || handleFormChange;

    // visual placeholder fallbacks directly in the render
    const title = campaign?.title || "Campaign Title";
    const tagline = campaign?.tagline || "This is a placeholder tagline for the campaign.";
    const category = campaign?.category || "Category";
    const about = campaign?.about || "This is a placeholder description about the campaign. Connect to a real data source to populate this content dynamically.";
    
    const goal = campaign?.goal ?? 0;
    const raised = campaign?.raised ?? 0;
    const backers = campaign?.backers ?? 0;
    const timeLeft = campaign?.timeLeft || "0 days";
    const endDateText = campaign?.endDateText || "ends date";

    const progressPercent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) + "%" : "0%";
    const totalRaisedFormatted = "₹" + raised.toLocaleString();
    const targetFormatted = "₹" + goal.toLocaleString();

    // Generic placeholder donor list items directly in render
    const donorsList = campaign?.donors || [
        { name: "Donor Name", amount: 0, time: "0h ago", avatar: "DN" },
        { name: "Donor Name", amount: 0, time: "0h ago", avatar: "DN" },
        { name: "Donor Name", amount: 0, time: "0h ago", avatar: "DN" },
        { name: "Donor Name", amount: 0, time: "0h ago", avatar: "DN" }
    ];

    return (
        <div className="min-h-screen bg-cubist-bg text-cubist-charcoal font-sans flex flex-col pb-20">
            {/* Header Toolbar (Back button + Claim Fund button) */}
            <div className="max-w-7xl mx-auto px-6 w-full pt-8 flex flex-row justify-between items-center gap-4 flex-wrap">
                <Link 
                    href={`/users/${email}/campaigns`}
                    className="inline-flex items-center gap-2 border-2 border-cubist-charcoal px-4 py-2 text-[10px] tracking-widest uppercase font-bold text-cubist-charcoal shadow-cubist-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all bg-cubist-canvas shrink-0"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Back to Campaigns
                </Link>
                {session?.user?.email === decodeURIComponent(email) && (
                    <ClaimFundButton 
                        loading={isClaiming}
                        onClick={()=>handleClaim(email)}
                        className="shrink-0"
                    />
                )}
            </div>

            {/* Banner Section */}
            <div className="max-w-7xl mx-auto px-6 w-full mt-6">
                <div className="relative w-full h-[280px] md:h-[350px] bg-cubist-sand border-4 border-cubist-charcoal overflow-hidden flex items-end p-6 md:p-12 shadow-cubist-lg">
                    
                    {/* Custom Banner Image */}
                    {campaign?.cover_image && (
                        <img 
                            src={campaign.cover_image} 
                            alt={title} 
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />
                    )}

                    {/* Dark gradient for text visibility */}
                    <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{ backgroundImage: "linear-gradient(to top, rgba(17, 17, 17, 0.7) 0%, rgba(17, 17, 17, 0) 100%)" }}
                    ></div>

                    {/* Overlay Text Details */}
                    <div className="relative z-10 text-white w-full">
                        <span className="text-[9px] uppercase font-extrabold tracking-widest text-cubist-charcoal bg-cubist-yellow px-2.5 py-1 border-2 border-cubist-charcoal inline-block shadow-cubist-sm mb-3">
                            {category}
                        </span>
                        <h1 className="serif-display text-3xl md:text-5xl uppercase tracking-tight text-white leading-none drop-shadow-md">
                            {title}
                        </h1>
                        <p className="font-sans text-xs md:text-sm text-white/90 font-light mt-2 max-w-2xl leading-relaxed">
                            {tagline}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Layout Grid */}
            <div className="max-w-7xl mx-auto px-6 w-full mt-12 mb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    
                    {/* Left Column (About + Donors) - order-2 on mobile, order-1 on desktop */}
                    <div className="lg:col-span-2 order-2 lg:order-1 flex flex-col gap-8 w-full min-w-0">
                        
                        {/* About Campaign Box */}
                        <div className="card-cubist-neutral p-8 md:p-10 shape-cubist-curve-1 relative flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-cubist-charcoal/60 font-extrabold font-sans mb-3 block">Manifesto</span>
                            <h2 className="serif-display text-2xl text-cubist-charcoal font-black uppercase mb-4 border-b-2 border-cubist-charcoal/20 pb-3">
                                About the Campaign
                            </h2>
                            <p className="font-sans font-normal text-cubist-charcoal/80 text-sm md:text-base leading-relaxed">
                                {about}
                            </p>
                        </div>

                        {/* Recent Donors List */}
                        <div className="card-cubist-yellow p-8 md:p-10 shape-cubist-curve-2 relative flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-cubist-charcoal/60 font-extrabold font-sans mb-3 block">Patron Roster</span>
                            <h2 className="serif-display text-2xl text-cubist-charcoal font-black uppercase mb-4 border-b-2 border-cubist-charcoal/20 pb-3">
                                Recent Backers
                            </h2>
                            
                            <div className="flex flex-col gap-1">
                                {donorsList.map((donor, idx) => (
                                    <div 
                                        key={idx}
                                        className="border-b-2 border-cubist-charcoal/15 last:border-0 py-4 last:pb-0 first:pt-0 flex items-center justify-between text-cubist-charcoal group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-full border-2 border-cubist-charcoal bg-cubist-orange text-white flex items-center justify-center font-bold text-xs shadow-cubist-sm shrink-0 group-hover:scale-105 transition-transform">
                                                {donor.avatar}
                                            </div>
                                            <div>
                                                <h4 className="font-sans font-black text-sm text-cubist-charcoal uppercase tracking-wide">
                                                    {donor.message ? `${donor.name} says, "${donor.message}"` : donor.name}
                                                </h4>
                                                <p className="text-[9px] text-cubist-charcoal/60 uppercase tracking-widest font-extrabold mt-0.5">
                                                    {donor.time}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 bg-white border-2 border-cubist-charcoal px-3 py-1.5 shadow-cubist-sm group-hover:-translate-y-0.5 transition-transform">
                                            <span className="serif-display text-sm font-black text-cubist-orange">+$</span>
                                            <span className="serif-display text-base font-black text-cubist-charcoal">{donor.amount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Stats & Form) - order-1 on mobile, order-2 on desktop */}
                    <div className="lg:col-span-1 order-1 lg:order-2 lg:sticky lg:top-24 self-start w-full">
                        <CampaignStatsCard 
                            paymentform={activePaymentForm}
                            onChange={activeOnChange}
                            onSubmit={onSubmit}
                            totalRaised={totalRaisedFormatted}
                            target={targetFormatted}
                            progress={progressPercent}
                            backers={backers.toLocaleString()}
                            timeLeft={timeLeft}
                            endDateText={endDateText}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
