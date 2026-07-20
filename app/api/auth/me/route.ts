import { getSessionToken } from "../../../../server/auth/session-cookie";
import { currentUser } from "../../../../server/auth/service";
import { authErrorResponse } from "../../../../server/auth/errors";

export async function GET(request: Request) {
  try {
    const user = await currentUser(getSessionToken(request));
    if (!user) {
      return Response.json(
        { error: { code: "UNAUTHENTICATED", message: "Entre para continuar." } },
        { status: 401 },
      );
    }
    return Response.json({ user });
  } catch (error) {
    return authErrorResponse(error);
  }
}
