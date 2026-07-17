import { authErrorResponse } from "../../../../../server/auth/errors";
import { requireUser } from "../../../../../server/auth/authorization";
import { downloadResume } from "../../../../../server/candidate/resume";

function safeFileName(value: string): string {
  return value.replace(/[\r\n"\\/]/gu, "_");
}

export async function GET(request: Request) {
  try {
    const user = await requireUser(request, ["CANDIDATE"]);
    const { resume, content } = await downloadResume(user.id);
    return new Response(new Uint8Array(content), {
      headers: {
        "Content-Type": resume.mimeType,
        "Content-Length": String(resume.sizeBytes),
        "Content-Disposition": `attachment; filename="${safeFileName(resume.originalName)}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
