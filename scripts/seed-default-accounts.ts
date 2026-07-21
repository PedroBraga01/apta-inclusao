import { eq } from "drizzle-orm";

import { defaultAccounts } from "../config/default-accounts";
import { closeDb, getDb } from "../db";
import { candidateProfiles, companyProfiles, users } from "../db/schema";
import { hashPassword } from "../server/auth/crypto";

async function seedDefaultAccounts(): Promise<void> {
  const db = getDb();

  for (const account of defaultAccounts) {
    const passwordHash = await hashPassword(account.password);
    const generatedId = crypto.randomUUID();

    await db
      .insert(users)
      .values({
        id: generatedId,
        email: account.email,
        passwordHash,
        role: account.role,
        status: "ACTIVE",
        emailVerifiedAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          passwordHash,
          role: account.role,
          status: "ACTIVE",
          emailVerifiedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

    const [storedUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, account.email))
      .limit(1);

    if (!storedUser) {
      throw new Error(`Não foi possível preparar a conta ${account.email}.`);
    }

    if (account.role === "CANDIDATE") {
      await db
        .insert(candidateProfiles)
        .values({ userId: storedUser.id, fullName: account.name })
        .onConflictDoNothing({ target: candidateProfiles.userId });
    }

    if (account.role === "COMPANY") {
      await db
        .insert(companyProfiles)
        .values({
          userId: storedUser.id,
          legalName: account.name,
          contactName: account.name,
          contactEmail: account.email,
        })
        .onConflictDoNothing({ target: companyProfiles.userId });
    }
  }

  console.log("Contas padrão da APTA preparadas com sucesso.");
}

try {
  await seedDefaultAccounts();
} finally {
  await closeDb();
}
