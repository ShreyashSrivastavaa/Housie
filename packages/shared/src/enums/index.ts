export const GameStatus = {
  DRAFT: 'DRAFT',
  READY: 'READY',
  LOBBY: 'LOBBY',
  LIVE: 'LIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus];

export const PrizeStatus = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  DISABLED: 'DISABLED',
} as const;
export type PrizeStatus = (typeof PrizeStatus)[keyof typeof PrizeStatus];

export const WinnerStatus = {
  CLAIMED: 'CLAIMED',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
} as const;
export type WinnerStatus = (typeof WinnerStatus)[keyof typeof WinnerStatus];

export const VoiceMode = {
  EN: 'EN',
  HI: 'HI',
  HI_EN: 'HI_EN',
} as const;
export type VoiceMode = (typeof VoiceMode)[keyof typeof VoiceMode];

export const PrizeKey = {
  FIRST_FIVE: 'FIRST_FIVE',
  TOP_LINE: 'TOP_LINE',
  MIDDLE_LINE: 'MIDDLE_LINE',
  BOTTOM_LINE: 'BOTTOM_LINE',
  FOUR_CORNERS: 'FOUR_CORNERS',
  FULL_HOUSE: 'FULL_HOUSE',
  SECOND_FULL_HOUSE: 'SECOND_FULL_HOUSE',
  THIRD_FULL_HOUSE: 'THIRD_FULL_HOUSE',
  CUSTOM: 'CUSTOM',
} as const;
export type PrizeKey = (typeof PrizeKey)[keyof typeof PrizeKey];

export const AuditAction = {
  GAME_CREATED: 'GAME_CREATED',
  GAME_UPDATED: 'GAME_UPDATED',
  GAME_READY: 'GAME_READY',
  LOBBY_OPENED: 'LOBBY_OPENED',
  GAME_STARTED: 'GAME_STARTED',
  NUMBER_CALLED: 'NUMBER_CALLED',
  NUMBER_CALLED_MANUAL: 'NUMBER_CALLED_MANUAL',
  NUMBER_UNDONE: 'NUMBER_UNDONE',
  GAME_PAUSED: 'GAME_PAUSED',
  GAME_RESUMED: 'GAME_RESUMED',
  WINNER_CLAIMED: 'WINNER_CLAIMED',
  WINNER_VERIFIED: 'WINNER_VERIFIED',
  WINNER_REJECTED: 'WINNER_REJECTED',
  PRIZE_MARKED_PAID: 'PRIZE_MARKED_PAID',
  PRIZE_UPDATED: 'PRIZE_UPDATED',
  PRIZE_REOPENED: 'PRIZE_REOPENED',
  GAME_REOPENED: 'GAME_REOPENED',
  GAME_COMPLETED: 'GAME_COMPLETED',
  GAME_CANCELLED: 'GAME_CANCELLED',
} as const;
export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];
