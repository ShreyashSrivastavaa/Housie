'use client';

import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Plus,
  DollarSign,
  Ticket,
  User,
  RotateCcw,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { PrizeStatus, WinnerStatus } from '@housie/shared';
import { LocalPrize, LocalWinner } from '../../hooks/useGameState';

interface PrizesSectionProps {
  prizes: LocalPrize[];
  winners: LocalWinner[];
  calledCount: number;
  onClaimWinner: (
    prizeId: string,
    playerName: string,
    ticketNumber: string,
    notes?: string
  ) => void;
  onVerifyWinner: (winnerId: string) => void;
  onRejectWinner: (winnerId: string) => void;
  onTogglePaid: (winnerId: string) => void;
  onReopenPrize: (prizeId: string) => void;
  onAddCustomPrize: (
    name: string,
    prizeName: string,
    prizeAmount: number,
    maxWinners: number
  ) => void;
  onDeletePrize: (prizeId: string) => void;
  onClearAllPrizes?: () => void;
}

const PRESET_SUGGESTIONS = [
  { name: 'Early Five (Jaldi 5)', prize: 'Cash Prize', amount: '500' },
  { name: 'Top Line', prize: 'Cash Prize', amount: '500' },
  { name: 'Middle Line', prize: 'Cash Prize', amount: '500' },
  { name: 'Bottom Line', prize: 'Cash Prize', amount: '500' },
  { name: 'Four Corners', prize: 'Cash Prize', amount: '500' },
  { name: 'Full House (1st)', prize: 'Grand Prize', amount: '1500' },
  { name: 'Full House (2nd)', prize: 'Second Prize', amount: '1000' },
  { name: 'Star / King / Queen', prize: 'Special Prize', amount: '300' },
];

export const PrizesSection: React.FC<PrizesSectionProps> = ({
  prizes,
  winners,
  calledCount,
  onClaimWinner,
  onVerifyWinner,
  onRejectWinner,
  onTogglePaid,
  onReopenPrize,
  onAddCustomPrize,
  onDeletePrize,
  onClearAllPrizes,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'claims'>('categories');
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedPrizeId, setSelectedPrizeId] = useState<string>(prizes[0]?.id || '');
  const [playerName, setPlayerName] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrizeName, setCustomPrizeName] = useState('Cash Prize');
  const [customAmount, setCustomAmount] = useState('500');

  const formatINR = (paise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(paise / 100);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrizeId || !playerName.trim() || !ticketNumber.trim()) return;

    onClaimWinner(selectedPrizeId, playerName, ticketNumber, notes);

    setPlayerName('');
    setTicketNumber('');
    setNotes('');
    setShowClaimModal(false);
    setActiveTab('claims');
  };

  const handleAddPrizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const amount = parseInt(customAmount, 10) || 0;
    onAddCustomPrize(customName, customPrizeName || 'Cash Prize', amount, 1);

    setCustomName('');
    setCustomPrizeName('Cash Prize');
    setCustomAmount('500');
    setShowAddModal(false);
  };

  const applyPreset = (preset: typeof PRESET_SUGGESTIONS[0]) => {
    setCustomName(preset.name);
    setCustomPrizeName(preset.prize);
    setCustomAmount(preset.amount);
  };

  const pendingClaimsCount = winners.filter((w) => w.status === WinnerStatus.CLAIMED).length;

  return (
    <div className="w-full rounded-2xl border border-surface-border bg-surface/80 p-4 sm:p-5 shadow-xl backdrop-blur-md space-y-4">
      {/* Header and Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-gold-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Prize Categories & Claims
          </h3>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-surface-subtle p-1 border border-surface-border text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'categories'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Prizes ({prizes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('claims')}
            className={`relative rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'claims'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Claims ({winners.length})
            {pendingClaimsCount > 0 && (
              <span className="ml-1.5 rounded-full bg-neon-green px-1.5 py-0.2 text-[10px] text-slate-950 font-black">
                {pendingClaimsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories View */}
      {activeTab === 'categories' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {prizes.length === 0
                ? 'Add your custom prizes below'
                : `Active Prizes (${prizes.length})`}
            </span>
            <div className="flex items-center gap-2">
              {prizes.length > 0 && onClearAllPrizes && (
                <button
                  type="button"
                  onClick={onClearAllPrizes}
                  className="flex items-center gap-1 rounded-lg border border-surface-border bg-surface px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-rose-500 hover:border-rose-500/40 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Clear All</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-500 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Prize Category</span>
              </button>
              {prizes.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPrizeId(prizes[0]?.id || '');
                    setShowClaimModal(true);
                  }}
                  className="flex items-center gap-1 rounded-lg border border-surface-border bg-surface px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-500 transition-colors"
                >
                  <Ticket className="h-3.5 w-3.5" />
                  <span>Claim Winner</span>
                </button>
              )}
            </div>
          </div>

          {prizes.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-surface-border p-8 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  No Prize Categories Yet
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Add custom prize categories for your party (e.g. Early 5, Top Line, Middle Line, Bottom Line, Full House).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-brand-500 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Add First Prize</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {prizes.map((prize) => {
                const verifiedForPrize = winners.filter(
                  (w) => w.prizeId === prize.id && w.status === WinnerStatus.VERIFIED
                );
                const isCompleted = prize.status === PrizeStatus.COMPLETED;

                return (
                  <div
                    key={prize.id}
                    className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                      isCompleted
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-surface-border bg-surface-subtle/70'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {prize.name}
                        </span>
                        {isCompleted ? (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-500 dark:text-emerald-400">
                            COMPLETED
                          </span>
                        ) : (
                          <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-300">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span>{prize.prizeName}</span>
                        <span>•</span>
                        <span className="font-semibold text-gold-600 dark:text-gold-400">
                          {formatINR(prize.prizeAmount)}
                        </span>
                      </div>

                      {/* Verified winners display */}
                      {verifiedForPrize.length > 0 && (
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                          🏆 Winner: {verifiedForPrize.map((w) => `${w.playerName} (#${w.ticketNumber})`).join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isCompleted ? (
                        <button
                          type="button"
                          onClick={() => onReopenPrize(prize.id)}
                          className="rounded-lg border border-surface-border bg-surface p-1.5 text-xs text-slate-400 hover:text-amber-500 hover:border-amber-500/40"
                          title="Reopen prize for more winners"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPrizeId(prize.id);
                            setShowClaimModal(true);
                          }}
                          className="rounded-lg bg-surface border border-surface-border px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-500"
                        >
                          Claim
                        </button>
                      )}

                      {/* Delete Prize Button */}
                      <button
                        type="button"
                        onClick={() => onDeletePrize(prize.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Delete prize category"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Claims List View */}
      {activeTab === 'claims' && (
        <div className="space-y-3">
          {winners.length === 0 ? (
            <div className="rounded-xl border border-dashed border-surface-border p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
              No ticket claims registered yet. Tap "Claim Winner" to verify a player's physical ticket.
            </div>
          ) : (
            <div className="space-y-2">
              {winners.map((winner) => (
                <div
                  key={winner.id}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 transition-all ${
                    winner.status === WinnerStatus.VERIFIED
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : winner.status === WinnerStatus.REJECTED
                        ? 'border-rose-500/20 bg-rose-500/5 opacity-60'
                        : 'border-amber-500/30 bg-amber-500/10'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {winner.playerName}
                      </span>
                      <span className="rounded bg-black/10 dark:bg-white/10 px-1.5 py-0.5 font-mono text-xs text-slate-700 dark:text-slate-300">
                        Ticket #{winner.ticketNumber}
                      </span>
                      <span className="text-xs text-gold-600 dark:text-gold-400 font-semibold">
                        ({winner.categoryName})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>Claimed at #{winner.atSequence} calls</span>
                      {winner.notes && <span>• Note: {winner.notes}</span>}
                    </div>
                  </div>

                  {/* Actions according to winner status */}
                  <div className="flex items-center gap-2">
                    {winner.status === WinnerStatus.CLAIMED && (
                      <>
                        <button
                          type="button"
                          onClick={() => onVerifyWinner(winner.id)}
                          className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 active:scale-95"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Verify</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRejectWinner(winner.id)}
                          className="flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/20 active:scale-95"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {winner.status === WinnerStatus.VERIFIED && (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          VERIFIED
                        </span>

                        {/* Paid toggle */}
                        <button
                          type="button"
                          onClick={() => onTogglePaid(winner.id)}
                          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                            winner.isPaid
                              ? 'bg-gold-500/20 text-gold-600 dark:text-gold-400 border border-gold-500/40'
                              : 'bg-surface border border-surface-border text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <DollarSign className="h-3 w-3" />
                          <span>{winner.isPaid ? 'Prize Paid' : 'Mark Paid'}</span>
                        </button>
                      </div>
                    )}

                    {winner.status === WinnerStatus.REJECTED && (
                      <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-500 dark:text-rose-400">
                        REJECTED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Claim Winner Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Ticket className="h-5 w-5 text-brand-500" />
              Claim Physical Ticket
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter the player's name and physical ticket number to verify their numbers against the {calledCount} called numbers.
            </p>

            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prize Category
                </label>
                <select
                  value={selectedPrizeId}
                  onChange={(e) => setSelectedPrizeId(e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-3 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
                >
                  {prizes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.prizeName} - {formatINR(p.prizeAmount)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Player Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full rounded-xl border border-surface-border bg-surface-subtle pl-9 pr-4 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Physical Ticket Number
                </label>
                <div className="relative">
                  <Ticket className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 42"
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                    className="w-full rounded-xl border border-surface-border bg-surface-subtle pl-9 pr-4 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Verified offline by referee"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-4 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="w-1/2 rounded-xl border border-surface-border bg-surface-subtle py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-500"
                >
                  Record Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Prize Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="h-5 w-5 text-brand-500" />
              Add Prize Category
            </h3>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                Quick Suggestions (Tap to prefill):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SUGGESTIONS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-500 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddPrizeSubmit} className="space-y-3.5 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Early Five, Full House, Star"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-4 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prize Item / Reward
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cash Prize, Gift Hamper"
                  value={customPrizeName}
                  onChange={(e) => setCustomPrizeName(e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-4 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prize Value in ₹ (Rupees)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  required
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-surface-subtle px-4 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 rounded-xl border border-surface-border bg-surface-subtle py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-500"
                >
                  Add Prize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
