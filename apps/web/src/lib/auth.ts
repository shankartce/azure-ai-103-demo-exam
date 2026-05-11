import { ApiClientError, apiRequest } from "./api-client";

export type SessionUser = {
  id: string;
  email: string;
  isAdmin: boolean;
};

type MeResponse = {
  user: SessionUser;
};

export async function getSession(): Promise<SessionUser | null> {
  try {
    const result = await apiRequest<MeResponse>("/auth/me");
    return result.user;
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 401) {
      return null;
    }

    throw error;
  }
}
