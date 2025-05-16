import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [isMuted, setIsMuted] = useState(false);
  
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const volumeIconRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    // Animate volume slider
    if (sliderContainerRef.current) {
      gsap.to(sliderContainerRef.current, {
        width: isOpen ? '100px' : '0px',
        opacity: isOpen ? 1 : 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isOpen]);
  
  useEffect(() => {
    // Animate volume icon
    if (volumeIconRef.current) {
      gsap.fromTo(
        volumeIconRef.current,
        { scale: 0.8, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.2 }
      );
    }
  }, [volume, isMuted]);
  
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      onVolumeChange(prevVolume);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      onVolumeChange(0);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
    
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    } else if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
    }
  };
  
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return (
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
      );
    } else if (volume < 0.5) {
      return (
        <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
      );
    } else {
      return (
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      );
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div 
        ref={sliderContainerRef}
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ width: isOpen ? '100px' : '0px', opacity: isOpen ? 1 : 0 }}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-full accent-blue-500"
        />
      </div>
      
      <button 
        className="text-white focus:outline-none w-10 h-10 flex items-center justify-center"
        onClick={toggleMute}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        <svg 
          ref={volumeIconRef}
          className="w-6 h-6"
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          {getVolumeIcon()}
        </svg>
      </button>
    </div>
  );
}; 