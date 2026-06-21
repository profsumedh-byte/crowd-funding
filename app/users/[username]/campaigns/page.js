"use client";

import React from "react";

const Campaigns = () => {
    // Mock campaigns for demonstration
    const campaigns = [
        { id: 1, title: "GTA VI Gaming Setup", goal: "$5,000", raised: "$2,450", status: "Active" },
        { id: 2, title: "Streaming Equipment Upgrade", goal: "$2,500", raised: "$2,500", status: "Completed" }
    ];

    return (
        <div className="card-cubist-green p-8 shape-cubist-curve-1 relative text-white">
            
            <span className="text-[10px] uppercase tracking-widest text-white/70 font-extrabold font-sans mb-3 block">Exhibited Pieces</span>
            <h3 className="serif-display text-2xl text-white font-black uppercase mb-6">Active & Completed Campaigns</h3>
            
            <div className="flex flex-col gap-6">
                {campaigns.map((camp) => (
                    <div 
                        key={camp.id} 
                        className="border-b-2 border-white/20 last:border-0 pb-5 last:pb-0 flex justify-between items-center text-white group"
                    >
                        <div>
                            <h4 className="serif-display text-lg text-white group-hover:text-cubist-yellow transition-colors duration-300 font-bold uppercase">
                                {camp.title}
                            </h4>
                            <p className="text-xs text-white/80 mt-1 font-sans font-normal">
                                Goal: <span className="font-bold text-white">{camp.goal}</span> | Raised: <span className="font-bold text-cubist-yellow">{camp.raised}</span>
                            </p>
                        </div>
                        <span className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 border-2 border-cubist-charcoal shadow-cubist-sm font-sans ${
                            camp.status === "Completed" 
                                ? "text-cubist-charcoal bg-cubist-yellow" 
                                : "text-white bg-cubist-orange"
                        }`}>
                            {camp.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Campaigns;
