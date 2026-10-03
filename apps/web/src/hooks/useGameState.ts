'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  GameStatus,
  PrizeStatus,
  WinnerStatus,
  VoiceMode,
  PrizeKey,
} from '@housie/shared';
import { speechEngine, SpeechSettings } from '../lib/speech';
import confetti from 'canvas-confetti';

export interface LocalPrize {
  id: string;
  key: PrizeKey;
  name: string;
  prizeName: string;
  prizeAmount: number; // in paise
  maxWinners: number;
  status: PrizeStatus;
  isCustom: boolean;
}

export interface LocalWinner {
  id: string;
  prizeId: string;
  prizeName: string;
  categoryName: string;
  playerName: string;
  ticketNumber: string;
  notes?: string;
  status: WinnerStatus;
  claimedAt: string;
  verifiedAt?: string;
  atSequence: number;
  isPaid: boolean;
}

export interface GameSettings extends SpeechSettings {
  autoCallInterval: number; // in seconds
}

const STORAGE_KEY = 'housie_standalone_game_v1';

const DEFAULT_PRIZES: LocalPrize[] = [];

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  voiceMode: VoiceMode.HI_EN,
  volume: 100,
  rate: 0.95,
  autoCallInterval: 8,
};

export function useGameState() {
  const [isClient, setIsClient] = useState(false);
  const [gameName, setGameName] = useState('Housie Night with Friends');
  const [status, setStatus] = useState<GameStatus>(GameStatus.LIVE);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [prizes, setPrizes] = useState<LocalPrize[]>(DEFAULT_PRIZES);
  const [winners, setWinners] = useState<LocalWinner[]>([]);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [isAutoCalling, setIsAutoCalling] = useState(false);
  const [celebrationWinner, setCelebrationWinner] = useState<LocalWinner | null>(null);

  const autoCallTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load state from localStorage on initial mount
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.gameName) setGameName(parsed.gameName);
        if (parsed.status) setStatus(parsed.status);
        if (Array.isArray(parsed.calledNumbers)) setCalledNumbers(parsed.calledNumbers);
        if (Array.isArray(parsed.prizes)) {
          // If the stored prizes match the old default 8 prizes (starting with id 'p1'), clean them up to []
          const hasOldDefaults = parsed.prizes.length === 8 && parsed.prizes[0]?.id === 'p1';
          if (hasOldDefaults) {
            setPrizes([]);
          } else {
            setPrizes(parsed.prizes);
          }
        }
        if (Array.isArray(parsed.winners)) setWinners(parsed.winners);
        if (parsed.settings) setSettings(parsed.settings);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isClient) return;
    try {
      const dataToSave = {
        gameName,
        status,
        calledNumbers,
        prizes,
        winners,
        settings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [isClient, gameName, status, calledNumbers, prizes, winners, settings]);

  // Derived state
  const lastCalledNumber = calledNumbers.length > 0 ? calledNumbers[calledNumbers.length - 1] ?? null : null;
  const recentNumbers = [...calledNumbers].slice(-5).reverse();
  const calledSet = new Set(calledNumbers);
  const remainingNumbers: number[] = [];
  for (let i = 1; i <= 90; i++) {
    if (!calledSet.has(i)) {
      remainingNumbers.push(i);
    }
  }

  // Trigger Confetti
  const triggerCelebration = useCallback((winner: LocalWinner) => {
    setCelebrationWinner(winner);

    // Fire fireworks style confetti
    if (typeof window !== 'undefined') {
      const duration = 4000;
      const end = Date.now() + duration;

      const interval: NodeJS.Timeout = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          return;
        }
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors: ['#7C3AED', '#F59E0B', '#10B981', '#EC4899', '#3B82F6'],
        });
      }, 300);
    }

    // Auto-dismiss celebration modal after 6 seconds
    setTimeout(() => {
      setCelebrationWinner(null);
    }, 6000);
  }, []);

  // Call Next Number
  const callNextNumber = useCallback(() => {
    if (status !== GameStatus.LIVE) return null;
    if (remainingNumbers.length === 0) return null;

    // Cryptographically secure selection (with robust fallback if crypto is not supported)
    let randomIndex = 0;
    if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.getRandomValues === 'function') {
      const buffer = new Uint32Array(1);
      window.crypto.getRandomValues(buffer);
      randomIndex = (buffer[0] ?? 0) % remainingNumbers.length;
    } else {
      randomIndex = Math.floor(Math.random() * remainingNumbers.length);
    }

    const nextNum = remainingNumbers[randomIndex];

    if (!nextNum) return null;

    setCalledNumbers((prev) => [...prev, nextNum]);

    // Announce with Web Speech API
    speechEngine.announceNumber(nextNum, settings);

    return nextNum;
  }, [status, remainingNumbers, settings]);

  // Manual Call Number
  const manualCallNumber = useCallback(
    (num: number) => {
      if (status !== GameStatus.LIVE) return false;
      if (num < 1 || num > 90 || !Number.isInteger(num)) return false;
      if (calledSet.has(num)) return false;

      setCalledNumbers((prev) => [...prev, num]);
      speechEngine.announceNumber(num, settings);
      return true;
    },
    [status, calledSet, settings]
  );

  // Undo Last Call
  const undoLastCall = useCallback(() => {
    if (status !== GameStatus.LIVE || calledNumbers.length === 0) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCalledNumbers((prev) => prev.slice(0, -1));
  }, [status, calledNumbers.length]);

  // Pause / Resume
  const togglePause = useCallback(() => {
    if (status === GameStatus.LIVE) {
      setStatus(GameStatus.PAUSED);
      setIsAutoCalling(false);
    } else if (status === GameStatus.PAUSED) {
      setStatus(GameStatus.LIVE);
    }
  }, [status]);

  // Reset Game
  const resetGame = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAutoCalling(false);
    setCalledNumbers([]);
    setWinners([]);
    setStatus(GameStatus.LIVE);
    setPrizes(DEFAULT_PRIZES);
  }, []);

  // Auto-Caller Interval Hook
  useEffect(() => {
    if (isAutoCalling && status === GameStatus.LIVE) {
      autoCallTimerRef.current = setInterval(() => {
        if (remainingNumbers.length > 0) {
          callNextNumber();
        } else {
          setIsAutoCalling(false);
        }
      }, settings.autoCallInterval * 1000);
    } else {
      if (autoCallTimerRef.current) {
        clearInterval(autoCallTimerRef.current);
        autoCallTimerRef.current = null;
      }
    }

    return () => {
      if (autoCallTimerRef.current) {
        clearInterval(autoCallTimerRef.current);
      }
    };
  }, [isAutoCalling, status, settings.autoCallInterval, callNextNumber, remainingNumbers.length]);

  const toggleAutoCalling = useCallback(() => {
    if (status !== GameStatus.LIVE) return;
    setIsAutoCalling((prev) => !prev);
  }, [status]);

  // Claim Winner
  const claimWinner = useCallback(
    (prizeId: string, playerName: string, ticketNumber: string, notes?: string) => {
      const prize = prizes.find((p) => p.id === prizeId);
      if (!prize) return null;

      const newWinner: LocalWinner = {
        id: `w_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        prizeId,
        prizeName: prize.prizeName,
        categoryName: prize.name,
        playerName: playerName.trim(),
        ticketNumber: ticketNumber.trim(),
        notes: notes?.trim() || undefined,
        status: WinnerStatus.CLAIMED,
        claimedAt: new Date().toISOString(),
        atSequence: calledNumbers.length,
        isPaid: false,
      };

      setWinners((prev) => [newWinner, ...prev]);
      return newWinner;
    },
    [prizes, calledNumbers.length]
  );

  // Verify Winner
  const verifyWinner = useCallback(
    (winnerId: string) => {
      const targetWinner = winners.find((w) => w.id === winnerId);
      if (!targetWinner) return;

      const prize = prizes.find((p) => p.id === targetWinner.prizeId);
      if (!prize) return;

      const updatedWinner: LocalWinner = {
        ...targetWinner,
        status: WinnerStatus.VERIFIED,
        verifiedAt: new Date().toISOString(),
      };

      setWinners((prev) => prev.map((w) => (w.id === winnerId ? updatedWinner : w)));

      // Check if prize has reached max winners
      const currentVerifiedForPrize = winners.filter(
        (w) => w.prizeId === targetWinner.prizeId && w.status === WinnerStatus.VERIFIED && w.id !== winnerId
      ).length + 1;

      if (currentVerifiedForPrize >= prize.maxWinners) {
        setPrizes((prev) =>
          prev.map((p) => (p.id === prize.id ? { ...p, status: PrizeStatus.COMPLETED } : p))
        );
      }

      // Fanfare celebration!
      triggerCelebration(updatedWinner);
    },
    [winners, prizes, triggerCelebration]
  );

  // Reject Winner
  const rejectWinner = useCallback((winnerId: string) => {
    setWinners((prev) =>
      prev.map((w) => (w.id === winnerId ? { ...w, status: WinnerStatus.REJECTED } : w))
    );
  }, []);

  // Toggle Winner Paid
  const toggleWinnerPaid = useCallback((winnerId: string) => {
    setWinners((prev) =>
      prev.map((w) => (w.id === winnerId ? { ...w, isPaid: !w.isPaid } : w))
    );
  }, []);

  // Reopen Prize
  const reopenPrize = useCallback((prizeId: string) => {
    setPrizes((prev) =>
      prev.map((p) => (p.id === prizeId ? { ...p, status: PrizeStatus.ACTIVE } : p))
    );
  }, []);

  // Add Custom Prize
  const addCustomPrize = useCallback(
    (name: string, prizeName: string, prizeAmount: number, maxWinners: number = 1) => {
      const newPrize: LocalPrize = {
        id: `custom_${Date.now()}`,
        key: PrizeKey.CUSTOM,
        name: name.trim(),
        prizeName: prizeName.trim(),
        prizeAmount: prizeAmount * 100, // convert ₹ to paise
        maxWinners,
        status: PrizeStatus.ACTIVE,
        isCustom: true,
      };
      setPrizes((prev) => [...prev, newPrize]);
    },
    []
  );

  // Delete a specific prize
  const deletePrize = useCallback((prizeId: string) => {
    setPrizes((prev) => prev.filter((p) => p.id !== prizeId));
  }, []);

  // Clear all prizes
  const clearAllPrizes = useCallback(() => {
    setPrizes([]);
  }, []);

  // Update Settings
  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return {
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
    undoLastCall,
    togglePause,
    resetGame,
    claimWinner,
    verifyWinner,
    rejectWinner,
    toggleWinnerPaid,
    reopenPrize,
    addCustomPrize,
    deletePrize,
    clearAllPrizes,
    updateSettings,
    toggleAutoCalling,
  };
}
