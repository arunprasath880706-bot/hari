import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

class DreamySynth {
  private ctx: AudioContext | null = null;
  private timer: SVGAElement | any = null;
  private isPlaying: boolean = false;
  private currentVolume: number = 0.18;
  private masterGain: GainNode | null = null;
  
  constructor() {
    // Lazy load the audio context
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.currentVolume = vol;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  public start() {
    this.initCtx();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.chordLoop();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  // Play a soft, ambient bell chime
  public playBell(freq: number = 523.25, duration: number = 2.0) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const time = this.ctx.currentTime;
    
    // Main oscillator - Triangle
    const osc1 = this.ctx.createOscillator();
    const oscGain1 = this.ctx.createGain();
    
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);
    
    // Shine oscillator - Sine (octave higher)
    const osc2 = this.ctx.createOscillator();
    const oscGain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, time);

    oscGain1.gain.setValueAtTime(0.3, time);
    oscGain1.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    
    oscGain2.gain.setValueAtTime(0.12, time);
    oscGain2.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.6);

    osc1.connect(oscGain1);
    oscGain1.connect(this.masterGain);
    
    osc2.connect(oscGain2);
    oscGain2.connect(this.masterGain);

    osc1.start(time);
    osc1.stop(time + duration);
    
    osc2.start(time);
    osc2.stop(time + duration);
  }

  // Play a cute, rising bubble sparkle sequence
  public playSparkle() {
    this.initCtx();
    if (!this.ctx) return;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C major arpeggio
    notes.forEach((note, i) => {
      setTimeout(() => {
        this.playBell(note * 1.2, 1.2);
      }, i * 110);
    });
  }

  // A romantic arpeggio chord loop
  private chordLoop = () => {
    if (!this.isPlaying || !this.ctx) return;

    // EbMaj9 (Eb, G, Bb, D, F) -> Cm9 (C, Eb, G, Bb, D) -> AbMaj9 (Ab, C, Eb, G, Bb) -> Bb11 (Bb, D, F, Ab, C)
    const chords = [
      [155.56, 196.00, 233.08, 293.66, 349.23], // EbMaj9
      [130.81, 155.56, 196.00, 233.08, 293.66], // Cm9
      [116.54, 130.81, 155.56, 196.00, 233.08], // AbMaj9
      [116.54, 146.83, 174.61, 207.65, 261.63]  // Bb11
    ];

    const currentChord = chords[Math.floor(Math.random() * chords.length)];
    const time = this.ctx.currentTime;

    // Arpeggiate the chord softly over 5 seconds
    currentChord.forEach((noteFreq, index) => {
      const noteDelay = index * 0.45;
      setTimeout(() => {
        if (!this.isPlaying || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.5);
        
        osc.connect(gain);
        if (this.masterGain) gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 3.6);
      }, noteDelay * 1000);
    });

    this.timer = setTimeout(this.chordLoop, 5500);
  };
}

// Single instance for global helper triggers
export const synthInstance = new DreamySynth();

interface Props {
  className?: string;
  autoplay?: boolean;
}

export const AudioPlayer: React.FC<Props> = ({ autoplay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [soundIntensity, setSoundIntensity] = useState(0.18);

  useEffect(() => {
    if (autoplay) {
      handleTogglePlay();
    }
    return () => {
      synthInstance.stop();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      synthInstance.stop();
      setIsPlaying(false);
    } else {
      synthInstance.start();
      synthInstance.setVolume(isMuted ? 0 : soundIntensity);
      setIsPlaying(true);
      // Play brief welcoming chime
      synthInstance.playSparkle();
    }
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    synthInstance.setVolume(nextMute ? 0 : soundIntensity);
  };

  return (
    <div id="audio-controls-container" className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <button
        id="audio-synth-toggle-play"
        onClick={handleTogglePlay}
        className={`px-3 py-2 rounded-full glass-morphism flex items-center gap-2 text-xs text-white/90 hover:scale-105 transition-all outline-none border border-white/20 shadow-md ${
          isPlaying ? 'bg-purple-700/30' : 'bg-black/40'
        }`}
        title="Toggle romantic ambient music"
      >
        <Music size={14} className={isPlaying ? 'animate-spin-slow text-pink-400' : 'text-gray-400'} />
        <span>{isPlaying ? 'Dreamy Music Live' : 'Enable Magic Sound ✨'}</span>
      </button>

      {isPlaying && (
        <button
          id="audio-synth-toggle-mute"
          onClick={handleToggleMute}
          className="p-2 rounded-full bg-black/40 border border-white/20 glass-morphism text-white/80 hover:scale-105 transition-all outline-none"
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      )}
    </div>
  );
};
