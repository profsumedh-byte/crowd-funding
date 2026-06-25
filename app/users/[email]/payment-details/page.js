"use client";
import { useState, useContext } from "react";
import { user_payment_account } from "@/app/services/payouts/user";

import React from "react";
import { UserProfileContext } from "../layout";

const PaymentDetails = () => {
    const { isEditingpay, setIsEditingpay } = useContext(UserProfileContext) || {};
    const isEditing = isEditingpay;
    
    return (
        <div className="card-cubist-purple p-8 shape-cubist-curve-1 relative text-white">
            
            <span className="text-[10px] uppercase tracking-widest text-white/70 font-extrabold font-sans mb-3 block">Financial Ledger</span>
            <h3 className="serif-display text-2xl text-white font-black uppercase mb-6">Payment Details</h3>
            
            <form action={user_payment_account}>
            <div className="flex flex-col gap-5 text-white font-sans">
                <div className="pb-4 border-b-2 border-white/20">
                    <span className="text-[9px] uppercase tracking-widest text-white/60 block font-extrabold mb-1">Phone Number</span>
                    <input type="text" disabled={!isEditing} inputMode="numeric" maxLength={10} name="phone" placeholder="9999999999" id="phoneno" required/>
                </div>

                <div className="pb-4 border-b-2 border-white/20">
                    <span className="text-[9px] uppercase tracking-widest text-white/60 block font-extrabold mb-1">Payout Account Name You Want</span>
                    <input type="text" disabled={!isEditing} name="acc_name" placeholder="Rohit@gmail.com" id="acc_name" />
                </div>

                <div className="pb-4 border-b-2 border-white/20">
                    <span className="text-[9px] uppercase tracking-widest text-white/60 block font-extrabold mb-1">UPI ID</span>
                    <input type="text" disabled={!isEditing} pattern="[^@]+@[^@]+" name="upi" placeholder="example@upi" id="upiid" required />
                </div>
                
                <div className="pb-4 border-b-2 border-white/20">
                    <span className="text-[9px] uppercase tracking-widest text-white/60 block font-extrabold mb-1">Email </span>
                    <input type="email" disabled={!isEditing} name="email" placeholder="Rohit@gmail.com" id="email" />
                </div>
                
                <div className="pt-2">
                    {isEditing && (<button className=" cursor-pointer text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 border-2 border-cubist-charcoal shadow-cubist-sm text-cubist-charcoal bg-cubist-yellow inline-block mt-2 font-sans" type="reset" onClick={()=>setIsEditingpay(false)}>Cancel</button>)}
                    {isEditing && (<button className=" cursor-pointer text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 border-2 border-cubist-charcoal shadow-cubist-sm text-cubist-charcoal bg-cubist-yellow inline-block mt-2 font-sans" type="submit" disabled={!isEditing}>Submit</button>)}
                </div>
            </div>
            </form>
        </div>
    );
};

export default PaymentDetails;
