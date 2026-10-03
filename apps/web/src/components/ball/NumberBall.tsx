'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEnglishWord, getHindiWord } from '@housie/shared';
import { Sparkles, Play } from 'lucide-react';

interface NumberBallProps {
  currentNumber: number | null;
  sequence: number;
  isPaused: boolean;
  totalCalled: number;
  onCallNext?: () => void;
}

export const NumberBall: React.FC<NumberBallProps> = ({
  currentNumber,
  sequence,
  isPaused,
  onCallNext,
}) => {
  const enWord = currentNumber ? getEnglishWord(currentNumber) : null;
  const hiWord = currentNumber ? getHindiWord(currentNumber) : null;

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Glow aura */}
      <div className="absolute h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-brand-600/20 blur-3xl -z-10 pointer-events-none" />

      <AnimatePresence mode="wait">
        {currentNumber !== null ? (
          <motion.div
            key={currentNumber}
            initial={{ scale: 0.4, y: -30, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 18,
            }}
            className="relative flex flex-col items-center"
          >
            {/* 3D Ball Container */}
            <div className="relative flex h-32 w-32 xs:h-36 xs:w-36 sm:h-44 sm:w-44 md:h-48 md:w-48 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 via-purple-600 to-indigo-900 shadow-2xl shadow-brand-500/40 ring-4 ring-white/20 select-none">
              {/* Inner Specular Highlight */}
              <div className="absolute top-2 left-4 sm:left-5 h-8 sm:h-12 w-14 sm:w-20 rounded-full bg-white/30 blur-sm transform -rotate-12" />

              {/* Number */}
              <span className="text-5xl sm:text-7xl font-black tracking-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                {currentNumber}
              </span>

              {/* Sequence badge */}
              <div className="absolute -bottom-2 rounded-full border border-surface-border bg-surface px-2.5 sm:px-3 py-0.5 text-[11px] sm:text-xs font-bold text-brand-600 dark:text-brand-400 shadow-md">
                #{sequence}
              </div>
            </div>

            {/* Word Announcements (Visible in both Light and Dark mode) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-3 sm:mt-5 text-center space-y-0.5 sm:space-y-1"
            >
              <div className="text-lg sm:text-2xl font-black tracking-wide text-slate-900 dark:text-white uppercase">
                {enWord}
              </div>
              {hiWord && (
                <div className="text-base sm:text-xl font-bold text-amber-600 dark:text-amber-400">
                  {hiWord.devanagari}{' '}
                  <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
                    ({hiWord.transliteration})
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          /* Empty / Idle State */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div
              onClick={onCallNext}
              className="group relative flex h-32 w-32 xs:h-36 xs:w-36 sm:h-44 sm:w-44 md:h-48 md:w-48 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-brand-500/40 bg-surface/50 p-4 sm:p-6 text-center transition-all hover:border-brand-500 hover:bg-surface-subtle active:scale-95"
            >
              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-brand-600/20 text-brand-500 group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5 fill-current" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Ready to Start
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                  Tap to call #1
                </span>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <Sparkles className="h-4 w-4 text-gold-500" />
              <span>Tap 'Call Next' to draw the first number</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paused indicator */}
      {isPaused && (
        <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 animate-pulse">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          GAME PAUSED
        </div>
      )}
    </div>
  );
};
