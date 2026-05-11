export default function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
        <span>Progress</span>
        <span>{percent}%</span>
      </div>
      <div className="h-3 rounded-full bg-[var(--surface-strong)]">
        <div
          className="h-3 rounded-full bg-[var(--accent)] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
