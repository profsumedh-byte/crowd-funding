"use client";

import React from "react";

const PaymentDetails = () => {
    return (
        <div className="card-cubist-purple p-8 shape-cubist-curve-1 relative text-white">
            
            <span className="text-[10px] uppercase tracking-widest text-white/70 font-extrabold font-sans mb-3 block">Financial Ledger</span>
            <h3 className="serif-display text-2xl text-white font-black uppercase mb-6">Payment Details</h3>
            
            <div className="flex flex-col gap-5 text-white font-sans">
                <div className="pb-4 border-b-2 border-white/20">
                    <span className="text-[9px] uppercase tracking-widest text-white/60 block font-extrabold mb-1">Razorpay Account ID</span>
                    <span className="text-sm font-bold text-cubist-yellow font-mono">acc_razorpay_987654321</span>
                </div>
                
                <div className="pb-4 border-b-2 border-white/20">
                    <span className="text-[9px] uppercase tracking-widest text-white/60 block font-extrabold mb-1">Account Holder Name</span>
                    <span className="text-sm font-bold text-white">Sumedh Gangurde.</span>
                </div>
                
                <div className="pt-2">
                    <span className="text-[9px] uppercase tracking-widest text-white/60 block font-extrabold">Status</span>
                    <span className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 border-2 border-cubist-charcoal shadow-cubist-sm text-cubist-charcoal bg-cubist-yellow inline-block mt-2 font-sans">
                        Verified & Active
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetails;
