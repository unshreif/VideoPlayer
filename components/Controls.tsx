import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  duration: number;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onTogglePlay,
  currentTime,
  duration
}) => {
  const playButtonRef = useRef<SVGSVGElement>(null);
  const pauseButtonRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {

    if (isPlaying) {
      gsap.to(playButtonRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(2)",
        display: 'none'
      });
      gsap.fromTo(
        pauseButtonRef.current,
        { scale: 0, opacity: 0, display: 'block' },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }
      );
    } else {
      gsap.to(pauseButtonRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(2)",
        display: 'none'
      });
      gsap.fromTo(
        playButtonRef.current,
        { scale: 0, opacity: 0, display: 'block' },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }
      );
    }
  }, [isPlaying]);

  // Format time in MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-4">
      <button 
        className="text-white focus:outline-none relative w-12 h-12 flex items-center justify-center"
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        <svg 
          ref={playButtonRef} 
          className="w-10 h-10 absolute"
          viewBox="0 0 24 24" 
          fill="currentColor"
          style={{ display: isPlaying ? 'none' : 'block' }}
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        <svg 
          ref={pauseButtonRef} 
          className="w-10 h-10 absolute"
          viewBox="0 0 24 24" 
          fill="currentColor"
          style={{ display: isPlaying ? 'block' : 'none' }}
        >
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      </button>
      
      <div className="text-white text-sm">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
}; 