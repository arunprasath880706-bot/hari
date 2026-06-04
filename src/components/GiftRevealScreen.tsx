import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, Heart } from 'lucide-react';
import { Butterfly } from './Butterfly';
import { synthInstance } from './AudioPlayer';

interface Props {
  onOpen: () => void;
  sanaName: string;
}

export const GiftRevealScreen: React.FC<Props> = ({ onOpen, sanaName }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenGift = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Play sparkling chimes and soft musical synth cord
    synthInstance.playSparkle();
    
    // Delayed callback to let the gift explode into stars and transition to next screen
    setTimeout(() => {
      onOpen();
    }, 1800);
  };

  return (
    <div
      id="gift-screen-bg"
      className="relative min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-[#771166] via-[#460b45] to-[#140220] overflow-hidden px-4 select-none"
    >
      {/* Background glowing rings */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-pink-400/20 rounded-full animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] border border-purple-500/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
      </div>

      <div className="w-full max-w-sm flex flex-col items-center z-10 text-center">
        {/* Glowing Subtext */}
        <motion.p
          id="gift-heading-sub"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-cursive text-2xl md:text-3xl text-pink-200/90 tracking-wide font-medium text-glow-purple mb-8"
        >
          They left a gift jar for you... 🎁
        </motion.p>

        {/* Gift cardboard pack wrapping */}
        <AnimatePresence>
          {!isOpening ? (
            <motion.div
              id="gift-card-envelope"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ scale: 1.15, opacity: 0, filter: 'blur(5px)' }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
              onClick={handleOpenGift}
              className="cursor-pointer relative w-full h-[360px] rounded-[32px] bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col items-center justify-between p-8 border border-pink-200/30 overflow-hidden"
            >
              {/* Magical Sparklies corner highlights */}
              <div className="absolute top-4 left-4 text-pink-300">
                <Sparkles size={16} className="animate-sparkle" />
              </div>
              <div className="absolute bottom-4 right-4 text-purple-300">
                <Sparkles size={16} className="animate-sparkle" style={{ animationDelay: '0.8s' }} />
              </div>

              {/* Top Text label */}
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-pink-500">
                A Secret for {sanaName}
              </span>

              {/* Glowing Interactive Huge Butterfly representing the Gift */}
              <div id="gift-butterfly-core" className="relative w-36 h-36 flex items-center justify-center my-4">
                {/* Floating halo shadow */}
                <div className="absolute w-24 h-24 rounded-full bg-pink-400/20 blur-[15px] animate-pulse" />
                <Butterfly
                  id="gift-box-butterfly"
                  x={50}
                  y={50}
                  size={92}
                  color="#ca8aff"
                  angle={-15}
                  interactive={false}
                />
              </div>

              {/* Bottom Instructions */}
              <div className="flex flex-col items-center gap-1">
                <p className="font-cursive text-2xl text-purple-950 font-bold tracking-wide">
                  Tap to open 💌
                </p>
                <div className="w-8 h-[2px] bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mt-1 animate-pulse" />
              </div>
            </motion.div>
          ) : (
            /* Golden explosion frame when tapped */
            <motion.div
              id="gift-opening-particle-frame"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.3, opacity: 1 }}
              className="w-40 h-40 flex items-center justify-center bg-transparent"
            >
              <div className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center text-pink-500 shadow-[0_0_50px_#ec4899] animate-heart-pulse">
                <Heart size={32} fill="currentColor" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
