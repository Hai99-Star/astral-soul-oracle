import React from 'react';

interface AstrologyIconProps {
  className?: string;
}

const AstrologyIcon = ({ className }: AstrologyIconProps) => {
  return (
    <div className={className}>
      <img 
        src="/astrology-emblem.svg" 
        alt="Astrology Emblem" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default AstrologyIcon; 