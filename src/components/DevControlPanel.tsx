import React, { useState } from 'react';
import { Settings, X, Wand2, Volume2, User2, Eye, HelpCircle } from 'lucide-react';
import { ScreenId } from '../types';
import { synthInstance } from './AudioPlayer';

interface Props {
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  sanaName: string;
  setSanaName: (name: string) => void;
  partnerName: string;
  setPartnerName: (name: string) => void;
}

export const DevControlPanel: React.FC<Props> = ({
  currentScreen,
  setCurrentScreen,
  sanaName,
  setSanaName,
  partnerName,
  setPartnerName,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const screens: { id: ScreenId; label: string }[] = [
    { id: 'countdown', label: '1. Countdown ⏳' },
    { id: 'proposal1', label: '2. Love Proposal 💖' },
    { id: 'game', label: '3. Butterfly Game 🦋' },
    { id: 'gift', label: '4. Open Gift 🎁' },
    { id: 'proposal2', label: '5. Date Outing 🌌' },
    { id: 'celebration', label: '6. Celebration 🎉' },
  ];

  const handleTestSound = () => {
    synthInstance.playSparkle();
  };

  return (
    <div id="dev-controls-wrapper" className="fixed bottom-4 right-4 z-[9999]">
      {/* Floating settings cog circle */}
      <button
        id="dev-panel-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-black/50 hover:bg-black/75 cursor-pointer rounded-full glass-morphism text-white/90 shadow-lg hover:scale-105 active:scale-95 transition-all outline-none border border-white/20 flex items-center justify-center"
        title="Open client surprise settings drawer"
      >
        {isOpen ? <X size={15} /> : <Settings size={15} className="animate-spin-slow text-pink-400" />}
      </button>

      {/* Drawer content */}
      {isOpen && (
        <div
          id="dev-panel-drawer"
          className="absolute bottom-14 right-0 w-72 rounded-[24px] glass-morphism-dark border border-white/20 shadow-2xl p-6 text-white text-left flex flex-col gap-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold font-sans tracking-widest uppercase text-pink-400 flex items-center gap-1.5">
              <Wand2 size={13} className="animate-pulse" />
              <span>Surprise Controls</span>
            </span>
            <span className="text-[9px] font-mono text-white/40">V1.0</span>
          </div>

          {/* Quick page switcher */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
              Jump To Surprises
            </label>
            <div className="grid grid-cols-2 gap-1.5 mt-0.5">
              {screens.map((scr) => (
                <button
                  key={scr.id}
                  onClick={() => {
                    setCurrentScreen(scr.id);
                    synthInstance.playBell(330, 0.5);
                  }}
                  className={`cursor-pointer px-2 py-1.5 rounded-lg text-[10px] font-semibold text-left border transition-all ${
                    currentScreen === scr.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-transparent text-white shadow-inner'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {scr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Customize target names */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
              Customize Names
            </label>
            
            {/* HER Name */}
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-2.5 py-1.5 border border-white/10">
              <User2 size={12} className="text-pink-400" />
              <input
                id="dev-her-name-input"
                type="text"
                placeholder="Her name (Sana)"
                value={sanaName}
                onChange={(e) => setSanaName(e.target.value)}
                className="bg-transparent border-none text-[11px] font-sans text-white focus:outline-none w-full placeholder-white/30"
              />
            </div>

            {/* PARTNER Name */}
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-2.5 py-1.5 border border-white/10">
              <User2 size={12} className="text-indigo-400" />
              <input
                id="dev-partner-name-input"
                type="text"
                placeholder="Your name"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                className="bg-transparent border-none text-[11px] font-sans text-white focus:outline-none w-full placeholder-white/30"
              />
            </div>
          </div>

          {/* Audio Chime trigger */}
          <div className="border-t border-white/10 pt-4 flex justify-between items-center text-[10px] text-white/60">
            <span>Check sound output:</span>
            <button
              id="dev-panel-check-sound"
              onClick={handleTestSound}
              className="cursor-pointer px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white flex items-center gap-1 h-6 hover:scale-105 active:scale-95 transition-all outline-none"
            >
              <Volume2 size={11} className="text-pink-300" />
              <span>Play Bell</span>
            </button>
          </div>

          <p className="text-[9px] text-[#ffdbe9]/40 text-center leading-relaxed mt-1">
            This panel is invisible during client presentations. Perfect for testing! 🕊️✨
          </p>
        </div>
      )}
    </div>
  );
};
