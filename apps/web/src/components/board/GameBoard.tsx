'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GameBoardProps {
  calledNumbers: number[];
  latestNumber: number | null;
  onManualCallSelect?: (num: number) => void;
  interactive?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  calledNumbers,
  latestNumber,
  onManualCallSelect,
  interactive = true,
}) => {
  const calledSet = new Set(calledNumbers);

  // 1 to 90 array
  const numbers = Array.from({ length: 90 }, (_, i) => i + 1);

  return (
    <div className="w-full rounded-2xl border border-surface-border bg-surface/80 p-3 sm:p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Digital Tambola Board (1–90)
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-gradient-to-br from-brand-500 to-purple-600 shadow-sm" />
            <span className="text-slate-400">Called</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-md bg-neon-green opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-md bg-neon-green" />
            </span>
            <span className="text-slate-400">Latest</span>
          </div>
        </div>
      </div>

      {/* Grid: 10 columns */}
      <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
        {numbers.map((num) => {
          const isCalled = calledSet.has(num);
          const isLatest = num === latestNumber;

          return (
            <motion.button
              key={num}
              type="button"
              disabled={!interactive || isCalled}
              onClick={() => onManualCallSelect && onManualCallSelect(num)}
              whileHover={interactive && !isCalled ? { scale: 1.12 } : {}}
              whileTap={interactive && !isCalled ? { scale: 0.95 } : {}}
              className={`
                relative flex aspect-square items-center justify-center rounded-lg text-xs sm:text-base font-bold transition-all duration-200 select-none
                ${
                  isLatest
                    ? 'bg-gradient-to-br from-neon-green via-emerald-500 to-teal-700 text-slate-950 font-black shadow-lg shadow-neon-green/30 ring-2 ring-white z-10 scale-105'
                    : isCalled
                      ? 'bg-gradient-to-br from-brand-600 to-purple-800 text-white shadow-md shadow-brand-600/20 border border-brand-400/30'
                      : 'bg-surface-subtle/80 text-slate-400 border border-white/5 hover:border-slate-500 hover:text-white'
                }
              `}
              title={
                isCalled
                  ? `Number ${num} (Already Called)`
                  : interactive
                    ? `Click to manually call ${num}`
                    : `Number ${num}`
              }
            >
              {num}

              {/* Pulsing beacon on the latest called number */}
              {isLatest && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-90" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
