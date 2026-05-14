"use client";

import { useRouter } from "next/navigation";

import RouteGuard from "../../components/route-guard";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { useSession } from "../../lib/auth-queries";

export default function DashboardPage() {
  const router = useRouter();
  const { data } = useSession();

  return (
    <RouteGuard>
      <div className="min-h-screen px-6 py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <header>
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">
              Your Practice Hub
            </p>
            <h1 className="mt-2 text-4xl font-bold">Welcome back! 👋</h1>
            <p className="mt-2 text-lg text-[var(--muted)]">{data?.email}</p>
          </header>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-2 border-[var(--accent)] bg-gradient-to-br from-[var(--surface)] to-[var(--page-bg)]">
              <CardHeader>
                <div className="mb-2 text-4xl">🎯</div>
                <CardTitle>Start Practicing</CardTitle>
                <CardDescription>
                  Choose from multiple practice exams tailored to different AI-103 topics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/exams")} className="w-full">
                  Browse Exams
                </Button>
              </CardContent>
            </Card>

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
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardHeader>
              <CardTitle>About Azure AI-103 Certification</CardTitle>
              <CardDescription>
                Microsoft Certified: Azure AI Apps and Agents Developer Associate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[var(--muted)]">
                This certification validates your ability to design, build, and deploy AI solutions using Azure AI services. You'll demonstrate skills in:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg bg-white/50 p-3 dark:bg-black/20">
                  <span className="text-xl">🤖</span>
                  <div>
                    <div className="font-medium">Generative AI Solutions</div>
                    <div className="text-xs text-[var(--muted)]">Azure OpenAI, prompt engineering, RAG</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-white/50 p-3 dark:bg-black/20">
                  <span className="text-xl">👁️</span>
                  <div>
                    <div className="font-medium">Computer Vision</div>
                    <div className="text-xs text-[var(--muted)]">Image analysis, OCR, Custom Vision</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-white/50 p-3 dark:bg-black/20">
                  <span className="text-xl">💬</span>
                  <div>
                    <div className="font-medium">Natural Language Processing</div>
                    <div className="text-xs text-[var(--muted)]">Text analysis, translation, sentiment</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-white/50 p-3 dark:bg-black/20">
                  <span className="text-xl">📄</span>
                  <div>
                    <div className="font-medium">Document Intelligence</div>
                    <div className="text-xs text-[var(--muted)]">Form processing, data extraction</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button onClick={() => router.push("/exams")}>
                  Start Your First Practice Exam
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open("https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-103/", "_blank")}
                >
                  View Exam Details
                </Button>
              </div>
            </CardContent>
          </Card>

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
