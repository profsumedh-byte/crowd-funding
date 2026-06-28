"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createCampaign, getUserCampaigns } from "@/app/services/campaign-services";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import CampaignList from "@/app/components/CampaignList";
import { checkuser } from "@/app/services/user-services";


const Campaigns = () => {
    const { data: session } = useSession();
    const params = useParams();
    const email = params?.email;
    
    // Stateful list of campaigns, initialized to empty array
    const [campaigns, setCampaigns] = useState([]);
    const [whouser, setwhouser] = useState(false);
    useEffect(() => {
      if (email) {
        checkuser(email)
          .then(res => setwhouser(res))
          .catch(() => setwhouser(false));
      }
    }, [email])

    const loadCampaigns = useCallback(async () => {
        if (!email) return;
        try {
            const data = await getUserCampaigns(email);
            setCampaigns(data);
        } catch (err) {
            console.error("Failed to load campaigns:", err);
        }
    }, [email]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCampaigns();
    }, [loadCampaigns]);
    

    // Form states
    const [formData, setFormData] = useState({
        title: "",
        about: "",
        goal: ""
    });
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef(null);

    

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (bannerPreview) {
                URL.revokeObjectURL(bannerPreview);
            }
        };
    }, [bannerPreview]);

    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGoalChange = (e) => {
        const value = e.target.value;
        // Allow only positive integers
        if (value === "" || /^\d+$/.test(value)) {
            setFormData((prev) => ({
                ...prev,
                goal: value
            }));
        }
    };

    const handleFileChange = (file) => {
        if (!file) return;
        if (bannerPreview) {
            URL.revokeObjectURL(bannerPreview);
        }
        setBannerFile(file);
        setBannerPreview(URL.createObjectURL(file));
    };

    const handleRemoveBanner = (e) => {
        e.stopPropagation(); // Prevent triggering the file input click
        if (bannerPreview) {
            URL.revokeObjectURL(bannerPreview);
        }
        setBannerFile(null);
        setBannerPreview("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            handleFileChange(file);
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.goal) {
            return;
        }

        const goalAmount = parseFloat(formData.goal);
        if (goalAmount > 99999999) {
            alert("The maximum expected amount for a campaign is ₹99,999,999.");
            return;
        }

        if (!session || !session.user || !session.user.id) {
            alert("You must be logged in to create a campaign.");
            return;
        }

        setIsSubmitting(true);

        try {
            const formattedGoal = Number(formData.goal).toLocaleString();
            let imageUrl = null;

            // If banner is provided, upload it first to get the URL
            if (bannerFile) {
                try {
                    const formDataToSend = new FormData();
                    formDataToSend.append("title", formData.title);
                    formDataToSend.append("about", formData.about);
                    formDataToSend.append("goal_amount", formattedGoal);
                    formDataToSend.append("file", bannerFile); // actual File object

                    const res = await fetch("/api/uploads", {
                        method: "POST",
                        body: formDataToSend,
                    });

                    if (res.ok) {
                        const result = await res.json();
                        imageUrl = result.URL || result.url || null;
                        console.log("Uploaded Image URL:", imageUrl);
                    }
                } catch (err) {
                    console.error("Error uploading cover image:", err);
                }
            }

            // Create new campaign object with the resolved imageUrl giving it to db for storing 
            const decimal_goal = parseFloat(formData.goal);
            const newCampaign = {
                user_id: BigInt(session.user.id),
                title: formData.title,
                about: formData.about,
                goal_amount: decimal_goal || 0,
                cover_image: imageUrl
            };

            try {
                await createCampaign(newCampaign);
                // console.log("Created Campaign Object:", newCampaign);

                // Refresh the campaign list from the database
                await loadCampaigns();

                // Show success visual state
                setSuccessMessage(`Campaign "${formData.title}" details submitted successfully!`);
                setShowSuccess(true);

                // Reset form inputs
                setFormData({ title: "", about: "", goal: "" });
                setBannerFile(null);
                setBannerPreview("");
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }

                // Hide success banner after 4 seconds
                setTimeout(() => {
                    setShowSuccess(false);
                }, 4000);

            } catch (dbErr) {
                console.error("Database error creating campaign:", dbErr);
                alert("Failed to save campaign to the database.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full">

            {/* Success Toast / Cubist Alert Banner */}
            {showSuccess && (
                <div className="bg-cubist-cobalt border-4 border-cubist-charcoal p-4 text-white shadow-cubist-sm font-sans font-bold flex items-center justify-between animate-bounce">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-cubist-yellow border-2 border-cubist-charcoal flex items-center justify-center text-cubist-charcoal text-xs">✓</div>
                        <span className="text-xs uppercase tracking-wider">{successMessage}</span>
                    </div>
                    <button
                        onClick={() => setShowSuccess(false)}
                        className="text-white hover:text-cubist-yellow font-black uppercase text-[10px]"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Grid Container for Side-by-Side Layout on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Start Campaign Option Form Card - Left Column */}
                {whouser && (<div className="lg:col-span-7 card-cubist-neutral p-8 shape-cubist-curve-2 relative text-cubist-charcoal w-full">
                    <span className="text-[10px] uppercase tracking-widest text-cubist-charcoal/60 font-extrabold font-sans mb-3 block">Creation Portal</span>
                    <h3 className="serif-display text-2xl text-cubist-charcoal font-black uppercase mb-6 border-b-2 border-cubist-charcoal/20 pb-3">Initiate New Campaign</h3>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Campaign Name */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="campaign-title" className="text-[9px] uppercase tracking-widest text-cubist-charcoal/70 font-extrabold font-sans">Campaign Name</label>
                            <input
                                type="text"
                                id="campaign-title"
                                name="title"
                                required
                                placeholder="E.G. NEXT-GEN GRAPHICS HARDWARE BUILD"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full bg-white border-2 border-cubist-charcoal px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-cubist-orange text-cubist-charcoal shadow-cubist-sm placeholder-cubist-charcoal/40 transition-colors"
                            />
                        </div>

                        {/* About the Campaign */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="campaign-about" className="text-[9px] uppercase tracking-widest text-cubist-charcoal/70 font-extrabold font-sans">About the Campaign</label>
                            <textarea
                                id="campaign-about"
                                name="about"
                                rows={3}
                                required
                                placeholder="DESCRIBE YOUR GOALS AND SHOWCASE DETAILS FOR PATRONS..."
                                value={formData.about}
                                onChange={handleInputChange}
                                className="w-full bg-white border-2 border-cubist-charcoal px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-cubist-orange text-cubist-charcoal shadow-cubist-sm placeholder-cubist-charcoal/40 transition-colors resize-none"
                            />
                        </div>

                        {/* Upload Banner */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[9px] uppercase tracking-widest text-cubist-charcoal/70 font-extrabold font-sans">Upload Banner (Optional)</span>

                            {bannerPreview ? (
                                /* Custom image preview frame */
                                <div className="relative w-full h-40 border-2 border-cubist-charcoal shadow-cubist-sm overflow-hidden group">
                                    <img
                                        src={bannerPreview}
                                        alt="Banner preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-cubist-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={handleRemoveBanner}
                                            className="bg-cubist-red text-white border-2 border-cubist-charcoal px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest shadow-cubist-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer border-none"
                                        >
                                            Remove Banner
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Drag & drop upload area */
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 rounded-none ${isDragging
                                        ? "border-cubist-orange bg-cubist-orange/10"
                                        : "border-cubist-charcoal/40 bg-cubist-canvas/30 hover:bg-cubist-canvas hover:border-cubist-orange"
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-cubist-charcoal/50">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                    </svg>
                                    <span className="text-[10px] font-sans font-black text-cubist-charcoal uppercase tracking-wider">
                                        Drag & Drop Banner or Click to Browse
                                    </span>
                                    <span className="text-[8px] text-cubist-charcoal/50 font-sans uppercase tracking-wide">
                                        Supports image formats (PNG, JPG, WEBP)
                                    </span>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={(e) => handleFileChange(e.target.files?.[0])}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Total Amount Needed */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="campaign-goal" className="text-[9px] uppercase tracking-widest text-cubist-charcoal/70 font-extrabold font-sans">Total Amount Needed</label>
                            <div className={`flex bg-white border-2 shadow-cubist-sm relative ${parseFloat(formData.goal) > 99999999 ? "border-cubist-red" : "border-cubist-charcoal"}`}>
                                <span className="bg-cubist-charcoal text-white font-bold px-4 py-2.5 text-sm border-r-2 border-cubist-charcoal flex items-center justify-center font-sans">
                                    ₹
                                </span>
                                <input
                                    type="text"
                                    id="campaign-goal"
                                    name="goal"
                                    required
                                    placeholder="E.G. 10000"
                                    value={formData.goal}
                                    onChange={handleGoalChange}
                                    className="w-full px-4 py-2.5 text-sm font-sans focus:outline-none placeholder-cubist-charcoal/40 text-cubist-charcoal"
                                />
                            </div>
                            {parseFloat(formData.goal) > 99999999 && (
                                <span className="text-cubist-red text-[10px] font-sans font-bold uppercase tracking-wider mt-1">
                                    The maximum expected amount for a campaign is ₹99,999,999.
                                </span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-cubist-orange text-white border-2 border-cubist-charcoal shadow-cubist hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-cubist-lg active:translate-x-0 active:translate-y-0 active:shadow-none font-bold py-3.5 px-6 rounded-none text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Adding Campaign...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        Launch Campaign
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                )}

                {/* Campaign List Card - Right Column */}
                <div className={whouser ? "lg:col-span-5 card-cubist-green p-8 shape-cubist-curve-1 relative text-white w-full":"lg:col-span-10 card-cubist-green p-8 shape-cubist-curve-1 relative text-white w-full"}>
                    <span className="text-[10px] uppercase tracking-widest text-white/70 font-extrabold font-sans mb-3 block">Exhibited Pieces</span>
                    <h3 className="serif-display text-2xl text-white font-black uppercase mb-6">Active & Completed Campaigns</h3>

                    <CampaignList Campaign={campaigns} email={email} />
                </div>

            </div>
        </div>
    );
};

export default Campaigns;
