import { AuthError } from "../auth/errors";

export function assertSameOrigin(request: Request): void {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin && origin !== requestUrl.origin) {
    throw new AuthError("FORBIDDEN", "Origem da solicitação não permitida.", 403);
  }

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") {
    throw new AuthError("FORBIDDEN", "Origem da solicitação não permitida.", 403);
  }
}
