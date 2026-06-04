import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, Heart, Lock, CheckCircle2 } from 'lucide-react';
import { Butterfly } from './Butterfly';
import { synthInstance } from './AudioPlayer';

interface ButterflyConfig {
  id: number;
  x: number;
  y: number;
  size: number;
  angle: number;
  color: string;
  speedX: number;
  speedY: number;
  message: string;
  isCaught: boolean;
  isInJar: boolean;
}

interface Props {
  onComplete: () => void;
  sanaName: string;
}

export const CatchButterfliesScreen: React.FC<Props> = ({ onComplete, sanaName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom cute messages from the romantic video
  const messages = [
    "I don't say this enough... but I really love you ❤️",
    "You made my normal days feel special... just by being there ✨",
    "I know I mess up sometimes... and I'm really sorry for that 🥺",
    "But no matter what... I always choose you ❤️",
    "And today... I just want to see you smile 😊"
  ];

  const colors = ['#ca8aff', '#f472b6', '#c084fc', '#f43f5e', '#a855f7'];

  // Initialize 5 active flying butterflies
  const [butterflies, setButterflies] = useState<ButterflyConfig[]>([]);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [caughtCount, setCaughtCount] = useState(0);
  const [jarGlow, setJarGlow] = useState(false);
  const [bottleOpening, setBottleOpening] = useState(false);

  useEffect(() => {
    // Generate initial randomized coordinates with speeds
    const initialButterflies = Array.from({ length: 5 }).map((_, i) => ({
      id: i + 1,
      x: 15 + Math.random() * 70, // 15% to 85% width
      y: 15 + Math.random() * 50, // 15% to 65% height
      size: 44 + Math.random() * 10,
      angle: Math.random() * 360,
      color: colors[i % colors.length],
      speedX: (Math.random() * 0.4 + 0.2) * (Math.random() > 0.5 ? 1 : -1),
      speedY: (Math.random() * 0.4 + 0.2) * (Math.random() > 0.5 ? 1 : -1),
      message: messages[i],
      isCaught: false,
      isInJar: false,
    }));
    setButterflies(initialButterflies);
  }, []);

  // Update butterfly coordinates (flight paths) dynamically - Bounce off viewport margins
  useEffect(() => {
    if (activeNote || bottleOpening) return; // Freeze flight when note panel is open or finished

    const flightLoop = setInterval(() => {
      setButterflies((prev) =>
        prev.map((b) => {
          if (b.isCaught) return b; // Skip if caught

          let nextX = b.x + b.speedX;
          let nextY = b.y + b.speedY;

          let nextSpeedX = b.speedX;
          let nextSpeedY = b.speedY;

          // Bounce horizontally
          if (nextX < 5 || nextX > 95) {
            nextSpeedX = -b.speedX;
            nextX = Math.max(5, Math.min(95, nextX));
          }

          // Bounce vertically
          if (nextY < 8 || nextY > 70) {
            nextSpeedY = -b.speedY;
            nextY = Math.max(8, Math.min(70, nextY));
          }

          // Random wind perturbation to create organic flight curves
          if (Math.random() < 0.08) {
            nextSpeedX += (Math.random() * 0.15 - 0.075);
            nextSpeedY += (Math.random() * 0.15 - 0.075);
            // Speed clamp limits
            nextSpeedX = Math.max(-0.8, Math.min(0.8, nextSpeedX));
            nextSpeedY = Math.max(-0.8, Math.min(0.8, nextSpeedY));
          }

          // Calculate flying direction angle based on vector speeds
          const angleRad = Math.atan2(nextSpeedY, nextSpeedX);
          const rawAngle = (angleRad * 180) / Math.PI + 90; // Align with vertical SVG path

          return {
            ...b,
            x: nextX,
            y: nextY,
            speedX: nextSpeedX,
            speedY: nextSpeedY,
            angle: rawAngle,
          };
        })
      );
    }, 35);

    return () => clearInterval(flightLoop);
  }, [activeNote, bottleOpening]);

  const handleCapture = (id: number) => {
    if (activeNote) return; // Prevent multiple captures simultaneously

    synthInstance.playBell(392.00, 1.2);

    setButterflies((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return { ...b, isCaught: true };
        }
        return b;
      })
    );

    // Dynamic flight sequence: animate butterfly soaring into the jar at the bottom center (50%, 82%)
    setTimeout(() => {
      setButterflies((prev) =>
        prev.map((b) => {
          if (b.id === id) {
            return { ...b, isInJar: true, x: 50, y: 82, angle: 0 };
          }
          return b;
        })
      );
      
      // Flash glowing jar when butterfly joins
      setJarGlow(true);
      setTimeout(() => setJarGlow(false), 800);

      // Play soft transition chord
      synthInstance.playBell(523.25, 2.0);

      // Lock other interactions and read note
      const targeted = butterflies.find((b) => b.id === id);
      if (targeted) {
        setActiveNote(targeted.message);
      }
    }, 850);
  };

  const handleCloseNote = () => {
    setActiveNote(null);
    const nextCaughtCount = caughtCount + 1;
    setCaughtCount(nextCaughtCount);

    // Check game winning condition
    if (nextCaughtCount === 5) {
      triggerBottleMagic();
    }
  };

  const triggerBottleMagic = () => {
    setBottleOpening(true);
    synthInstance.playSparkle();
    
    // Play multiple sparkling sound chimes
    setTimeout(() => synthInstance.playBell(659.25, 3.0), 300);
    setTimeout(() => synthInstance.playBell(783.99, 4.0), 800);

    // Beautiful screen fade-out / card transition
    setTimeout(() => {
      onComplete();
    }, 3800);
  };

  return (
    <div
      ref={containerRef}
      id="catch-screen-bg"
      className="relative min-h-screen w-full flex flex-col justify-between items-center bg-gradient-to-b from-[#7c1d68] via-[#4d0c4d] to-[#1a0122] overflow-hidden px-4 py-8 select-none"
    >
      {/* Sparkly background decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <Star className="absolute top-1/4 left-1/4 text-yellow-300 animate-sparkle" size={16} />
        <Star className="absolute top-1/3 right-[15%] text-indigo-300 animate-sparkle" size={24} style={{ animationDelay: '0.7s' }} />
        <Heart className="absolute bottom-[28%] left-[12%] text-pink-400 animate-heart-pulse" size={20} />
      </div>

      {/* Elegant HUD Progress Bar Header */}
      <div className="w-full max-w-md flex flex-col items-center mt-2 z-10 text-center">
        <motion.h2
          id="catch-head-title"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-sacramento text-4xl md:text-5xl text-pink-200 tracking-wide font-bold select-none text-glow-purple"
        >
          Catch the butterflies 🦋
        </motion.h2>
        <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-purple-200/60 mt-1 select-none">
          {caughtCount < 5 
            ? `Caught ${caughtCount} of 5... each one shares a secret ✨` 
            : "All secrets unlocked! Let the bottle glow... 💖"}
        </p>

        {/* Custom Glowing Dot Progress tracker */}
        <div className="flex gap-2.5 mt-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border border-pink-400/30 transition-all duration-500 flex items-center justify-center ${
                idx < caughtCount 
                  ? 'bg-pink-500 scale-110 shadow-[0_0_10px_#ec4899]' 
                  : 'bg-black/40'
              }`}
            >
              {idx < caughtCount && <span className="text-[7px] text-white">✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Main playzone container area */}
      <div className="relative w-full flex-grow flex items-center justify-center min-h-[350px]">
        
        {/* Render ACTIVE Flying Butterflies */}
        {butterflies.map((b) => {
          if (b.isInJar) return null; // Hide from playing area when packed in jar

          return (
            <motion.div
              key={b.id}
              style={{
                position: 'absolute',
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: b.size,
                height: b.size,
                transform: 'translate(-50%, -50%)',
              }}
              animate={b.isCaught ? {
                // If clicked, float directly into the glass bottle at bottom
                left: '50%',
                top: '82%',
                scale: 0.38,
                rotate: 720,
              } : {}}
              transition={{
                duration: b.isCaught ? 0.8 : 0,
                ease: 'easeInOut',
              }}
            >
              <Butterfly
                id={`active-${b.id}`}
                x={50}
                y={50}
                size={b.isCaught ? b.size : b.size}
                angle={b.angle}
                color={b.color}
                interactive={!b.isCaught}
                onClick={() => handleCapture(b.id)}
              />
            </motion.div>
          );
        })}

        {/* POPUP: Beautiful frosted romantic handwritten message card */}
        <AnimatePresence>
          {activeNote && (
            <motion.div
              id="catch-note-overlay"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="absolute inset-0 z-50 flex items-center justify-center px-4"
            >
              {/* Note card wrapping */}
              <div className="px-6 py-10 md:px-8 md:py-12 w-full max-w-sm rounded-[28px] glass-morphism border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.5)] text-center flex flex-col items-center gap-6 box-glow-purple">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-300">
                  <Heart size={24} fill="currentColor" className="animate-pulse" />
                </div>

                <p className="font-cursive text-3xl md:text-4xl text-glow-pink text-pink-200 leading-relaxed font-medium">
                  "{activeNote}"
                </p>

                <button
                  id="catch-note-read-btn"
                  onClick={handleCloseNote}
                  className="cursor-pointer px-6 py-2.5 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 text-white font-medium text-[11px] uppercase tracking-wider transition-all border border-white/30"
                >
                  Keep in Jar 💌
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* POPUP: All caught / Opening Bottle Animation */}
        <AnimatePresence>
          {bottleOpening && (
            <motion.div
              id="catch-victory-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#1a0122]/75 backdrop-blur-md"
            >
              <motion.div
                animate={{
                  scale: [1, 1.3, 20],
                  rotate: [0, 180, 360],
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 3.5, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-full bg-pink-400/80 flex items-center justify-center text-white shadow-[0_0_40px_rgba(244,63,94,0.8)] animate-sparkle"
              >
                <Sparkles size={28} />
              </motion.div>
              <motion.h3
                animate={{ opacity: [1, 0] }}
                transition={{ delay: 1.5, duration: 1.0 }}
                className="font-sacramento text-5xl text-pink-200 text-glow-purple"
              >
                The bottle opens... ✨
              </motion.h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Glass Jar/Bottle at bottom center */}
      <div id="catch-glass-jar-area" className="relative w-44 h-56 mb-4 z-10 flex flex-col items-center justify-end">
        {/* Cute cork lid */}
        <div className="w-16 h-4 bg-[#a78bfa]/50 rounded-md border border-purple-300/40 shadow-inner z-20" />
        <div className="w-12 h-3 bg-[#8b5cf6]/40 rounded-sm mb-[-2px] border border-purple-400/30 z-20" />

        {/* Glass body jar */}
        <div
          className={`relative w-40 h-48 rounded-t-[35px] rounded-b-[45px] glass-morphism overflow-hidden flex items-center justify-center border-t-2 border-white/20 transition-all duration-800 ${
            jarGlow ? 'box-shadow-[0_0_35px_rgba(236,72,153,0.6)] border-pink-400 bg-pink-900/10' : 'box-glow-purple'
          }`}
        >
          {/* Jar Fluid / Sparkle particle layer inside */}
          <div
            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-purple-500/30 via-pink-500/20 to-transparent transition-all duration-1000"
            style={{ height: `${20 + caughtCount * 16}%` }} // Bottle fills up on captures!
          />

          {/* Captured Tiny Sparkle Butterflies staying inside */}
          <div className="absolute inset-x-0 bottom-4 top-10 flex flex-wrap gap-2.5 items-center justify-center px-4">
            {butterflies
              .filter((b) => b.isInJar)
              .map((b) => (
                <motion.div
                  key={b.id}
                  animate={{
                    y: [0, -6, 0],
                    scale: [0.65, 0.72, 0.65],
                    rotate: [b.id % 2 === 0 ? -10 : 10, b.id % 2 === 0 ? 10 : -10, b.id % 2 === 0 ? -10 : 10],
                  }}
                  transition={{
                    duration: 2.0 + (b.id % 3),
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-8 h-8 filter drop-shadow-[0_0_4px_#ca8aff]"
                >
                  <Butterfly
                    id={`jar-${b.id}`}
                    x={50}
                    y={50}
                    size={28}
                    angle={0}
                    color={b.color}
                    interactive={false}
                  />
                </motion.div>
              ))}
          </div>

          {/* Floating tiny bubbles inside jar */}
          <div className="absolute inset-0 pointer-events-none opacity-45">
            <div className="absolute bottom-6 left-10 w-1.5 h-1.5 bg-white/70 rounded-full animate-heart-pulse" />
            <div className="absolute bottom-12 right-8 w-1.5 h-1.5 bg-pink-100/60 rounded-full animate-heart-pulse" style={{ animationDelay: '0.6s' }} />
            <div className="absolute bottom-18 left-16 w-1 h-1 bg-white rounded-full animate-heart-pulse" style={{ animationDelay: '1.2s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
