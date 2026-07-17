import { AuthError } from "./errors";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

export function normalizeEmail(value: unknown): string {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    throw new AuthError("INVALID_INPUT", "Informe um e-mail válido.", 400);
  }
  return email;
}

export function validatePassword(value: unknown): string {
  const password = typeof value === "string" ? value : "";
  if (password.length < 8) {
    throw new AuthError(
      "INVALID_INPUT",
      "A senha deve ter pelo menos 8 caracteres.",
      400,
    );
  }
  if (password.length > 128) {
    throw new AuthError(
      "INVALID_INPUT",
      "A senha deve ter no máximo 128 caracteres.",
      400,
    );
  }
  return password;
}

export function requiredText(
  value: unknown,
  label: string,
  maximumLength = 160,
): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) {
    throw new AuthError("INVALID_INPUT", `${label} é obrigatório.`, 400);
  }
  if (text.length > maximumLength) {
    throw new AuthError(
      "INVALID_INPUT",
      `${label} deve ter no máximo ${maximumLength} caracteres.`,
      400,
    );
  }
  return text;
}

export function publicRole(value: unknown): "CANDIDATE" | "COMPANY" {
  if (value === "CANDIDATE" || value === "COMPANY") return value;
  throw new AuthError("INVALID_INPUT", "Tipo de conta inválido.", 400);
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  try {
    const value: unknown = await request.json();
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      throw new Error("Invalid JSON object");
    }
    return value as Record<string, unknown>;
  } catch {
    throw new AuthError("INVALID_INPUT", "Envie dados JSON válidos.", 400);
  }
}
