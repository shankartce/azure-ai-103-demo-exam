import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
              Azure AI Practice
            </p>
            <h1 className="text-3xl font-semibold">Prep like it is exam day.</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-[var(--page-fg)] hover:bg-[var(--surface-strong)]"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-[var(--shadow)] hover:bg-[var(--accent-strong)]"
            >
              Sign up
            </Link>
          </div>
        </header>

        <main className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <h2 className="text-5xl font-semibold leading-tight">
              Master Azure AI with timed, high-signal assessments.
            </h2>
            <p className="text-lg text-[var(--muted)]">
              Practice against realistic exam pacing, get deterministic scoring, and
              review every question with clear insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-7 py-3 text-base font-semibold text-white shadow-[var(--shadow)] hover:bg-[var(--accent-strong)]"
              >
                Get started
              </Link>
              <Link
                href="/exams"
                className="inline-flex items-center justify-center rounded-full border border-[var(--surface-strong)] px-7 py-3 text-base font-semibold text-[var(--page-fg)] hover:bg-[var(--surface)]"
              >
                Browse exams
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-[var(--surface-strong)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">
              What you get
            </p>
            <ul className="mt-4 space-y-4 text-sm">
              <li>Timed exam runner with autosave and review flags.</li>
              <li>Deterministic scoring with per-question breakdowns.</li>
              <li>AI-assisted explanations (coming next phase).</li>
              <li>Analytics that spotlight weak topics.</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
