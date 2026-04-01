import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { analyzeSignal } from '@/lib/market-analyzer';
import type { MentorAnalysisResult } from '@/lib/types';
import { MarketDataSchema } from '@/lib/validations';

/**
 * POST market metrics and receive deterministic signal + streamed mentor explanation.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const parsed = MarketDataSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid market data provided.' }, { status: 400 });
    }

    const validatedData = parsed.data;
    const signalResult = analyzeSignal(validatedData);

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      const fallback: MentorAnalysisResult = {
        ...signalResult,
        mentorExplanation:
          'Using deterministic logic only because GROQ_API_KEY is missing. Practice by validating MA, RSI, and volatility alignment before acting.',
        llmUsed: false,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(fallback);
    }

    const groq = createGroq({ apiKey: groqApiKey });
    const prompt = `You are a Quant Mentor. The system flagged a ${signalResult.signal} because ${signalResult.rulesApplied.join(
      '; ',
    )}. Market data: ${JSON.stringify(validatedData)}. Explain to a beginner WHY these indicators suggest this action. Keep it under 3 sentences.`;

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
    });

    const timestamp = new Date().toISOString();
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let mentorExplanation = '';
        const timeout = setTimeout(() => {
          controller.enqueue(
            encoder.encode(
              `${JSON.stringify({
                type: 'error',
                message: 'Groq request timed out after 2 seconds',
              })}\n`,
            ),
          );
          controller.close();
        }, 2000);

        try {
          controller.enqueue(
            encoder.encode(
              `${JSON.stringify({
                type: 'meta',
                signal: signalResult.signal,
                confidence: signalResult.confidence,
                rulesApplied: signalResult.rulesApplied,
                timestamp,
              })}\n`,
            ),
          );

          for await (const chunk of result.textStream) {
            mentorExplanation += chunk;
            controller.enqueue(encoder.encode(`${JSON.stringify({ type: 'token', token: chunk })}\n`));
          }

          clearTimeout(timeout);
          const payload: MentorAnalysisResult = {
            ...signalResult,
            mentorExplanation: mentorExplanation.trim() || 'No mentor explanation generated.',
            llmUsed: true,
            timestamp,
          };
          controller.enqueue(encoder.encode(`${JSON.stringify({ type: 'done', payload })}\n`));
          controller.close();
        } catch (streamError) {
          clearTimeout(timeout);
          controller.enqueue(
            encoder.encode(
              `${JSON.stringify({
                type: 'error',
                message: streamError instanceof Error ? streamError.message : 'Streaming failure',
              })}\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.log('analyze-market route error:', error);
    return NextResponse.json({ error: 'Market analysis failed. Please try again.' }, { status: 500 });
  }
}
