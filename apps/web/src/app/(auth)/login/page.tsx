"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { useLogin } from "../../../lib/auth-queries";
import { ApiClientError } from "../../../lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login.mutateAsync({ email, password });
      router.push("/dashboard");
    } catch {
      // Error state is surfaced via the mutation status.
    }
  };

  const errorMessage =
    login.error instanceof ApiClientError
      ? login.error.message
      : "Login failed. Check your credentials.";

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to continue your AI-103 practice.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
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
                placeholder="Enter your password"
                required
              />
            </label>
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "Signing in..." : "Sign in"}
            </Button>
            {login.isError && <p className="text-sm text-red-600">{errorMessage}</p>}
          </form>
          <p className="mt-4 text-sm text-[var(--muted)]">
            New here?{" "}
            <Link className="text-[var(--accent)] hover:underline" href="/signup">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
