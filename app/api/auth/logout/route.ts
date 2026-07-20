import {
  clearedSessionCookie,
  getSessionToken,
} from "../../../../server/auth/session-cookie";
import { revokeSession } from "../../../../server/auth/service";
import { assertSameOrigin } from "../../../../server/http/security";
import { authErrorResponse } from "../../../../server/auth/errors";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await revokeSession(getSessionToken(request));
    return new Response(null, {
      status: 204,
      headers: { "Set-Cookie": clearedSessionCookie(request) },
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
