'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Maximize2, Minimize2, Volume2, VolumeX, ArrowLeft, Trophy } from 'lucide-react';
import { NumberBall } from '../ball/NumberBall';
import { GameBoard } from '../board/GameBoard';
import { WinnerCelebrationModal } from '../celebration/WinnerCelebrationModal';
import { useGameState } from '../../hooks/useGameState';
import { PrizeStatus } from '@housie/shared';

export const ProjectorView: React.FC = () => {
  const {
    isClient,
    gameName,
    status,
    calledNumbers,
    remainingNumbers,
    lastCalledNumber,
    recentNumbers,
    prizes,
    settings,
    celebrationWinner,
    setCelebrationWinner,
    updateSettings,
    callNextNumber,
  } = useGameState();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleUnlockAudio = () => {
    setAudioUnlocked(true);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Speak a blank utterance to unlock browser autoplay policy
      const u = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(u);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none">
      {/* Top Bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-surface-subtle transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Host Controls</span>
          </Link>

          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{gameName}</span>
              <span className="rounded-full bg-brand-500/20 px-2.5 py-0.5 text-xs font-bold text-brand-400 border border-brand-500/30">
                TV DISPLAY
              </span>
            </h1>
          </div>
        </div>

        {/* Counter and Fullscreen toolbar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-surface/80 rounded-xl px-4 py-1.5 border border-white/10">
            <span className="text-xs text-slate-400">Called:</span>
            <span className="text-lg font-black text-brand-400">
              {calledNumbers.length} <span className="text-xs text-slate-500 font-normal">/ 90</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-400">Remaining:</span>
            <span className="text-lg font-black text-slate-200">{remainingNumbers.length}</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
              settings.soundEnabled
                ? 'border-neon-green/40 bg-neon-green/10 text-neon-green'
                : 'border-white/10 bg-surface text-slate-500'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-surface px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-surface-subtle hover:text-white transition-all"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </header>

      {/* Audio Unlock Gate Banner if autoplay requires gesture */}
      {!audioUnlocked && settings.soundEnabled && (
        <div
          onClick={handleUnlockAudio}
          className="my-2 cursor-pointer rounded-xl border border-gold-500/40 bg-gold-500/10 p-2.5 text-center text-xs font-bold text-gold-400 hover:bg-gold-500/20 transition-all animate-pulse"
        >
          🔊 Tap anywhere to enable Voice Announcements for this TV Screen
        </div>
      )}

      {/* Main Center Area: 2 Columns on Desktop */}
      <main className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center py-4">
        {/* Left Column: Giant Number Ball & Last 5 numbers */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6">
          <NumberBall
            currentNumber={lastCalledNumber}
            sequence={calledNumbers.length}
            isPaused={status === 'PAUSED'}
            totalCalled={calledNumbers.length}
            onCallNext={callNextNumber}
          />

          {/* Recent numbers tape */}
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface/70 p-4 text-center backdrop-blur">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Previous Numbers
            </span>
            <div className="flex items-center justify-center gap-2.5">
              {recentNumbers.slice(1, 6).length > 0 ? (
                recentNumbers.slice(1, 6).map((num, i) => (
                  <span
                    key={`${num}-${i}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-subtle text-base font-bold text-slate-200 border border-white/10 shadow-sm"
                  >
                    {num}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No previous calls yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Full 1 to 90 Board */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <GameBoard
            calledNumbers={calledNumbers}
            latestNumber={lastCalledNumber}
            interactive={false}
          />
        </div>
      </main>

      {/* Bottom Footer: Prize Categories Status Ticker */}
      <footer className="border-t border-white/10 pt-4">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Trophy className="h-4 w-4 text-gold-400" />
          <span>Prize Status</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {prizes.map((p) => {
            const isCompleted = p.status === PrizeStatus.COMPLETED;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-white/10 bg-surface text-slate-300'
                }`}
              >
                <span>{p.name}</span>
                <span className="text-[10px] text-gold-400 font-bold">
                  (₹{p.prizeAmount / 100})
                </span>
                {isCompleted && (
                  <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[9px] font-black uppercase text-emerald-300">
                    WON
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </footer>

      {/* Celebratory Winner Modal */}
      <WinnerCelebrationModal
        winner={celebrationWinner}
        onDismiss={() => setCelebrationWinner(null)}
      />
    </div>
  );
};
