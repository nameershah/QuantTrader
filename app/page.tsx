import Link from 'next/link';

const features = [
  {
    title: 'Deterministic Logic',
    description: 'Signal generation remains rule-based so learners see stable, repeatable outcomes.',
  },
  {
    title: 'Explainable AI',
    description: 'Groq translates quant indicators into plain English to teach the why behind each signal.',
  },
  {
    title: 'Institutional Guardrails',
    description: 'Risk checks enforce disciplined sizing and loss controls before every paper trade.',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slatebg via-slate-900 to-slatebg">
      <section className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
          Explainable AI Trading Mentor
        </p>
        <h1 className="gradient-text text-4xl font-semibold tracking-tight md:text-6xl">
          Math over emotion. Trade with the mind of a quant.
        </h1>
        <p className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg">
          The Explainable AI (XAI) market simulator that teaches you the why behind the buy.
        </p>
        <Link
          href="/dashboard"
          className="mt-10 rounded-xl bg-cyan-400 px-8 py-3 text-base font-medium text-slate-950 transition hover:bg-cyan-300"
        >
          Enter Simulator
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-slate-700 bg-slatepanel/80 p-6 shadow-neon">
              <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
              <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
          {['Vercel', 'Groq', 'Next.js'].map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-1 text-violet-200"
            >
              {badge}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
