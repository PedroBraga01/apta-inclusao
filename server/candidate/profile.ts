import { desc, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { candidateProfiles, consents } from "../../db/schema";
import { AuthError } from "../auth/errors";

export type CandidateProfileUpdate = Partial<{
  fullName: string;
  phone: string;
  city: string;
  state: string;
  education: string;
  area: string;
  experience: string;
  workMode: string;
  disability: string;
  skills: string[];
  accessibilityResources: string[];
}>;

function profileProgress(profile: typeof candidateProfiles.$inferSelect): number {
  const fields = [
    profile.fullName,
    profile.phone,
    profile.city,
    profile.state,
    profile.education,
    profile.area,
    profile.experience,
    profile.workMode,
    profile.disability,
    profile.skills && profile.skills.length > 0 ? "skills" : "",
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

export async function getCandidateProfile(userId: string) {
  const db = getDb();
  const [profile] = await db
    .select()
    .from(candidateProfiles)
    .where(eq(candidateProfiles.userId, userId))
    .limit(1);
  if (!profile) {
    throw new AuthError("ACCOUNT_UNAVAILABLE", "Perfil de candidato não encontrado.", 404);
  }
  return profile;
}

export async function updateCandidateProfile(
  userId: string,
  values: CandidateProfileUpdate,
) {
  const current = await getCandidateProfile(userId);
  const merged = { ...current, ...values };
  const progress = profileProgress(merged);
  const db = getDb();
  await db
    .update(candidateProfiles)
    .set({ ...values, profileProgress: progress, updatedAt: new Date().toISOString() })
    .where(eq(candidateProfiles.userId, userId));
  return getCandidateProfile(userId);
}

export async function listCandidateConsents(userId: string) {
  return getDb()
    .select()
    .from(consents)
    .where(eq(consents.candidateId, userId))
    .orderBy(desc(consents.recordedAt));
}

export async function recordCandidateConsent(input: {
  userId: string;
  type: "PROFILE_SHARING" | "RESUME_SHARING" | "COMMUNICATIONS";
  granted: boolean;
}) {
  const db = getDb();
  const purposeByType = {
    PROFILE_SHARING: "Permitir que empresas autorizadas encontrem e consultem o perfil profissional.",
    RESUME_SHARING: "Permitir acesso temporário ao currículo por empresas autorizadas.",
    COMMUNICATIONS: "Receber comunicações sobre oportunidades, treinamentos e palestras.",
  } as const;
  const consentStatement = db.insert(consents).values({
    candidateId: input.userId,
    type: input.type,
    version: "2026-07-17",
    purpose: purposeByType[input.type],
    granted: input.granted,
    revokedAt: input.granted ? null : new Date().toISOString(),
  });

  if (input.type === "PROFILE_SHARING") {
    await db.batch([
      consentStatement,
      db
        .update(candidateProfiles)
        .set({
          sharingEnabled: input.granted,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(candidateProfiles.userId, input.userId)),
    ]);
  } else {
    await consentStatement;
  }
  return listCandidateConsents(input.userId);
}
