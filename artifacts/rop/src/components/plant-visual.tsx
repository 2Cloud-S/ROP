import React from "react";
import { motion } from "framer-motion";

interface PlantVisualProps {
  speciesSlug?: string;
  stage: number;
  colors?: {
    primary?: string;
    glow?: string;
  };
  imageUrl?: string;
  className?: string;
  isSilhouetted?: boolean;
}

export function PlantVisual({ speciesSlug, stage, colors, imageUrl, className, isSilhouetted }: PlantVisualProps) {
  const primary = colors?.primary || "hsl(var(--primary))";
  const glow = colors?.glow || "hsl(var(--primary))";

  if (imageUrl) {
    return (
      <div className={`relative flex items-center justify-center ${className || ""}`}>
        {isSilhouetted ? (
          <img src={imageUrl} alt={speciesSlug} className="w-full h-full object-contain brightness-0 opacity-50" />
        ) : (
          <>
            <div className="absolute inset-0 blur-2xl opacity-30 mix-blend-screen" style={{ backgroundColor: glow }} />
            <img src={imageUrl} alt={speciesSlug} className="w-full h-full object-contain relative z-10 animate-in fade-in zoom-in duration-700" />
          </>
        )}
      </div>
    );
  }

  // Fallback procedural SVG
  const getSize = () => {
    switch (stage) {
      case 1: return 60;
      case 2: return 100;
      case 3: return 160;
      case 4: return 220;
      default: return 60;
    }
  };

  const size = getSize();

  return (
    <div className={`relative flex items-center justify-center ${className || ""}`}>
      {!isSilhouetted && (
        <motion.div 
          className="absolute inset-0 rounded-full blur-3xl opacity-20 mix-blend-screen" 
          style={{ backgroundColor: glow }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      
      <motion.svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        style={{ filter: isSilhouetted ? "brightness(0) opacity(0.5)" : "drop-shadow(0 0 10px rgba(0,0,0,0.5))" }}
        animate={{ y: [0, -5, 0], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Pot / Base */}
        <path d="M30 80 L70 80 L80 100 L20 100 Z" fill="#2d3748" />
        
        {/* Plant Stem */}
        <path d="M50 80 Q 45 60 50 40" stroke={primary} strokeWidth="4" fill="none" />
        
        {/* Leaves based on stage */}
        {stage >= 2 && (
          <>
            <path d="M50 60 Q 30 50 20 60 Q 30 70 50 60" fill={primary} opacity="0.8" />
            <path d="M50 50 Q 70 40 80 50 Q 70 60 50 50" fill={primary} opacity="0.8" />
          </>
        )}
        
        {stage >= 3 && (
          <>
            <path d="M50 40 Q 35 25 25 30 Q 35 45 50 40" fill={primary} />
            <path d="M50 35 Q 65 20 75 25 Q 65 40 50 35" fill={primary} />
            <circle cx="50" cy="20" r="10" fill={glow} opacity="0.9" />
          </>
        )}
        
        {stage >= 4 && (
          <>
            <circle cx="50" cy="20" r="15" fill={glow} />
            <circle cx="50" cy="20" r="25" fill={glow} opacity="0.4" />
            <path d="M50 5 L 55 15 L 65 15 L 57 22 L 60 32 L 50 27 L 40 32 L 43 22 L 35 15 L 45 15 Z" fill="#fff" opacity="0.5" />
          </>
        )}
      </motion.svg>
    </div>
  );
}
