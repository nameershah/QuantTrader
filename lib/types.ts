export type SignalType = 'BUY' | 'SELL' | 'HOLD' | 'NO_SIGNAL';
export type TradeAction = 'BUY' | 'SELL';

export interface MarketDataInput {
  symbol: string;
  price: number;
  volume: number;
  volatility: number;
  ma20?: number;
  rsi?: number;
}

export interface RuleSignalResult {
  signal: SignalType;
  confidence: number;
  rulesApplied: string[];
}

export interface MentorAnalysisResult extends RuleSignalResult {
  mentorExplanation: string;
  llmUsed: boolean;
  timestamp: string;
}

export interface Trade {
  id: string;
  timestamp: string;
  symbol: string;
  signal: SignalType;
  action?: TradeAction;
  amount?: number;
  status: 'Simulated' | 'Blocked by Risk Guard';
  mentorExplanation: string;
  blockReason?: string;
  pnl?: number;
}

export interface ExecuteTradeRequest {
  symbol: string;
  action: TradeAction;
  amount: number;
}

export interface ExecuteTradeResponse {
  success: boolean;
  orderId?: string;
  filledPrice?: number;
  blockReason?: string;
}

export interface BalanceSnapshot {
  usd: number;
  crypto: number;
  totalValue: number;
}
