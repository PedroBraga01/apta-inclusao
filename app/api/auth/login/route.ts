import { authErrorResponse } from "../../../../server/auth/errors";
import {
  normalizeEmail,
  readJsonObject,
  validatePassword,
} from "../../../../server/auth/input";
import { sessionCookie } from "../../../../server/auth/session-cookie";
import {
  assertLoginAllowed,
  authenticate,
  recordLoginAttempt,
} from "../../../../server/auth/service";
import { assertSameOrigin } from "../../../../server/http/security";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const payload = await readJsonObject(request);
    const email = normalizeEmail(payload.email);
    await assertLoginAllowed(email);
    try {
      const result = await authenticate({
        email,
        password: validatePassword(payload.password),
      });
      await recordLoginAttempt(email, true);
      return Response.json(
        { user: result.user },
        { headers: { "Set-Cookie": sessionCookie(request, result.sessionToken) } },
      );
    } catch (error) {
      await recordLoginAttempt(email, false);
      throw error;
    }
  } catch (error) {
    return authErrorResponse(error);
  }
}
