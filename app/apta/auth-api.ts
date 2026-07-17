import type { AccountPortal } from "./types";

type ApiErrorBody = {
  error?: { message?: string };
};

export type AuthUser = {
  id: string;
  email: string;
  role: "CANDIDATE" | "COMPANY" | "ADMIN";
  status: "PENDING" | "ACTIVE" | "BLOCKED" | "DELETED";
};

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const body = (await response.json().catch(() => ({}))) as T & ApiErrorBody;
  if (!response.ok) {
    throw new Error(body.error?.message ?? "Não foi possível concluir a solicitação.");
  }
  return body;
}

export function rolePortal(role: AuthUser["role"]): AccountPortal {
  if (role === "CANDIDATE") return "candidate";
  if (role === "COMPANY") return "company";
  return "admin";
}

export async function loginAccount(email: string, password: string) {
  return apiRequest<{ user: AuthUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerAccount(input: {
  email: string;
  password: string;
  name: string;
  role: "CANDIDATE" | "COMPANY";
}) {
  return apiRequest<{
    user: AuthUser;
    requiresEmailVerification: boolean;
    verificationToken?: string;
  }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function confirmEmail(token: string) {
  return apiRequest<{ user: AuthUser }>("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function requestPasswordReset(email: string) {
  return apiRequest<{ message: string; resetToken?: string }>(
    "/api/auth/request-password-reset",
    { method: "POST", body: JSON.stringify({ email }) },
  );
}

export async function finishPasswordReset(token: string, password: string) {
  return apiRequest<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export async function getCurrentAccount() {
  return apiRequest<{ user: AuthUser }>("/api/auth/me", { method: "GET" });
}

export async function logoutAccount(): Promise<void> {
  const response = await fetch("/api/auth/logout", { method: "POST" });
  if (!response.ok) throw new Error("Não foi possível encerrar a sessão.");
}
