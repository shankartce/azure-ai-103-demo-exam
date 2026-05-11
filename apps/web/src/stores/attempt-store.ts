import { create } from "zustand";

type AttemptResponseState = {
  selectedOptionId: string | null;
  markedForReview: boolean;
};

type AttemptState = {
  attemptId: string | null;
  examId: string | null;
  startedAt: string | null;
  expiresAt: string | null;
  currentQuestionId: string | null;
  responses: Record<string, AttemptResponseState>;
  setResponses: (responses: Record<string, AttemptResponseState>) => void;
  setAttempt: (data: {
    attemptId: string;
    examId: string;
    startedAt: string;
    expiresAt: string;
  }) => void;
  hydrateAttempt: (data: {
    attemptId: string;
    examId: string;
    startedAt: string;
    expiresAt: string;
    responses?: Record<string, AttemptResponseState>;
    currentQuestionId?: string | null;
  }) => void;
  setCurrentQuestion: (questionId: string) => void;
  updateResponse: (questionId: string, selectedOptionId: string | null) => void;
  toggleReview: (questionId: string) => void;
  resetAttempt: () => void;
};

export const useAttemptStore = create<AttemptState>((set) => ({
  attemptId: null,
  examId: null,
  startedAt: null,
  expiresAt: null,
  currentQuestionId: null,
  responses: {},
  setResponses: (responses) => set({ responses }),
  setAttempt: ({ attemptId, examId, startedAt, expiresAt }) =>
    set({ attemptId, examId, startedAt, expiresAt }),
  hydrateAttempt: ({
    attemptId,
    examId,
    startedAt,
    expiresAt,
    responses,
    currentQuestionId,
  }) =>
    set({
      attemptId,
      examId,
      startedAt,
      expiresAt,
      responses: responses ?? {},
      currentQuestionId: currentQuestionId ?? null,
    }),
  setCurrentQuestion: (questionId) => set({ currentQuestionId: questionId }),
  updateResponse: (questionId, selectedOptionId) =>
    set((state) => ({
      responses: {
        ...state.responses,
        [questionId]: {
          selectedOptionId,
          markedForReview: state.responses[questionId]?.markedForReview ?? false,
        },
      },
    })),
  toggleReview: (questionId) =>
    set((state) => ({
      responses: {
        ...state.responses,
        [questionId]: {
          selectedOptionId: state.responses[questionId]?.selectedOptionId ?? null,
          markedForReview: !state.responses[questionId]?.markedForReview,
        },
      },
    })),
  resetAttempt: () =>
    set({
      attemptId: null,
      examId: null,
      startedAt: null,
      expiresAt: null,
      currentQuestionId: null,
      responses: {},
    }),
}));
