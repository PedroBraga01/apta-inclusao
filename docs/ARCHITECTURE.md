# Arquitetura da APTA

## Decisão de infraestrutura

A produção utiliza exclusivamente serviços do Render. A interface e o backend
formam uma aplicação Next.js full-stack executada em um Render Web Service. Os
dados relacionais e os currículos privados ficam em um Render Postgres.

Os serviços são criados na região `virginia`. O PostgreSQL bloqueia conexões
externas e fornece sua URL interna ao Web Service por meio de `DATABASE_URL`.

## Aplicação

- Uma única aplicação Next.js, React e TypeScript.
- Renderização, recursos estáticos e APIs no mesmo domínio.
- Design mobile-first e responsivo.
- PWA prevista para uma etapa posterior.
- Nenhuma aplicação nativa separada.
- Portais protegidos para candidato, empresa e administração.

## Backend

- Route Handlers do Next.js executados no runtime Node.js.
- Drizzle ORM com driver `node-postgres`.
- Transações PostgreSQL nas operações com múltiplas gravações.
- Migrações executadas pelo `preDeployCommand` antes da publicação.
- Validação e autorização realizadas no servidor.
- Respostas de erro sem dados internos ou sensíveis.
- Health check em `/api/health` incluindo acesso ao banco.

## Dados

Os identificadores públicos usam UUID gerado pela aplicação. Datas são gravadas
em UTC no formato ISO 8601. Valores monetários são armazenados em centavos
inteiros. Listas e estruturas pequenas usam `jsonb`.

As 23 tabelas estão agrupadas nos domínios:

- identidade, autenticação e sessões;
- candidatos, consentimentos e currículos;
- empresas, favoritos e contatos;
- questionários e respostas;
- treinamentos, planos e consultorias;
- palestras, pedidos e ingressos;
- notificações e auditoria.

## Currículos privados

O conteúdo de PDF, DOC e DOCX é armazenado em uma coluna `bytea` do PostgreSQL,
com limite de 10 MB. A resposta de metadados nunca inclui o conteúdo. Download e
exclusão passam por rotas autenticadas, e arquivos substituídos ou excluídos têm
o conteúdo removido do registro.

Essa decisão mantém todo o produto dentro do Render e evita depender do sistema
de arquivos efêmero do Web Service ou de armazenamento externo. Quando o volume
de arquivos justificar outra solução, a camada de serviço poderá ser substituída
sem alterar as telas ou as regras de autorização.

## Segurança e operação

- Senhas usam PBKDF2-HMAC-SHA256 com salt exclusivo.
- Tokens de sessão são aleatórios e persistidos somente como hash.
- Cookies são HttpOnly, SameSite e Secure em HTTPS.
- Confirmação e recuperação usam tokens com expiração e uso único.
- Operações de conta usam transações atômicas.
- O PostgreSQL é acessível somente pela rede privada do Render.
- Planos pagos são usados porque a versão gratuita do banco expira e não possui
  garantias adequadas para dados pessoais em produção.

## Publicação

O Blueprint em `render.yaml` cria o Web Service e o PostgreSQL, injeta a URL de
conexão, executa o build, aplica migrações e verifica `/api/health`. O Render só
promove uma nova versão quando o serviço inicia com sucesso.
