import { authErrorResponse } from "../../../../server/auth/errors";
import { readJsonObject, requiredText } from "../../../../server/auth/input";
import { verifyEmail } from "../../../../server/auth/service";
import { assertSameOrigin } from "../../../../server/http/security";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const payload = await readJsonObject(request);
    const user = await verifyEmail(requiredText(payload.token, "Token", 512));
    return Response.json({ user });
  } catch (error) {
    return authErrorResponse(error);
  }
}
