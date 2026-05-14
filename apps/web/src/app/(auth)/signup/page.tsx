"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { useSignup } from "../../../lib/auth-queries";
import { ApiClientError } from "../../../lib/api-client";

export default function SignupPage() {
  const router = useRouter();
  const signup = useSignup();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signup.mutateAsync({ name, email, password });
      // Small delay to ensure session is set
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch {
      // Error state is surfaced via the mutation status.
    }
  };

  const errorMessage =
    signup.error instanceof ApiClientError
      ? signup.error.message
      : "Signup failed. Try a different email.";

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your learner profile</CardTitle>
          <CardDescription>Start your Azure AI-103 certification journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <label className="grid gap-2 text-sm font-medium">
              Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 text-sm text-[var(--text-strong)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                placeholder="Your full name"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 text-sm text-[var(--text-strong)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 text-sm text-[var(--text-strong)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                placeholder="Create a password"
                required
                minLength={8}
              />
            </label>
            <Button type="submit" className="w-full" disabled={signup.isPending}>
              {signup.isPending ? "Creating account..." : "Sign up"}
            </Button>
            {signup.isError && <p className="text-sm text-red-600">{errorMessage}</p>}
          </form>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link className="text-[var(--accent)] hover:underline" href="/login">
              Sign in instead
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
