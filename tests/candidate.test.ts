import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { candidateNavigation, videoLessons } from "../app/apta/data";
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

test("offers categorized video lessons in the candidate portal", async () => {
  assert.deepEqual(
    videoLessons.reduce<Record<string, number>>((totals, lesson) => {
      totals[lesson.category] = (totals[lesson.category] ?? 0) + 1;
      return totals;
    }, {}),
    { Excel: 5, PowerPoint: 5, "Inglês": 5 },
  );
  assert.ok(candidateNavigation.some((item) => item.id === "videoaulas"));

  for (const lesson of videoLessons) {
    const url = new URL(lesson.url);
    assert.equal(url.hostname, "www.youtube.com");
    assert.ok(url.searchParams.get("v"));
    if (lesson.thumbnail) {
      await access(new URL(`../public${lesson.thumbnail}`, import.meta.url));
    }
  }

  const source = await readFile(new URL("../app/AptaApp.tsx", import.meta.url), "utf8");
  assert.match(source, /target="_blank"/u);
  assert.match(source, /rel="noopener noreferrer"/u);
});
