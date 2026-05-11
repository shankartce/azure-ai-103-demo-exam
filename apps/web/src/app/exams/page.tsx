"use client";

import { useRouter } from "next/navigation";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { useExams } from "../../lib/exam-queries";

export default function ExamsPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useExams();

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">
              Assessments
            </p>
            <h1 className="text-3xl font-semibold">Choose an exam</h1>
          </div>
          <Button variant="secondary" onClick={() => router.push("/dashboard")}>
            Back to dashboard
          </Button>
        </header>

        {isLoading && <p className="text-sm text-[var(--muted)]">Loading exams...</p>}
        {isError && <p className="text-sm text-red-600">Unable to load exams.</p>}

        <div className="grid gap-6 md:grid-cols-2">
          {data?.items.map((exam) => (
            <Card key={exam.id} className="flex h-full flex-col">
              <CardHeader>
                <CardTitle>{exam.title}</CardTitle>
                <CardDescription>{exam.description ?? "Timed practice exam"}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex flex-col gap-4">
                <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                  <span>{Math.round(exam.durationSeconds / 60)} min</span>
                  <span>{exam.questionCount} questions</span>
                </div>
                <Button onClick={() => router.push(`/exams/${exam.id}`)}>Start</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
