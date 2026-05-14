"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useStartAttempt } from "../../../lib/attempt-mutations";
import { storeAttempt } from "../../../lib/storage";
import { useAttemptStore } from "../../../stores/attempt-store";
import RouteGuard from "../../../components/route-guard";

function AttemptStartContent() {
  const router = useRouter();
  const params = useSearchParams();
  const examId = params.get("examId");
  const startAttempt = useStartAttempt();
  const hydrate = useAttemptStore((state) => state.hydrateAttempt);

  useEffect(() => {
    if (!examId) {
      router.push("/exams");
      return;
    }

    const begin = async () => {
      try {
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
      } catch (error) {
        console.error("Failed to start attempt:", error);
        // Redirect back to exam page on error
        router.push(`/exams/${examId}`);
      }
    };

    begin();
  }, [examId, hydrate, router, startAttempt]);

  if (startAttempt.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-sm text-red-600 mb-4">Failed to start attempt. Please try again.</p>
          <button
            onClick={() => router.push("/exams")}
            className="text-sm text-[var(--accent)] hover:underline"
          >
            Back to exams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-sm text-[var(--muted)]">Starting your attempt...</div>
    </div>
  );
}

export default function AttemptStartPage() {
  return (
    <RouteGuard>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-sm text-[var(--muted)]">Loading...</div>
        </div>
      }>
        <AttemptStartContent />
      </Suspense>
    </RouteGuard>
  );
}
