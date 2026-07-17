import { and, count, eq, gt, isNull, sql } from "drizzle-orm";
import { getDb } from "../../db";
import {
  authTokens,
  candidateProfiles,
  companyProfiles,
  loginAttempts,
  sessions,
  users,
} from "../../db/schema";
import { createRandomToken, hashPassword, hashToken, verifyPassword } from "./crypto";
import { AuthError } from "./errors";
import { SESSION_DURATION_SECONDS } from "./session-cookie";

type UserRow = typeof users.$inferSelect;

export type PublicUser = {
  id: string;
  email: string;
  role: UserRow["role"];
  status: UserRow["status"];
};

function publicUser(user: UserRow): PublicUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

function expiresIn(seconds: number): string {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

export async function registerAccount(input: {
  email: string;
  password: string;
  role: "CANDIDATE" | "COMPANY";
  name: string;
}): Promise<{ user: PublicUser; verificationToken: string }> {
  const db = getDb();
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);
  if (existing.length > 0) {
    throw new AuthError("EMAIL_IN_USE", "Já existe uma conta com esse e-mail.", 409);
  }

  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword(input.password);
  const verificationToken = createRandomToken();
  const verificationTokenHash = await hashToken(verificationToken);
  const userValues: typeof users.$inferInsert = {
    id: userId,
    email: input.email,
    passwordHash,
    role: input.role,
    status: "PENDING",
  };

  const userStatement = db.insert(users).values(userValues);
  const profileStatement =
    input.role === "CANDIDATE"
      ? db.insert(candidateProfiles).values({ userId, fullName: input.name })
      : db.insert(companyProfiles).values({
          userId,
          legalName: input.name,
          contactName: input.name,
          contactEmail: input.email,
        });
  const tokenStatement = db.insert(authTokens).values({
    userId,
    purpose: "VERIFY_EMAIL",
    tokenHash: verificationTokenHash,
    expiresAt: expiresIn(60 * 60 * 24),
  });

  try {
    await db.batch([userStatement, profileStatement, tokenStatement]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("UNIQUE") || message.includes("users.email")) {
      throw new AuthError("EMAIL_IN_USE", "Já existe uma conta com esse e-mail.", 409);
    }
    throw error;
  }

  return {
    user: publicUser({
      ...userValues,
      emailVerifiedAt: null,
      lastAccessAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    verificationToken,
  };
}

export async function verifyEmail(token: string): Promise<PublicUser> {
  const db = getDb();
  const tokenHash = await hashToken(token);
  const now = new Date().toISOString();
  const [record] = await db
    .select()
    .from(authTokens)
    .where(
      and(
        eq(authTokens.tokenHash, tokenHash),
        eq(authTokens.purpose, "VERIFY_EMAIL"),
        isNull(authTokens.usedAt),
        gt(authTokens.expiresAt, now),
      ),
    )
    .limit(1);
  if (!record) {
    throw new AuthError("INVALID_TOKEN", "O link de confirmação é inválido ou expirou.", 400);
  }

  await db.batch([
    db.update(authTokens).set({ usedAt: now }).where(eq(authTokens.id, record.id)),
    db
      .update(users)
      .set({ status: "ACTIVE", emailVerifiedAt: now, updatedAt: now })
      .where(eq(users.id, record.userId)),
  ]);
  const [user] = await db.select().from(users).where(eq(users.id, record.userId)).limit(1);
  if (!user) {
    throw new AuthError("INVALID_TOKEN", "A conta não está mais disponível.", 400);
  }
  return publicUser(user);
}

export async function authenticate(input: {
  email: string;
  password: string;
}): Promise<{ user: PublicUser; sessionToken: string }> {
  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
  const passwordMatches = user
    ? await verifyPassword(input.password, user.passwordHash)
    : await verifyPassword(input.password, await hashPassword("invalid-password"));

  if (!user || !passwordMatches) {
    throw new AuthError("INVALID_CREDENTIALS", "E-mail ou senha incorretos.", 401);
  }
  if (user.status === "PENDING") {
    throw new AuthError(
      "EMAIL_NOT_VERIFIED",
      "Confirme seu e-mail antes de entrar.",
      403,
    );
  }
  if (user.status !== "ACTIVE") {
    throw new AuthError("ACCOUNT_UNAVAILABLE", "Esta conta não está disponível.", 403);
  }

  const sessionToken = createRandomToken();
  const tokenHash = await hashToken(sessionToken);
  const now = new Date().toISOString();
  await db.batch([
    db.insert(sessions).values({
      userId: user.id,
      tokenHash,
      expiresAt: expiresIn(SESSION_DURATION_SECONDS),
    }),
    db.update(users).set({ lastAccessAt: now, updatedAt: now }).where(eq(users.id, user.id)),
  ]);
  return { user: publicUser(user), sessionToken };
}

export async function assertLoginAllowed(email: string): Promise<void> {
  const db = getDb();
  const emailHash = await hashToken(email);
  const [result] = await db
    .select({ attempts: count() })
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.emailHash, emailHash),
        eq(loginAttempts.succeeded, false),
        gt(loginAttempts.createdAt, sql`datetime('now', '-15 minutes')`),
      ),
    );
  if ((result?.attempts ?? 0) >= 5) {
    throw new AuthError(
      "RATE_LIMITED",
      "Muitas tentativas. Aguarde 15 minutos antes de tentar novamente.",
      429,
    );
  }
}

export async function recordLoginAttempt(
  email: string,
  succeeded: boolean,
): Promise<void> {
  const db = getDb();
  await db.insert(loginAttempts).values({
    emailHash: await hashToken(email),
    succeeded,
  });
}

export async function currentUser(sessionToken: string | null): Promise<PublicUser | null> {
  if (!sessionToken) return null;
  const db = getDb();
  const tokenHash = await hashToken(sessionToken);
  const [session] = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.tokenHash, tokenHash),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, new Date().toISOString()),
      ),
    )
    .limit(1);
  if (!session) return null;
  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  if (!user || user.status !== "ACTIVE") return null;
  return publicUser(user);
}

export async function revokeSession(sessionToken: string | null): Promise<void> {
  if (!sessionToken) return;
  const db = getDb();
  const tokenHash = await hashToken(sessionToken);
  await db
    .update(sessions)
    .set({ revokedAt: new Date().toISOString() })
    .where(eq(sessions.tokenHash, tokenHash));
}

export async function createPasswordReset(
  email: string,
): Promise<string | null> {
  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || user.status === "DELETED") return null;

  const token = createRandomToken();
  await db.insert(authTokens).values({
    userId: user.id,
    purpose: "RESET_PASSWORD",
    tokenHash: await hashToken(token),
    expiresAt: expiresIn(60 * 30),
  });
  return token;
}

export async function resetPassword(token: string, password: string): Promise<void> {
  const db = getDb();
  const tokenHash = await hashToken(token);
  const now = new Date().toISOString();
  const [record] = await db
    .select()
    .from(authTokens)
    .where(
      and(
        eq(authTokens.tokenHash, tokenHash),
        eq(authTokens.purpose, "RESET_PASSWORD"),
        isNull(authTokens.usedAt),
        gt(authTokens.expiresAt, now),
      ),
    )
    .limit(1);
  if (!record) {
    throw new AuthError("INVALID_TOKEN", "O link de recuperação é inválido ou expirou.", 400);
  }

  const passwordHash = await hashPassword(password);
  await db.batch([
    db.update(authTokens).set({ usedAt: now }).where(eq(authTokens.id, record.id)),
    db
      .update(users)
      .set({ passwordHash, updatedAt: now })
      .where(eq(users.id, record.userId)),
    db
      .update(sessions)
      .set({ revokedAt: now })
      .where(and(eq(sessions.userId, record.userId), isNull(sessions.revokedAt))),
  ]);
}
