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

export function useTrades() {
  const [state, setState] = useState<TradeState>(defaultState);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as TradeState;
      setState(parsed);
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
