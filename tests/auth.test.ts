import assert from "node:assert/strict";
import test from "node:test";
import {
  createRandomToken,
  hashPassword,
  hashToken,
  verifyPassword,
} from "../server/auth/crypto";
import {
  normalizeEmail,
  publicRole,
  validatePassword,
} from "../server/auth/input";
import {
  clearedSessionCookie,
  getSessionToken,
  sessionCookie,
} from "../server/auth/session-cookie";
import { assertSameOrigin } from "../server/http/security";

test("hashes and verifies passwords with a unique salt", async () => {
  const password = "uma-senha-segura";
  const first = await hashPassword(password);
  const second = await hashPassword(password);

  assert.notEqual(first, second);
  assert.match(first, /^pbkdf2-sha256\$600000\$/u);
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword("senha-incorreta", first), false);
  assert.equal(await verifyPassword(password, "invalid"), false);
});

test("creates opaque tokens and stable token hashes", async () => {
  const token = createRandomToken();
  assert.ok(token.length >= 40);
  assert.doesNotMatch(token, /[+/=]/u);
  assert.equal(await hashToken(token), await hashToken(token));
  assert.notEqual(await hashToken(token), await hashToken(createRandomToken()));
});

test("normalizes account input and rejects administrative public signup", () => {
  assert.equal(normalizeEmail("  Pessoa@Exemplo.COM  "), "pessoa@exemplo.com");
  assert.equal(validatePassword("12345678"), "12345678");
  assert.equal(publicRole("CANDIDATE"), "CANDIDATE");
  assert.throws(() => publicRole("ADMIN"));
  assert.throws(() => normalizeEmail("not-an-email"));
  assert.throws(() => validatePassword("short"));
});

test("serializes secure session cookies and reads them back", () => {
  const secureRequest = new Request("https://apta.example/api/auth/login");
  const localRequest = new Request("http://localhost/api/auth/login");
  const proxiedSecureRequest = new Request("http://internal/api/auth/login", {
    headers: { "x-forwarded-proto": "https" },
  });
  const cookie = sessionCookie(secureRequest, "token-value");

  assert.match(cookie, /HttpOnly/u);
  assert.match(cookie, /SameSite=Lax/u);
  assert.match(cookie, /Secure/u);
  assert.doesNotMatch(sessionCookie(localRequest, "token-value"), /Secure/u);
  assert.match(sessionCookie(proxiedSecureRequest, "token-value"), /Secure/u);

  const authenticatedRequest = new Request("https://apta.example/", {
    headers: { cookie: "theme=high-contrast; apta_session=token-value" },
  });
  assert.equal(getSessionToken(authenticatedRequest), "token-value");
  assert.match(clearedSessionCookie(secureRequest), /Max-Age=0/u);
});

test("rejects cross-site state-changing requests", () => {
  assert.doesNotThrow(() =>
    assertSameOrigin(
      new Request("https://apta.example/api/auth/login", {
        headers: { origin: "https://apta.example" },
      }),
    ),
  );
  assert.throws(() =>
    assertSameOrigin(
      new Request("https://apta.example/api/auth/login", {
        headers: {
          origin: "https://attacker.example",
          "sec-fetch-site": "cross-site",
        },
      }),
    ),
  );
});

test("accepts the public origin forwarded by a trusted reverse proxy", () => {
  assert.doesNotThrow(() =>
    assertSameOrigin(
      new Request("http://internal-service:10000/api/auth/login", {
        headers: {
          host: "internal-service:10000",
          origin: "https://apta-inclusao.onrender.com",
          "sec-fetch-site": "same-origin",
          "x-forwarded-host": "apta-inclusao.onrender.com",
          "x-forwarded-proto": "https",
        },
      }),
    ),
  );

  assert.throws(() =>
    assertSameOrigin(
      new Request("http://internal-service:10000/api/auth/login", {
        headers: {
          origin: "https://attacker.example",
          "sec-fetch-site": "cross-site",
          "x-forwarded-host": "apta-inclusao.onrender.com",
          "x-forwarded-proto": "https",
        },
      }),
    ),
  );
});
