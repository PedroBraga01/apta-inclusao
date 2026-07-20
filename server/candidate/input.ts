import { AuthError } from "../auth/errors";
import type { CandidateProfileUpdate } from "./profile";

function optionalText(
  value: unknown,
  label: string,
  maximumLength: number,
): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new AuthError("INVALID_INPUT", `${label} é inválido.`, 400);
  }
  const text = value.trim();
  if (text.length > maximumLength) {
    throw new AuthError(
      "INVALID_INPUT",
      `${label} deve ter no máximo ${maximumLength} caracteres.`,
      400,
    );
  }
  return text;
}

function optionalStringList(value: unknown, label: string): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.length > 30) {
    throw new AuthError("INVALID_INPUT", `${label} é inválido.`, 400);
  }
  const items = value.map((item) => {
    if (typeof item !== "string" || item.trim().length > 80) {
      throw new AuthError("INVALID_INPUT", `${label} é inválido.`, 400);
    }
    return item.trim();
  });
  return [...new Set(items.filter(Boolean))];
}

export function candidateProfileUpdate(
  payload: Record<string, unknown>,
): CandidateProfileUpdate {
  const update: CandidateProfileUpdate = {};
  const textFields: Array<[
    keyof CandidateProfileUpdate,
    string,
    number,
  ]> = [
    ["fullName", "Nome", 160],
    ["phone", "Telefone", 40],
    ["city", "Cidade", 100],
    ["state", "Estado", 40],
    ["education", "Formação", 160],
    ["area", "Área", 120],
    ["experience", "Experiência", 3000],
    ["workMode", "Modalidade", 80],
    ["disability", "Deficiência visual", 160],
  ];
  for (const [key, label, maximum] of textFields) {
    const value = optionalText(payload[key], label, maximum);
    if (value !== undefined) {
      (update as Record<string, unknown>)[key] = value;
    }
  }
  const skills = optionalStringList(payload.skills, "Competências");
  if (skills !== undefined) update.skills = skills;
  const resources = optionalStringList(
    payload.accessibilityResources,
    "Recursos de acessibilidade",
  );
  if (resources !== undefined) update.accessibilityResources = resources;
  if (Object.keys(update).length === 0) {
    throw new AuthError("INVALID_INPUT", "Nenhuma informação foi enviada.", 400);
  }
  return update;
}

export function consentInput(payload: Record<string, unknown>) {
  const allowedTypes = [
    "PROFILE_SHARING",
    "RESUME_SHARING",
    "COMMUNICATIONS",
  ] as const;
  if (!allowedTypes.includes(payload.type as (typeof allowedTypes)[number])) {
    throw new AuthError("INVALID_INPUT", "Tipo de consentimento inválido.", 400);
  }
  if (typeof payload.granted !== "boolean") {
    throw new AuthError("INVALID_INPUT", "Escolha autorizar ou revogar.", 400);
  }
  return {
    type: payload.type as (typeof allowedTypes)[number],
    granted: payload.granted,
  };
}
