"use client";

import React from "react";

/**
 * CubistBannerPattern - Presentational component encapsulating the website's 
 * signature geometric color blocking banner shapes, curves, and motifs.
 * Use this as a background placeholder when a custom banner image is not present.
 */
export default function CubistBannerPattern() {
    return (
        <>
            {/* Confident primary color blocking banner components */}
            <div className="absolute top-0 right-10 md:right-28 w-[360px] h-full bg-cubist-cobalt border-l-4 border-r-4 border-cubist-charcoal shape-cubist-arch translate-y-12 pointer-events-none"></div>
            <div className="absolute top-10 left-[10%] w-24 h-24 bg-cubist-red rounded-full border-4 border-cubist-charcoal pointer-events-none"></div>
            <div className="absolute bottom-4 left-[22%] w-[200px] h-[80px] bg-cubist-yellow border-t-4 border-l-4 border-cubist-charcoal shape-cubist-curve-1 pointer-events-none"></div>
            
            {/* Concentric Circle "Eye" motif details floating on the wall */}
            <div className="absolute top-4 right-[40%] flex items-center justify-center w-14 h-14 bg-cubist-canvas border-4 border-cubist-charcoal rounded-full pointer-events-none opacity-30">
                <div className="absolute w-10 h-10 bg-cubist-red rounded-full"></div>
                <div className="absolute w-6 h-6 bg-cubist-yellow rounded-full"></div>
                <div className="absolute w-3 h-3 bg-cubist-charcoal rounded-full"></div>
            </div>
        </>
    );
}
