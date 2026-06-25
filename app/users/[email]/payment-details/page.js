"use client";
import { useState, useContext } from "react";

import React from "react";
import { UserProfileContext } from "../layout";

const PaymentDetails = () => {
    const { isEditingpay } = useContext(UserProfileContext) || {};
    const isEditing = isEditingpay;
    
    return (
        <div className="card-cubist-purple p-8 shape-cubist-curve-1 relative text-white">
            
            <span className="text-[10px] uppercase tracking-widest text-white/70 font-extrabold font-sans mb-3 block">Financial Ledger</span>
            <h3 className="serif-display text-2xl text-white font-black uppercase mb-6">Payment Details</h3>
            
            <form action="">
            <div className="flex flex-col gap-5 text-white font-sans">
                <div className="pb-4 border-b-2 border-white/20">
                    <span className="text-[9px] uppercase tracking-widest text-white/60 block font-extrabold mb-1">Phone Number</span>
                    <input type="text" disabled={!isEditing} inputMode="numeric" maxLength={10} name="phone" placeholder="9999999999" id="phoneno" required/>
                </div>
                <div className="pb-4 border-b-2 border-white/20">
                    <span className="text-[9px] uppercase tracking-widest text-white/60 block font-extrabold mb-1">UPI ID</span>
                    <input type="text" disabled={!isEditing} pattern="[^@]+@[^@]+" name="upi" placeholder="example@upi" id="upiid" required />
                </div>
                
                <div className="pb-4 border-b-2 border-white/20">
                    <span className="text-[9px] uppercase tracking-widest text-white/60 block font-extrabold mb-1">Account Holder Name</span>
                    <input type="text" disabled={!isEditing} name="Account_name" placeholder="Rohit" id="Account_name" />
                </div>
                
                <div className="pt-2">
                    {isEditing && (<button className=" cursor-pointer text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 border-2 border-cubist-charcoal shadow-cubist-sm text-cubist-charcoal bg-cubist-yellow inline-block mt-2 font-sans" type="submit" disabled={!isEditing}>Submit</button>)}
                </div>
            </div>
            </form>
        </div>
    );
};

export default PaymentDetails;
