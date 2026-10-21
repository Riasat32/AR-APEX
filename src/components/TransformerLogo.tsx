import React from 'react';

interface TransformerLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const TRANSFORMER_LOGO_URL = '/assets/aistudio/file_0000000093f081f5902b6fdd29762298_938e318c.png';

export const TransformerLogo: React.FC<TransformerLogoProps> = ({
  className = '',
  size = 42,
  glow = true
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer Cyan Cybernetic Rim Glow */}
      {glow && (
        <div
          className="absolute inset-0 rounded-2xl bg-[#00BFFF] opacity-40 blur-md pointer-events-none animate-pulse"
          style={{ transform: 'scale(1.2)' }}
        />
      )}

      {/* Real High-Resolution Uploaded Transformer AR Metallic Emblem */}
      <img
        src={TRANSFORMER_LOGO_URL}
        alt="AR-STORE Transformer Emblem"
        className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,191,255,0.7)]"
        loading="eager"
      />
    </div>
  );
};
