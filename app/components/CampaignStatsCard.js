"use client";

import React from "react";

/**
 * CampaignStatsCard - Pure presentational component for campaign metrics and backing form.
 * 
 * @param {Object} props
 * @param {Object} props.paymentform - Form input values { donorname, donoramount, donormessage }
 * @param {function} props.onChange - Change handler callback for form inputs
 * @param {function} props.onSubmit - Submission callback for the backing form
 * @param {string} props.totalRaised - Formatted total raised string (e.g., "₹0")
 * @param {string} props.target - Formatted campaign goal target string (e.g., "₹0")
 * @param {string} props.progress - Progress bar width percentage string (e.g., "0%")
 * @param {string} props.backers - Formatted total backer count (e.g., "0")
 * @param {string} props.timeLeft - Remaining time string (e.g., "0 days")
 * @param {string} props.endDateText - End date indicator string (e.g., "ends date")
 */
export default function CampaignStatsCard({
    paymentform = { donorname: "", donoramount: "", donormessage: "" },
    onChange,
    onSubmit,
    totalRaised = "₹0",
    target = "₹0",
    progress = "0%",
    backers = "0",
    timeLeft = "0 days",
    endDateText = "Ends Date"
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    };

    return (
        <div className="card-cubist-orange p-8 shape-cubist-curve-2 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="flex flex-col gap-6">
                <div className="border-b-2 border-white pb-4">
                    <span className="text-[10px] uppercase tracking-widest text-white/80 font-extrabold font-sans">Patron Ledger</span>
                    <h3 className="serif-display text-2xl text-white mt-1 font-bold uppercase">Campaign Status</h3>
                </div>

                {/* Main Progress Block */}
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-[9px] uppercase tracking-widest text-white/70 block font-bold font-sans">Total Raised</span>
                            <span className="serif-display text-3xl font-extrabold text-cubist-yellow">{totalRaised}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[9px] uppercase tracking-widest text-white/70 block font-bold font-sans">Progress</span>
                            <span className="serif-display text-2xl font-bold text-white">{progress}</span>
                        </div>
                    </div>

                    {/* Progress Bar (Bold thick Outline bar) */}
                    <div className="w-full bg-white h-5 border-2 border-cubist-charcoal overflow-hidden mt-1">
                        <div className="bg-cubist-yellow h-full border-r-2 border-cubist-charcoal" style={{ width: progress }}></div>
                    </div>

                    <div className="flex justify-between text-[10px] text-white/70 font-sans tracking-widest uppercase font-extrabold mt-1">
                        <span>Target: {target}</span>
                        <span>Pledged</span>
                    </div>
                </div>

                {/* Secondary Stats Grid */}
                <div className="grid grid-cols-2 gap-4 border-t-2 border-b-2 border-white py-4 my-2">
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest text-white/70 font-extrabold font-sans">Backers</span>
                        <span className="serif-display text-xl font-bold text-white">{backers}</span>
                        <span className="text-[10px] text-cubist-yellow font-bold uppercase tracking-wider mt-0.5">supporters</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest text-white/70 font-extrabold font-sans">Time Left</span>
                        <span className="serif-display text-xl font-bold text-white">{timeLeft}</span>
                        <span className="text-[10px] text-cubist-yellow font-bold uppercase tracking-wider mt-0.5">{endDateText}</span>
                    </div>
                </div>

                {/* Payment/Donation Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h4 className="serif-display text-lg text-white font-bold uppercase">Back this project</h4>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="donor-name" className="text-[9px] uppercase tracking-widest text-white/80 font-extrabold font-sans">Your Name</label>
                        <input
                            type="text"
                            id="donor-name"
                            name="donorname"
                            placeholder="NAME OR INITIALS"
                            value={paymentform.donorname}
                            onChange={onChange}
                            className="bg-transparent border-b-2 border-white py-1.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cubist-yellow transition-colors font-sans"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="donor-amount" className="text-[9px] uppercase tracking-widest text-white/80 font-extrabold font-sans">Contribution Amount</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            name="donoramount"
                            id="donor-amount"
                            placeholder="E.G. 50"
                            value={paymentform.donoramount}
                            onChange={onChange}
                            className="bg-transparent border-b-2 border-white py-1.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cubist-yellow transition-colors font-sans"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="donor-message" className="text-[9px] uppercase tracking-widest text-white/80 font-extrabold font-sans">Your Message (Optional)</label>
                        <textarea
                            name="donormessage"
                            id="donor-message"
                            rows={2}
                            placeholder="Leave an encouraging note..."
                            value={paymentform.donormessage}
                            onChange={onChange}
                            className="bg-transparent border-b-2 border-white py-1.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cubist-yellow transition-colors resize-none font-sans"
                        />
                    </div>

                    {/* Pay Button / Call To Action */}
                    <div className="mt-8">
                        <button 
                            type="submit" 
                            className="w-full bg-cubist-yellow text-cubist-charcoal border-2 border-cubist-charcoal shadow-cubist hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-cubist-lg active:translate-x-0 active:translate-y-0 active:shadow-none font-bold py-3.5 px-6 rounded-none text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                            </svg>
                            Make Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
