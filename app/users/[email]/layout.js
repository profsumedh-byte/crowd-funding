"use client";

import React, { useState, useEffect, useCallback, createContext } from "react";
import Image from "next/image";
import { usePathname, useParams, redirect } from "next/navigation";
import User_Navbar from "@/app/components/User_Navbar";
import CampaignStatsCard from "@/app/components/CampaignStatsCard";
import { checkuser, updateprofilepic, getUser, updateUserProfile } from "@/app/services/user-services";
import { Cloudinary } from "@cloudinary/url-gen";
import CubistLoader from "@/app/components/CubistLoader";

export const UserProfileContext = createContext(null);

export const DEFAULT_ABOUT = "Hey there! I am a full-time digital creator dedicated to building sleek open-source templates, streaming high-framerate gameplay setups, and sharing design tricks. By backing my campaigns or joining a membership tier, you help fund new hardware, server environments, and content schedules. Thank you for visiting and supporting the journey!";



export default function UserProfileLayout({ children }) {
    const [paymentform, setpaymentform] = useState({ donorname: "", donoramount: "", donormessage: "" });
    const [isSameuser, setisSameuser] = useState(false);
    const [userprofile, setuserprofile] = useState({name:'user',email:'',profile_image:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",created_at :''});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", about: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pic_updating, setpic_updating] = useState(false)
    
    const pathname = usePathname();
    const params = useParams();
    const email = params?.email;

    const fetchUser = useCallback(async () => {
            try {
                if (!email) {
                    redirect('/users')
                }
                const res = await getUser(email);
                if (!res) {
                    throw new Error( "Failed to load user");
                }
                const data = res;
                setuserprofile(data);
            } catch (err) {
                console.error(err.message);
            } finally {
                // setLoading(false);
            }
        }, [email]);

    const openEditModal = () => {
        setEditForm({
            name: userprofile.name || "",
            about: userprofile.about || DEFAULT_ABOUT
        });
        setIsEditModalOpen(true);
    };

    const handleEditFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await updateUserProfile(email, editForm.name, editForm.about);
            if (res.status === 200) {
                setuserprofile(prev => ({
                    ...prev,
                    name: editForm.name,
                    about: editForm.about
                }));
                setIsEditModalOpen(false);
            } else {
                alert(res.error || "Failed to update profile");
            }
        } catch (err) {
            console.error("Error saving profile details:", err);
            alert("An error occurred while saving the profile.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (email) {
            checkuser(email)
                .then(res => setisSameuser(res))
                .catch(() => setisSameuser(false));
        }
    }, [email]);
    const campaign_id = params?.campaign_Id || params?.campaign_id;

    const isCampaignsTab = pathname === `/users/${email}/campaigns`;
    const isparticuar_campaign = !!campaign_id && pathname === `/users/${email}/campaigns/${campaign_id}`;

    const formchanged = (e) => {
        if (e.target.name === "donoramount" && !/^\d*\.?\d*$/.test(e.target.value)) {
            return;
        }
        setpaymentform({ ...paymentform, [e.target.name]: e.target.value });
    };

    const edit_profile_pic = () => {
        const fileInput = document.getElementById('hidden-file-input');
        fileInput.click();

    };
    const profile_change = async (e) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles[0]) {
            setpic_updating(true);
            try {
                const formDataProfilePic = new FormData();
                formDataProfilePic.append("profile_pic", selectedFiles[0]);
                const res = await fetch("/api/uploads/profile_pic", {
                    method: "POST",
                    body: formDataProfilePic,
                });

                if (res.ok) {
                    const result = await res.json();
                    const imagepublic_id = result.public_id || null;
                    console.log("Uploaded profile_pic URL:", result.url);
                    const emailofuser = decodeURIComponent(email).trim().toLowerCase();
                    const updated_pp = await updateprofilepic(imagepublic_id, emailofuser);
                    if (updated_pp.status === 200) {
                        await fetchUser();
                    } else {
                        alert("unable to update image in db");
                    }
                } else {
                    alert("Failed to upload image to server.");
                }
            } catch (err) {
                console.error("Error uploading profile image:", err);
                alert("An error occurred during upload.");
            } finally {
                setpic_updating(false);
            }
        }
    };


    const cld = new Cloudinary({
        cloud: {
            cloudName: "dgxhjssdt"
        }
    });

    const profile_user = userprofile.profile_image
        ? (userprofile.profile_image.startsWith("http")
            ? userprofile.profile_image
            : cld.image(userprofile.profile_image).toURL())
        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

    if (isparticuar_campaign) {
        return (
            <UserProfileContext.Provider value={{ userprofile, setuserprofile, isSameuser, fetchUser }}>
                <User_Navbar />
                <div className="min-h-screen pt-16 bg-cubist-bg text-cubist-charcoal font-sans">
                    {children}
                </div>
            </UserProfileContext.Provider>
        );
    }

    return (
        <UserProfileContext.Provider value={{ userprofile, setuserprofile, isSameuser, fetchUser }}>
            <User_Navbar />
             {pic_updating && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center">
                     <div className="absolute inset-0 bg-cubist-charcoal/60 backdrop-blur-sm"></div>
                     <div className="relative  z-10">
                         <CubistLoader message="updating profile pic" />
                     </div>
                 </div>
             )}
            <div className="min-h-screen pt-16 pb-24 bg-cubist-bg text-cubist-charcoal flex flex-col relative overflow-hidden font-sans">

                {/* Structural Cubist background decoration segments */}
                <div className="absolute top-20 right-[-10%] w-[50%] h-[500px] bg-cubist-cobalt/5 shape-cubist-blob pointer-events-none -z-10"></div>
                <div className="absolute bottom-10 left-[-5%] w-[350px] h-[350px] bg-cubist-yellow/5 rounded-full pointer-events-none -z-10"></div>

                {/* Hero / Exhibition Wall Banner Section */}
                <div className="relative w-full h-[260px] md:h-[320px] bg-cubist-sand border-b-4 border-cubist-charcoal overflow-hidden flex items-end">

                    {/* Confident primary color blocking banner components */}
                    <div className="absolute top-0 right-10 md:right-28 w-[360px] h-full bg-cubist-cobalt border-l-4 border-r-4 border-cubist-charcoal shape-cubist-arch translate-y-12"></div>
                    <div className="absolute top-10 left-[10%] w-24 h-24 bg-cubist-red rounded-full border-4 border-cubist-charcoal"></div>
                    <div className="absolute bottom-4 left-[22%] w-[200px] h-[80px] bg-cubist-yellow border-t-4 border-l-4 border-cubist-charcoal shape-cubist-curve-1"></div>

                    {/* Concentric Circle "Eye" motif details floating on the wall */}
                    <div className="absolute top-4 right-[40%] flex items-center justify-center w-14 h-14 bg-cubist-canvas border-4 border-cubist-charcoal rounded-full pointer-events-none opacity-30">
                        <div className="absolute w-10 h-10 bg-cubist-red rounded-full"></div>
                        <div className="absolute w-6 h-6 bg-cubist-yellow rounded-full"></div>
                        <div className="absolute w-3 h-3 bg-cubist-charcoal rounded-full"></div>
                    </div>
                </div>

                {/* Main Profile Info Layer */}
                <div className="max-w-7xl mx-auto px-6 w-full -mt-20 md:-mt-24 z-10 relative">
                    <div className="flex flex-col md:flex-row items-end gap-6 md:gap-8">

                        {/* Profile Picture Frame (Concentric Eye Motif) */}
                        <div className="relative group shrink-0">
                            {/* Outer offset circles */}
                            <div className="absolute inset-0 bg-cubist-yellow rounded-full border-4 border-cubist-charcoal translate-x-3 translate-y-3 transition-transform group-hover:translate-x-4 group-hover:translate-y-4"></div>
                            <div className="absolute inset-0 bg-cubist-red rounded-full border-4 border-cubist-charcoal -translate-x-1.5 -translate-y-1.5"></div>

                            <div className="relative w-36 h-36 rounded-full border-4 border-cubist-charcoal overflow-hidden bg-cubist-canvas z-10">
                                <Image
                                    src={ profile_user || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Edit pencil icon */}
                            {isSameuser && (

                                <button
                                    onClick={edit_profile_pic}
                                    className="absolute bottom-1 right-1 z-20 bg-cubist-orange text-white p-2 border-2 border-cubist-charcoal rounded-full shadow-cubist-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer flex items-center justify-center"
                                    title="Edit profile picture"
                                >
                                    <input onChange={profile_change} className="hidden" type="file" id="hidden-file-input" />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 20.013a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Title and Info */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-4 pb-2">
                            <div className="flex-1 text-left">
                                <span className="text-[10px] uppercase tracking-widest text-cubist-orange font-extrabold font-sans mb-1 block">Artist Showcase</span>
                                <h1 className="serif-display text-4xl md:text-5xl font-black uppercase tracking-tight text-cubist-charcoal leading-none">
                                    {userprofile.name || decodeURIComponent(email)}
                                </h1>
                                <p className="font-sans text-sm text-cubist-charcoal/70 tracking-wide font-light mt-1">
                                    {userprofile.email || decodeURIComponent(email)}
                                </p>
                            </div>
                            
                            {isSameuser && (
                                <button
                                    onClick={openEditModal}
                                    className="shrink-0 inline-flex items-center gap-2 border-4 border-cubist-charcoal px-5 py-2.5 text-xs tracking-widest uppercase font-black text-cubist-charcoal bg-cubist-yellow hover:bg-cubist-orange hover:text-white shadow-cubist-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                                    title="Edit your display name and manifesto"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 20.013a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Subpage Contents Grid */}
                <div className="max-w-7xl mx-auto px-6 w-full mt-16 z-10">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">

                        {/* Content Body: this is where nested page content goes */}
                        <div className="w-full min-w-0">
                            {children}
                        </div>


                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-cubist-charcoal/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="card-cubist-neutral w-full max-w-lg p-6 md:p-8 shape-cubist-curve-1 relative flex flex-col gap-6 text-cubist-charcoal shadow-cubist-lg animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-4 right-4 text-cubist-charcoal hover:text-cubist-orange transition-colors cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-cubist-orange font-extrabold font-sans mb-1 block">Studio Control</span>
                            <h2 className="serif-display text-2xl font-black uppercase tracking-tight text-cubist-charcoal">Edit Profile</h2>
                        </div>

                        <form onSubmit={handleEditFormSubmit} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase tracking-widest text-cubist-charcoal/80 font-extrabold font-sans">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter display name"
                                    className="w-full border-4 border-cubist-charcoal bg-white p-3 font-sans font-medium text-sm text-cubist-charcoal outline-none focus:ring-2 focus:ring-cubist-orange animate-duration-150"
                                    maxLength={50}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase tracking-widest text-cubist-charcoal/80 font-extrabold font-sans">
                                    About the Creator (Manifesto)
                                </label>
                                <textarea
                                    name="about"
                                    value={editForm.about}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, about: e.target.value }))}
                                    placeholder="Tell the world about yourself, your campaigns, and your goals..."
                                    className="w-full h-36 border-4 border-cubist-charcoal bg-white p-3 font-sans font-normal text-sm text-cubist-charcoal outline-none focus:ring-2 focus:ring-cubist-orange resize-none"
                                    maxLength={500}
                                    required
                                />
                            </div>

                            <div className="flex gap-4 mt-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-5 py-2.5 border-4 border-cubist-charcoal font-black uppercase text-xs tracking-widest text-cubist-charcoal bg-cubist-canvas hover:bg-cubist-sand shadow-cubist-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 border-4 border-cubist-charcoal font-black uppercase text-xs tracking-widest text-white bg-cubist-green hover:bg-green-700 shadow-cubist-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </UserProfileContext.Provider>
    );
}
