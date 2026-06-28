"use client";

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { UserProfileContext } from '@/app/users/[email]/layout';

const User_Navbar = () => {
    const params = useParams();
    const email = params?.email;
    const pathname = usePathname();
    const isUsersPage = pathname === '/users';
    const [mobileOpen, setMobileOpen] = useState(false);
    const { data: session } = useSession();
    
    // Consume isSameuser from context, fallback to false if not inside provider
    const { isSameuser } = useContext(UserProfileContext) || {};

    // Build paths dynamically based on the current email parameter
    const profilePath = email ? `/users/${email}` : '#';
    const campaignsPath = email ? `/users/${email}/campaigns` : '#';

    return (
        <nav className="fixed w-full z-40 top-0 inset-x-0 border-b-4 border-cubist-charcoal bg-cubist-cobalt text-white">
            <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto px-6 py-4">
                
                {/* Logo with Concentric Eye Motif */}
                <Link href="/" className="flex items-center space-x-3 group text-white">
                    <div className="relative flex items-center justify-center w-8 h-8 bg-cubist-canvas border-2 border-cubist-charcoal rounded-full overflow-hidden transition-transform group-hover:rotate-90 duration-500">
                        <div className="absolute w-6 h-6 bg-cubist-cobalt rounded-full"></div>
                        <div className="absolute w-3.5 h-3.5 bg-cubist-yellow rounded-full"></div>
                        <div className="absolute w-1.5 h-1.5 bg-cubist-charcoal rounded-full"></div>
                    </div>
                    <span className="serif-display text-xl uppercase tracking-wider font-black text-white">
                        Buy Me GTA
                    </span>
                </Link>
                
                <button 
                    onClick={() => setMobileOpen(!mobileOpen)}
                    type="button" 
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-white border-2 border-white hover:bg-cubist-cobalt/40 md:hidden focus:outline-none" 
                    aria-controls="navbar-default" 
                    aria-expanded={mobileOpen}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" d="M5 7h14M5 12h14M5 17h14" />
                    </svg>
                </button>
                
                <div className={`${mobileOpen ? "block" : "hidden"} w-full md:block md:w-auto mt-4 md:mt-0`} id="navbar-default">
                    <ul className="font-sans text-[11px] font-bold uppercase tracking-widest flex flex-col p-4 md:p-0 border-2 border-cubist-charcoal md:border-0 bg-cubist-cobalt md:bg-transparent md:flex-row md:space-x-8 md:items-center">
                        {email ? (
                            <>
                                <li>
                                    <Link href="/users" className="block py-2 px-3 md:p-0 hover:text-cubist-yellow transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href={profilePath} className="block py-2 px-3 md:p-0 hover:text-cubist-yellow transition-colors">
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link href={campaignsPath} className="block py-2 px-3 md:p-0 hover:text-cubist-yellow transition-colors">
                                        Campaigns
                                    </Link>
                                </li>
                                {isSameuser && (
                                    <li>
                                        <Link href={`/users/${email}/payment-details`} className="block py-2 px-3 md:p-0 hover:text-cubist-yellow transition-colors">
                                            Payment Details
                                        </Link>
                                    </li>
                                )}
                            </>
                        ) : (
                            // Registry/Discover view
                            session?.user?.email && (
                                <li>
                                    <Link href={`/users/${session.user.email}`} className="block py-2 px-3 md:p-0 hover:text-cubist-yellow transition-colors">
                                        Dashboard
                                    </Link>
                                </li>
                            )
                        )}
                        
                        {isUsersPage && (
                            <li>
                                <a 
                                    href="https://github.com/profsumedh-byte/crowd-funding"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-cubist-charcoal text-white border-2 border-white shadow-cubist-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all font-bold text-[10px] tracking-widest uppercase px-4 py-2.5 text-center cursor-pointer"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                    GitHub
                                </a>
                            </li>
                        )}
                        
                        <li className="mt-3 md:mt-0 pt-3 md:pt-0 border-t-2 border-cubist-charcoal md:border-t-0">
                            {session ? (
                                <button 
                                    type="button" 
                                    onClick={() => { signOut({ callbackUrl: '/' }) }} 
                                    className="w-full md:w-auto bg-cubist-yellow text-cubist-charcoal border-2 border-cubist-charcoal shadow-cubist-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all font-bold text-[10px] tracking-widest uppercase px-5 py-2.5 text-center cursor-pointer"
                                >
                                    logout
                                </button>
                            ) : (
                                <Link 
                                    href="/" 
                                    className="block w-full md:w-auto bg-cubist-yellow text-cubist-charcoal border-2 border-cubist-charcoal shadow-cubist-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all font-bold text-[10px] tracking-widest uppercase px-5 py-2.5 text-center cursor-pointer"
                                >
                                    Sign In
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default User_Navbar;
