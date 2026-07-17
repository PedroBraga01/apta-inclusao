# APTA — Talento não tem barreiras

Plataforma web acessível que conecta profissionais com deficiência visual a
empresas comprometidas com inclusão. A aplicação reúne jornadas específicas
para candidatos, empresas e para a administração da APTA.

## Estado atual

O repositório contém uma demonstração navegável e responsiva dos três portais.
Os fluxos ainda usam dados locais e serão substituídos progressivamente por API,
autenticação real, banco de dados e armazenamento privado.

Já disponível na demonstração:

- acesso unificado para candidato, empresa e administração;
- cadastro e recuperação de senha em modo demonstrativo;
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
npm run dev
```

O endereço local é informado pelo servidor de desenvolvimento.

## Verificações

```bash
npm run lint
npm test
npm run build
```

`npm test` gera o build e valida o HTML renderizado da tela de acesso da APTA.

## Acessos demonstrativos

Enquanto a autenticação real não estiver implementada, a própria tela de login
oferece três contas de demonstração:

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Candidato | `candidato@apta.org.br` | `apta123` |
| Empresa | `empresa@apta.org.br` | `apta123` |
| Administração | `admin@apta.org.br` | `apta360` |

Essas credenciais são apenas dados públicos de demonstração e não representam
contas reais.

## Estrutura principal

- `app/`: páginas, componentes e estilos da aplicação;
- `db/`: conexão e esquema do banco;
- `worker/`: entrada da aplicação no Cloudflare Worker;
- `tests/`: testes automatizados;
- `public/`: imagens e arquivos públicos;
- `.openai/hosting.json`: configuração da hospedagem atual.

## Segurança

Não adicione segredos ao repositório. Arquivos `.env*`, bancos locais, artefatos
de build e estado do Wrangler permanecem ignorados pelo Git. Credenciais reais
serão configuradas somente nos ambientes apropriados.
