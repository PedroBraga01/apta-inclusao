import assert from "node:assert/strict";
import test from "node:test";
import {
  candidateProfileUpdate,
  consentInput,
} from "../server/candidate/input";

test("normalizes candidate profile updates", () => {
  const result = candidateProfileUpdate({
    fullName: "  Pessoa Candidata  ",
    city: "  São Paulo ",
    skills: [" TypeScript ", "Acessibilidade", "TypeScript"],
  });
  assert.deepEqual(result, {
    fullName: "Pessoa Candidata",
    city: "São Paulo",
    skills: ["TypeScript", "Acessibilidade"],
  });
});

test("rejects empty profile updates and invalid consent", () => {
  assert.throws(() => candidateProfileUpdate({}));
  assert.throws(() => consentInput({ type: "UNKNOWN", granted: true }));
  assert.throws(() => consentInput({ type: "PROFILE_SHARING", granted: "yes" }));
  assert.deepEqual(
    consentInput({ type: "RESUME_SHARING", granted: false }),
    { type: "RESUME_SHARING", granted: false },
  );
});
