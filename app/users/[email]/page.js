"use client";

import React, { useState } from "react";

const UserProfile = () => {
    const [selectedTier, setSelectedTier] = useState(null);

    const stats = [
        { label: "Supporters", value: "1,420", color: "text-cubist-cobalt" },
        { label: "Updates Posted", value: "28", color: "text-cubist-red" },
        { label: "Active Goals", value: "2", color: "text-cubist-purple" },
        { label: "Rank", value: "Pro Creator", color: "text-cubist-orange" }
    ];

    const socials = [
        {
            name: "YouTube",
            url: "#",
            hoverBg: "hover:bg-cubist-red hover:text-white",
            icon: (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.522 3.5 12 3.5 12 3.5s-7.522 0-9.388.556a3.003 3.003 0 0 0-2.11 2.107C0 8.029 0 12 0 12s0 3.971.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.478 20.5 12 20.5 12 20.5s7.522 0 9.388-.556a3.003 3.003 0 0 0 2.11-2.107C24 15.971 24 12 24 12s0-3.971-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
            )
        },
        {
            name: "Twitch",
            url: "#",
            hoverBg: "hover:bg-cubist-purple hover:text-white",
            icon: (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
            )
        },
        {
            name: "Twitter / X",
            url: "#",
            hoverBg: "hover:bg-cubist-cobalt hover:text-white",
            icon: (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
            )
        },
        {
            name: "Discord",
            url: "#",
            hoverBg: "hover:bg-[#5865F2] hover:text-white",
            icon: (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                </svg>
            )
        },
        {
            name: "GitHub",
            url: "#",
            hoverBg: "hover:bg-cubist-charcoal hover:text-white",
            icon: (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
            )
        }
    ];

    const tiers = [
        {
            id: "bronze",
            name: "Fan Club",
            price: "$5",
            period: "month",
            cardClass: "card-cubist-cobalt text-white",
            benefitBorder: "border-white/20",
            buttonClass: "bg-cubist-yellow text-cubist-charcoal hover:bg-cubist-charcoal hover:text-white",
            benefits: ["Early access to campaign status updates", "Supporter badge next to your shoutout", "Private community polls access"]
        },
        {
            id: "silver",
            name: "Super Supporter",
            price: "$15",
            period: "month",
            cardClass: "card-cubist-red text-white",
            benefitBorder: "border-white/20",
            buttonClass: "bg-cubist-yellow text-cubist-charcoal hover:bg-cubist-charcoal hover:text-white",
            benefits: ["All Fan Club tier perks", "Access to subscriber-only Discord channel", "Monthly behind-the-scenes progress vlog", "Your name listed in project credits"]
        },
        {
            id: "gold",
            name: "VIP Guild Member",
            price: "$50",
            period: "month",
            cardClass: "card-cubist-yellow text-cubist-charcoal",
            benefitBorder: "border-cubist-charcoal/20",
            buttonClass: "bg-cubist-cobalt text-white hover:bg-cubist-charcoal hover:text-white",
            benefits: ["All previous tier perks", "Quarterly 1-on-1 Q&A stream access", "Beta access to new tools and themes", "VIP Discord role & exclusive giveaways"]
        }
    ];

    const updates = [
        {
            id: 1,
            title: "GTA VI Gaming Setup Campaign Reaches 49%",
            date: "June 18, 2026",
            tag: "Milestone",
            tagColor: "bg-cubist-red text-white",
            content: "We just reached 49% of our goal, raised by 142 incredible supporters! I've finalized the GPU and display choices for the new rig. Thank you all for making this setup a reality. Click to view full layout specs."
        },
        {
            id: 2,
            title: "Friday Co-op Multiplayer Stream Schedule",
            date: "June 15, 2026",
            tag: "Event",
            tagColor: "bg-cubist-yellow text-cubist-charcoal",
            content: "This Friday at 8 PM EST, we are doing a live gameplay and setup showcase. I'll be playing custom maps with some of our VIP Guild and Super Supporter backers. Don't forget to link your Discord account for invite codes!"
        },
        {
            id: 3,
            title: "Open Source release of the widget components",
            date: "June 10, 2026",
            tag: "Release",
            tagColor: "bg-cubist-green text-white",
            content: "The custom Tailwind dashboard components are now pushed to GitHub! I've written setup instructions for React/NextJS developers. Go clone it and style your pages with these animations."
        }
    ];

    return (
        <div className="flex flex-col gap-14 w-full text-cubist-charcoal">
            
            {/* Stats Row (Bold, outline structure on Sand Canvas backdrop) */}
            <div className="card-cubist-neutral p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col items-start justify-center border-r-0 md:border-r-2 last:border-r-0 border-cubist-charcoal/30 pr-2">
                        <span className="text-[9px] uppercase tracking-widest text-cubist-charcoal/60 font-extrabold font-sans mb-1">{stat.label}</span>
                        <span className={`serif-display text-3xl font-black ${stat.color}`}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* About Box (Solid Saturated Golden Yellow Card with offset shadow) */}
            <div className="card-cubist-yellow p-8 md:p-10 shape-cubist-curve-1 relative flex flex-col gap-8">
                <div>
                    <span className="text-[10px] uppercase tracking-widest text-cubist-charcoal/60 font-extrabold font-sans mb-3 block">Manifesto</span>
                    <h3 className="serif-display text-3xl text-cubist-charcoal font-black uppercase mb-4">About the Creator</h3>
                    <p className="font-sans font-normal text-cubist-charcoal/90 text-sm md:text-base leading-relaxed max-w-3xl">
                        Hey there! I am a full-time digital creator dedicated to building sleek open-source templates, streaming high-framerate gameplay setups, and sharing design tricks. By backing my campaigns or joining a membership tier, you help fund new hardware, server environments, and content schedules. Thank you for visiting and supporting the journey!
                    </p>
                </div>
                
                {/* Social Links as flat flat buttons */}
                <div className="border-t-2 border-cubist-charcoal pt-6">
                    <span className="text-[9px] uppercase tracking-widest text-cubist-charcoal/60 font-extrabold font-sans mb-4 block">Connect With Me</span>
                    <div className="flex flex-wrap gap-3">
                        {socials.map((social) => (
                            <a
                                key={social.name}
                                href={social.url}
                                className={`flex items-center gap-2 border-2 border-cubist-charcoal px-4 py-2 text-[10px] tracking-widest uppercase font-bold text-cubist-charcoal shadow-cubist-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all bg-cubist-canvas ${social.hoverBg}`}
                            >
                                {social.icon}
                                <span>{social.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Membership Tiers Grid (Saturated Color Block Cards) */}
            <div className="flex flex-col gap-6">
                <div>
                    <span className="text-[10px] uppercase tracking-widest text-cubist-orange font-extrabold font-sans mb-1 block">Patron Levels</span>
                    <h3 className="serif-display text-2xl md:text-3xl text-cubist-charcoal font-black uppercase">Membership Tiers</h3>
                    <p className="text-xs text-cubist-charcoal/60 mt-1 font-sans">Unlock rewards and support content creation monthly</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tiers.map((tier) => {
                        const isSelected = selectedTier === tier.id;
                        
                        return (
                            <div
                                key={tier.id}
                                onClick={() => setSelectedTier(isSelected ? null : tier.id)}
                                className={`p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${
                                    isSelected 
                                        ? "bg-cubist-orange text-white border-4 border-cubist-charcoal shadow-cubist-lg scale-[1.02]" 
                                        : tier.cardClass
                                }`}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="serif-display text-lg uppercase font-bold">{tier.name}</h4>
                                        {isSelected && (
                                            <span className="text-[8px] bg-cubist-charcoal text-white font-bold uppercase px-2 py-0.5 tracking-wider font-sans">
                                                Selected
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-baseline gap-1 mb-5">
                                        <span className="serif-display text-3xl font-black">{tier.price}</span>
                                        <span className="text-[10px] font-sans opacity-70">/{tier.period}</span>
                                    </div>

                                    <ul className={`flex flex-col gap-3 text-xs mt-2 border-t-2 pt-4 ${
                                        isSelected || tier.cardClass.includes("text-white") ? "border-white/20" : "border-cubist-charcoal/20"
                                    }`}>
                                        {tier.benefits.map((benefit, i) => (
                                            <li key={i} className="flex gap-2 items-start leading-relaxed">
                                                <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="font-sans font-medium">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button className={`w-full mt-8 py-2.5 px-4 font-bold uppercase tracking-widest text-[9px] border-2 border-cubist-charcoal shadow-cubist-sm transition-all duration-200 active:translate-x-0 active:translate-y-0 active:shadow-none ${
                                    isSelected
                                        ? "bg-cubist-charcoal text-white hover:bg-cubist-charcoal"
                                        : tier.buttonClass
                                }`}>
                                    {isSelected ? "Selected" : "Select Tier"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Creator Logs / Recent Updates Feed */}
            <div className="flex flex-col gap-8">
                <div className="border-b-4 border-cubist-charcoal pb-4">
                    <span className="text-[10px] uppercase tracking-widest text-cubist-green font-extrabold font-sans mb-1 block">Chronicle</span>
                    <h3 className="serif-display text-2xl md:text-3xl text-cubist-charcoal font-black uppercase">Creator Log & Updates</h3>
                    <p className="text-xs text-cubist-charcoal/60 mt-1 font-sans">Stay up-to-date with work schedules and milestones</p>
                </div>

                <div className="flex flex-col gap-10">
                    {updates.map((update) => (
                        <div
                            key={update.id}
                            className="bg-transparent border-b-2 border-cubist-charcoal/20 pb-8 last:border-0 flex flex-col gap-3 group"
                        >
                            <div className="flex flex-wrap justify-between items-center gap-2">
                                <span className={`text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 border-2 border-cubist-charcoal shadow-cubist-sm font-sans ${update.tagColor}`}>
                                    {update.tag}
                                </span>
                                <span className="text-[10px] text-cubist-charcoal/50 font-sans italic font-bold">{update.date}</span>
                            </div>

                            <div>
                                <h4 className="serif-display text-xl text-cubist-charcoal group-hover:text-cubist-cobalt transition-colors duration-300 mb-2 font-extrabold uppercase">
                                    {update.title}
                                </h4>
                                <p className="font-sans font-normal text-cubist-charcoal/80 text-sm leading-relaxed max-w-4xl">
                                    {update.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;