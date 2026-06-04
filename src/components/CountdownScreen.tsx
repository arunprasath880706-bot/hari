import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Moon, Compass } from 'lucide-react';
import { synthInstance } from './AudioPlayer';

interface Props {
  onComplete: () => void;
  sanaName: string;
}

export const CountdownScreen: React.FC<Props> = ({ onComplete, sanaName }) => {
  const [isEntering, setIsEntering] = useState(false);

  const handleEnterSurprise = () => {
    if (isEntering) return;
    setIsEntering(true);
    synthInstance.playSparkle();
    
    // Play sweet chime chord and then progress
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div
      id="countdown-screen-bg"
      className="relative min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-[#120624] via-[#2d0b43] to-[#0d011c] overflow-hidden px-4 select-none"
    >
      {/* Ambient background particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-purple-600/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-[20%] right-[10%] w-72 h-72 bg-pink-700/20 rounded-full blur-[80px]" />
        <Moon className="absolute top-12 right-12 text-white/10 animate-spin-slow" size={64} />
      </div>

      <div className="w-full max-w-lg flex flex-col items-center text-center z-10">
        {/* Soft glowing label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0 }}
          className="flex gap-2 text-pink-400 mb-6"
        >
          <Sparkles size={16} className="animate-sparkle" />
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-pink-300">A promise for you</span>
          <Sparkles size={16} className="animate-sparkle" />
        </motion.div>

        {/* Elegant Quote Scroll/Card Panel */}
        <motion.div
          id="countdown-clock-card"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1.0 }}
          className="relative px-8 py-12 md:px-12 md:py-16 w-full rounded-3xl glass-morphism border border-purple-500/30 flex flex-col items-center gap-6 shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden"
        >
          {/* Subtle neon glow backdrops */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Heart indicator decoration */}
          <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 mb-1">
            <Heart size={20} fill="currentColor" className="animate-pulse" />
          </div>

          {/* Custom user quotation exactly as specified */}
          <h1 className="font-sacramento text-4xl md:text-5xl text-glow-pink text-pink-100 leading-relaxed font-semibold">
            "If you feel low, whatever it is, come to me, I will heal you"
          </h1>

          <div className="w-1/4 h-[1px] bg-gradient-to-r from-transparent via-purple-300/40 to-transparent mt-2" />

          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-purple-300/60 font-medium">
            Dedicated entirely to you, {sanaName}
          </p>
        </motion.div>

        {/* Magic Enter Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-12 flex flex-col items-center gap-2"
        >
          <button
            id="countdown-fast-forward-btn"
            onClick={handleEnterSurprise}
            disabled={isEntering}
            className={`cursor-pointer px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2.5 shadow-[0_5px_25px_rgba(244,63,94,0.35)] hover:shadow-[0_5px_30px_rgba(244,63,94,0.5)] active:scale-95 transition-all outline-none border border-white/20 disabled:scale-95 disabled:pointer-events-none ${
              isEntering ? 'opacity-80 saturate-50' : 'animate-heart-pulse'
            }`}
          >
            <Compass size={16} className="animate-spin-slow text-yellow-300" />
            <span>{isEntering ? 'Revealing Love...' : 'Open Magical Surprise 🦋'}</span>
          </button>
          
          <p className="text-[10px] text-white/30 tracking-wider mt-2.5">
            Step into the magical garden designed for her
          </p>
        </motion.div>
      </div>

      {/* Decorative stars */}
      <div className="absolute top-1/4 right-[22%] w-1.5 h-1.5 bg-yellow-300 rounded-full animate-sparkle" />
      <div className="absolute bottom-1/3 left-[18%] w-1 h-1 bg-purple-300 rounded-full animate-sparkle" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-2/3 right-[12%] w-2 h-2 bg-pink-400 rounded-full animate-sparkle" style={{ animationDelay: '1s' }} />
    </div>
  );
};
