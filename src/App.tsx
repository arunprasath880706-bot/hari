/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenId } from './types';
import { CountdownScreen } from './components/CountdownScreen';
import { ProposalScreen } from './components/ProposalScreen';
import { CatchButterfliesScreen } from './components/CatchButterfliesScreen';
import { GiftRevealScreen } from './components/GiftRevealScreen';
import { FinalBirthdayScreen } from './components/FinalBirthdayScreen';
import { DevControlPanel } from './components/DevControlPanel';
import { AudioPlayer, synthInstance } from './components/AudioPlayer';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('countdown');
  const [sanaName, setSanaName] = useState<string>('Sana');
  const [partnerName, setPartnerName] = useState<string>('');

  const handleRestartSurprise = () => {
    synthInstance.playSparkle();
    setCurrentScreen('countdown');
  };

  return (
    <div id="main-surprise-app-viewport" className="relative min-h-screen w-full bg-slate-950 font-sans text-white antialiased overflow-x-hidden selection:bg-pink-500 selection:text-white">
      {/* Global Interactive Synth Background Music Widget */}
      <AudioPlayer />

      {/* Pages Router based on current interactive state */}
      <main id="surprise-page-router">
        {currentScreen === 'countdown' && (
          <CountdownScreen
            sanaName={sanaName}
            onComplete={() => setCurrentScreen('proposal1')}
          />
        )}

        {currentScreen === 'proposal1' && (
          <ProposalScreen
            sanaName={sanaName}
            onYes={() => setCurrentScreen('game')}
          />
        )}

        {currentScreen === 'game' && (
          <CatchButterfliesScreen
            sanaName={sanaName}
            onComplete={() => setCurrentScreen('gift')}
          />
        )}

        {currentScreen === 'gift' && (
          <GiftRevealScreen
            sanaName={sanaName}
            onOpen={() => setCurrentScreen('proposal2')}
          />
        )}

        {(currentScreen === 'proposal2' || currentScreen === 'celebration') && (
          <FinalBirthdayScreen
            sanaName={sanaName}
            partnerName={partnerName}
            onRestart={handleRestartSurprise}
          />
        )}
      </main>

      {/* Behind-the-scenes control panel for quick page builders & client previewing */}
      <DevControlPanel
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        sanaName={sanaName}
        setSanaName={setSanaName}
        partnerName={partnerName}
        setPartnerName={setPartnerName}
      />
    </div>
  );
}

