"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useStartAttempt } from "../../../lib/attempt-mutations";
import { storeAttempt } from "../../../lib/storage";
import { useAttemptStore } from "../../../stores/attempt-store";

function AttemptStartContent() {
  const router = useRouter();
  const params = useSearchParams();
  const examId = params.get("examId");
  const startAttempt = useStartAttempt();
  const hydrate = useAttemptStore((state) => state.hydrateAttempt);

  useEffect(() => {
    if (!examId) {
      return;
    }

    const begin = async () => {
      const response = await startAttempt.mutateAsync(examId);
      const attempt = response.attempt;

      hydrate({
        attemptId: attempt.id,
        examId: attempt.examId,
        startedAt: attempt.startedAt,
        expiresAt: attempt.expiresAt,
        responses: {},
        currentQuestionId: null,
      });

      storeAttempt({
        attemptId: attempt.id,
        examId: attempt.examId,
        startedAt: attempt.startedAt,
        expiresAt: attempt.expiresAt,
        responses: {},
        currentQuestionId: null,
      });

      router.replace(`/attempts/${attempt.id}`);
    };

    begin();
  }, [examId, hydrate, router, startAttempt]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-sm text-[var(--muted)]">Starting your attempt...</div>
    </div>
  );
}

export default function AttemptStartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-sm text-[var(--muted)]">Loading...</div>
      </div>
    }>
      <AttemptStartContent />
    </Suspense>
  );
}
