"use client";

import { useRouter } from "next/navigation";

import RouteGuard from "../../components/route-guard";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { useSession } from "../../lib/auth-queries";
import { useExams } from "../../lib/exam-queries";

export default function DashboardPage() {
  const router = useRouter();
  const { data: user } = useSession();
  const { data: examsData, isLoading: examsLoading } = useExams();

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
    <RouteGuard>
      <div className="min-h-screen px-6 py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          {/* Welcome Header */}
          <header className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-8 dark:from-blue-950/20 dark:to-purple-950/20">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">
              Welcome Back
            </p>
            <h1 className="mt-2 text-4xl font-bold">
              Hello, {user?.name || user?.email?.split('@')[0]}! 👋
            </h1>
            <p className="mt-2 text-lg text-[var(--muted)]">{user?.email}</p>
            <p className="mt-4 text-[var(--muted)]">
              Ready to practice for your Azure AI-103 certification? Choose an exam below to get started.
            </p>
          </header>

          {/* Available Exams Section */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Available Practice Exams</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Choose a practice exam to test your knowledge
                </p>
              </div>
              <Button variant="secondary" onClick={() => router.push("/exams")}>
                View All Exams
              </Button>
            </div>

            {examsLoading && (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-[var(--muted)]">Loading exams...</p>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {examsData?.items.slice(0, 4).map((exam) => (
                <Card key={exam.id} className="flex h-full flex-col transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex items-start justify-between">
                      <span className="text-4xl">{getExamIcon(exam.title)}</span>
                      <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--text-soft)]">
                        {getExamDifficulty(exam.title)}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
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
                      Start Exam →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-2 text-4xl">📊</div>
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  View your performance analytics and identify areas for improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" onClick={() => router.push("/analytics")} className="w-full">
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 text-4xl">📚</div>
                <CardTitle>Study Resources</CardTitle>
                <CardDescription>
                  Access official Microsoft documentation and learning paths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="secondary"
                  onClick={() => window.open("https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/", "_blank")}
                  className="w-full"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 text-4xl">🎯</div>
                <CardTitle>Exam Details</CardTitle>
                <CardDescription>
                  Review the official exam requirements and format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="secondary"
                  onClick={() => window.open("https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-103/", "_blank")}
                  className="w-full"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tips Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Tips for Success</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-[var(--muted)]">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">✓</span>
                    <span>Take practice exams under timed conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">✓</span>
                    <span>Review incorrect answers to understand concepts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">✓</span>
                    <span>Focus on hands-on experience with Azure AI services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">✓</span>
                    <span>Study official Microsoft Learn documentation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exam Format</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Duration:</span>
                    <span className="font-medium">100 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Questions:</span>
                    <span className="font-medium">40-60 questions</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Passing Score:</span>
                    <span className="font-medium">700 / 1000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Question Types:</span>
                    <span className="font-medium">Multiple choice, scenarios</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
