import React from 'react';

/**
 * CubistLoader - A reusable loading indicator component tailored 
 * to the neo-brutalist / cubist design language of the project.
 */
export default function CubistLoader({ message = "LOADING EXPOSITION..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4 w-full h-full min-h-[250px] z-9999">
      <div className="relative flex items-center justify-center">
        {/* Animated Morphing Cubist Spinner */}
        <div className="cubist-spinner"></div>
        
        {/* Decorative background shape offset */}
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-cubist-charcoal bg-transparent -z-10"></div>
      </div>
      
      {/* Heavy Uppercase Serif Text */}
      <span className="serif-display text-xs uppercase tracking-widest text-cubist-charcoal font-black mt-2 animate-pulse">
        {message}
      </span>
    </div>
  );
}
