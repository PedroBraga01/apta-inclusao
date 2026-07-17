import { env } from "cloudflare:workers";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { resumes } from "../../db/schema";
import { AuthError } from "../auth/errors";

const MAX_RESUME_BYTES = 10 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export function validateResumeFile(value: FormDataEntryValue | null): File {
  if (!(value instanceof File) || value.size === 0) {
    throw new AuthError("INVALID_INPUT", "Selecione um currículo.", 400);
  }
  if (!ALLOWED_RESUME_TYPES.has(value.type)) {
    throw new AuthError("INVALID_INPUT", "Envie um arquivo PDF, DOC ou DOCX.", 400);
  }
  if (value.size > MAX_RESUME_BYTES) {
    throw new AuthError("INVALID_INPUT", "O currículo deve ter no máximo 10 MB.", 400);
  }
  return value;
}

export async function activeResume(candidateId: string) {
  const [resume] = await getDb()
    .select()
    .from(resumes)
    .where(and(eq(resumes.candidateId, candidateId), eq(resumes.status, "ACTIVE")))
    .orderBy(desc(resumes.createdAt))
    .limit(1);
  return resume ?? null;
}

export async function uploadResume(candidateId: string, file: File) {
  const db = getDb();
  const previous = await activeResume(candidateId);
  const resumeId = crypto.randomUUID();
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const objectKey = `resumes/${candidateId}/${resumeId}.${extension}`;
  await env.RESUMES.put(objectKey, file.stream(), {
    httpMetadata: { contentType: file.type },
    customMetadata: { candidateId, originalName: file.name },
  });
  try {
    const statements = [
      db.insert(resumes).values({
        id: resumeId,
        candidateId,
        objectKey,
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      }),
    ];
    if (previous) {
      statements.push(
        db
          .update(resumes)
          .set({ status: "REPLACED" })
          .where(eq(resumes.id, previous.id)),
      );
    }
    await db.batch(statements as [typeof statements[number], ...typeof statements]);
  } catch (error) {
    await env.RESUMES.delete(objectKey);
    throw error;
  }
  return activeResume(candidateId);
}

export async function deleteResume(candidateId: string) {
  const resume = await activeResume(candidateId);
  if (!resume) return false;
  await env.RESUMES.delete(resume.objectKey);
  await getDb()
    .update(resumes)
    .set({ status: "DELETED", deletedAt: new Date().toISOString() })
    .where(eq(resumes.id, resume.id));
  return true;
}

export async function downloadResume(candidateId: string) {
  const resume = await activeResume(candidateId);
  if (!resume) {
    throw new AuthError("INVALID_INPUT", "Nenhum currículo foi enviado.", 404);
  }
  const object = await env.RESUMES.get(resume.objectKey);
  if (!object) {
    throw new AuthError("ACCOUNT_UNAVAILABLE", "O arquivo não está disponível.", 404);
  }
  return { resume, object };
}
