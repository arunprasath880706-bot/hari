/**
 * Types & Interfaces for Sana's Magical Surprise
 */

export type ScreenId = 'countdown' | 'proposal1' | 'game' | 'gift' | 'proposal2' | 'celebration';

export interface ButterflyData {
  id: number;
  x: number; // 0 to 100 representing screen %
  y: number; // 0 to 100 representing screen %
  size: number; // size in px
  isCaught: boolean;
  message: string;
  angle: number; // current flight angle for SVG rotation
  color: string; // Tailwind color or custom hex
}

export interface SurpriseSettings {
  sanaName: string;
  partnerName: string;
  countdownTargetTime: string; // HH:MM:SS format
  butterflyMessages: string[];
  proposal1Question: string;
  proposal2Question: string;
  finalMessage: string;
}
