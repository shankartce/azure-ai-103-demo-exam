"use client";

import { useRouter } from "next/navigation";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { useExams } from "../../lib/exam-queries";

export default function ExamsPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useExams();

  const getExamIcon = (title: string) => {
    if (title.includes("Fundamentals")) return "📚";
    if (title.includes("OpenAI")) return "🤖";
    if (title.includes("Vision") || title.includes("Document")) return "👁️";
    if (title.includes("Full")) return "🎯";
    return "📝";
  };

  const getExamDifficulty = (title: string) => {
    if (title.includes("Fundamentals")) return "Beginner";
    if (title.includes("Full")) return "Advanced";
    return "Intermediate";
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">
              Practice Assessments
            </p>
            <h1 className="text-3xl font-semibold">Azure AI-103 Exam Preparation</h1>
            <p className="mt-2 text-[var(--muted)]">
              Choose a practice exam to test your knowledge and prepare for certification
            </p>
          </div>
          <Button variant="secondary" onClick={() => router.push("/dashboard")}>
            Back to dashboard
          </Button>
        </header>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-[var(--muted)]">Loading exams...</p>
          </div>
        )}
        
        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-600">Unable to load exams. Please try again later.</p>
          </div>
        )}

        {data?.items && data.items.length === 0 && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
            <p className="text-[var(--muted)]">No exams available at the moment.</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {data?.items.map((exam) => (
            <Card key={exam.id} className="flex h-full flex-col transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex items-start justify-between">
                  <span className="text-4xl">{getExamIcon(exam.title)}</span>
                  <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--text-soft)]">
                    {getExamDifficulty(exam.title)}
                  </span>
                </div>
                <CardTitle className="text-xl">{exam.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {exam.description ?? "Timed practice exam"}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex flex-col gap-4">
                <div className="flex flex-wrap gap-4 rounded-lg bg-[var(--surface)] p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--muted)]">⏱️</span>
                    <span className="font-medium">{Math.round(exam.durationSeconds / 60)} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--muted)]">❓</span>
                    <span className="font-medium">{exam.questionCount} questions</span>
                  </div>
                </div>
                <Button onClick={() => router.push(`/exams/${exam.id}`)} className="w-full">
                  View Details →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="mb-3 text-lg font-semibold">About the AI-103 Certification</h2>
          <p className="mb-4 text-sm text-[var(--muted)]">
            The Microsoft Certified: Azure AI Apps and Agents Developer Associate certification validates your ability to design and implement Azure AI solutions, including generative AI applications, computer vision, natural language processing, and intelligent agents.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-[var(--page-bg)] p-4">
              <div className="mb-2 text-2xl">🎓</div>
              <div className="text-sm font-medium">Skill Level</div>
              <div className="text-xs text-[var(--muted)]">Intermediate</div>
            </div>
            <div className="rounded-lg bg-[var(--page-bg)] p-4">
              <div className="mb-2 text-2xl">⏰</div>
              <div className="text-sm font-medium">Exam Duration</div>
              <div className="text-xs text-[var(--muted)]">100 minutes</div>
            </div>
            <div className="rounded-lg bg-[var(--page-bg)] p-4">
              <div className="mb-2 text-2xl">✅</div>
              <div className="text-sm font-medium">Passing Score</div>
              <div className="text-xs text-[var(--muted)]">700 / 1000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
