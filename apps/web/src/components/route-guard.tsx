"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getSession } from "../lib/auth";

type RouteGuardProps = {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
};

export default function RouteGuard({
  children,
  redirectTo = "/login",
  fallback,
}: RouteGuardProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isActive = true;

    const checkSession = async () => {
      const user = await getSession();

      if (!isActive) {
        return;
      }

      if (!user) {
        router.replace(redirectTo);
        return;
      }

      setIsReady(true);
    };

    checkSession();

    return () => {
      isActive = false;
    };
  }, [redirectTo, router]);

  if (!isReady) {
    return (
      fallback ?? (
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--muted)]">
          Checking session...
        </div>
      )
    );
  }

  return <>{children}</>;
}
