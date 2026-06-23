"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname, useParams } from "next/navigation";
import User_Navbar from "@/app/components/User_Navbar";
import CampaignStatsCard from "@/app/components/CampaignStatsCard";

export default function UserProfileLayout({ children }) {
    const [paymentform, setpaymentform] = useState({ donorname: "", donoramount: "", donormessage: "" });
    const pathname = usePathname();
    const params = useParams();
    const email = params?.email;
    const campaign_id = params?.campaign_Id || params?.campaign_id;

    const isCampaignsTab = pathname === `/users/${email}/campaigns`;
    const isparticuar_campaign = !!campaign_id && pathname === `/users/${email}/campaigns/${campaign_id}`;

    const formchanged = (e) => {
        if (e.target.name === "donoramount" && !/^\d*\.?\d*$/.test(e.target.value)) {
            return;
        }
        setpaymentform({ ...paymentform, [e.target.name]: e.target.value });
    };

    const edit_profile_pic = () => {
        // Preserved profile edit functionality hook
    };

    if (isparticuar_campaign) {
        return (
            <>
                <User_Navbar />
                <div className="min-h-screen pt-16 bg-cubist-bg text-cubist-charcoal font-sans">
                    {children}
                </div>
            </>
        );
    }

    return (
        <>
            <User_Navbar />
            <div className="min-h-screen pt-16 pb-24 bg-cubist-bg text-cubist-charcoal flex flex-col relative overflow-hidden font-sans">
                
                {/* Structural Cubist background decoration segments */}
                <div className="absolute top-20 right-[-10%] w-[50%] h-[500px] bg-cubist-cobalt/5 shape-cubist-blob pointer-events-none -z-10"></div>
                <div className="absolute bottom-10 left-[-5%] w-[350px] h-[350px] bg-cubist-yellow/5 rounded-full pointer-events-none -z-10"></div>

                {/* Hero / Exhibition Wall Banner Section */}
                <div className="relative w-full h-[260px] md:h-[320px] bg-cubist-sand border-b-4 border-cubist-charcoal overflow-hidden flex items-end">
                    
                    {/* Confident primary color blocking banner components */}
                    <div className="absolute top-0 right-10 md:right-28 w-[360px] h-full bg-cubist-cobalt border-l-4 border-r-4 border-cubist-charcoal shape-cubist-arch translate-y-12"></div>
                    <div className="absolute top-10 left-[10%] w-24 h-24 bg-cubist-red rounded-full border-4 border-cubist-charcoal"></div>
                    <div className="absolute bottom-4 left-[22%] w-[200px] h-[80px] bg-cubist-yellow border-t-4 border-l-4 border-cubist-charcoal shape-cubist-curve-1"></div>
                    
                    {/* Concentric Circle "Eye" motif details floating on the wall */}
                    <div className="absolute top-4 right-[40%] flex items-center justify-center w-14 h-14 bg-cubist-canvas border-4 border-cubist-charcoal rounded-full pointer-events-none opacity-30">
                        <div className="absolute w-10 h-10 bg-cubist-red rounded-full"></div>
                        <div className="absolute w-6 h-6 bg-cubist-yellow rounded-full"></div>
                        <div className="absolute w-3 h-3 bg-cubist-charcoal rounded-full"></div>
                    </div>
                </div>

                {/* Main Profile Info Layer */}
                <div className="max-w-7xl mx-auto px-6 w-full -mt-20 md:-mt-24 z-10 relative">
                    <div className="flex flex-col md:flex-row items-end gap-6 md:gap-8">
                        
                        {/* Profile Picture Frame (Concentric Eye Motif) */}
                        <div className="relative group shrink-0">
                            {/* Outer offset circles */}
                            <div className="absolute inset-0 bg-cubist-yellow rounded-full border-4 border-cubist-charcoal translate-x-3 translate-y-3 transition-transform group-hover:translate-x-4 group-hover:translate-y-4"></div>
                            <div className="absolute inset-0 bg-cubist-red rounded-full border-4 border-cubist-charcoal -translate-x-1.5 -translate-y-1.5"></div>
                            
                            <div className="relative w-36 h-36 rounded-full border-4 border-cubist-charcoal overflow-hidden bg-cubist-canvas z-10">
                                <Image
                                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            
                            {/* Edit pencil icon */}
                            <button 
                                onClick={edit_profile_pic}
                                className="absolute bottom-1 right-1 z-20 bg-cubist-orange text-white p-2 border-2 border-cubist-charcoal rounded-full shadow-cubist-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer flex items-center justify-center"
                                title="Edit profile picture"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 20.013a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
                        </div>

                        {/* Title and Info */}
                        <div className="flex-1 text-left pb-2">
                            <span className="text-[10px] uppercase tracking-widest text-cubist-orange font-extrabold font-sans mb-1 block">Artist Showcase</span>
                            <h1 className="serif-display text-4xl md:text-5xl font-black uppercase tracking-tight text-cubist-charcoal leading-none">
                                help to grow
                            </h1>
                            <p className="font-sans text-sm text-cubist-charcoal/70 tracking-wide font-light mt-1">
                                yes this is about grp
                            </p>
                        </div>
                    </div>
                </div>

                {/* Subpage Contents Grid */}
                <div className="max-w-7xl mx-auto px-6 w-full mt-16 z-10">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        
                        {/* Content Body: this is where nested page content goes */}
                        <div className="w-full min-w-0">
                            {children}
                        </div>

                        
                    </div>
                </div>
            </div>
        </>
    );
}
