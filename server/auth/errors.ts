export type AuthErrorCode =
  | "INVALID_INPUT"
  | "EMAIL_IN_USE"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_UNAVAILABLE"
  | "EMAIL_NOT_VERIFIED"
  | "INVALID_TOKEN"
  | "RATE_LIMITED"
  | "UNAUTHENTICATED"
  | "FORBIDDEN";

export class AuthError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export function authErrorResponse(error: unknown): Response {
  if (error instanceof AuthError) {
    return Response.json(
      { error: { code: error.code, message: error.message } },
      {
        status: error.status,
        headers: error.code === "RATE_LIMITED" ? { "Retry-After": "900" } : undefined,
      },
    );
  }

  console.error("Unexpected authentication error", error);
  return Response.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Não foi possível concluir a solicitação.",
      },
    },
    { status: 500 },
  );
}
