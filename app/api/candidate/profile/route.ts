import { authErrorResponse } from "../../../../server/auth/errors";
import { requireUser } from "../../../../server/auth/authorization";
import { readJsonObject } from "../../../../server/auth/input";
import { candidateProfileUpdate } from "../../../../server/candidate/input";
import {
  getCandidateProfile,
  updateCandidateProfile,
} from "../../../../server/candidate/profile";
import { assertSameOrigin } from "../../../../server/http/security";

export async function GET(request: Request) {
  try {
    const user = await requireUser(request, ["CANDIDATE"]);
    return Response.json({
      profile: await getCandidateProfile(user.id),
      email: user.email,
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser(request, ["CANDIDATE"]);
    const payload = await readJsonObject(request);
    const profile = await updateCandidateProfile(
      user.id,
      candidateProfileUpdate(payload),
    );
    return Response.json({ profile });
  } catch (error) {
    return authErrorResponse(error);
  }
}
