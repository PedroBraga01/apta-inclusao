import { authErrorResponse } from "../../../../server/auth/errors";
import {
  readJsonObject,
  requiredText,
  validatePassword,
} from "../../../../server/auth/input";
import { resetPassword } from "../../../../server/auth/service";
import { assertSameOrigin } from "../../../../server/http/security";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const payload = await readJsonObject(request);
    await resetPassword(
      requiredText(payload.token, "Token", 512),
      validatePassword(payload.password),
    );
    return Response.json({ message: "Senha redefinida com sucesso." });
  } catch (error) {
    return authErrorResponse(error);
  }
}
