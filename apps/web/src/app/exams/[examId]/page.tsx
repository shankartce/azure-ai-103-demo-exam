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
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Button variant="ghost" className="w-fit" onClick={() => router.push("/exams")}>
          Back to exams
        </Button>

        {isLoading && <p className="text-sm text-[var(--muted)]">Loading exam...</p>}
        {isError && <p className="text-sm text-red-600">Unable to load exam.</p>}

        {exam && (
          <Card>
            <CardHeader>
              <CardTitle>{exam.title}</CardTitle>
              <CardDescription>{exam.description ?? "Timed practice exam"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                <span>{Math.round(exam.durationSeconds / 60)} minute timer</span>
                <span>{exam.questionCount} questions</span>
              </div>
              <Button onClick={() => router.push(`/attempts/start?examId=${exam.id}`)}>
                Begin attempt
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
