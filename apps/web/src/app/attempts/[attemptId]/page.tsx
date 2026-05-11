"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useAutosave, useSubmitAttempt } from "../../../lib/attempt-mutations";
import { useExamQuestions } from "../../../lib/attempt-queries";
import { clearAttempt, loadAttempt, storeAttempt } from "../../../lib/storage";
import { useAttemptStore } from "../../../stores/attempt-store";
import QuestionCard from "../../../components/attempt/question-card";
import OptionList from "../../../components/attempt/option-list";
import QuestionPalette from "../../../components/attempt/question-palette";
import ProgressBar from "../../../components/attempt/progress-bar";
import MarkForReview from "../../../components/attempt/mark-for-review";
import SubmitModal from "../../../components/attempt/submit-modal";
import Timer from "../../../components/attempt/timer";
import { Button } from "../../../components/ui/button";

type Props = {
  params: {
    attemptId: string;
  };
};

export default function AttemptRunnerPage({ params }: Props) {
  const router = useRouter();
  const attemptId = params.attemptId;
  const {
    attemptId: storedAttemptId,
    examId,
    startedAt,
    expiresAt,
    currentQuestionId,
    responses,
    setCurrentQuestion,
    updateResponse,
    toggleReview,
    hydrateAttempt,
  } = useAttemptStore();

  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const autosave = useAutosave(attemptId);
  const submit = useSubmitAttempt(attemptId);
  const autosaveTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (storedAttemptId === attemptId && examId) {
      return;
    }


    const stored = loadAttempt(attemptId);
    if (stored) {
      hydrateAttempt(stored);
    }
  }, [attemptId, examId, hydrateAttempt, storedAttemptId]);

  const { data, isLoading, isError } = useExamQuestions(examId);
  const questions = data?.items ?? [];

  useEffect(() => {
    if (!currentQuestionId && questions.length > 0) {
      setCurrentQuestion(questions[0].id);
    }
  }, [currentQuestionId, questions, setCurrentQuestion]);

  useEffect(() => {
    if (!examId || !expiresAt) {
      return;
    }

    storeAttempt({
      attemptId,
      examId,
      startedAt: startedAt ?? new Date().toISOString(),
      expiresAt,
      responses,
      currentQuestionId,
    });
  }, [attemptId, examId, expiresAt, responses, currentQuestionId, startedAt]);

  const activeQuestion = questions.find((question) => question.id === currentQuestionId);

  const autosavePayload = useMemo(
    () =>
      Object.entries(responses).map(([questionId, response]) => ({
        questionId,
        selectedOptionId: response.selectedOptionId,
        markedForReview: response.markedForReview,
      })),
    [responses]
  );

  useEffect(() => {
    if (!autosavePayload.length) {
      return;
    }

    if (autosaveTimeout.current) {
      window.clearTimeout(autosaveTimeout.current);
    }

    autosaveTimeout.current = window.setTimeout(() => {
      autosave.mutate(autosavePayload);
    }, 600);

    return () => {
      if (autosaveTimeout.current) {
        window.clearTimeout(autosaveTimeout.current);
      }
    };
  }, [autosave, autosavePayload]);

  const handleSubmit = async () => {
    await submit.mutateAsync();
    clearAttempt(attemptId);
    router.push(`/attempts/${attemptId}/result`);
  };

  if (!examId || !expiresAt) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-sm text-[var(--muted)]">Loading attempt...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-soft)]">Live attempt</p>
            <h1 className="text-2xl font-semibold">Stay focused and finish strong.</h1>
          </div>
          <Timer expiresAt={expiresAt} onExpire={() => setIsSubmitOpen(true)} />
        </header>

        {isLoading && <p className="text-sm text-[var(--muted)]">Loading questions...</p>}
        {isError && <p className="text-sm text-red-600">Unable to load questions.</p>}

        {activeQuestion && (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <QuestionCard
                index={activeQuestion.position}
                prompt={activeQuestion.prompt}
              />
              <OptionList
                options={activeQuestion.options}
                selectedOptionId={responses[activeQuestion.id]?.selectedOptionId ?? null}
                onSelect={(optionId) => updateResponse(activeQuestion.id, optionId)}
              />
              <div className="flex flex-wrap items-center gap-3">
                <MarkForReview
                  isMarked={responses[activeQuestion.id]?.markedForReview ?? false}
                  onToggle={() => toggleReview(activeQuestion.id)}
                />
                <Button variant="secondary" onClick={() => setIsSubmitOpen(true)}>
                  Submit attempt
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <ProgressBar
                completed={Object.values(responses).filter((response) => response.selectedOptionId).length}
                total={questions.length}
              />
              <QuestionPalette
                items={questions.map((question) => ({
                  id: question.id,
                  index: question.position,
                  isCurrent: question.id === currentQuestionId,
                  hasAnswer: Boolean(responses[question.id]?.selectedOptionId),
                  isMarked: responses[question.id]?.markedForReview ?? false,
                }))}
                onSelect={setCurrentQuestion}
              />
            </div>
          </div>
        )}
      </div>

      <SubmitModal
        open={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onConfirm={handleSubmit}
      />
    </div>
  );
}
