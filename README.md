# APTA — Talento não tem barreiras

Plataforma web acessível que conecta profissionais com deficiência visual a
empresas comprometidas com inclusão. A aplicação reúne jornadas específicas
para candidatos, empresas e para a administração da APTA.

## Estado atual

O repositório contém uma aplicação navegável e responsiva dos três portais. A
autenticação, as sessões e o modelo relacional já possuem base de servidor; os
demais domínios ainda serão substituídos progressivamente por operações da API.

Já disponível na demonstração:

- acesso unificado para candidato, empresa e administração;
- cadastro, confirmação de e-mail, sessão e recuperação pela API;
- perfil e consentimentos persistentes do candidato;
- currículo privado armazenado no R2;
- perfil, questionário, currículo e palestras do candidato;
- busca de talentos, consultoria e treinamentos da empresa;
- gestão de palestras, ingressos e treinamentos pela administração;
- navegação por teclado, alto contraste, ampliação de texto e regiões de anúncio;
- layout adaptado para celular, tablet e computador.

O plano completo está em [PLANO_EXECUCAO_MOBILE.md](./PLANO_EXECUCAO_MOBILE.md).

## Direção do produto

A APTA será uma única aplicação web mobile-first e instalável como PWA. Não há
aplicativo nativo separado: a mesma interface responsiva atenderá Android, iOS,
tablets e computadores.

As próximas entregas incluem:

- autenticação e permissões reais;
- persistência de perfis e consentimentos;
- armazenamento privado de currículos;
- questionários com progresso salvo;
- busca autorizada de candidatos e solicitações de contato;
- treinamentos, consultorias, planos, palestras e ingressos;
- pagamentos, notificações, recursos de PWA e requisitos de LGPD.

## Tecnologias

- React 19 e Next.js 16;
- TypeScript;
- Vinext e Vite;
- Cloudflare Workers para a execução publicada;
- Drizzle ORM para acesso ao banco;
- Tailwind CSS e estilos próprios.

## Requisitos

- Node.js 22.13 ou superior;
- npm 11 ou superior.

## Executar localmente

```bash
npm ci
npm run db:migrate:local
npm run dev
```

O comando de migração prepara o D1 local antes da primeira execução. O endereço
da aplicação é informado pelo servidor de desenvolvimento.

## Verificações

```bash
npm run lint
npm test
npm run build
```

`npm test` gera o build e valida autenticação, cookies, metadados e a tela de
acesso renderizada da APTA.

## Estrutura principal

- `app/`: páginas, componentes e estilos da aplicação;
- `db/`: conexão e esquema do banco;
- `server/`: autenticação, segurança e regras executadas no servidor;
- `worker/`: entrada da aplicação no Cloudflare Worker;
- `tests/`: testes automatizados;
- `public/`: imagens e arquivos públicos;
- `.openai/hosting.json`: configuração da hospedagem atual.

## Segurança

Não adicione segredos ao repositório. Arquivos `.env*`, bancos locais, artefatos
de build e estado do Wrangler permanecem ignorados pelo Git. Credenciais reais
serão configuradas somente nos ambientes apropriados.
