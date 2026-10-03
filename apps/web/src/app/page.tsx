'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tv, Edit3, Check, Trophy } from 'lucide-react';
import { NumberBall } from '../components/ball/NumberBall';
import { GameBoard } from '../components/board/GameBoard';
import { HostControls } from '../components/host/HostControls';
import { PrizesSection } from '../components/prizes/PrizesSection';
import { WinnerCelebrationModal } from '../components/celebration/WinnerCelebrationModal';
import { useGameState } from '../hooks/useGameState';

export default function HomePage() {
  const {
    isClient,
    gameName,
    setGameName,
    status,
    calledNumbers,
    remainingNumbers,
    lastCalledNumber,
    recentNumbers,
    prizes,
    winners,
    settings,
    isAutoCalling,
    celebrationWinner,
    setCelebrationWinner,
    callNextNumber,
    manualCallNumber,
    undoLastCall,
    togglePause,
    resetGame,
    claimWinner,
    verifyWinner,
    rejectWinner,
    toggleWinnerPaid,
    reopenPrize,
    addCustomPrize,
    updateSettings,
    toggleAutoCalling,
  } = useGameState();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(gameName);

  const handleTitleSave = () => {
    if (tempTitle.trim()) {
      setGameName(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <span className="text-sm font-semibold tracking-wide">Loading Housie Platform...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-surface-border bg-surface/90 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          {/* Logo & Game Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-purple-500 font-black text-white shadow-md shadow-brand-500/20">
              H
            </div>

            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                  autoFocus
                  className="rounded-lg border border-brand-500 bg-surface-subtle px-2.5 py-1 text-sm font-bold text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleTitleSave}
                  className="rounded-lg bg-brand-600 p-1.5 text-white hover:bg-brand-500"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => {
                setTempTitle(gameName);
                setIsEditingTitle(true);
              }}>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-brand-400 transition-colors">
                  {gameName}
                </h1>
                <Edit3 className="h-3.5 w-3.5 text-slate-500 group-hover:text-brand-400 transition-colors" />
              </div>
            )}
          </div>

          {/* Action CTAs: TV Display & Status */}
          <div className="flex items-center gap-3">
            <Link
              href="/display"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-gold-500/40 bg-gold-500/10 px-3.5 py-1.5 text-xs font-bold text-gold-400 shadow-sm transition-all hover:bg-gold-500/20 hover:border-gold-400 active:scale-95"
            >
              <Tv className="h-4 w-4" />
              <span>Open Projector / TV Screen</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Top Section: Ball + Host Controls */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Giant Number Ball */}
          <div className="lg:col-span-5 flex justify-center">
            <NumberBall
              currentNumber={lastCalledNumber}
              sequence={calledNumbers.length}
              isPaused={status === 'PAUSED'}
              totalCalled={calledNumbers.length}
              onCallNext={callNextNumber}
            />
          </div>

          {/* Primary Controls */}
          <div className="lg:col-span-7">
            <HostControls
              status={status}
              calledCount={calledNumbers.length}
              remainingCount={remainingNumbers.length}
              recentNumbers={recentNumbers}
              isAutoCalling={isAutoCalling}
              settings={settings}
              onCallNext={callNextNumber}
              onUndoLast={undoLastCall}
              onTogglePause={togglePause}
              onToggleAutoCalling={toggleAutoCalling}
              onManualCall={manualCallNumber}
              onResetGame={resetGame}
              onUpdateSettings={updateSettings}
            />
          </div>
        </section>

        {/* Middle Section: 1 to 90 Board */}
        <section>
          <GameBoard
            calledNumbers={calledNumbers}
            latestNumber={lastCalledNumber}
            onManualCallSelect={(num) => manualCallNumber(num)}
            interactive={status === 'LIVE'}
          />
        </section>

        {/* Bottom Section: Prize Categories & Claims */}
        <section>
          <PrizesSection
            prizes={prizes}
            winners={winners}
            calledCount={calledNumbers.length}
            onClaimWinner={claimWinner}
            onVerifyWinner={verifyWinner}
            onRejectWinner={rejectWinner}
            onTogglePaid={toggleWinnerPaid}
            onReopenPrize={reopenPrize}
            onAddCustomPrize={addCustomPrize}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-surface-border bg-surface/50 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          Digital Housie & Tambola Game Control Platform • Built for parties, kitty parties, weddings & club celebrations.
        </p>
      </footer>

      {/* Confetti Celebration Fanfare Modal */}
      <WinnerCelebrationModal
        winner={celebrationWinner}
        onDismiss={() => setCelebrationWinner(null)}
      />
    </div>
  );
}
