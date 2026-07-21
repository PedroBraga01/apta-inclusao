import { AuthError } from "../auth/errors";

function firstHeaderValue(value: string | null): string | null {
  const first = value?.split(",")[0]?.trim();
  return first || null;
}

function publicRequestOrigin(request: Request): string {
  const requestUrl = new URL(request.url);
  const host =
    firstHeaderValue(request.headers.get("x-forwarded-host")) ??
    firstHeaderValue(request.headers.get("host"));
  const protocol =
    firstHeaderValue(request.headers.get("x-forwarded-proto")) ??
    requestUrl.protocol.replace(":", "");

  if (!host || (protocol !== "http" && protocol !== "https")) {
    return requestUrl.origin;
  }

  try {
    return new URL(`${protocol}://${host}`).origin;
  } catch {
    return requestUrl.origin;
  }
}

export function assertSameOrigin(request: Request): void {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") {
    throw new AuthError("FORBIDDEN", "Origem da solicitação não permitida.", 403);
  }

  const origin = request.headers.get("origin");
  if (!origin) return;

  let normalizedOrigin: string;
  try {
    normalizedOrigin = new URL(origin).origin;
  } catch {
    throw new AuthError("FORBIDDEN", "Origem da solicitação não permitida.", 403);
  }

  if (normalizedOrigin !== publicRequestOrigin(request)) {
    throw new AuthError("FORBIDDEN", "Origem da solicitação não permitida.", 403);
  }
}
