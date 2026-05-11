const PREFIX = "azure-ai";

export type StoredAttempt = {
  attemptId: string;
  examId: string;
  startedAt: string;
  expiresAt: string;
  responses: Record<string, { selectedOptionId: string | null; markedForReview: boolean }>;
  currentQuestionId: string | null;
};

export function storeAttempt(data: StoredAttempt) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(`${PREFIX}:attempt:${data.attemptId}`, JSON.stringify(data));
}

export function loadAttempt(attemptId: string): StoredAttempt | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(`${PREFIX}:attempt:${attemptId}`);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as StoredAttempt;
  } catch {
    return null;
  }
}

export function clearAttempt(attemptId: string) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(`${PREFIX}:attempt:${attemptId}`);
}
