import { NextResponse } from 'next/server';
import { krakenClient } from '@/lib/kraken-client';
import type { ExecuteTradeRequest, ExecuteTradeResponse } from '@/lib/types';

const ACCOUNT_SIZE_USD = 10_000;
const MAX_RISK_FRACTION = 0.02;

let consecutiveLosses = 0;
const attemptedTrades: Array<{ at: string; request: ExecuteTradeRequest; approved: boolean; blockReason?: string }> = [];

function validateTradePayload(body: Partial<ExecuteTradeRequest>): body is ExecuteTradeRequest {
  return Boolean(
    body.symbol &&
      typeof body.symbol === 'string' &&
      (body.action === 'BUY' || body.action === 'SELL') &&
      typeof body.amount === 'number' &&
      body.amount > 0,
  );
}

/**
 * Executes paper trades under educational risk controls.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as Partial<ExecuteTradeRequest>;

    if (!validateTradePayload(body)) {
      return NextResponse.json({ success: false, blockReason: 'Invalid trade request payload.' }, { status: 400 });
    }

    if (body.amount > ACCOUNT_SIZE_USD * MAX_RISK_FRACTION) {
      const response: ExecuteTradeResponse = {
        success: false,
        blockReason: 'Institutional guardrail triggered: Never risk more than 2% on a single trade.',
      };
      attemptedTrades.push({ at: new Date().toISOString(), request: body, approved: false, blockReason: response.blockReason });
      return NextResponse.json(response, { status: 403 });
    }

    if (consecutiveLosses >= 3) {
      const response: ExecuteTradeResponse = {
        success: false,
        blockReason: 'Institutional guardrail triggered: Max 3 consecutive losses reached.',
      };
      attemptedTrades.push({ at: new Date().toISOString(), request: body, approved: false, blockReason: response.blockReason });
      return NextResponse.json(response, { status: 403 });
    }

    const trade = await krakenClient.executeTrade(body.symbol, body.action, body.amount);
    attemptedTrades.push({ at: new Date().toISOString(), request: body, approved: true });

    if (trade.status !== 'filled') {
      consecutiveLosses += 1;
    } else {
      consecutiveLosses = 0;
    }

    const successResponse: ExecuteTradeResponse = {
      success: trade.status === 'filled',
      orderId: trade.orderId,
      filledPrice: trade.filledPrice,
    };

    return NextResponse.json(successResponse);
  } catch (error) {
    return NextResponse.json(
      { success: false, blockReason: `Trade execution failed: ${(error as Error).message}` },
      { status: 500 },
    );
  }
}
