'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GameBoardProps {
  calledNumbers: number[];
  latestNumber: number | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  calledNumbers,
  latestNumber,
}) => {
  const calledSet = new Set(calledNumbers);

  // 1 to 90 array
  const numbers = Array.from({ length: 90 }, (_, i) => i + 1);

  return (
    <div className="w-full rounded-2xl border border-surface-border bg-surface/90 p-2.5 sm:p-4 md:p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-2.5 sm:mb-3 px-1">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Digital Tambola Board (1–90)
        </h3>
        <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-md bg-gradient-to-br from-brand-500 to-purple-600 shadow-sm" />
            <span className="text-slate-600 dark:text-slate-400">Called</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-md bg-neon-green opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-md bg-neon-green" />
            </span>
            <span className="text-slate-600 dark:text-slate-400">Latest</span>
          </div>
        </div>
      </div>

      {/* Grid: 10 columns perfectly scalable on all mobile screens */}
      <div className="grid grid-cols-10 gap-1 sm:gap-1.5 md:gap-2">
        {numbers.map((num) => {
          const isCalled = calledSet.has(num);
          const isLatest = num === latestNumber;

          return (
            <motion.div
              key={num}
              initial={false}
              animate={isCalled ? { scale: isLatest ? 1.06 : 1 } : { scale: 1 }}
              className={`
                relative flex aspect-square items-center justify-center rounded sm:rounded-lg text-[10px] xs:text-xs sm:text-sm md:text-base font-bold transition-all duration-150 select-none
                ${
                  isLatest
                    ? 'bg-gradient-to-br from-neon-green via-emerald-500 to-teal-700 text-slate-950 font-black shadow-lg shadow-neon-green/30 ring-2 ring-white z-10'
                    : isCalled
                      ? 'bg-gradient-to-br from-brand-600 to-purple-800 text-white shadow-sm border border-brand-400/40'
                      : 'bg-slate-100 dark:bg-surface-subtle/80 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-white/5'
                }
              `}
              title={
                isCalled
                  ? `Number ${num} (Called)`
                  : `Number ${num} (Not Called)`
              }
            >
              <span>{num}</span>

              {/* Pulsing beacon on latest called number */}
              {isLatest && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-90" />
                  <span className="relative inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-white" />
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
