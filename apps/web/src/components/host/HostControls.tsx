'use client';

import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { GameStatus, VoiceMode } from '@housie/shared';
import { GameSettings } from '../../hooks/useGameState';

interface HostControlsProps {
  status: GameStatus;
  calledCount: number;
  remainingCount: number;
  recentNumbers: number[];
  isAutoCalling: boolean;
  settings: GameSettings;
  onCallNext: () => void;
  onUndoLast: () => void;
  onTogglePause: () => void;
  onToggleAutoCalling: () => void;
  onResetGame: () => void;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
}

export const HostControls: React.FC<HostControlsProps> = ({
  status,
  calledCount,
  remainingCount,
  recentNumbers,
  isAutoCalling,
  settings,
  onCallNext,
  onUndoLast,
  onTogglePause,
  onToggleAutoCalling,
  onResetGame,
  onUpdateSettings,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const isLive = status === GameStatus.LIVE;

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Top Status & Recent Numbers Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 rounded-2xl border border-surface-border bg-surface/90 px-3 sm:px-4 py-2.5 sm:py-3 shadow-md backdrop-blur">
        {/* Counters */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Called</span>
            <span className="text-base sm:text-lg font-black text-brand-600 dark:text-brand-400">
              {calledCount} <span className="text-[11px] sm:text-xs font-normal text-slate-500">/ 90</span>
            </span>
          </div>
          <div className="h-7 w-[1px] bg-slate-300 dark:bg-white/10" />
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Remaining</span>
            <span className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-200">
              {remainingCount}
            </span>
          </div>
        </div>

        {/* Recent Numbers Tape with silky mobile touch scroll */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-[200px] xs:max-w-none">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
            Last:
          </span>
          {recentNumbers.length > 0 ? (
            recentNumbers.map((num, idx) => (
              <span
                key={`${num}-${idx}`}
                className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg text-xs sm:text-sm font-bold shadow-sm ${
                  idx === 0
                    ? 'bg-neon-green text-slate-950 font-black ring-2 ring-white/60'
                    : 'bg-slate-100 dark:bg-surface-subtle text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-white/10'
                }`}
              >
                {num}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-slate-400 italic">None</span>
          )}
        </div>
      </div>

      {/* Main Massive Call Next Button (Mobile Touch Optimized ≥ 56px) */}
      <div className="relative">
        <button
          type="button"
          disabled={!isLive || remainingCount === 0}
          onClick={onCallNext}
          className={`
            group relative w-full overflow-hidden rounded-2xl py-4 sm:py-6 px-4 sm:px-8 text-center font-black tracking-wider uppercase transition-all duration-150 active:scale-[0.97] select-none min-h-[56px] sm:min-h-[68px]
            ${
              isLive && remainingCount > 0
                ? 'bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-brand-600/30 hover:shadow-brand-500/50 hover:brightness-110'
                : 'bg-slate-200 dark:bg-surface-subtle text-slate-400 dark:text-slate-600 cursor-not-allowed border border-surface-border'
            }
          `}
        >
          {/* Subtle light sweep animation */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

          <div className="relative flex items-center justify-center gap-2 sm:gap-3">
            <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-current shrink-0" />
            <span className="text-xl xs:text-2xl sm:text-3xl">
              {remainingCount === 0 ? 'All 90 Called' : 'Call Next Number'}
            </span>
          </div>
        </button>
      </div>

      {/* Controls Toolbar: Undo, Pause, Auto (3 Equal Touch Columns) */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
        {/* Undo Button */}
        <button
          type="button"
          disabled={!isLive || calledCount === 0}
          onClick={onUndoLast}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-surface-border bg-surface px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 transition-all hover:bg-surface-subtle disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 min-h-[44px]"
          title="Undo last called number"
        >
          <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
          <span>Undo</span>
        </button>

        {/* Pause / Resume Button */}
        <button
          type="button"
          onClick={onTogglePause}
          className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-all active:scale-95 min-h-[44px] ${
            isLive
              ? 'border-surface-border bg-surface text-slate-700 dark:text-slate-200 hover:bg-surface-subtle'
              : 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-300 hover:bg-amber-500/20'
          }`}
        >
          {isLive ? (
            <>
              <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neon-green fill-current" />
              <span>Resume</span>
            </>
          )}
        </button>

        {/* Auto Caller Toggle */}
        <button
          type="button"
          disabled={!isLive || remainingCount === 0}
          onClick={onToggleAutoCalling}
          className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-all active:scale-95 min-h-[44px] ${
            isAutoCalling
              ? 'border-neon-green/50 bg-neon-green/20 text-neon-green shadow-md shadow-neon-green/20'
              : 'border-surface-border bg-surface text-slate-700 dark:text-slate-200 hover:bg-surface-subtle'
          }`}
        >
          <FastForward className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isAutoCalling ? 'animate-pulse' : ''}`} />
          <span>{isAutoCalling ? `Auto ${settings.autoCallInterval}s` : 'Auto Call'}</span>
        </button>
      </div>

      {/* Audio & Settings Bar (Clean Mobile Wrap) */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-surface-border bg-surface/60 px-3 sm:px-4 py-2 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`flex items-center gap-1.5 font-bold transition-colors ${
              settings.soundEnabled ? 'text-neon-green' : 'text-slate-400'
            }`}
          >
            {settings.soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
            <span>{settings.soundEnabled ? 'Sound' : 'Muted'}</span>
          </button>

          {/* Voice Mode Selector */}
          <div className="flex items-center gap-0.5 bg-surface-subtle rounded-lg p-0.5 border border-surface-border">
            <button
              type="button"
              onClick={() => onUpdateSettings({ voiceMode: VoiceMode.HI_EN })}
              className={`px-2 py-0.5 rounded font-bold text-[11px] transition-colors ${
                settings.voiceMode === VoiceMode.HI_EN
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              HI+EN
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ voiceMode: VoiceMode.HI })}
              className={`px-2 py-0.5 rounded font-bold text-[11px] transition-colors ${
                settings.voiceMode === VoiceMode.HI
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ voiceMode: VoiceMode.EN })}
              className={`px-2 py-0.5 rounded font-bold text-[11px] transition-colors ${
                settings.voiceMode === VoiceMode.EN
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Reset Game Trigger */}
        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-500 transition-colors ml-auto"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-rose-500/30 bg-surface p-5 sm:p-6 shadow-2xl space-y-3.5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-500">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Reset Game Board?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This will clear all {calledCount} called numbers and winner claims for a fresh start.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="w-1/2 rounded-xl border border-surface-border bg-surface-subtle py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Keep Game
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetGame();
                  setShowResetConfirm(false);
                }}
                className="w-1/2 rounded-xl bg-rose-600 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-rose-500 active:scale-95"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
