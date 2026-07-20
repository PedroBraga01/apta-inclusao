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

const resumeMetadataColumns = {
  id: resumes.id,
  candidateId: resumes.candidateId,
  originalName: resumes.originalName,
  mimeType: resumes.mimeType,
  sizeBytes: resumes.sizeBytes,
  status: resumes.status,
  createdAt: resumes.createdAt,
  deletedAt: resumes.deletedAt,
};

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
    .select(resumeMetadataColumns)
    .from(resumes)
    .where(and(eq(resumes.candidateId, candidateId), eq(resumes.status, "ACTIVE")))
    .orderBy(desc(resumes.createdAt))
    .limit(1);
  return resume ?? null;
}

export async function uploadResume(candidateId: string, file: File) {
  const db = getDb();
  const previous = await activeResume(candidateId);
  const content = Buffer.from(await file.arrayBuffer());

  await db.transaction(async (transaction) => {
    await transaction.insert(resumes).values({
      id: crypto.randomUUID(),
      candidateId,
      originalName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      content,
    });
    if (previous) {
      await transaction
        .update(resumes)
        .set({ status: "REPLACED", content: null })
        .where(eq(resumes.id, previous.id));
    }
  });

  return activeResume(candidateId);
}

export async function deleteResume(candidateId: string) {
  const resume = await activeResume(candidateId);
  if (!resume) return false;
  await getDb()
    .update(resumes)
    .set({
      status: "DELETED",
      deletedAt: new Date().toISOString(),
      content: null,
    })
    .where(eq(resumes.id, resume.id));
  return true;
}

export async function downloadResume(candidateId: string) {
  const [record] = await getDb()
    .select()
    .from(resumes)
    .where(and(eq(resumes.candidateId, candidateId), eq(resumes.status, "ACTIVE")))
    .orderBy(desc(resumes.createdAt))
    .limit(1);

  if (!record) {
    throw new AuthError("INVALID_INPUT", "Nenhum currículo foi enviado.", 404);
  }
  if (!record.content) {
    throw new AuthError("ACCOUNT_UNAVAILABLE", "O arquivo não está disponível.", 404);
  }

  const { content, ...resume } = record;
  return { resume, content };
}
