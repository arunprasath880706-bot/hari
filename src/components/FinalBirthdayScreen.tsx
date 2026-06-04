import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Sparkles, Heart, Moon, Calendar, RefreshCw } from 'lucide-react';
import { synthInstance } from './AudioPlayer';

interface Props {
  sanaName: string;
  partnerName: string;
  onRestart: () => void;
}

export const FinalBirthdayScreen: React.FC<Props> = ({ sanaName, partnerName, onRestart }) => {
  const [proposalStep, setProposalStep] = useState(true); // true = date proposal, false = ultimate I Love You celebration
  const [noCounter, setNoCounter] = useState(0);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1.0);
  const [stars, setStars] = useState<{ id: number; top: number; left: number; speed: number }[]>([]);
  const [confetti, setConfetti] = useState<{ id: number; left: number; color: string; duration: number; size: number }[]>([]);

  // Generate background starry night sky
  useEffect(() => {
    const starCount = 35;
    const initialStars = Array.from({ length: starCount }).map((_, idx) => ({
      id: idx,
      top: Math.random() * 85,
      left: Math.random() * 95,
      speed: 1.5 + Math.random() * 2,
    }));
    setStars(initialStars);

    // If on celebration step, trigger standard confetti showers
    if (!proposalStep) {
      triggerConfettiShowers();
    }
  }, [proposalStep]);

  const triggerConfettiShowers = () => {
    // Generate lovely confetti coordinates and colors
    const colors = ['#f472b6', '#a855f7', '#60a5fa', '#34d399', '#fbbf24', '#f87171'];
    const generated = Array.from({ length: 60 }).map((_, idx) => ({
      id: idx,
      left: Math.random() * 100,
      color: colors[idx % colors.length],
      duration: 2.5 + Math.random() * 3,
      size: 6 + Math.random() * 10,
    }));
    setConfetti(generated);
  };

  const noPhrases = [
    "No 💔",
    "Please?... 🥺",
    "It'll be unforgettable! ✨",
    "We can count shooting stars... 💫",
    "Just think about forever! ✨",
    "Only YES is permitted! 😉",
  ];

  const handleNoInteraction = () => {
    synthInstance.playBell(200 + noCounter * 30, 0.45);
    const nextCount = noCounter + 1;
    setNoCounter(nextCount);

    // Relocate the No button randomly on screen hover/click
    const randomX = (Math.random() * 260 - 130);
    const randomY = (Math.random() * 160 - 80);
    setNoOffset({ x: randomX, y: randomY });

    // Shrink the button slightly
    setNoScale((prev) => Math.max(0.2, prev - 0.15));
  };

  const handleYes = () => {
    synthInstance.playSparkle();
    
    // Play multiple sweet bell chords indicating success!
    setTimeout(() => synthInstance.playBell(523.25, 2.5), 100);
    setTimeout(() => synthInstance.playBell(659.25, 2.5), 300);
    setTimeout(() => synthInstance.playBell(783.99, 2.5), 500);

    setProposalStep(false);
  };

  return (
    <div
      id="final-celebration-container"
      className="relative min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-[#10031f] via-[#240b40] to-[#0a0014] overflow-hidden px-4 md:px-6 select-none"
    >
      {/* Star field twinkle rendering */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-sparkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${1.5 + (star.id % 2)}px`,
            height: `${1.5 + (star.id % 2)}px`,
            animationDelay: `${star.id * 0.1}s`,
            animationDuration: `${star.speed}s`,
          }}
        />
      ))}

      {/* Confetti element lines in final state */}
      {!proposalStep &&
        confetti.map((c) => (
          <motion.div
            key={c.id}
            initial={{ y: -50, x: `${c.left}vw`, rotate: 0, opacity: 1 }}
            animate={{ y: '110vh', rotate: 360, opacity: 0.2 }}
            transition={{
              duration: c.duration,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              top: 0,
              width: `${c.size}px`,
              height: `${c.size}px`,
              backgroundColor: c.color,
              borderRadius: c.id % 3 === 0 ? '50%' : c.id % 3 === 1 ? '4px' : '0px',
              zIndex: 35,
            }}
          />
        ))}

      {/* Ambient shooter star effects */}
      <div className="absolute inset-x-0 top-12 pointer-events-none opacity-20">
        <div className="absolute top-10 left-[10%] w-[120px] h-[1.5px] bg-gradient-to-r from-white to-transparent transform rotate-[15deg]" style={{ animation: 'spark-float 4s infinite linear' }} />
        <div className="absolute top-24 right-[20%] w-[160px] h-[1.5px] bg-gradient-to-r from-white to-transparent transform rotate-[15deg]" style={{ animation: 'spark-float 6s infinite linear', animationDelay: '2s' }} />
      </div>

      <AnimatePresence mode="wait">
        {proposalStep ? (
          /* SECTION A: Love confession & Outing Date Proposal (Screenshots 5-6) */
          <motion.div
            key="proposal-card"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg z-10 flex flex-col items-center"
          >
            {/* Elegant Magical Card panel */}
            <div className="w-full px-6 py-12 md:px-10 md:py-16 rounded-[40px] glass-morphism border border-purple-500/20 shadow-[0_0_80px_rgba(147,51,234,0.18)] text-center flex flex-col items-center gap-6 overflow-hidden relative">
              
              {/* Moon ornament inside card */}
              <div className="absolute top-4 right-6 text-yellow-200/20 animate-float-slow">
                <Moon size={32} />
              </div>

              {/* Sparkles labels */}
              <div className="flex gap-2 text-pink-400">
                <Sparkles size={20} className="animate-sparkle" />
                <span className="text-xs uppercase tracking-[0.3em] font-bold text-pink-300">Magical surprise</span>
                <Sparkles size={20} className="animate-sparkle" />
              </div>

              {/* Header Title Name exactly matching Sana */}
              <h1 className="font-sacramento text-5xl md:text-6xl text-glow-purple text-[#ffdce9] mt-2 font-bold tracking-wide">
                Will you be mine, {sanaName || 'Sana'}? 💍💖
              </h1>

              {/* Lovely ring/rose illustration & Heart representation */}
              <div id="proposal2-emoji-display" className="text-5xl flex gap-4 items-center justify-center my-1 filter drop-shadow-md">
                <span className="animate-float-slow select-none">💍</span>
                <Heart size={44} fill="#f43f5e" className="text-rose-500 animate-heart-pulse drop-shadow-[0_0_10px_#f43f5e]" />
                <span className="animate-float-slow select-none" style={{ animationDelay: '0.6s' }}>🌹</span>
              </div>

              {/* Main romantic messages from the templates */}
              <div className="flex flex-col gap-4 max-w-sm mt-3">
                <p className="font-sans text-white/80 leading-relaxed text-sm font-medium">
                  "You mean more than words can say... and I'm really lucky to have you in my life ✨"
                </p>

                <div className="h-[1px] w-1/2 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent mx-auto my-1" />

                <h3 className="font-cursive text-3xl text-glow-pink text-pink-300 tracking-wide font-semibold mt-1">
                  So... can we go out tonight? 🌌✨
                </h3>
                <p className="font-sans text-[11px] uppercase tracking-widest text-[#a855f7] font-semibold">
                  Just you, me & the stars
                </p>
              </div>

              {/* Date Proposal Buttons zone */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-5 mt-6 w-full min-h-[120px]">
                {/* YES Button */}
                <motion.button
                  id="final-yes-btn"
                  onClick={handleYes}
                  style={{ scale: 1 + noCounter * 0.15 }}
                  whileHover={{ scale: (1 + noCounter * 0.15) * 1.08 }}
                  whileTap={{ scale: (1 + noCounter * 0.15) * 0.95 }}
                  className="cursor-pointer z-35 px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-md flex items-center justify-center gap-2 shadow-[0_5px_30px_rgba(236,72,153,0.4)] hover:shadow-[0_5px_35px_rgba(236,72,153,0.55)] outline-none border border-white/20 select-none"
                >
                  <Heart size={16} fill="currentColor" className="animate-pulse" />
                  <span>Yes, I'd Love to! 💖</span>
                </motion.button>

                {/* NO Button runaway with adaptive scale trigger */}
                {noScale > 0.15 && (
                  <motion.button
                    id="final-no-btn"
                    onMouseEnter={handleNoInteraction}
                    onTouchStart={handleNoInteraction}
                    onClick={handleNoInteraction}
                    style={{
                      scale: noScale,
                      x: noOffset.x,
                      y: noOffset.y,
                    }}
                    transition={{
                      type: 'spring',
                      damping: 15,
                      stiffness: 220,
                    }}
                    className={`cursor-pointer px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-white/10 outline-none select-none z-30 ${
                      noCounter > 0 ? 'absolute' : 'relative'
                    }`}
                  >
                    <span>{noPhrases[Math.min(noCounter, noPhrases.length - 1)]}</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* SECTION B: Ultimate celebration "I LOVE YOU SANA" Screen (Screenshot 6-7) */
          <motion.div
            key="ultimate-love-card"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-full max-w-lg z-20 flex flex-col items-center text-center px-4"
          >
            {/* Sparkles icon header */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_40px_rgba(236,72,153,0.6)] mb-8"
            >
              <Heart size={38} fill="currentColor" className="animate-pulse" />
            </motion.div>

            {/* Huge I Love You Cursive Statement */}
            <h1 className="font-cursive text-7xl md:text-8xl text-glow-pink text-pink-300 font-bold tracking-wide leading-tight mb-2 select-none animate-float-slow">
              I Love You!
            </h1>
            <p className="font-sacramento text-4xl md:text-5xl text-glow-purple text-purple-200 tracking-wider font-semibold mb-8 select-none">
              Sana {partnerName ? `& ${partnerName}` : 'Forever & Always 💖'}
            </p>

            {/* Personalized sweet birthday wishes paragraph */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1.0 }}
              className="px-6 py-8 md:px-8 md:py-10 rounded-[32px] glass-morphism-dark border border-pink-500/20 max-w-sm flex flex-col items-center gap-4 shadow-2xl relative"
            >
              {/* Star sparkles overlay */}
              <div className="absolute -top-3 -right-3 text-yellow-300 text-glow-pink">
                <Sparkles size={18} className="animate-sparkle" />
              </div>

              <p className="font-sans text-sm md:text-md text-[#ffdbe9]/95 text-glow-purple leading-relaxed text-center font-medium">
                Wishing you a magical destiny filled with endless laughter, secure hand-holds, and all the love in the universe. Let's grow old together, Sana! 🌸✨
              </p>

              <div className="w-1/3 h-[2px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mt-2" />

              {/* Cute calendar stamp */}
              <div className="flex items-center gap-1.5 text-[10px] text-pink-300/60 uppercase font-mono tracking-widest font-semibold mt-2">
                <Calendar size={11} />
                <span>Today's Date & Forever</span>
              </div>
            </motion.div>

            {/* Restart/Replay Surprise CTA buttons */}
            <motion.button
              id="final-restart-btn"
              onClick={onRestart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer mt-12 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-xs tracking-wider uppercase flex items-center gap-2 border border-white/20 shadow-md transition-all outline-none"
            >
              <RefreshCw size={13} className="text-pink-300 animate-spin-slow" />
              <span>Replay Surprise Journey 🕊️</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
