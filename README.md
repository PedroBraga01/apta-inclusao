# APTA — Talento não tem barreiras

Plataforma web acessível que conecta profissionais com deficiência visual a
empresas comprometidas com inclusão. A mesma aplicação reúne as jornadas de
candidatos, empresas e administração da APTA.

## Estado atual

O projeto é uma aplicação full-stack responsiva. Interface, páginas e APIs são
executadas no mesmo processo Node.js. Já estão implementados:

- acesso unificado para candidato, empresa e administração;
- cadastro, confirmação de e-mail, sessão e recuperação de senha pela API;
- perfil, progresso e consentimentos persistentes do candidato;
- envio, substituição, download e exclusão privada de currículo;
- base relacional para questionários, talentos, treinamentos, consultorias,
  palestras, ingressos, notificações e auditoria;
- navegação por teclado, alto contraste, ampliação de texto e regiões de anúncio;
- layout mobile-first para celular, tablet e computador.

O plano completo está em [PLANO_EXECUCAO_MOBILE.md](./PLANO_EXECUCAO_MOBILE.md).

## Hospedagem

Toda a infraestrutura de produção foi preparada para o Render:

- um Render Web Service executa frontend, renderização e APIs Next.js;
- um Render Postgres armazena contas, sessões, dados de negócio e currículos;
- a conexão usa a rede privada do Render e não expõe o banco à internet;
- as migrações são executadas antes de cada publicação;
- `/api/health` valida a aplicação e a conexão com o banco.

O arquivo [render.yaml](./render.yaml) descreve os dois recursos. A configuração
usa planos pagos adequados a uma aplicação de produção com dados pessoais. O
plano gratuito do PostgreSQL do Render expira e não deve armazenar dados reais.

Cloudflare Workers, D1, R2 e ChatGPT Sites não fazem parte da arquitetura atual.

## Direção do produto

A APTA será uma única aplicação web mobile-first. Ela poderá ser instalada como
PWA em uma etapa posterior, usando a mesma interface responsiva no Android, iOS,
tablets e computadores. Não haverá aplicativo nativo separado.

## Tecnologias

- Next.js 16, React 19 e TypeScript;
- Node.js 22;
- PostgreSQL;
- Drizzle ORM e migrações versionadas;
- Tailwind CSS e estilos próprios;
- Render Web Service e Render Postgres.

## Executar localmente

É necessário ter um PostgreSQL acessível. Copie `.env.example` para `.env.local`
e ajuste `DATABASE_URL`.

```bash
npm ci
npm run db:migrate
npm run dev
```

## Verificações

```bash
npm run lint
npm test
npm run db:generate
```

`npm test` gera o build e executa os testes automatizados. `db:generate` deve
informar que o esquema não sofreu mudanças quando todas as migrações estão
versionadas corretamente.

## Publicar no Render

1. Mescle a branch aprovada na `main`.
2. No Render, crie um Blueprint e conecte este repositório.
3. Revise os recursos e custos descritos em `render.yaml`.
4. Aplique o Blueprint.

O Render injeta `DATABASE_URL`, executa o build, aplica as migrações no comando
de pré-publicação e inicia o servidor. Novos commits na `main` geram publicações
automáticas.

## Estrutura principal

- `app/`: páginas, componentes, estilos e rotas HTTP;
- `db/`: conexão e esquema PostgreSQL;
- `drizzle/`: migrações versionadas;
- `server/`: autenticação, segurança e regras de negócio;
- `tests/`: testes automatizados;
- `public/`: imagens e arquivos públicos;
- `render.yaml`: infraestrutura do Render.

## Segurança

Não adicione segredos ao repositório. Arquivos `.env*`, artefatos de build e
credenciais permanecem ignorados pelo Git. O banco aceita somente conexões pela
rede privada do Render. Currículos são validados, armazenados no PostgreSQL e
entregues apenas por rotas autenticadas com resposta sem cache.
