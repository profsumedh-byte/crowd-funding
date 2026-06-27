"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllUsers } from "@/app/services/user-services";
import User_Navbar from "@/app/components/User_Navbar";
import CubistLoader from "@/app/components/CubistLoader";
import { Cloudinary } from "@cloudinary/url-gen";

export default function CreatorsRegistry() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const cld = new Cloudinary({
        cloud: {
            cloudName: "dgxhjssdt"
        }
    });

    useEffect(() => {
        async function fetchUsers() {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (err) {
                console.error("Failed to load creators:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    const getProfileUrl = (profileImage) => {
        if (!profileImage) {
            return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
        }
        if (profileImage.startsWith("http")) {
            return profileImage;
        }
        return cld.image(profileImage).toURL();
    };

    return (
        <>
            <User_Navbar />
            <div className="min-h-screen pt-24 pb-24 bg-cubist-bg text-cubist-charcoal flex flex-col relative overflow-hidden font-sans">
                {/* Structural Cubist background decoration segments */}
                <div className="absolute top-20 right-[-10%] w-[50%] h-[500px] bg-cubist-cobalt/5 shape-cubist-blob pointer-events-none -z-10"></div>
                <div className="absolute bottom-10 left-[-5%] w-[350px] h-[350px] bg-cubist-yellow/5 rounded-full pointer-events-none -z-10"></div>

                <div className="max-w-7xl mx-auto px-6 w-full z-10 relative">
                    {/* Page Header */}
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <span className="text-[10px] uppercase tracking-widest text-cubist-orange font-extrabold font-sans mb-3 block">
                            Creator Registry
                        </span>
                        <h1 className="serif-display text-4xl md:text-5xl font-black uppercase tracking-tight text-cubist-charcoal leading-none mb-4">
                            Support Digital Creators
                        </h1>
                        <p className="font-sans font-light text-cubist-charcoal/70 text-sm leading-relaxed">
                            Browse registry profiles, explore their campaigns, and back their creative endeavors directly. No registration required to donate.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <CubistLoader message="Loading creators..." />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="card-cubist-neutral p-10 text-center max-w-md mx-auto shape-cubist-curve-1">
                            <span className="text-xs uppercase font-extrabold tracking-widest text-cubist-orange block mb-2">Notice</span>
                            <h3 className="serif-display text-xl font-bold uppercase mb-2">No Creators Found</h3>
                            <p className="text-sm font-sans font-light text-cubist-charcoal/70">
                                Be the first creator to join the gallery! Sign in using Google to list your campaigns.
                            </p>
                        </div>
                    ) : (
                        /* Responsive Grid Layout */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {users.map((user, index) => {
                                const isEven = index % 2 === 0;
                                const curveClass = isEven ? "shape-cubist-curve-1" : "shape-cubist-curve-2";
                                const profilePic = getProfileUrl(user.profile_image);
                                const campaignsCount = user._count?.campaigns || 0;
                                const manifesto = user.about || "Hey there! I am a full-time digital creator dedicated to building sleek templates, streams, and sharing design tricks. Back my campaigns to support the journey!";

                                return (
                                    <div
                                        key={user.email}
                                        className={`card-cubist-neutral p-8 ${curveClass} flex flex-col justify-between gap-6 hover:scale-[1.03] hover:-translate-y-1.5 hover:shadow-cubist-lg transition-all ease-out duration-300 relative group`}
                                    >
                                        <div className="flex flex-col gap-6">
                                            {/* Creator Header with Avatar and Campaign Count */}
                                            <div className="flex items-start justify-between gap-4">
                                                {/* Profile Pic concentric frames */}
                                                <div className="relative shrink-0 transition-transform ease-out duration-300 group-hover:scale-105">
                                                    <div className="absolute inset-0 bg-cubist-yellow rounded-full border-2 border-cubist-charcoal translate-x-1 translate-y-1"></div>
                                                    <div className="absolute inset-0 bg-cubist-red rounded-full border-2 border-cubist-charcoal -translate-x-0.5 -translate-y-0.5"></div>

                                                    <div className="relative w-16 h-16 rounded-full border-2 border-cubist-charcoal overflow-hidden bg-cubist-canvas z-10">
                                                        <Image
                                                            src={profilePic}
                                                            alt={user.name || "Creator Profile"}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Campaigns count badge */}
                                                <span className="text-[9px] uppercase tracking-widest text-cubist-charcoal font-extrabold bg-cubist-yellow border-2 border-cubist-charcoal px-3 py-1.5 shadow-cubist-sm shrink-0">
                                                    {campaignsCount} {campaignsCount === 1 ? "Campaign" : "Campaigns"}
                                                </span>
                                            </div>

                                            {/* Name and Email */}
                                            <div>
                                                <h3 className="serif-display text-2xl font-black uppercase text-cubist-charcoal group-hover:text-cubist-orange transition-colors truncate">
                                                    {user.name || "Anonymous Creator"}
                                                </h3>
                                                <p className="text-xs text-cubist-charcoal/60 font-light truncate mt-0.5">
                                                    {user.email}
                                                </p>
                                            </div>

                                            {/* Short Manifesto */}
                                            <p className="text-sm text-cubist-charcoal/80 font-normal leading-relaxed line-clamp-3 font-sans">
                                                {manifesto}
                                            </p>
                                        </div>

                                        {/* Action Button */}
                                        <div className="mt-4 pt-4 border-t border-cubist-charcoal/10">
                                            <Link
                                                href={`/users/${encodeURIComponent(user.email)}/campaigns`}
                                                className="w-full bg-cubist-orange text-white border-2 border-cubist-charcoal shadow-cubist-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-cubist active:translate-x-0 active:translate-y-0 active:shadow-none font-bold py-2.5 px-4 rounded-none text-[9px] uppercase tracking-widest transition-all ease-out duration-200 flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                Support Creator
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
