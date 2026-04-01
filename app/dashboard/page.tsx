'use client';

import Dashboard from '@/components/Dashboard';
import TradeLog from '@/components/TradeLog';
import { useTrades } from '@/lib/trade-state';

export default function DashboardPage() {
  const { trades, addTrade } = useTrades();

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Dashboard trades={trades} addTrade={addTrade} />
        <section>
          <h3 className="mb-3 text-lg font-medium text-white">Simulation Log</h3>
          <TradeLog trades={trades} />
        </section>
      </div>
    </main>
  );
}
