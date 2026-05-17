import React from 'react';

/**
 * AnimatedLightBackground
 * A premium, futuristic, and editorial background for light mode.
 * Features slow drift animations, pastel glows, and a frosted glass effect.
 */
export const AnimatedLightBackground = () => {
  return (
    <div className="fixed inset-0 -z-30 overflow-hidden bg-[#F6F3F8]">
      {/* Ambient Glows - Positioned off-center for depth and airiness */}
      {/* Each glow has a unique drift animation delay to avoid synchronization */}
      
      {/* Electric Lavender Glow */}
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#CFC7FF]/60 blur-[120px] animate-drift" />
      
      {/* Sky Blue Mist */}
      <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#BFE3FF]/60 blur-[120px] animate-drift" style={{ animationDelay: '-10s' }} />
      
      {/* Coral Blush */}
      <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#F7B3B0]/40 blur-[100px] animate-drift" style={{ animationDelay: '-20s' }} />
      
      {/* Mint Haze */}
      <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-[#CFF7EA]/40 blur-[120px] animate-drift" style={{ animationDelay: '-5s' }} />

      {/* Frosted Glass Veil - Softens the colors and adds depth */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl" />
      
      {/* Subtle Frame Highlight */}
      <div className="absolute inset-0 border-[1px] border-white/20 rounded-[2rem] pointer-events-none" />
    </div>
  );
};
