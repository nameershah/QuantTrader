import { streamText } from 'ai';
import type { MarketDataInput, MentorAnalysisResult, RuleSignalResult } from '@/lib/types';

/**
 * Calculates a moving average over the latest number of days.
 */
export function calculateMA(prices: number[], days: number): number {
  if (!prices.length || days <= 0) return 0;
  const sample = prices.slice(-days);
  return sample.reduce((sum, n) => sum + n, 0) / sample.length;
}

/**
 * Calculates RSI using a simple average gain/loss approach.
 */
export function calculateRSI(prices: number[]): number {
  if (prices.length < 2) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i < prices.length; i += 1) {
    const delta = prices[i] - prices[i - 1];
    if (delta > 0) gains += delta;
    if (delta < 0) losses += Math.abs(delta);
  }

  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - 100 / (1 + rs);
}

/**
 * Estimates volatility as the percentage standard deviation.
 */
export function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((sum, value) => sum + (value - mean) ** 2, 0) / prices.length;
  const stdDev = Math.sqrt(variance);
  return mean === 0 ? 0 : (stdDev / mean) * 100;
}

/**
 * Runs deterministic rule-based signal detection.
 */
export function analyzeSignal(marketData: MarketDataInput): RuleSignalResult {
  const rulesApplied: string[] = [];
  const ma20 = marketData.ma20 ?? marketData.price;
  const rsi = marketData.rsi ?? 50;
  const volatility = marketData.volatility;

  if (volatility < 15) {
    rulesApplied.push('Volatility below 15% means market is too quiet for reliable opportunities.');
    return { signal: 'NO_SIGNAL', confidence: 0.3, rulesApplied };
  }

  if (marketData.price > ma20 && rsi < 40) {
    rulesApplied.push('Price is above MA20 while RSI is below 40 (oversold in uptrend).');
    return { signal: 'BUY', confidence: 0.85, rulesApplied };
  }

  if (marketData.price < ma20 && rsi > 70) {
    rulesApplied.push('Price is below MA20 while RSI is above 70 (overbought in downtrend).');
    return { signal: 'SELL', confidence: 0.8, rulesApplied };
  }

  if (volatility > 40) {
    rulesApplied.push('Volatility above 40% with no clear trend favors waiting.');
    return { signal: 'HOLD', confidence: 0.6, rulesApplied };
  }

  rulesApplied.push('No deterministic edge found from MA20, RSI, and volatility alignment.');
  return { signal: 'HOLD', confidence: 0.5, rulesApplied };
}

/**
 * Uses an LLM mentor layer to explain deterministic signals for education.
 */
export async function analyzeWithLLMMentor(
  marketData: MarketDataInput,
  ruleSignal: RuleSignalResult,
  groqModel: unknown,
): Promise<Omit<MentorAnalysisResult, 'timestamp'>> {
  let instruction = '';

  if (ruleSignal.confidence > 0.85) {
    instruction =
      'Explain why RSI and MA setup indicates a high-probability trade. Keep max 3 sentences.';
  } else if (ruleSignal.confidence > 0.5) {
    instruction =
      'Explain the risks in this moderate-confidence setup and why caution matters. Keep max 2 sentences.';
  } else {
    instruction =
      'Explain why professionals avoid low-confidence noisy markets. Keep max 2 sentences.';
  }

  const fallback =
    'Signal generated from deterministic quant rules. Treat this as practice context and wait for stronger confluence when confidence is limited.';

  const content = `Signal: ${ruleSignal.signal}. Rules: ${ruleSignal.rulesApplied.join(' ')}. Data: ${JSON.stringify(
    marketData,
  )}. ${instruction}`;

  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('LLM timeout')), 2000);
    });

    const generationPromise = (async () => {
      const result = streamText({
        model: groqModel as Parameters<typeof streamText>[0]['model'],
        system: 'You are a beginner-friendly quant mentor. Keep explanations concise and educational.',
        prompt: content,
      });

      let explanation = '';
      for await (const part of result.textStream) {
        explanation += part;
      }
      return explanation.trim();
    })();

    const mentorExplanation = await Promise.race([generationPromise, timeoutPromise]);

    return {
      ...ruleSignal,
      mentorExplanation: mentorExplanation || fallback,
      llmUsed: Boolean(mentorExplanation),
    };
  } catch {
    return {
      ...ruleSignal,
      mentorExplanation: fallback,
      llmUsed: false,
    };
  }
}
