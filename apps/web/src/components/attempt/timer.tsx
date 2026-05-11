"use client";

import { useEffect, useMemo, useState } from "react";

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function Timer({ expiresAt, onExpire }: { expiresAt: string; onExpire?: () => void }) {
  const expiresAtMs = useMemo(() => new Date(expiresAt).getTime(), [expiresAt]);
  const [remaining, setRemaining] = useState(() => {
    const diff = Math.max(0, expiresAtMs - Date.now());
    return Math.floor(diff / 1000);
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      const diff = Math.max(0, expiresAtMs - Date.now());
      const next = Math.floor(diff / 1000);
      setRemaining(next);
      if (next <= 0) {
        window.clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [expiresAtMs, onExpire]);

  return (
    <div className="rounded-full border border-[var(--surface-strong)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold">
      {remaining > 0 ? `${formatDuration(remaining)} remaining` : "Time is up"}
    </div>
  );
}
