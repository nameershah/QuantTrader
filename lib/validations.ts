import { z } from 'zod';

const SymbolSchema = z.string().trim().toUpperCase().regex(/^[A-Z0-9]{1,6}$/, {
  message: 'Invalid symbol format',
});

/**
 * Strict validation for market data consumed by analyzer and LLM prompts.
 */
export const MarketDataSchema = z.object({
  symbol: SymbolSchema,
  price: z.number().positive().max(1_000_000),
  volume: z.number().positive().max(10_000_000_000),
  volatility: z.number().min(0).max(100),
  ma20: z.number().positive().max(1_000_000),
  rsi: z.number().min(0).max(100),
});

/**
 * Strict validation for paper trade execution requests.
 */
export const TradeRequestSchema = z.object({
  symbol: SymbolSchema,
  action: z.enum(['BUY', 'SELL']),
  amount: z.number().positive().max(10_000),
});

export type ValidatedMarketData = z.infer<typeof MarketDataSchema>;
export type ValidatedTradeRequest = z.infer<typeof TradeRequestSchema>;
