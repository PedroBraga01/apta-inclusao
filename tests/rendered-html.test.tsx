import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AptaApp } from "../app/AptaApp";
import { GET as getHealth } from "../app/api/health/route";

function renderAccessPage(): string {
  return renderToStaticMarkup(createElement(AptaApp));
}

test("renders the APTA access experience", () => {
  const html = renderAccessPage();
  assert.match(html, /Boas-vindas à APTA/i);
  assert.match(html, /Acesso unificado/i);
  assert.match(html, /Um login\./i);
  assert.doesNotMatch(html, /Your site is taking shape|Codex is working/i);
});

test("renders an accessible unified login form", () => {
  const html = renderAccessPage();
  assert.match(html, /class="skip-link" href="#auth-card"/i);
  assert.match(html, /aria-label="Ferramentas de acessibilidade"/i);
  assert.match(html, /<label for="login-email">E-mail<\/label>/i);
  assert.match(html, /<label for="login-password">Senha<\/label>/i);
  assert.match(html, /Esqueci minha senha/i);
  assert.match(html, /Cadastrar-se/i);
  assert.match(html, /role="status" aria-live="polite"/i);
});

test("keeps locale and product metadata in the root layout", async () => {
  const source = await readFile(
    new URL("../app/layout.tsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /<html lang="pt-BR">/u);
  assert.match(source, /title: "APTA \| Talento não tem barreiras"/u);
  assert.match(source, /profissionais com deficiência visual/u);
});

test("renders quick access buttons for the three default accounts", () => {
  const html = renderAccessPage();
  assert.match(html, /Acessos rápidos/i);
  assert.match(html, /candidato@apta\.org\.br/i);
  assert.match(html, /empresa@apta\.org\.br/i);
  assert.match(html, /admin@apta\.org\.br/i);
  assert.match(html, /Preencher credenciais e entrar como Pessoa com deficiência visual/i);
});

test("defines a full-stack Render deployment with private Postgres", async () => {
  const blueprint = await readFile(
    new URL("../render.yaml", import.meta.url),
    "utf8",
  );
  const packageJson = await readFile(
    new URL("../package.json", import.meta.url),
    "utf8",
  );

  assert.match(blueprint, /type: web/u);
  assert.match(blueprint, /runtime: node/u);
  assert.match(blueprint, /preDeployCommand: npm run db:migrate/u);
  assert.match(blueprint, /npm run db:seed/u);
  assert.match(blueprint, /fromDatabase:/u);
  assert.match(blueprint, /ipAllowList: \[\]/u);
  assert.match(packageJson, /"build": "next build"/u);
  assert.doesNotMatch(packageJson, /vinext|wrangler|cloudflare/iu);
});

test("keeps the demonstration deployment healthy without PostgreSQL", async () => {
  const previousDatabaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  try {
    const response = await getHealth();
    const body = (await response.json()) as {
      status: string;
      database: string;
    };

    assert.equal(response.status, 200);
    assert.deepEqual(body, {
      status: "demo",
      database: "not_configured",
    });
  } finally {
    if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDatabaseUrl;
  }
});
