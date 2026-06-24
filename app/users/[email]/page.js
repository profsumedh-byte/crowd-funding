"use client";

import React, { useState, useContext } from "react";
import { UserProfileContext, DEFAULT_ABOUT } from "./layout";

const UserProfile = () => {
    const [selectedTier, setSelectedTier] = useState(null);
    const { userprofile } = useContext(UserProfileContext) || {};

    return (
        <div className="flex flex-col gap-14 w-full text-cubist-charcoal">
            {/* About Box (Solid Saturated Golden Yellow Card with offset shadow) */}
            <div className="card-cubist-yellow p-8 md:p-10 shape-cubist-curve-1 relative flex flex-col gap-8">
                <div>
                    <span className="text-[10px] uppercase tracking-widest text-cubist-charcoal/60 font-extrabold font-sans mb-3 block">Manifesto</span>
                    <h3 className="serif-display text-3xl text-cubist-charcoal font-black uppercase mb-4">About the Creator</h3>
                    <p className="font-sans font-normal text-cubist-charcoal/90 text-sm md:text-base leading-relaxed max-w-3xl whitespace-pre-line">
                        {userprofile?.about || DEFAULT_ABOUT}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;