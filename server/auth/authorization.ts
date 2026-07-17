import type { PublicUser } from "./service";
import { AuthError } from "./errors";
import { getSessionToken } from "./session-cookie";
import { currentUser } from "./service";

export async function requireUser(
  request: Request,
  roles?: PublicUser["role"][],
): Promise<PublicUser> {
  const user = await currentUser(getSessionToken(request));
  if (!user) {
    throw new AuthError("UNAUTHENTICATED", "Entre para continuar.", 401);
  }
  if (roles && !roles.includes(user.role)) {
    throw new AuthError("FORBIDDEN", "Você não tem permissão para esta ação.", 403);
  }
  return user;
}
