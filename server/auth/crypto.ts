const PASSWORD_ALGORITHM = "PBKDF2";
const PASSWORD_DIGEST = "SHA-256";
const PASSWORD_ITERATIONS = 600_000;
const PASSWORD_HASH_BYTES = 32;
const SALT_BYTES = 16;

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

async function derivePassword(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    PASSWORD_ALGORITHM,
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: PASSWORD_ALGORITHM,
      hash: PASSWORD_DIGEST,
      salt: salt as BufferSource,
      iterations,
    },
    key,
    PASSWORD_HASH_BYTES * 8,
  );
  return new Uint8Array(bits);
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const derived = await derivePassword(password, salt, PASSWORD_ITERATIONS);
  return [
    "pbkdf2-sha256",
    String(PASSWORD_ITERATIONS),
    toBase64Url(salt),
    toBase64Url(derived),
  ].join("$");
}

export async function verifyPassword(
  password: string,
  encodedHash: string,
): Promise<boolean> {
  const [algorithm, iterationValue, saltValue, hashValue] = encodedHash.split("$");
  const iterations = Number(iterationValue);
  if (
    algorithm !== "pbkdf2-sha256" ||
    !Number.isSafeInteger(iterations) ||
    iterations < 1 ||
    !saltValue ||
    !hashValue
  ) {
    return false;
  }

  try {
    const salt = fromBase64Url(saltValue);
    const expected = fromBase64Url(hashValue);
    const actual = await derivePassword(password, salt, iterations);
    return constantTimeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function createRandomToken(bytes = 32): string {
  return toBase64Url(randomBytes(bytes));
}

export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(token));
  return toBase64Url(new Uint8Array(digest));
}
