import { NextResponse } from 'next/server';
import { krakenClient } from '@/lib/kraken-client';
import type { ExecuteTradeRequest, ExecuteTradeResponse } from '@/lib/types';
import { TradeRequestSchema } from '@/lib/validations';

const ACCOUNT_SIZE_USD = 10_000;
const MAX_RISK_FRACTION = 0.02;

let consecutiveLosses = 0;
const attemptedTrades: Array<{ at: string; request: ExecuteTradeRequest; approved: boolean; blockReason?: string }> = [];

/**
 * Executes paper trades under educational risk controls.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const parsed = TradeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, blockReason: 'Invalid trade request payload.' }, { status: 400 });
    }
    const validatedRequest: ExecuteTradeRequest = parsed.data;

    if (validatedRequest.amount > ACCOUNT_SIZE_USD * MAX_RISK_FRACTION) {
      const response: ExecuteTradeResponse = {
        success: false,
        blockReason: 'Institutional guardrail triggered: Never risk more than 2% on a single trade.',
      };
      attemptedTrades.push({
        at: new Date().toISOString(),
        request: validatedRequest,
        approved: false,
        blockReason: response.blockReason,
      });
      return NextResponse.json(response, { status: 403 });
    }

    if (consecutiveLosses >= 3) {
      const response: ExecuteTradeResponse = {
        success: false,
        blockReason: 'Institutional guardrail triggered: Max 3 consecutive losses reached.',
      };
      attemptedTrades.push({
        at: new Date().toISOString(),
        request: validatedRequest,
        approved: false,
        blockReason: response.blockReason,
      });
      return NextResponse.json(response, { status: 403 });
    }

    const trade = await krakenClient.executeTrade(
      validatedRequest.symbol,
      validatedRequest.action,
      validatedRequest.amount,
    );
    attemptedTrades.push({ at: new Date().toISOString(), request: validatedRequest, approved: true });

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
    console.log('execute-trade route error:', error);
    return NextResponse.json(
      { success: false, blockReason: 'Trade execution failed due to an internal error.' },
      { status: 500 },
    );
  }
}
