import { z } from 'zod';
import { PrizeStatus, VoiceMode } from '../enums/index.js';

// ==========================================
// Auth Schemas
// ==========================================
export const signupSchema = z
  .object({
    email: z.string().trim().email('Invalid email address').max(255),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password must not exceed 128 characters'),
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  })
  .strict();

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z
  .object({
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  })
  .strict();

export type LoginInput = z.infer<typeof loginSchema>;

// ==========================================
// Game Schemas
// ==========================================
export const createGameSchema = z
  .object({
    name: z.string().trim().min(2, 'Game name must be at least 2 characters').max(100),
    venue: z.string().trim().min(1, 'Venue is required').max(150),
    eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Event date must be in YYYY-MM-DD format'),
    description: z.string().trim().max(1000).optional().default(''),
    ticketPrice: z
      .number()
      .int('Ticket price must be an integer in paise')
      .nonnegative('Ticket price cannot be negative')
      .default(0),
    totalTickets: z
      .number()
      .int('Total tickets must be an integer')
      .positive('Total tickets must be at least 1')
      .default(100),
  })
  .strict();

export type CreateGameInput = z.infer<typeof createGameSchema>;

export const updateGameSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    venue: z.string().trim().min(1).max(150).optional(),
    eventDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Event date must be in YYYY-MM-DD format')
      .optional(),
    description: z.string().trim().max(1000).optional(),
  })
  .strict();

export type UpdateGameInput = z.infer<typeof updateGameSchema>;

export const updateTicketsSchema = z
  .object({
    ticketPrice: z
      .number()
      .int('Ticket price must be an integer in paise')
      .nonnegative('Ticket price cannot be negative')
      .optional(),
    ticketsDistributed: z
      .number()
      .int()
      .nonnegative('Distributed tickets cannot be negative')
      .optional(),
    ticketsSold: z
      .number()
      .int()
      .nonnegative('Sold tickets cannot be negative')
      .optional(),
    ticketsComplimentary: z
      .number()
      .int()
      .nonnegative('Complimentary tickets cannot be negative')
      .optional(),
  })
  .strict();

export type UpdateTicketsInput = z.infer<typeof updateTicketsSchema>;

export const updateSettingsSchema = z
  .object({
    soundEnabled: z.boolean().optional(),
    voiceMode: z.nativeEnum(VoiceMode).optional(),
    volume: z.number().int().min(0).max(100).optional(),
  })
  .strict();

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

// ==========================================
// Prize Schemas
// ==========================================
export const createCustomPrizeSchema = z
  .object({
    name: z.string().trim().min(2, 'Prize category name required').max(100),
    prizeName: z.string().trim().min(1, 'Prize item name required').max(100),
    prizeAmount: z.number().int().nonnegative('Prize amount cannot be negative').default(0),
    maxWinners: z.number().int().positive('Max winners must be at least 1').default(1),
  })
  .strict();

export type CreateCustomPrizeInput = z.infer<typeof createCustomPrizeSchema>;

export const updatePrizeSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    prizeName: z.string().trim().min(1).max(100).optional(),
    prizeAmount: z.number().int().nonnegative().optional(),
    maxWinners: z.number().int().positive().optional(),
    status: z.nativeEnum(PrizeStatus).optional(),
  })
  .strict();

export type UpdatePrizeInput = z.infer<typeof updatePrizeSchema>;

// ==========================================
// Calling Schemas
// ==========================================
export const manualCallSchema = z
  .object({
    number: z
      .number()
      .int('Number must be an integer')
      .min(1, 'Number must be between 1 and 90')
      .max(90, 'Number must be between 1 and 90'),
  })
  .strict();

export type ManualCallInput = z.infer<typeof manualCallSchema>;

// ==========================================
// Winner Schemas
// ==========================================
export const claimWinnerSchema = z
  .object({
    prizeId: z.string().uuid('Valid prize ID required'),
    playerName: z.string().trim().min(1, 'Player name is required').max(100),
    ticketNumber: z.string().trim().min(1, 'Physical ticket number is required').max(50),
    notes: z.string().trim().max(500).optional(),
  })
  .strict();

export type ClaimWinnerInput = z.infer<typeof claimWinnerSchema>;

export const rejectWinnerSchema = z
  .object({
    reason: z.string().trim().max(500).optional(),
  })
  .strict();

export type RejectWinnerInput = z.infer<typeof rejectWinnerSchema>;

export const paidWinnerSchema = z
  .object({
    paid: z.boolean(),
  })
  .strict();

export type PaidWinnerInput = z.infer<typeof paidWinnerSchema>;
