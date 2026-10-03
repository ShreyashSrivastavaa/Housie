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
    <div className="w-full space-y-4">
      {/* Top Status & Recent Numbers Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-surface-border bg-surface/90 px-4 py-3 shadow-md backdrop-blur">
        {/* Counters */}
        <div className="flex items-center gap-4">
          <div>
            <span className="text-xs text-slate-400 block">Called</span>
            <span className="text-lg font-black text-brand-400">
              {calledCount} <span className="text-xs font-normal text-slate-500">/ 90</span>
            </span>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div>
            <span className="text-xs text-slate-400 block">Remaining</span>
            <span className="text-lg font-black text-slate-200">{remainingCount}</span>
          </div>
        </div>

        {/* Recent Numbers Tape */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Last:
          </span>
          {recentNumbers.length > 0 ? (
            recentNumbers.map((num, idx) => (
              <span
                key={`${num}-${idx}`}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold shadow-sm ${
                  idx === 0
                    ? 'bg-neon-green text-slate-950 font-black ring-2 ring-white/50'
                    : 'bg-surface-subtle text-slate-300 border border-white/10'
                }`}
              >
                {num}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 italic">None yet</span>
          )}
        </div>
      </div>

      {/* Main Massive Call Next Button */}
      <div className="relative">
        <button
          type="button"
          disabled={!isLive || remainingCount === 0}
          onClick={onCallNext}
          className={`
            group relative w-full overflow-hidden rounded-2xl py-6 px-8 text-center font-black tracking-wider uppercase transition-all duration-200 active:scale-[0.98] select-none
            ${
              isLive && remainingCount > 0
                ? 'bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-brand-600/30 hover:shadow-brand-500/50 hover:brightness-110'
                : 'bg-surface-subtle text-slate-500 cursor-not-allowed border border-white/5'
            }
          `}
        >
          {/* Subtle light sweep animation */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

          <div className="relative flex items-center justify-center gap-3">
            <Play className="h-7 w-7 fill-current" />
            <span className="text-2xl sm:text-3xl">
              {remainingCount === 0 ? 'All Numbers Called' : 'Call Next Number'}
            </span>
          </div>
        </button>
      </div>

      {/* Controls Toolbar: Undo, Pause, Auto */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Undo Button */}
        <button
          type="button"
          disabled={!isLive || calledCount === 0}
          onClick={onUndoLast}
          className="flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface px-4 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-surface-subtle hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          title="Undo last called number"
        >
          <RotateCcw className="h-4 w-4 text-amber-400" />
          <span>Undo Last</span>
        </button>

        {/* Pause / Resume Button */}
        <button
          type="button"
          onClick={onTogglePause}
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all active:scale-95 ${
            isLive
              ? 'border-surface-border bg-surface text-slate-300 hover:bg-surface-subtle'
              : 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
          }`}
        >
          {isLive ? (
            <>
              <Pause className="h-4 w-4 text-amber-400 fill-current" />
              <span>Pause Game</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 text-neon-green fill-current" />
              <span>Resume Game</span>
            </>
          )}
        </button>

        {/* Auto Caller Toggle */}
        <button
          type="button"
          disabled={!isLive || remainingCount === 0}
          onClick={onToggleAutoCalling}
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all active:scale-95 ${
            isAutoCalling
              ? 'border-neon-green/50 bg-neon-green/20 text-neon-green shadow-md shadow-neon-green/20'
              : 'border-surface-border bg-surface text-slate-300 hover:bg-surface-subtle'
          }`}
        >
          <FastForward className={`h-4 w-4 ${isAutoCalling ? 'animate-pulse' : ''}`} />
          <span>{isAutoCalling ? `Auto (${settings.autoCallInterval}s)` : 'Auto Call'}</span>
        </button>
      </div>

      {/* Audio & Settings Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-surface-border bg-surface/50 px-4 py-2.5 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`flex items-center gap-1.5 font-semibold transition-colors ${
              settings.soundEnabled ? 'text-neon-green' : 'text-slate-500'
            }`}
          >
            {settings.soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
            <span>{settings.soundEnabled ? 'Sound On' : 'Sound Muted'}</span>
          </button>

          {/* Voice Mode Selector */}
          <div className="flex items-center gap-1 bg-surface-subtle rounded-lg p-0.5 border border-white/5">
            <button
              type="button"
              onClick={() => onUpdateSettings({ voiceMode: VoiceMode.HI_EN })}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                settings.voiceMode === VoiceMode.HI_EN
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              HI + EN
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ voiceMode: VoiceMode.HI })}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                settings.voiceMode === VoiceMode.HI
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ voiceMode: VoiceMode.EN })}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                settings.voiceMode === VoiceMode.EN
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Reset Game Trigger */}
        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-1.5 text-slate-500 hover:text-rose-400 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Board</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-surface p-6 shadow-2xl space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Reset Game Board?</h3>
            <p className="text-xs text-slate-400">
              This will clear all {calledCount} called numbers and winner claims for a fresh start. This cannot be undone.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="w-1/2 rounded-xl border border-surface-border bg-surface-subtle py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                Keep Game
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetGame();
                  setShowResetConfirm(false);
                }}
                className="w-1/2 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-rose-500"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
