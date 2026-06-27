"use client";

import React from 'react';

/**
 * ClaimFundButton - A green button with white text designed to match the site's Cubist/Neo-Brutalist design theme.
 *
 * @param {Object} props
 * @param {function} props.onClick - Click handler function
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.loading=false] - Loading/processing state
 * @param {string} [props.className=""] - Additional class names for styling overrides
 */
const ClaimFundButton = ({ 
    onClick, 
    disabled = false, 
    loading = false, 
    className = "" 
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                group
                relative
                inline-flex
                items-center
                justify-center
                gap-2.5
                px-6
                py-3.5
                bg-cubist-green
                text-white
                font-sans
                text-[11px]
                font-bold
                uppercase
                tracking-widest
                border-2
                border-cubist-charcoal
                shadow-cubist-sm
                transition-all
                duration-200
                ease-out
                hover:-translate-x-0.5
                hover:-translate-y-0.5
                hover:shadow-cubist
                active:translate-x-0
                active:translate-y-0
                active:shadow-none
                disabled:opacity-50
                disabled:pointer-events-none
                cursor-pointer
                ${className}
            `}
        >
            {/* Money / Claim Icon */}
            {loading ? (
                <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : (
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2.5} 
                    stroke="currentColor" 
                    className="w-4 h-4 transition-transform group-hover:scale-110"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            )}
            <span>
                {loading ? "Processing..." : "claim campaign fund"}
            </span>
        </button>
    );
};

export default ClaimFundButton;
