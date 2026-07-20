import { authErrorResponse } from "../../../../server/auth/errors";
import {
  normalizeEmail,
  publicRole,
  readJsonObject,
  requiredText,
  validatePassword,
} from "../../../../server/auth/input";
import { registerAccount } from "../../../../server/auth/service";
import { assertSameOrigin } from "../../../../server/http/security";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const payload = await readJsonObject(request);
    const result = await registerAccount({
      email: normalizeEmail(payload.email),
      password: validatePassword(payload.password),
      role: publicRole(payload.role),
      name: requiredText(payload.name, "Nome"),
    });
    const localRequest = new URL(request.url).hostname === "localhost";
    return Response.json(
      {
        user: result.user,
        requiresEmailVerification: true,
        ...(localRequest ? { verificationToken: result.verificationToken } : {}),
      },
      { status: 201 },
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}
