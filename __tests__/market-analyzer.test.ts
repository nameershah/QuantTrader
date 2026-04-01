import { describe, expect, it } from 'vitest';
import { analyzeSignal } from '../lib/market-analyzer';

describe('analyzeSignal', () => {
  it('returns BUY with 0.85 confidence when price > MA and RSI < 40', () => {
    const result = analyzeSignal({
      symbol: 'BTCUSD',
      price: 110,
      volume: 250000,
      volatility: 25,
      ma20: 100,
      rsi: 35,
    });

    expect(result.signal).toBe('BUY');
    expect(result.confidence).toBe(0.85);
  });

  it('returns SELL with 0.80 confidence when price < MA and RSI > 70', () => {
    const result = analyzeSignal({
      symbol: 'ETHUSD',
      price: 90,
      volume: 180000,
      volatility: 28,
      ma20: 100,
      rsi: 74,
    });

    expect(result.signal).toBe('SELL');
    expect(result.confidence).toBe(0.8);
  });

  it('returns NO_SIGNAL when volatility is below 15%', () => {
    const result = analyzeSignal({
      symbol: 'SOLUSD',
      price: 100,
      volume: 120000,
      volatility: 10,
      ma20: 98,
      rsi: 45,
    });

    expect(result.signal).toBe('NO_SIGNAL');
  });
});
