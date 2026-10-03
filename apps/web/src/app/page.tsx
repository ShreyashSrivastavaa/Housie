import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface px-4 py-1.5 text-xs font-medium text-brand-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-green opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-green"></span>
          </span>
          Phase 0 Complete: Monorepo & Core Engine Initialized
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
          Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-purple-400 to-gold-400">Housie / Tambola</span> Game Control
        </h1>

        <p className="text-lg text-slate-400 leading-relaxed">
          High-performance game-control platform for live physical-ticket events. Realtime randomized number calling, projector display synchronization, and immutable audit logs.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-brand-500 hover:shadow-brand-500/25 active:scale-95"
          >
            Host Portal
          </Link>
          <Link
            href="/signup"
            className="rounded-xl border border-surface-border bg-surface px-6 py-3 font-semibold text-slate-200 transition-all hover:bg-surface-subtle hover:border-slate-600 active:scale-95"
          >
            Create Host Account
          </Link>
        </div>
      </div>
    </main>
  );
}
