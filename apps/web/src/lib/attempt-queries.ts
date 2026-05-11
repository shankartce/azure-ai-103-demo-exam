import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "./api-client";

export type ExamQuestion = {
  id: string;
  examId: string;
  position: number;
  prompt: string;
  topics: string[];
  options: Array<{ id: string; position: number; text: string }>;
};

type ExamQuestionsResponse = {
  items: ExamQuestion[];
};

export type AttemptResultItem = {
  questionId: string;
  isCorrect: boolean;
  selectedOptionId: string | null;
  correctOptionId: string;
  topics: string[];
};

type AttemptResult = {
  attemptId: string;
  scorePercent: number;
  status: string;
  items: AttemptResultItem[];
  weakTopics: Array<{ topic: string; incorrectCount: number; questionCount: number }>;
};

type AttemptResultResponse = {
  result: AttemptResult;
};

export function useExamQuestions(examId: string | null) {
  return useQuery({
    queryKey: ["exam-questions", examId],
    queryFn: () => apiRequest<ExamQuestionsResponse>(`/exams/${examId}/questions`),
    enabled: Boolean(examId),
  });
}

export function useAttemptResult(attemptId: string) {
  return useQuery({
    queryKey: ["attempt-result", attemptId],
    queryFn: () => apiRequest<AttemptResultResponse>(`/attempts/${attemptId}/result`),
    enabled: Boolean(attemptId),
  });
}
