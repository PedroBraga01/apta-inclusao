# Arquitetura da APTA

## Decisão inicial

A primeira versão de produção utilizará Cloudflare D1 para dados relacionais e
Cloudflare R2 para currículos privados. O projeto já executa em Cloudflare
Workers por meio do Vinext e possui suporte local aos dois bindings.

Essa escolha reduz serviços externos durante a construção feita por uma única
pessoa e permite publicar API, interface e armazenamento no mesmo ambiente. O
acesso ao banco e aos arquivos permanecerá isolado em módulos próprios para que
uma futura migração para PostgreSQL ou outro armazenamento S3 não exija mudanças
nas telas ou nas regras de negócio.

## Aplicação

- Uma única aplicação React, Next.js e TypeScript.
- Design mobile-first e responsivo.
- Instalação como PWA em Android e iOS.
- Nenhuma aplicação nativa separada.
- Portais protegidos para candidato, empresa e administração.

## Backend

- Route handlers executados no Cloudflare Worker.
- Drizzle ORM para consultas e migrações.
- Validação e autorização realizadas no servidor.
- Respostas de erro sem dados internos ou sensíveis.
- Regras de negócio organizadas por domínio.

## Dados

Os identificadores públicos usam UUID. Datas são persistidas em UTC. Valores
monetários são armazenados em centavos inteiros. Dados estruturados pequenos,
como listas de competências, usam JSON no D1.

As tabelas estão agrupadas nos domínios:

- identidade e acesso;
- candidatos, consentimentos e currículos;
- empresas, favoritos e contatos;
- questionários e respostas;
- treinamentos, planos e consultorias;
- palestras, pedidos e ingressos;
- notificações e auditoria.

## Arquivos privados

Currículos serão armazenados no binding R2 `RESUMES`. A chave real do objeto não
será exposta diretamente. Download e visualização passarão por uma rota
autorizada, com expiração e registro de auditoria.

## Segurança

- Senhas nunca serão armazenadas em texto puro.
- Sessões usarão tokens aleatórios armazenados no banco somente como hash.
- Cookies terão atributos seguros e não serão acessíveis ao JavaScript.
- Permissões serão validadas em cada operação da API.
- Tokens de confirmação e recuperação terão expiração e uso único.
- Operações administrativas e acessos a currículos serão auditados.

## Portabilidade

Componentes de interface não consultarão D1 ou R2 diretamente. Eles consumirão
funções de serviço ou rotas da API. Essa separação mantém aberta a possibilidade
de trocar a infraestrutura sem reconstruir o produto.
