"use client";

import React from "react";
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    const username = session.user.name;
    redirect(`/users/${username}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cubist-bg text-cubist-charcoal font-sans p-6 relative overflow-hidden">
      
      {/* Large abstract cubist background forms */}
      <div className="absolute top-[-80px] left-[-80px] w-96 h-96 bg-cubist-cobalt/5 shape-cubist-blob pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-cubist-yellow/5 rounded-full pointer-events-none -z-10"></div>
      
      {/* Bold Modern Art Registry Box */}
      <div className="bg-cubist-canvas border-4 border-cubist-charcoal p-10 md:p-12 shadow-cubist-lg text-center max-w-md w-full relative">
        {/* Gallery-style top border color line */}
        <div className="absolute top-0 left-0 w-full h-[6px] bg-cubist-cobalt"></div>
        
        {/* Concentric Eye Emblem in center */}
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center w-12 h-12 bg-cubist-canvas border-4 border-cubist-charcoal rounded-full">
            <div className="absolute w-8 h-8 bg-cubist-cobalt rounded-full"></div>
            <div className="absolute w-5 h-5 bg-cubist-yellow rounded-full"></div>
            <div className="absolute w-2.5 h-2.5 bg-cubist-charcoal rounded-full"></div>
          </div>
        </div>
        
        <span className="text-[10px] uppercase tracking-widest text-cubist-orange font-extrabold font-sans mb-2 block">Patron Portal</span>
        <h1 className="serif-display text-3xl text-cubist-charcoal font-black uppercase mb-4">
          Buy Me GTA
        </h1>
        <p className="font-sans font-light text-cubist-charcoal/70 text-xs md:text-sm leading-relaxed mb-8">
          A bold, curated space connecting digital creators with patrons supporting their showcases and causes.
        </p>
        
        <button 
          className="w-full bg-cubist-orange text-white border-2 border-cubist-charcoal shadow-cubist hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-cubist-lg active:translate-x-0 active:translate-y-0 active:shadow-none font-bold py-3.5 px-6 rounded-none text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer" 
          onClick={() => signIn("Google")}
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
}
