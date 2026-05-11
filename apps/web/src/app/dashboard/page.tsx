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
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">
                Your practice hub
              </p>
              <h1 className="text-3xl font-semibold">Welcome, {data?.email ?? "learner"}</h1>
            </div>
            <Button onClick={() => router.push("/exams")}>Browse exams</Button>
          </header>
          <Card>
            <CardHeader>
              <CardTitle>Ready for another attempt?</CardTitle>
              <CardDescription>Pick a timed assessment and track your score trends.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => router.push("/exams")}>Start a new exam</Button>
                <Button variant="secondary" onClick={() => router.push("/analytics")}>
                  View analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RouteGuard>
  );
}
