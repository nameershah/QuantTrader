import type { BalanceSnapshot, TradeAction } from '@/lib/types';

export interface KrakenMarketData {
  price: number;
  volume: number;
  changePercent: number;
  ma20: number;
  rsi: number;
  volatility: number;
}

export interface KrakenTradeResult {
  orderId: string;
  status: 'filled' | 'rejected';
  filledPrice: number;
}

const hasApiCredentials = Boolean(process.env.KRAKEN_API_KEY);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

export async function getMarketData(symbol: string): Promise<KrakenMarketData> {
  try {
    if (!hasApiCredentials) {
      await delay(120);
      const price = randomBetween(80, 250);
      return {
        price,
        volume: randomBetween(50_000, 800_000),
        changePercent: randomBetween(-3.5, 3.5),
        ma20: Number((price * randomBetween(0.96, 1.04)).toFixed(2)),
        rsi: randomBetween(20, 85),
        volatility: randomBetween(10, 60),
      };
    }

    throw new Error('Live Kraken API integration endpoint is not configured in this demo scaffold.');
  } catch (error) {
    throw new Error(`Failed to fetch market data for ${symbol}: ${(error as Error).message}`);
  }
}

export async function executeTrade(
  symbol: string,
  action: TradeAction,
  amount: number,
): Promise<KrakenTradeResult> {
  try {
    if (!hasApiCredentials) {
      await delay(150);
      return {
        orderId: `MOCK-${symbol}-${Date.now()}`,
        status: 'filled',
        filledPrice: randomBetween(80, 250),
      };
    }

    throw new Error(`Live trade execution not configured for ${action} ${amount} ${symbol}.`);
  } catch (error) {
    throw new Error(`Failed to execute trade for ${symbol}: ${(error as Error).message}`);
  }
}

export async function getBalance(): Promise<BalanceSnapshot> {
  try {
    if (!hasApiCredentials) {
      await delay(80);
      const usd = randomBetween(8000, 12000);
      const crypto = randomBetween(1000, 3000);
      return {
        usd,
        crypto,
        totalValue: Number((usd + crypto).toFixed(2)),
      };
    }

    throw new Error('Live Kraken balance endpoint is not configured in this demo scaffold.');
  } catch (error) {
    throw new Error(`Failed to fetch account balance: ${(error as Error).message}`);
  }
}

export const krakenClient = {
  getMarketData,
  executeTrade,
  getBalance,
};
