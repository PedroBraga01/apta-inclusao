import { authErrorResponse } from "../../../../server/auth/errors";
import { requireUser } from "../../../../server/auth/authorization";
import {
  activeResume,
  deleteResume,
  uploadResume,
  validateResumeFile,
} from "../../../../server/candidate/resume";
import { assertSameOrigin } from "../../../../server/http/security";

export async function GET(request: Request) {
  try {
    const user = await requireUser(request, ["CANDIDATE"]);
    return Response.json({ resume: await activeResume(user.id) });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser(request, ["CANDIDATE"]);
    const formData = await request.formData();
    const resume = await uploadResume(user.id, validateResumeFile(formData.get("file")));
    return Response.json({ resume }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser(request, ["CANDIDATE"]);
    await deleteResume(user.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return authErrorResponse(error);
  }
}
