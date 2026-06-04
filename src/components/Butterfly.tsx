import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface Props {
  id: string | number;
  x: number; // percentage width
  y: number; // percentage height
  size?: number;
  color?: string; // e.g. '#c084fc'
  angle?: number; // visual direction angle
  onClick?: () => void;
  interactive?: boolean;
}

export const Butterfly: React.FC<Props> = ({
  id,
  x,
  y,
  size = 48,
  color = '#c084fc',
  angle = 12,
  onClick,
  interactive = true,
}) => {
  const [hovered, setHovered] = useState(false);
  const [trail, setTrail] = useState<{ id: number; left: number; top: number }[]>([]);

  // Generate little glowing trails behind the butterfly
  useEffect(() => {
    if (!interactive) return;
    const interval = setInterval(() => {
      setTrail((prev) => {
        const newTrail = [
          ...prev.filter((p) => Date.now() - p.id < 1200),
          {
            id: Date.now(),
            left: Math.random() * 16 - 8,
            top: Math.random() * 16 - 8 + 10,
          },
        ];
        return newTrail;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [x, y, interactive]);

  const primaryColor = color;
  const secondaryColor = '#ec4899'; // subtle pink highlight inside

  return (
    <motion.div
      id={`butterfly-${id}`}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        zIndex: 40,
        cursor: interactive ? 'pointer' : 'default',
      }}
      animate={{
        // Graceful hovering simulation on top of path movement
        translateY: hovered ? [-2, -22, -2] : [0, -12, 0],
        rotate: hovered ? angle + 15 : angle,
      }}
      transition={{
        duration: hovered ? 1.5 : 3.0,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
      onClick={onClick}
    >
      {/* Sparkle Trail representation */}
      {trail.map((spark) => (
        <div
          key={spark.id}
          className="absolute rounded-full bg-pink-300 pointer-events-none particle-sparkle opacity-80"
          style={{
            left: `${size / 2 + spark.left}px`,
            top: `${size / 2 + spark.top}px`,
            width: '4px',
            height: '4px',
            filter: 'blur(0.8px) drop-shadow(0 0 4px #ec4899)',
          }}
        />
      ))}

      {/* Main Butterfly SVG Wing-Flap Body Container */}
      <svg
        viewBox="0 0 24 24"
        className="w-full h-full select-none drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]"
        id={`butterfly-svg-${id}`}
      >
        <g id="butterfly-wings" className="origin-center">
          {/* Left Wing Group */}
          <g className="animate-flap-left">
            {/* Upper Left Wing */}
            <path
              d="M12 12 C10 4, 1 4, 3 10 C4 14, 9 15, 12 12"
              fill={primaryColor}
              className="transition-colors duration-500"
            />
            {/* Lower Left Wing */}
            <path
              d="M12 12 C10 16, 4 20, 5 15 C5 12, 10 12, 12 12"
              fill={secondaryColor}
              opacity="0.8"
            />
            {/* Elegant Inner Details */}
            <path
              d="M11 11 C9 6, 4 6, 5 9"
              stroke="#ffffff"
              strokeWidth="0.5"
              fill="none"
              opacity="0.5"
            />
          </g>

          {/* Right Wing Group */}
          <g className="animate-flap-right">
            {/* Upper Right Wing */}
            <path
              d="M12 12 C14 4, 23 4, 21 10 C20 14, 15 15, 12 12"
              fill={primaryColor}
              className="transition-colors duration-500"
            />
            {/* Lower Right Wing */}
            <path
              d="M12 12 C14 16, 20 20, 19 15 C19 12, 14 12, 12 12"
              fill={secondaryColor}
              opacity="0.75"
            />
            {/* Elegant Inner Details */}
            <path
              d="M13 11 C15 6, 20 6, 19 9"
              stroke="#ffffff"
              strokeWidth="0.5"
              fill="none"
              opacity="0.5"
            />
          </g>

          {/* Small elegant glowing antenna & body strictly in center */}
          <ellipse cx="12" cy="12" rx="0.8" ry="4.5" fill="#4c1d95" />
          <ellipse cx="12" cy="7.5" rx="1.0" ry="1.0" fill="#ec4899" />
          
          {/* Antennas */}
          <path
            d="M12 8 Q10 4 8 5"
            stroke="#4c1d95"
            strokeWidth="0.65"
            fill="none"
          />
          <path
            d="M12 8 Q14 4 16 5"
            stroke="#4c1d95"
            strokeWidth="0.65"
            fill="none"
          />
        </g>
      </svg>
    </motion.div>
  );
};
