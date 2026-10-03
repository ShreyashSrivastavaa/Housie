'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, X, Award } from 'lucide-react';
import { LocalWinner } from '../../hooks/useGameState';

interface WinnerCelebrationModalProps {
  winner: LocalWinner | null;
  onDismiss: () => void;
}

export const WinnerCelebrationModal: React.FC<WinnerCelebrationModalProps> = ({
  winner,
  onDismiss,
}) => {
  return (
    <AnimatePresence>
      {winner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md cursor-pointer select-none"
        >
          <motion.div
            initial={{ scale: 0.6, y: 50, rotate: -3 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-gold-500/60 bg-gradient-to-b from-surface via-surface-subtle to-slate-950 p-6 sm:p-10 text-center shadow-[0_0_60px_rgba(245,158,11,0.4)]"
          >
            {/* Top gold shine effect */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-gold-400/20 blur-2xl pointer-events-none" />

            {/* Close button */}
            <button
              type="button"
              onClick={onDismiss}
              className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-slate-400 hover:text-white hover:bg-white/20 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Trophy Icon */}
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-gold-600 to-amber-300 text-slate-950 shadow-lg shadow-gold-500/40"
            >
              <Trophy className="h-10 w-10 fill-current" />
            </motion.div>

            {/* Title */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1 text-xs font-black tracking-widest text-gold-400 uppercase mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Winner Verified!</span>
            </div>

            {/* Player Name */}
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2 drop-shadow-md">
              {winner.playerName}
            </h2>

            {/* Category & Prize */}
            <div className="space-y-1 mb-6">
              <p className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-300 to-gold-400">
                {winner.categoryName}
              </p>
              <p className="text-sm font-semibold text-slate-300">
                Reward: <span className="text-gold-400">{winner.prizeName}</span>
              </p>
            </div>

            {/* Ticket details pill */}
            <div className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-surface/90 px-4 py-2 text-xs text-slate-300 shadow-inner">
              <span className="flex items-center gap-1">
                <Award className="h-4 w-4 text-emerald-400" />
                Physical Ticket: <strong className="text-white text-sm">#{winner.ticketNumber}</strong>
              </span>
              <span>•</span>
              <span>At call sequence #{winner.atSequence}</span>
            </div>

            <p className="mt-6 text-xs text-slate-400">
              Tap anywhere to dismiss
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
