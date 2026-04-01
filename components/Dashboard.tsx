'use client';

import { useCallback, useState } from 'react';
import type { ExecuteTradeResponse, MarketDataInput, MentorAnalysisResult, Trade } from '@/lib/types';

const initialData: MarketDataInput = {
  symbol: 'BTCUSD',
  price: 102.5,
  volume: 250000,
  volatility: 22,
  ma20: 101.3,
  rsi: 38,
};

function signalClasses(signal?: string): string {
  if (signal === 'BUY') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  if (signal === 'SELL') return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  if (signal === 'HOLD') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
}

interface DashboardProps {
  trades: Trade[];
  addTrade: (trade: Trade) => void;
}

export default function Dashboard({ trades: _trades, addTrade }: DashboardProps) {
  const [marketData, setMarketData] = useState<MarketDataInput>(initialData);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MentorAnalysisResult | null>(null);
  const [streamExplanation, setStreamExplanation] = useState('');
  const [executing, setExecuting] = useState(false);
  const [tradeStatus, setTradeStatus] = useState<{ type: 'success' | 'warning'; message: string } | null>(null);

  const handleAnalyze = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(marketData),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to analyze market data.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalPayload: MentorAnalysisResult | null = null;
      setStreamExplanation('');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.trim()) continue;
          const chunk = JSON.parse(line) as
            | { type: 'token'; token: string }
            | { type: 'done'; payload: MentorAnalysisResult }
            | { type: 'error'; message: string };

          if (chunk.type === 'token') {
            setStreamExplanation((prev) => prev + chunk.token);
          }
          if (chunk.type === 'done') {
            finalPayload = chunk.payload;
          }
          if (chunk.type === 'error') {
            throw new Error(chunk.message);
          }
        }
      }

      const data = finalPayload;
      if (!data) throw new Error('No analysis payload returned from stream.');
      setResult(data);

    } finally {
      setLoading(false);
    }
  }, [addTrade, marketData]);

  const handleExecuteTrade = useCallback(async () => {
    if (!result || (result.signal !== 'BUY' && result.signal !== 'SELL')) return;

    setExecuting(true);
    setTradeStatus(null);
    try {
      const response = await fetch('/api/execute-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: marketData.symbol,
          action: result.signal,
          amount: 100,
        }),
      });

      const data = (await response.json()) as ExecuteTradeResponse;

      if (data.success) {
        addTrade({
          id: data.orderId ?? `${Date.now()}`,
          timestamp: new Date().toISOString(),
          symbol: marketData.symbol,
          signal: result.signal,
          action: result.signal,
          amount: 100,
          status: 'Simulated',
          mentorExplanation: result.mentorExplanation,
        });
        setTradeStatus({
          type: 'success',
          message: `Paper trade executed successfully. Order ID: ${data.orderId ?? 'N/A'}.`,
        });
      } else {
        addTrade({
          id: `${Date.now()}-blocked`,
          timestamp: new Date().toISOString(),
          symbol: marketData.symbol,
          signal: result.signal,
          action: result.signal,
          amount: 100,
          status: 'Blocked by Risk Guard',
          mentorExplanation: result.mentorExplanation,
          blockReason: data.blockReason,
        });
        setTradeStatus({
          type: 'warning',
          message: data.blockReason ?? 'Trade blocked by risk guardrails.',
        });
      }
    } catch (error) {
      setTradeStatus({
        type: 'warning',
        message: error instanceof Error ? error.message : 'Trade execution failed.',
      });
    } finally {
      setExecuting(false);
    }
  }, [addTrade, marketData.symbol, result]);

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <header className="rounded-2xl border border-slate-700 bg-slatepanel p-6">
        <h1 className="text-3xl font-semibold tracking-tight text-white">QuantTrader</h1>
        <p className="mt-2 text-slate-300">Trade with the mind of a quant.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-700 bg-slatepanel p-6">
          <h2 className="mb-4 text-xl font-medium text-white">The Math</h2>
          <div className="grid gap-4">
            <label className="text-sm text-slate-300">
              Symbol
              <input
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                value={marketData.symbol}
                onChange={(e) => setMarketData((prev) => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
              />
            </label>
            <label className="text-sm text-slate-300">
              Current Price
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                value={marketData.price}
                onChange={(e) => setMarketData((prev) => ({ ...prev, price: Number(e.target.value) }))}
              />
            </label>
            <label className="text-sm text-slate-300">
              20-Day MA
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                value={marketData.ma20}
                onChange={(e) => setMarketData((prev) => ({ ...prev, ma20: Number(e.target.value) }))}
              />
            </label>
            <label className="text-sm text-slate-300">
              RSI ({marketData.rsi})
              <input
                type="range"
                min={0}
                max={100}
                value={marketData.rsi}
                onChange={(e) => setMarketData((prev) => ({ ...prev, rsi: Number(e.target.value) }))}
                className="mt-2 w-full"
              />
            </label>
            <label className="text-sm text-slate-300">
              Volatility ({marketData.volatility}%)
              <input
                type="range"
                min={0}
                max={100}
                value={marketData.volatility}
                onChange={(e) => setMarketData((prev) => ({ ...prev, volatility: Number(e.target.value) }))}
                className="mt-2 w-full"
              />
            </label>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-2 rounded-xl bg-cyan-400 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Analyze Market Logic
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slatepanel p-6">
          <p className="text-sm uppercase tracking-wide text-cyan-300">Quant's Reasoning</p>
          {loading ? (
            <div className="mt-6 animate-pulse space-y-3">
              <div className="h-8 w-24 rounded bg-slate-700" />
              <div className="h-20 rounded-xl bg-slate-800" />
            </div>
          ) : (
            <>
              <div className="mt-6">
                <span className={`rounded-full border px-3 py-1 text-sm ${signalClasses(result?.signal)}`}>
                  {result?.signal ?? 'NO_SIGNAL'}
                </span>
              </div>
              <div className="mt-4 rounded-xl border border-slate-700 bg-slate-800/80 p-4">
                <p className="text-sm leading-relaxed text-slate-200">
                  {loading
                    ? streamExplanation || 'Analyzing signal and generating mentor explanation...'
                    : result?.mentorExplanation ??
                    'Run an analysis to see beginner-friendly quant reasoning generated from deterministic signals.'}
                </p>
              </div>
              {result && (result.signal === 'BUY' || result.signal === 'SELL') ? (
                <button
                  onClick={handleExecuteTrade}
                  disabled={executing}
                  className="mt-4 w-full rounded-xl bg-violet-400 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {executing ? 'Executing Paper Trade...' : 'Execute Paper Trade'}
                </button>
              ) : null}
              {tradeStatus ? (
                <div
                  className={`mt-4 rounded-xl border p-3 text-sm ${
                    tradeStatus.type === 'success'
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-200'
                  }`}
                >
                  {tradeStatus.message}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
