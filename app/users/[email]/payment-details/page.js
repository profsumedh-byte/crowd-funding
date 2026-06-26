"use client";
import { useState, useContext } from "react";
import { cashfree_payment_account } from "@/app/services/payouts/user";
import React from "react";
import { UserProfileContext } from "../layout";

const PaymentDetails = () => {
    const { userprofile, fetchUser, isEditingpay, setIsEditingpay } = useContext(UserProfileContext) || {};
    const isEditing = isEditingpay;
    const cashfree = userprofile?.cashfree_payment_accounts;
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget);
        try {
            const res = await cashfree_payment_account(formData);
            if (res?.success) {
                alert("Payment details stored in database successfully.");
                setIsEditingpay(false);
                if (fetchUser) {
                    await fetchUser();
                }
            } else {
                alert("Failed to save payment details: " + (res?.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error saving payment details:", error);
            alert("An unexpected error occurred. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <div className="card-cubist-purple p-8 shape-cubist-curve-1 relative text-white">
            
            <span className="text-[10px] uppercase tracking-widest text-white/70 font-extrabold font-sans mb-3 block">Financial Ledger</span>
            <h3 className="serif-display text-2xl text-white font-black uppercase mb-6">Payment Details</h3>
            
            <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5 text-white font-sans">
                <div className="pb-4 border-b-2 border-white/20">
                    <span className="text-[9px] uppercase tracking-widest text-white/60 block font-extrabold mb-1">Phone Number</span>
                    <input type="text" disabled={!isEditing} inputMode="numeric" maxLength={10} name="phone" defaultValue={cashfree?.phone || ""} placeholder="9999999999" id="phoneno" required/>
                </div>

                <div className="pb-4 border-b-2 border-white/20">
                    <span className="text-[9px] uppercase tracking-widest text-white/60 block font-extrabold mb-1">Payout Account Name You Want</span>
                    <input type="text" disabled={!isEditing} name="acc_name" defaultValue={cashfree?.account_name || ""} placeholder="Rohit@gmail.com" id="acc_name" />
                </div>

                <div className="pb-4 border-b-2 border-white/20">
                    <span className="text-[9px] uppercase tracking-widest text-white/60 block font-extrabold mb-1">UPI ID</span>
                    <input type="text" disabled={!isEditing} pattern="[^@]+@[^@]+" name="upi" defaultValue={cashfree?.upi_id || ""} placeholder="example@upi" id="upiid" required />
                </div>
                
                <div className="pb-4 border-b-2 border-white/20">
                    <span className="text-[9px] uppercase tracking-widest text-white/60 block font-extrabold mb-1">Email </span>
                    <input type="email" disabled={!isEditing} name="email" defaultValue={cashfree?.email || ""} placeholder="Rohit@gmail.com" id="email" />
                </div>
                
                <div className="pt-2">
                    {isEditing && (
                        <button 
                            className="cursor-pointer text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 border-2 border-cubist-charcoal shadow-cubist-sm text-cubist-charcoal bg-cubist-yellow inline-block mt-2 font-sans mr-2" 
                            type="button" 
                            onClick={() => setIsEditingpay(false)}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                    )}
                    {isEditing && (
                        <button 
                            className="cursor-pointer text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 border-2 border-cubist-charcoal shadow-cubist-sm text-cubist-charcoal bg-cubist-yellow inline-block mt-2 font-sans" 
                            type="submit" 
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Submit"}
                        </button>
                    )}
                </div>
            </div>
            </form>
        </div>
    );
};

export default PaymentDetails;
