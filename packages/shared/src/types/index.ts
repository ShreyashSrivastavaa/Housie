import { GameStatus, PrizeKey, PrizeStatus, VoiceMode, WinnerStatus, AuditAction } from '../enums/index.js';

export interface UserSummary {
  id: string;
  email: string;
  name: string;
}

export interface GameSettingsData {
  gameId: string;
  soundEnabled: boolean;
  voiceMode: VoiceMode;
  volume: number;
}

export interface GamePrizeData {
  id: string;
  gameId: string;
  key: PrizeKey;
  name: string;
  prizeName: string;
  prizeAmount: number; // in paise
  maxWinners: number;
  status: PrizeStatus;
  sortOrder: number;
  isCustom: boolean;
  verifiedWinnersCount?: number;
}

export interface CalledNumberData {
  id: string;
  gameId: string;
  number: number;
  sequence: number;
  calledAt: string;
  undoneAt: string | null;
  isManual: boolean;
}

export interface WinnerData {
  id: string;
  gameId: string;
  prizeId: string;
  playerName: string;
  ticketNumber: string;
  notes: string | null;
  status: WinnerStatus;
  claimedAt: string;
  resolvedAt: string | null;
  atSequence: number;
  paidAt: string | null;
  prize?: {
    id: string;
    name: string;
    prizeName: string;
    prizeAmount: number;
  };
}

export interface GameSummary {
  id: string;
  name: string;
  venue: string;
  eventDate: string;
  description: string;
  code: string;
  displayToken: string;
  status: GameStatus;
  ticketPrice: number;
  totalTickets: number;
  ticketsDistributed: number;
  ticketsSold: number;
  ticketsComplimentary: number;
  startedAt: string | null;
  pausedAt: string | null;
  endedAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  prizesCount?: number;
  verifiedWinnersCount?: number;
  calledNumbersCount?: number;
  totalRevenue?: number;
  totalPrizePool?: number;
}

export interface GameStateSnapshot {
  game: GameSummary;
  settings: GameSettingsData;
  prizes: GamePrizeData[];
  calledNumbers: number[]; // Array of active called numbers in chronological sequence
  lastCalledNumber: number | null;
  currentSequence: number;
  remainingCount: number;
  winners: WinnerData[];
  recentCalledNumbers: number[]; // Last 5 called numbers
}

// Error payload uniform structure
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown> | undefined;
  };
}

// Socket Events
export interface SocketEventMeta {
  gameId: string;
  version: number;
  ts: string;
}

export interface NumberCalledSocketPayload extends SocketEventMeta {
  number: number;
  sequence: number;
  words: {
    en: string;
    hi: {
      devanagari: string;
      transliteration: string;
    };
  };
  calledCount: number;
  remaining: number;
}

export interface NumberUndoneSocketPayload extends SocketEventMeta {
  undoneNumber: number;
  undoneSequence: number;
  calledCount: number;
  remaining: number;
}

export interface GameStatusSocketPayload extends SocketEventMeta {
  status: GameStatus;
  startedAt?: string | null;
  pausedAt?: string | null;
  endedAt?: string | null;
}

export interface PrizeUpdatedSocketPayload extends SocketEventMeta {
  prizeId: string;
  status: PrizeStatus;
  verifiedWinnersCount: number;
}

export interface WinnerClaimedSocketPayload extends SocketEventMeta {
  winner: WinnerData;
}

export interface WinnerVerifiedSocketPayload extends SocketEventMeta {
  winnerId: string;
  prizeId: string;
  prizeName: string;
  playerName: string;
  ticketNumber: string;
  atSequence: number;
}

export interface WinnerRejectedSocketPayload extends SocketEventMeta {
  winnerId: string;
  reason?: string;
}

export interface SettingsUpdatedSocketPayload extends SocketEventMeta {
  settings: GameSettingsData;
}

export interface AuditLogData {
  id: string;
  gameId: string;
  actorId: string | null;
  action: AuditAction;
  data: Record<string, unknown>;
  createdAt: string;
}

