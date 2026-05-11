import { useMutation } from "@tanstack/react-query";

import { apiJson, apiRequest } from "./api-client";

export type StartAttemptResponse = {
  attempt: {
    id: string;
    examId: string;
    status: string;
    startedAt: string;
    expiresAt: string;
  };
};

type AutosavePayload = {
  questionId: string;
  selectedOptionId: string | null;
  markedForReview: boolean;
};

export function useStartAttempt() {
  return useMutation({
    mutationFn: (examId: string) => apiJson<StartAttemptResponse>("/attempts/start", { examId }),
  });
}

export function useAutosave(attemptId: string) {
  return useMutation({
    mutationFn: (responses: AutosavePayload[]) =>
      apiRequest<{ attemptId: string }>(`/attempts/${attemptId}/responses`, {
        method: "PATCH",
        body: JSON.stringify({ responses }),
        headers: { "Content-Type": "application/json" },
      }),
  });
}

export function useSubmitAttempt(attemptId: string) {
  return useMutation({
    mutationFn: () => apiRequest<{ attemptId: string; status: string }>(`/attempts/${attemptId}/submit`, { method: "POST" }),
  });
}
