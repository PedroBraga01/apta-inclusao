import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the APTA access experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="pt-BR">/i);
  assert.match(html, /<title>APTA \| Talento não tem barreiras<\/title>/i);
  assert.match(
    html,
    /A plataforma que conecta profissionais com deficiência visual a empresas comprometidas com inclusão\./i,
  );
  assert.match(html, /Boas-vindas à APTA/i);
  assert.match(html, /Acesso unificado/i);
  assert.doesNotMatch(html, /Your site is taking shape|Codex is working/i);
});

test("renders an accessible unified login form", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /class="skip-link" href="#auth-card"/i);
  assert.match(html, /aria-label="Ferramentas de acessibilidade"/i);
  assert.match(html, /<label for="login-email">E-mail<\/label>/i);
  assert.match(html, /<label for="login-password">Senha<\/label>/i);
  assert.match(html, /Esqueci minha senha/i);
  assert.match(html, /Cadastrar-se/i);
  assert.match(html, /role="status" aria-live="polite"/i);
});

test("exposes the three documented demonstration portals", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /candidato@apta\.org\.br/i);
  assert.match(html, /empresa@apta\.org\.br/i);
  assert.match(html, /admin@apta\.org\.br/i);
});
