export const SESSION_COOKIE_NAME = "apta_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export function getSessionToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (rawName === SESSION_COOKIE_NAME) {
      return decodeURIComponent(rawValue.join("="));
    }
  }
  return null;
}

function secureAttribute(request: Request): string {
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  return new URL(request.url).protocol === "https:" || forwardedProtocol === "https"
    ? "; Secure"
    : "";
}

export function sessionCookie(request: Request, token: string): string {
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_DURATION_SECONDS}${secureAttribute(request)}`;
}

export function clearedSessionCookie(request: Request): string {
  return `${SESSION_COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secureAttribute(request)}`;
}
