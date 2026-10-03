import { GameStatus, PrizeStatus } from '../enums/index.js';

export const ALLOWED_GAME_TRANSITIONS: Record<GameStatus, readonly GameStatus[]> = {
  [GameStatus.DRAFT]: [GameStatus.READY, GameStatus.CANCELLED],
  [GameStatus.READY]: [GameStatus.DRAFT, GameStatus.LOBBY, GameStatus.CANCELLED],
  [GameStatus.LOBBY]: [GameStatus.LIVE, GameStatus.CANCELLED],
  [GameStatus.LIVE]: [GameStatus.PAUSED, GameStatus.COMPLETED, GameStatus.CANCELLED],
  [GameStatus.PAUSED]: [GameStatus.LIVE, GameStatus.COMPLETED, GameStatus.CANCELLED],
  [GameStatus.COMPLETED]: [GameStatus.LIVE], // Reopen game (audited)
  [GameStatus.CANCELLED]: [],
} as const;

export function canTransitionGame(from: GameStatus, to: GameStatus): boolean {
  const allowed = ALLOWED_GAME_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}

export function assertValidGameTransition(from: GameStatus, to: GameStatus): void {
  if (!canTransitionGame(from, to)) {
    throw new Error(`Invalid game state transition from ${from} to ${to}`);
  }
}

export function canCallNumber(status: GameStatus): boolean {
  return status === GameStatus.LIVE;
}

export function canUndoCall(status: GameStatus): boolean {
  return status === GameStatus.LIVE;
}

export function canPauseGame(status: GameStatus): boolean {
  return status === GameStatus.LIVE;
}

export function canResumeGame(status: GameStatus): boolean {
  return status === GameStatus.PAUSED;
}

export function canEndGame(status: GameStatus): boolean {
  return status === GameStatus.LIVE || status === GameStatus.PAUSED;
}

export function canClaimOrVerifyWinner(status: GameStatus): boolean {
  return status === GameStatus.LIVE || status === GameStatus.PAUSED;
}

export function canModifyPrizeCategories(status: GameStatus): boolean {
  // Enabling/disabling categories or adding custom categories is allowed in DRAFT, READY, LOBBY
  return (
    status === GameStatus.DRAFT ||
    status === GameStatus.READY ||
    status === GameStatus.LOBBY
  );
}

export function canModifyPrizeNameOrAmount(status: GameStatus): boolean {
  // When LIVE or PAUSED, prize name and amount edits are allowed (audited). Not allowed when COMPLETED or CANCELLED.
  return (
    status === GameStatus.DRAFT ||
    status === GameStatus.READY ||
    status === GameStatus.LOBBY ||
    status === GameStatus.LIVE ||
    status === GameStatus.PAUSED
  );
}

export function canReopenCompletedPrize(gameStatus: GameStatus, prizeStatus: PrizeStatus): boolean {
  return (
    (gameStatus === GameStatus.LIVE || gameStatus === GameStatus.PAUSED) &&
    prizeStatus === PrizeStatus.COMPLETED
  );
}
