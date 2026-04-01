'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Trade } from '@/lib/types';

interface TradeState {
  balance: { usd: number };
  trades: Trade[];
  consecutiveLosses: number;
}

const STORAGE_KEY = 'quanttrader-state';

const defaultState: TradeState = {
  balance: { usd: 10_000 },
  trades: [],
  consecutiveLosses: 0,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function finiteNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function sanitizeTradeState(input: unknown): TradeState {
  if (!input || typeof input !== 'object') return defaultState;

  const obj = input as Partial<TradeState>;
  const balanceUsd = clamp(finiteNumber(obj.balance?.usd, defaultState.balance.usd), 0, 1_000_000_000);
  const consecutiveLosses = clamp(Math.floor(finiteNumber(obj.consecutiveLosses, 0)), 0, 1_000_000);

  const trades = Array.isArray(obj.trades)
    ? obj.trades.filter((trade): trade is Trade => {
        if (!trade || typeof trade !== 'object') return false;
        const t = trade as Partial<Trade>;
        if (typeof t.id !== 'string' || typeof t.timestamp !== 'string' || typeof t.symbol !== 'string') return false;
        if (typeof t.mentorExplanation !== 'string' || (t.signal !== 'BUY' && t.signal !== 'SELL' && t.signal !== 'HOLD' && t.signal !== 'NO_SIGNAL')) {
          return false;
        }
        if (t.action !== undefined && t.action !== 'BUY' && t.action !== 'SELL') return false;
        if (t.amount !== undefined && !Number.isFinite(t.amount)) return false;
        if (t.pnl !== undefined && !Number.isFinite(t.pnl)) return false;
        if (t.status !== 'Simulated' && t.status !== 'Blocked by Risk Guard') return false;
        return true;
      })
    : [];

  return {
    balance: { usd: balanceUsd },
    trades,
    consecutiveLosses,
  };
}

export function useTrades() {
  const [state, setState] = useState<TradeState>(defaultState);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as unknown;
      setState(sanitizeTradeState(parsed));
    } catch {
      setState(defaultState);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addTrade = useCallback((trade: Trade) => {
    setState((prev) => {
      const nextLosses = trade.pnl !== undefined && trade.pnl < 0 ? prev.consecutiveLosses + 1 : 0;
      return {
        ...prev,
        trades: [trade, ...prev.trades],
        consecutiveLosses: nextLosses,
      };
    });
  }, []);

  const getConsecutiveLosses = useCallback(() => state.consecutiveLosses, [state.consecutiveLosses]);

  const resetSimulator = useCallback(() => {
    setState(defaultState);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
  }, []);

  return useMemo(
    () => ({
      state,
      trades: state.trades,
      balance: state.balance,
      addTrade,
      getConsecutiveLosses,
      resetSimulator,
    }),
    [addTrade, getConsecutiveLosses, resetSimulator, state],
  );
}
