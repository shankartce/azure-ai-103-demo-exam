import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "./api-client";

export type ExamSummary = {
  id: string;
  title: string;
  description?: string | null;
  durationSeconds: number;
  questionCount: number;
};

type ExamsResponse = {
  items: ExamSummary[];
  nextCursor: string | null;
};

export type ExamDetail = ExamSummary;

type ExamDetailResponse = {
  exam: ExamDetail;
};

export function useExams() {
  return useQuery({
    queryKey: ["exams"],
    queryFn: () => apiRequest<ExamsResponse>("/exams"),
  });
}

export function useExam(examId: string) {
  return useQuery({
    queryKey: ["exams", examId],
    queryFn: () => apiRequest<ExamDetailResponse>(`/exams/${examId}`),
    enabled: Boolean(examId),
  });
}
