import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, HelpCircle, AlertCircle } from 'lucide-react';
import { Butterfly } from './Butterfly';
import { synthInstance } from './AudioPlayer';

interface Props {
  onYes: () => void;
  sanaName: string;
}

export const ProposalScreen: React.FC<Props> = ({ onYes, sanaName }) => {
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noMoved, setNoMoved] = useState(false);
  const [noScale, setNoScale] = useState(1.0);
  const [emoji, setEmoji] = useState('🥺');

  // Decorative decorative butterflies fluttering in the background of proposal screen
  const [bgButterflies, setBgButterflies] = useState([
    { id: 1, x: 12, y: 25, size: 40, angle: -15, color: '#d8b4fe' },
    { id: 2, x: 88, y: 35, size: 46, angle: 25, color: '#ecc1f9' },
    { id: 3, x: 20, y: 75, size: 52, angle: 10, color: '#f0abfc' },
    { id: 4, x: 82, y: 80, size: 44, angle: -30, color: '#f472b6' },
  ]);

  // Keep background butterflies drifting slightly
  useEffect(() => {
    const drift = setInterval(() => {
      setBgButterflies((prev) =>
        prev.map((b) => ({
          ...b,
          x: Math.max(5, Math.min(95, b.x + (Math.random() * 4 - 2))),
          y: Math.max(10, Math.min(90, b.y + (Math.random() * 4 - 2))),
          angle: b.angle + (Math.random() * 8 - 4),
        }))
      );
    }, 4000);
    return () => clearInterval(drift);
  }, []);

  const noPhrases = [
    "No",
    "Please don't say no... 🥺",
    "Are you sure? 💔",
    "Think about it again... 😭",
    "You're breaking my heart... 😭💔",
    "Please click Yes! 🙏💖",
    "No is disabled! 😄🍒",
  ];

  const sadEmojis = ['🥺', '😢', '😭', '💔', '🤕', '😿'];

  const handleNoInteraction = () => {
    synthInstance.playBell(180 + noCount * 25, 0.5);
    
    // Choose next crying phase & emoji
    const nextCount = noCount + 1;
    setNoCount(nextCount);
    setEmoji(sadEmojis[Math.min(nextCount, sadEmojis.length - 1)]);

    // Relocate the button randomly within safety limits (e.g. -150px to 150px displacement)
    const randomDisplacementX = (Math.random() * 300 - 150);
    const randomDisplacementY = (Math.random() * 200 - 100);
    setNoPosition({ x: randomDisplacementX, y: randomDisplacementY });
    setNoMoved(true);

    // Shrink the No button slightly, while the user continues to slide away
    setNoScale((prev) => Math.max(0.2, prev - 0.15));
  };

  const handleYes = () => {
    synthInstance.playSparkle();
    onYes();
  };

  const currentNoText = noPhrases[Math.min(noCount, noPhrases.length - 1)];

  return (
    <div
      id="proposal1-screen-bg"
      className="relative min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-[#ffdbe9] via-[#f7cbe5] to-[#ebd3f8] overflow-hidden px-4 py-8 select-none"
    >
      {/* Background butterflies */}
      {bgButterflies.map((b) => (
        <Butterfly
          key={b.id}
          id={`bg-${b.id}`}
          x={b.x}
          y={b.y}
          size={b.size}
          angle={b.angle}
          color={b.color}
          interactive={false}
        />
      ))}

      {/* Sweet ambient layout floating sparkles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-pink-500 rounded-full animate-heart-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-500 rounded-full animate-heart-pulse" />
      </div>

      <div className="w-full max-w-md flex flex-col items-center text-center z-15">
        
        {/* Animated Emoji character representing state */}
        <motion.div
          id="proposal1-emoji-avatar"
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-6xl md:text-7xl mb-6 filter drop-shadow-md select-none"
        >
          {noCount >= 6 ? '💖😇' : emoji}
        </motion.div>

        {/* Cursive Romantic Header */}
        <motion.div
          id="proposal1-header"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-2 mb-10"
        >
          <h1 className="font-sacramento text-6xl md:text-7xl text-[#ca2c75] tracking-wide font-semibold text-glow-pink">
            Hey {sanaName || 'my Love'}
          </h1>
          <p className="font-sans font-medium text-lg text-purple-800/80 mt-1">
            Do you love me? 💖
          </p>
        </motion.div>

        {/* Buttons Enclosing Area */}
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 w-full min-h-[220px]">
          
          {/* YES Button */}
          <motion.button
            id="proposal1-yes-btn"
            onClick={handleYes}
            style={{ scale: 1 + noCount * 0.15 }} // Yes gets progressively larger as she struggles to click no!
            whileHover={{ scale: (1 + noCount * 0.15) * 1.08 }}
            whileTap={{ scale: (1 + noCount * 0.15) * 0.95 }}
            className={`cursor-pointer z-30 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_5px_25px_rgba(244,63,94,0.35)] outline-none border border-white/30 transition-all ${
              noCount > 0 ? 'animate-heart-pulse' : ''
            }`}
          >
            <Heart size={20} fill="currentColor" className="text-white animate-pulse" />
            <span>Yes 💖</span>
          </motion.button>

          {/* NO Button with Runaway / Shrink Logic */}
          <AnimatePresence>
            {noScale > 0.15 && (
              <motion.button
                id="proposal1-no-btn"
                onMouseEnter={handleNoInteraction} // Moves away on computer hover
                onTouchStart={handleNoInteraction} // Moves away on mobile touch
                onClick={handleNoInteraction} // Backup click handler
                style={{
                  scale: noScale,
                  x: noPosition.x,
                  y: noPosition.y,
                }}
                transition={{
                  type: 'spring',
                  damping: 15,
                  stiffness: 220,
                }}
                className={`px-5 py-3 rounded-full bg-white/70 hover:bg-white text-gray-700 font-semibold text-sm flex items-center justify-center gap-1.5 shadow-md border border-pink-200/50 outline-none select-none z-20 ${
                  noMoved ? 'absolute' : 'relative'
                }`}
              >
                <span>{currentNoText}</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Interactive message helper display */}
        {noCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            className="mt-6 text-xs font-sans text-pink-700/80 italic font-medium"
          >
            {noCount >= 5 ? "Don't fight the magic... just click Yes! 💕" : "The hearts are pleading with you..."}
          </motion.div>
        )}
      </div>

      {/* Symmetrical glowing bottom ornaments */}
      <div className="absolute bottom-6 left-6 text-[11px] font-mono text-purple-700/40 tracking-[0.2em] uppercase">
        Sana & Eternal Spark
      </div>
    </div>
  );
};
