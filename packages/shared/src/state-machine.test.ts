import { describe, it, expect } from 'vitest';
import { GameStatus, PrizeStatus } from './enums/index.js';
import {
  canTransitionGame,
  assertValidGameTransition,
  canCallNumber,
  canUndoCall,
  canPauseGame,
  canResumeGame,
  canEndGame,
  canClaimOrVerifyWinner,
  canModifyPrizeCategories,
  canModifyPrizeNameOrAmount,
  canReopenCompletedPrize,
} from './state-machine/index.js';

describe('Game State Machine Transitions', () => {
  it('allows valid transitions according to rules', () => {
    expect(canTransitionGame(GameStatus.DRAFT, GameStatus.READY)).toBe(true);
    expect(canTransitionGame(GameStatus.READY, GameStatus.LOBBY)).toBe(true);
    expect(canTransitionGame(GameStatus.LOBBY, GameStatus.LIVE)).toBe(true);
    expect(canTransitionGame(GameStatus.LIVE, GameStatus.PAUSED)).toBe(true);
    expect(canTransitionGame(GameStatus.PAUSED, GameStatus.LIVE)).toBe(true);
    expect(canTransitionGame(GameStatus.LIVE, GameStatus.COMPLETED)).toBe(true);
    expect(canTransitionGame(GameStatus.PAUSED, GameStatus.COMPLETED)).toBe(true);

    // Reopen completed game
    expect(canTransitionGame(GameStatus.COMPLETED, GameStatus.LIVE)).toBe(true);

    // Cancel transitions
    expect(canTransitionGame(GameStatus.DRAFT, GameStatus.CANCELLED)).toBe(true);
    expect(canTransitionGame(GameStatus.READY, GameStatus.CANCELLED)).toBe(true);
    expect(canTransitionGame(GameStatus.LOBBY, GameStatus.CANCELLED)).toBe(true);
    expect(canTransitionGame(GameStatus.LIVE, GameStatus.CANCELLED)).toBe(true);
    expect(canTransitionGame(GameStatus.PAUSED, GameStatus.CANCELLED)).toBe(true);
  });

  it('rejects invalid transitions', () => {
    expect(canTransitionGame(GameStatus.DRAFT, GameStatus.LIVE)).toBe(false);
    expect(canTransitionGame(GameStatus.READY, GameStatus.PAUSED)).toBe(false);
    expect(canTransitionGame(GameStatus.LOBBY, GameStatus.COMPLETED)).toBe(false);
    expect(canTransitionGame(GameStatus.CANCELLED, GameStatus.LIVE)).toBe(false);
    expect(canTransitionGame(GameStatus.CANCELLED, GameStatus.DRAFT)).toBe(false);
    expect(canTransitionGame(GameStatus.COMPLETED, GameStatus.DRAFT)).toBe(false);

    expect(() => assertValidGameTransition(GameStatus.DRAFT, GameStatus.LIVE)).toThrow();
  });

  it('evaluates operation guards correctly', () => {
    // Calling numbers: LIVE only
    expect(canCallNumber(GameStatus.LIVE)).toBe(true);
    expect(canCallNumber(GameStatus.PAUSED)).toBe(false);
    expect(canCallNumber(GameStatus.LOBBY)).toBe(false);
    expect(canCallNumber(GameStatus.COMPLETED)).toBe(false);

    // Undo: LIVE only
    expect(canUndoCall(GameStatus.LIVE)).toBe(true);
    expect(canUndoCall(GameStatus.PAUSED)).toBe(false);

    // Pause & Resume
    expect(canPauseGame(GameStatus.LIVE)).toBe(true);
    expect(canPauseGame(GameStatus.PAUSED)).toBe(false);
    expect(canResumeGame(GameStatus.PAUSED)).toBe(true);
    expect(canResumeGame(GameStatus.LIVE)).toBe(false);

    // End game: LIVE or PAUSED
    expect(canEndGame(GameStatus.LIVE)).toBe(true);
    expect(canEndGame(GameStatus.PAUSED)).toBe(true);
    expect(canEndGame(GameStatus.LOBBY)).toBe(false);

    // Winner verification: LIVE or PAUSED
    expect(canClaimOrVerifyWinner(GameStatus.LIVE)).toBe(true);
    expect(canClaimOrVerifyWinner(GameStatus.PAUSED)).toBe(true);
    expect(canClaimOrVerifyWinner(GameStatus.COMPLETED)).toBe(false);

    // Category modifications: DRAFT, READY, LOBBY only
    expect(canModifyPrizeCategories(GameStatus.DRAFT)).toBe(true);
    expect(canModifyPrizeCategories(GameStatus.READY)).toBe(true);
    expect(canModifyPrizeCategories(GameStatus.LOBBY)).toBe(true);
    expect(canModifyPrizeCategories(GameStatus.LIVE)).toBe(false);
    expect(canModifyPrizeCategories(GameStatus.PAUSED)).toBe(false);

    // Prize name & amount modification: DRAFT, READY, LOBBY, LIVE, PAUSED
    expect(canModifyPrizeNameOrAmount(GameStatus.LIVE)).toBe(true);
    expect(canModifyPrizeNameOrAmount(GameStatus.PAUSED)).toBe(true);
    expect(canModifyPrizeNameOrAmount(GameStatus.COMPLETED)).toBe(false);

    // Reopen prize: LIVE or PAUSED and COMPLETED status
    expect(canReopenCompletedPrize(GameStatus.LIVE, PrizeStatus.COMPLETED)).toBe(true);
    expect(canReopenCompletedPrize(GameStatus.LIVE, PrizeStatus.ACTIVE)).toBe(false);
    expect(canReopenCompletedPrize(GameStatus.COMPLETED, PrizeStatus.COMPLETED)).toBe(false);
  });
});
