"use client";

import Link from "next/link";

import { useAttemptResult, useExamQuestions } from "../../../../lib/attempt-queries";
import { loadAttempt } from "../../../../lib/storage";
import QuestionBreakdown from "../../../../components/result/question-breakdown";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";

export default function AttemptResultPage({ params }: { params: { attemptId: string } }) {
  const { data, isLoading, isError } = useAttemptResult(params.attemptId);
  const stored = loadAttempt(params.attemptId);
  const { data: questionData } = useExamQuestions(stored?.examId ?? null);
  const questionMap = new Map(
    (questionData?.items ?? []).map((question) => [question.id, question])
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-sm text-[var(--muted)]">Loading results...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-sm text-red-600">Unable to load results.</p>
      </div>
    );
  }

  const result = data.result;

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Attempt summary</p>
            <h1 className="text-3xl font-semibold">Your score: {result.scorePercent}%</h1>
          </div>
          <Link
            href="/exams"
            className="inline-flex items-center justify-center rounded-full border border-[var(--surface-strong)] px-5 py-2 text-sm font-semibold text-[var(--page-fg)] hover:bg-[var(--surface)]"
          >
            Take another exam
          </Link>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Performance breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.items.map((item) => (
              <QuestionBreakdown
                key={item.questionId}
                item={{
                  questionId: item.questionId,
                  prompt: questionMap.get(item.questionId)?.prompt,
                  isCorrect: item.isCorrect,
                  selectedOptionId: item.selectedOptionId,
                  correctOptionId: item.correctOptionId,
                  topics: item.topics,
                }}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
