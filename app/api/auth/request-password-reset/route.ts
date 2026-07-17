import { authErrorResponse } from "../../../../server/auth/errors";
import { normalizeEmail, readJsonObject } from "../../../../server/auth/input";
import { createPasswordReset } from "../../../../server/auth/service";
import { assertSameOrigin } from "../../../../server/http/security";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const payload = await readJsonObject(request);
    const token = await createPasswordReset(normalizeEmail(payload.email));
    const localRequest = new URL(request.url).hostname === "localhost";
    return Response.json({
      message:
        "Se existir uma conta com esse e-mail, enviaremos as instruções para redefinir a senha.",
      ...(localRequest && token ? { resetToken: token } : {}),
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
