const VideoPlayer = () => {
    const videoRef = React.useRef(null);
    const progressBarRef = React.useRef(null);
    const progressFillRef = React.useRef(null);
    const progressHandleRef = React.useRef(null);
    const playerRef = React.useRef(null);
    const centerPlayRef = React.useRef(null);
    
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [volume, setVolume] = React.useState(1);
    const [isMuted, setIsMuted] = React.useState(false);
    const [showCenterPlay, setShowCenterPlay] = React.useState(true);
    const [currentSrc, setCurrentSrc] = React.useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
    
    React.useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        
        gsap.from(playerRef.current, {
            duration: 0.8,
            opacity: 0,
            y: 30,
            ease: "power3.out",
            delay: 0.2
        });
        
        if (centerPlayRef.current) {
            gsap.from(centerPlayRef.current, {
                duration: 0.5,
                scale: 0.5,
                opacity: 0,
                ease: "back.out(1.7)",
                delay: 0.5
            });
        }
        
        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
        };
        
        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };
        
        const handleEnded = () => {
            setIsPlaying(false);
            setShowCenterPlay(true);
        };
        
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('ended', handleEnded);
        
        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('ended', handleEnded);
        };
    }, []);
    
    React.useEffect(() => {
        if (progressFillRef.current && progressHandleRef.current) {
            const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
            
            gsap.to(progressFillRef.current, {
                width: `${progress}%`,
                duration: 0.1,
                ease: "none"
            });
            
            gsap.to(progressHandleRef.current, {
                left: `${progress}%`,
                duration: 0.1,
                ease: "none"
            });
        }
    }, [currentTime, duration]);
    
    React.useEffect(() => {
        if (centerPlayRef.current) {
            if (isPlaying) {
                gsap.to(centerPlayRef.current, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.3,
                    ease: "power2.in"
                });
            } else {
                gsap.to(centerPlayRef.current, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            }
        }
    }, [isPlaying]);
    
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        
        if (isPlaying) {
            video.pause();
            setShowCenterPlay(true);
        } else {
            video.play();
            setShowCenterPlay(false);
        }
        setIsPlaying(!isPlaying);
        
        if (centerPlayRef.current) {
            if (isPlaying) {
                gsap.to(centerPlayRef.current, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            } else {
                gsap.to(centerPlayRef.current, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.3,
                    ease: "power2.in"
                });
            }
        }
    };
    
    const handleSeek = (e) => {
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const position = (e.clientX - rect.left) / rect.width;
        const seekTime = position * duration;
        
        if (videoRef.current) {
            videoRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };
    
    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        
        if (isMuted) {
            video.volume = volume;
            setIsMuted(false);
        } else {
            video.volume = 0;
            setIsMuted(true);
        }
    };
    
    const toggleFullscreen = () => {
        const player = playerRef.current;
        if (!player) return;
        
        if (!document.fullscreenElement) {
            player.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-white"> Media Player</h1>
            
            <div ref={playerRef} className="video-player max-w-4xl mx-auto">
                <video
                    ref={videoRef}
                    className="video-element"
                    poster="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
                    onClick={togglePlay}
                >
                    <source src={currentSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                
                <div 
                    ref={centerPlayRef} 
                    className={`center-play ${showCenterPlay ? 'visible' : ''} ${isPlaying ? 'pause' : ''}`} 
                    onClick={togglePlay}
                >
                    {isPlaying ? (
                        <svg viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </div>
                
                <div className="controls-overlay">
                    <div 
                        className="progress-bar"
                        ref={progressBarRef}
                        onClick={handleSeek}
                    >
                        <div 
                            ref={progressFillRef}
                            className="progress-fill"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        ></div>
                        <div 
                            ref={progressHandleRef}
                            className="progress-handle"
                            style={{ left: `${(currentTime / duration) * 100}%` }}
                        ></div>
                    </div>
                    
                    <div className="controls-row">
                        <div className="flex items-center">
                            <button 
                                className="control-btn play-btn"
                                onClick={togglePlay}
                            >
                                {isPlaying ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                    </svg>
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>
                            
                            <button 
                                className="control-btn ml-4"
                                onClick={toggleMute}
                            >
                                {isMuted ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                    </svg>
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                    </svg>
                                )}
                            </button>
                            
                            <span className="time-display">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>
                        
                        <div className="flex items-center">
                            <button 
                                className="control-btn"
                                onClick={toggleFullscreen}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <footer className="mt-8 text-center">
                <svg 
                    width="120" 
                    height="40" 
                    viewBox="0 0 120 40" 
                    className="mx-auto mb-2"
                >
                    <rect width="120" height="40" rx="8" fill="#3b82f6" />
                    <text 
                        x="60" 
                        y="25" 
                        fontFamily="Arial" 
                        fontSize="18" 
                        fontWeight="bold" 
                        fill="white" 
                        textAnchor="middle"
                    >
                        MEDIA PLAYER
                    </text>
                </svg>
                <p className="text-sm text-gray-400">© 2025 Media Player</p>
            </footer>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<VideoPlayer />); 