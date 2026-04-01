import type { Trade } from '@/lib/types';

interface TradeLogProps {
  trades: Trade[];
}

function signalBadge(signal: Trade['signal']): string {
  if (signal === 'BUY') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  if (signal === 'SELL') return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  if (signal === 'HOLD') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
}

function summarize(reason: string): string {
  return reason.length > 64 ? `${reason.slice(0, 61)}...` : reason;
}

export default function TradeLog({ trades }: TradeLogProps) {
  if (trades.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slatepanel p-6 text-sm text-slate-400">
        No simulations run. Input market data to learn.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slatepanel">
      <table className="w-full table-auto text-left text-sm">
        <thead className="bg-slate-800/80 text-slate-300">
          <tr>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3">Signal</th>
            <th className="px-4 py-3">XAI Reasoning Summary</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade.id} className="border-t border-slate-800 hover:bg-slate-800/40">
              <td className="px-4 py-3 text-slate-300">
                {new Date(trade.timestamp).toLocaleTimeString('en-US', { hour12: false })}
              </td>
              <td className="px-4 py-3 text-slate-200">{trade.symbol}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full border px-2 py-1 text-xs ${signalBadge(trade.signal)}`}>
                  {trade.signal}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-300">{summarize(trade.mentorExplanation)}</td>
              <td className="px-4 py-3 text-slate-300">{trade.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
