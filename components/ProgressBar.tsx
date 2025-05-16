import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressHandleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  
  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  useEffect(() => {
    if (!isDragging && progressFillRef.current && progressHandleRef.current) {
      // Animate progress bar fill and handle
      gsap.to(progressFillRef.current, {
        width: `${progressPercentage}%`,
        duration: 0.1,
        ease: "power1.out"
      });
      
      gsap.to(progressHandleRef.current, {
        left: `${progressPercentage}%`,
        duration: 0.1,
        ease: "power1.out"
      });
    }
  }, [currentTime, duration, progressPercentage, isDragging]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMouseMove(e);
    
    // Add event listeners for drag
    document.addEventListener('mousemove', handleMouseMoveDocument);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMoveDocument = (e: MouseEvent) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = position * duration;
    
    // Update progress bar visually during drag
    if (progressFillRef.current && progressHandleRef.current) {
      const percentage = position * 100;
      
      gsap.to(progressFillRef.current, {
        width: `${percentage}%`,
        duration: 0.1,
        ease: "power1.out"
      });
      
      gsap.to(progressHandleRef.current, {
        left: `${percentage}%`,
        duration: 0.1,
        ease: "power1.out"
      });
    }
  };
  
  const handleMouseUp = (e: MouseEvent) => {
    if (!progressBarRef.current || !isDragging) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = position * duration;
    
    onSeek(newTime);
    setIsDragging(false);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMoveDocument);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(position * 100);
  };
  
  const handleMouseLeave = () => {
    setHoverPosition(null);
  };
  
  return (
    <div 
      className="relative h-2 bg-gray-700 rounded-full cursor-pointer group"
      ref={progressBarRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Progress bar fill */}
      <div 
        ref={progressFillRef}
        className="absolute h-full bg-blue-500 rounded-full"
        style={{ width: `${progressPercentage}%` }}
      />
      
      {/* Hover effect */}
      {hoverPosition !== null && (
        <div 
          className="absolute h-full bg-blue-300 opacity-30 rounded-full"
          style={{ width: `${hoverPosition}%` }}
        />
      )}
      
      {/* Progress handle */}
      <div 
        ref={progressHandleRef}
        className="absolute top-1/2 -translate-y-1/2 -ml-2 w-4 h-4 bg-blue-500 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-150"
        style={{ left: `${progressPercentage}%` }}
      />
    </div>
  );
}; 