import React, { useState, useRef } from 'react'

const Hero = () => {
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef(null)

  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false
      setIsMuted(false)
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        src="https://res.cloudinary.com/dh9hpr60s/video/upload/q_auto,f_auto/v1762519870/SUYB7979_o4pht4.mp4"
        autoPlay
        muted={isMuted}
        loop
        playsInline
        className="w-full h-full object-cover"
        preload="auto"
      />

      {/* Sound Toggle Button (appears only on first load) */}
      {isMuted && (
        <div className="absolute bottom-8 right-8 z-10 animate-bounce">
          <button
            onClick={handleUnmute}
            className="bg-white/90 backdrop-blur-sm text-black px-6 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 hover:bg-white transition"
          >
            Click to Enable Sound
          </button>
        </div>
      )}

      {/* Optional: Subtle icon when unmuted */}
      {!isMuted && (
        <div className="absolute bottom-8 right-8 z-10">
          <div className="bg-white/80 backdrop-blur-sm text-green-600 px-5 py-3 rounded-full font-bold shadow-lg">
            Sound On
          </div>
        </div>
      )}

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 drop-shadow-2xl">PHENZ</h1>
          <p className="text-2xl md:text-4xl drop-shadow-lg">Spring Collection 2025</p>
        </div>
      </div>
    </div>
  )
}

export default Hero