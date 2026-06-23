import React from 'react'
import Link from 'next/link'

const CampaignList = ({Campaign, email}) => {
    return (
        <div className="flex flex-col gap-6">
            {Campaign.map((camp) => (
                <div
                    key={camp.id}
                    className="border-b-2 border-white/20 last:border-0 pb-5 last:pb-0 flex justify-between items-center text-white group"
                >
                    <Link
                        href={`/users/${email}/campaigns/${camp.id}`}
                        className="flex gap-4 items-center min-w-0 hover:opacity-90 active:scale-[0.99] transition-all flex-1"
                    >
                        {/* Cubist Canvas Frame Thumbnail */}
                        {camp.banner ? (
                            <div className="relative w-16 h-12 border-2 border-white shadow-cubist-sm shrink-0 overflow-hidden bg-cubist-charcoal">
                                <img src={camp.banner} alt={camp.title} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="relative w-16 h-12 border-2 border-white/30 shrink-0 overflow-hidden bg-white/10 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                        <div className="min-w-0">
                            <h4 className="serif-display text-lg text-white group-hover:text-cubist-yellow transition-colors duration-300 font-bold uppercase truncate">
                                {camp.title}
                            </h4>
                            <p className="text-xs text-white/80 mt-1 font-sans font-normal truncate">
                                Goal: <span className="font-bold text-white">{camp.goal}</span> | Raised: <span className="font-bold text-cubist-yellow">{camp.raised}</span>
                            </p>
                        </div>
                    </Link>
                    <span className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 border-2 border-cubist-charcoal shadow-cubist-sm font-sans shrink-0 ml-4 ${camp.status === "Completed"
                            ? "text-cubist-charcoal bg-cubist-yellow"
                            : "text-white bg-cubist-orange"
                        }`}>
                        {camp.status}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default CampaignList
