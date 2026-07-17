import { authErrorResponse } from "../../../../server/auth/errors";
import { requireUser } from "../../../../server/auth/authorization";
import { readJsonObject } from "../../../../server/auth/input";
import { consentInput } from "../../../../server/candidate/input";
import {
  listCandidateConsents,
  recordCandidateConsent,
} from "../../../../server/candidate/profile";
import { assertSameOrigin } from "../../../../server/http/security";

export async function GET(request: Request) {
  try {
    const user = await requireUser(request, ["CANDIDATE"]);
    return Response.json({ consents: await listCandidateConsents(user.id) });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser(request, ["CANDIDATE"]);
    const input = consentInput(await readJsonObject(request));
    const consents = await recordCandidateConsent({ userId: user.id, ...input });
    return Response.json({ consents }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}
