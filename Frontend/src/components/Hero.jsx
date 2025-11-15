// src/components/Hero.jsx
import React, { useRef, useState, useEffect } from 'react'

const Hero = () => {
  const videoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)

  // Toggle sound
  // const toggleSound = () => {
  //   if (videoRef.current) {
  //     videoRef.current.muted = !videoRef.current.muted
  //     setIsMuted(videoRef.current.muted)
  //   }
  // }
  const toggleSound = (e) => {
    e.stopPropagation(); // ← CRITICAL: STOP BUBBLING
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // // Auto-unmute on first user interaction (optional enhancement)
  // useEffect(() => {
  //   const enableAudio = () => {
  //     if (videoRef.current && videoRef.current.muted) {
  //       videoRef.current.muted = false
  //       setIsMuted(false)
  //     }
  //     document.removeEventListener('click', enableAudio)
  //     document.removeEventListener('touchstart', enableAudio)
  //   }

  //   document.addEventListener('click', enableAudio)
  //   document.addEventListener('touchstart', enableAudio)

  //   return () => {
  //     document.removeEventListener('click', enableAudio)
  //     document.removeEventListener('touchstart', enableAudio)
  //   }
  // }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        src="https://res.cloudinary.com/dh9hpr60s/video/upload/q_auto:good,f_auto,vc_auto/v1762519870/SUYB7979_o4pht4.mp4"
        autoPlay
        loop
        playsInline
        muted={isMuted}
        className="absolute inset-0 w-full h-full object-cover"
        preload="auto"
        poster="https://res.cloudinary.com/dh9hpr60s/image/upload/v1762519870/hero-poster.jpg"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
          PHENZ
        </h1>
        <p className="text-xl md:text-3xl font-light mb-8">
          Harmattan Collection 2025
        </p>
        <a
          href="/collection"
          className="bg-white text-black px-10 py-4 text-lg hover:bg-gray-200 transition transform hover:scale-105"
        >
          Shop Now
        </a>
      </div>

      {/* Sound Toggle Button */}
      <button
        onClick={toggleSound}
        className="absolute bottom-8 right-8 z-20 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-4 rounded-full transition-all duration-300 shadow-2xl border border-white/30 group"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? (
          // Muted Icon
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.03c2.89.86 5 3.54 5 6.74zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        ) : (
          // Unmuted Icon
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        )}
        
        {/* Pulse animation when muted */}
        {isMuted && (
          <span className="absolute inset-0 rounded-full animate-ping bg-white/30"></span>
        )}
      </button>

      {/* Optional: Small text indicator */}
      <div className="absolute bottom-20 right-8 z-20 text-white/80 text-sm font-medium">
        {isMuted ? "Sound Off" : "Sound On"}
      </div>
    </div>
  )
}

export default Hero