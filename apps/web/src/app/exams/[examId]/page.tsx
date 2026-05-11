"use client";

import { useRouter } from "next/navigation";

import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { useExam } from "../../../lib/exam-queries";

export default function ExamDetailPage({ params }: { params: { examId: string } }) {
  const router = useRouter();
  const { data, isLoading, isError } = useExam(params.examId);
  const exam = data?.exam;

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <Button variant="ghost" className="w-fit" onClick={() => router.push("/exams")}>
          Back to exams
        </Button>

        {isLoading && <p className="text-sm text-[var(--muted)]">Loading exam...</p>}
        {isError && <p className="text-sm text-red-600">Unable to load exam.</p>}

        {exam && (
          <>
            <Card>
              <CardHeader>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                  Certification practice
                </p>
                <CardTitle className="text-3xl">{exam.title}</CardTitle>
                <CardDescription>{exam.description ?? "Timed practice exam"}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                    <span>{Math.round(exam.durationSeconds / 60)} minute timer</span>
                    <span>{exam.questionCount} questions</span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">
                    This practice assessment mirrors the official exam flow, with autosave,
                    review flags, and deterministic scoring.
                  </p>
                  <Button onClick={() => router.push(`/attempts/start?examId=${exam.id}`)}>
                    Start the practice assessment
                  </Button>
                </div>
                <div className="rounded-3xl border border-[var(--surface-strong)] bg-[var(--surface)] p-4 text-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                    At a glance
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li>Role focus: AI engineer + developer</li>
                    <li>Scope: Foundry, Azure AI, generative + agentic apps</li>
                    <li>Difficulty: intermediate</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                    Exam sandbox
                  </p>
                  <CardTitle>Experience demo</CardTitle>
                  <CardDescription>
                    Try the official exam interface before the timed assessment.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-[var(--muted)]">
                    Interact with multiple question types in the same interface used on exam
                    day.
                  </p>
                  <a
                    href="https://go.microsoft.com/fwlink/?linkid=2226877"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-[var(--surface-strong)] px-5 py-2 text-sm font-semibold text-[var(--page-fg)] hover:bg-[var(--surface)]"
                  >
                    Launch the sandbox
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                    Take the exam
                  </p>
                  <CardTitle>Exam policy</CardTitle>
                  <CardDescription>Know the rules before your live attempt.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-[var(--muted)]">
                  <p>You will have 100 minutes to complete this assessment.</p>
                  <p>
                    This exam is proctored and may include interactive components. Review
                    the official exam duration and experience details before scheduling.
                  </p>
                  <p>
                    Retakes are available after 24 hours for the first retry, then follow
                    the official retake policy.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                  Assessed on this exam
                </p>
                <CardTitle>Core skill areas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-2">
                  <li>Plan and manage Azure AI solutions</li>
                  <li>Build generative AI and agentic solutions</li>
                  <li>Implement computer vision workflows</li>
                  <li>Implement text analysis solutions</li>
                  <li>Implement information extraction pipelines</li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
