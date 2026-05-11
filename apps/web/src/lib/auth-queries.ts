import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiJson } from "./api-client";
import { getSession } from "./auth";

export type AuthPayload = {
  email: string;
  password: string;
};

type AuthResponse = {
  user: {
    id: string;
    email: string;
    isAdmin: boolean;
  };
};

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: getSession,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AuthPayload) => apiJson<AuthResponse>("/auth/login", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["session"] }),
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (payload: AuthPayload) => apiJson<AuthResponse>("/auth/signup", payload),
  });
}
