# Plano de execução — APTA Mobile

## 1. Objetivo

Evoluir o protótipo atual da APTA para uma plataforma mobile-first, acessível e
preparada para funcionar como aplicativo. A primeira entrega será uma aplicação
web instalável (PWA), aproveitando o projeto existente. Depois, a mesma API poderá
atender uma versão nativa para Android e iOS sem duplicar regras de negócio.

A plataforma terá um login único. Depois da autenticação, o servidor identifica
o tipo da conta e libera somente a experiência correspondente:

- `CANDIDATO`: pessoa com deficiência visual;
- `EMPRESA`: representante de uma empresa;
- `ADMIN`: administração da APTA.

O cadastro público permitirá criar contas de candidato ou empresa. Contas de
administração serão criadas apenas por um administrador autorizado.

## 2. Princípios do produto

- Mobile-first: todas as funções principais devem funcionar em telas pequenas.
- Acessibilidade desde a primeira tela, incluindo login e recuperação de senha.
- Permissões validadas no servidor, nunca apenas escondidas na interface.
- Dados pessoais compartilhados somente com consentimento do candidato.
- Currículos armazenados de forma privada e entregues por links temporários.
- Nenhuma senha ou dado profissional importante será salvo apenas no navegador.
- Entregas pequenas, testáveis e publicáveis ao final de cada etapa.

## 3. Arquitetura prevista

### Aplicação

- Etapa inicial: PWA responsiva no projeto atual, com React e TypeScript.
- Etapa posterior: aplicativo React Native com Expo para Android e iOS.
- Navegação protegida de acordo com o tipo da conta.
- Preferências locais apenas para acessibilidade, tema e rascunhos temporários.

### Serviços

- API compartilhada em Node.js e TypeScript.
- Cloudflare D1 para contas, perfis, questionários, eventos e agendamentos.
- Cloudflare R2, compatível com S3, para currículos privados.
- E-mail transacional para recuperação de senha e confirmações.
- Notificações push para treinamentos, palestras e contatos.
- Mercado Pago ou Stripe para pagamentos de ingressos, após validação comercial.

### Segurança

- Hash forte de senha.
- Sessões curtas com renovação segura.
- Token de recuperação de senha com validade e uso único.
- Controle de acesso por função em todas as operações da API.
- Registro de ações administrativas.
- Consentimento, exportação e exclusão de dados conforme a LGPD.

## 4. Estrutura de dados principal

- `users`: identidade, e-mail, senha, tipo, estado e datas de acesso.
- `candidate_profiles`: dados profissionais, contato e consentimentos.
- `company_profiles`: dados da empresa e responsável.
- `resumes`: metadados e localização privada do currículo.
- `questionnaires`, `questions` e `answers`: conteúdo e progresso instrutivo.
- `talks`: palestra, preço, capacidade, data, formato e estado.
- `ticket_orders` e `tickets`: compra, reserva e ingresso individual.
- `training_slots`: períodos livres, bloqueados ou encerrados.
- `training_bookings`: agendamentos e seus estados.
- `plans` e `company_subscriptions`: APTA Essencial e Inclusão 360.
- `consultancies`: solicitações, agenda e acompanhamento.
- `notifications`: avisos enviados ou pendentes.
- `audit_logs`: operações administrativas sensíveis.

## 5. Fluxos por tipo de conta

### Entrada unificada

1. O usuário abre o aplicativo.
2. Informa e-mail e senha em uma única página.
3. Também pode escolher “Esqueci minha senha” ou “Cadastrar-se”.
4. O servidor autentica e retorna o tipo da conta.
5. O aplicativo abre automaticamente a área correspondente.

### Candidato

- Completar informações pessoais e profissionais.
- Autorizar ou revogar o compartilhamento com empresas.
- Enviar, substituir e excluir currículo.
- Responder questionários instrutivos e acompanhar progresso.
- Consultar períodos disponíveis e agendar treinamentos.
- Receber lembretes e acompanhar a agenda.

Navegação principal: Início, Aprender, Agenda e Perfil.

### Empresa

- Filtrar candidatos por localidade, formação, área, experiência e modalidade.
- Consultar perfis autorizados e visualizar currículos.
- Favoritar talentos e solicitar contato.
- Consultar APTA Essencial e APTA Inclusão 360.
- Solicitar consultorias e treinamentos.
- Consultar palestras, adquirir ingressos e acessar comprovantes.

Navegação principal: Início, Talentos, Serviços, Agenda e Empresa.

### Administração

- Criar, editar, publicar e cancelar palestras.
- Definir preço e quantidade fixa de ingressos.
- Acompanhar disponibilidade, vendas e participantes.
- Criar períodos livres para treinamentos.
- Bloquear, confirmar, reagendar ou cancelar horários.
- Acompanhar candidatos, empresas, planos e consultorias.
- Gerenciar outros administradores e consultar auditoria.

Navegação principal: Visão geral, Palestras, Treinamentos, Usuários e Ajustes.

## 6. Requisitos de acessibilidade

- Compatibilidade com TalkBack, VoiceOver e leitores de tela no navegador.
- Ordem de foco previsível e foco reposicionado após mudança de tela.
- Rótulos acessíveis em campos, botões, ícones e mensagens.
- Áreas de toque de pelo menos 44 por 44 pontos.
- Suporte à ampliação de texto sem perda de conteúdo.
- Alto contraste e ausência de informações transmitidas apenas por cor.
- Formulários curtos, com instruções e erros associados aos campos.
- Confirmações anunciadas por região viva.
- Alternativa a gestos complexos e redução de movimento.
- Seleção e confirmação acessíveis de arquivos.
- Testes reais com TalkBack e VoiceOver antes da publicação.

## 7. Etapas de execução

### Etapa 1 — Fundação mobile e acesso unificado

Estado: **concluída**

- [x] Transformar a primeira tela em login unificado mobile-first.
- [x] Adicionar “Esqueci minha senha”.
- [x] Adicionar “Cadastrar-se”.
- [x] Permitir cadastro de candidato ou empresa.
- [x] Direcionar a demonstração pelo tipo associado ao e-mail.
- [x] Remover o segundo login exclusivo da administração.
- [x] Garantir teclado, leitor de tela, contraste e layout responsivo.
- [x] Validar a versão publicada.

Critério de aceite: os três tipos entram pela mesma tela e cadastro/recuperação
possuem fluxos completos de interface, sem armazenar senha real no cliente.

### Etapa 2 — API, autenticação real e banco de dados

Estado: **planejada**

- [ ] Criar API e banco Cloudflare D1.
- [ ] Criar contas, sessões e permissões.
- [ ] Implementar confirmação de e-mail.
- [ ] Implementar recuperação e redefinição de senha.
- [ ] Adicionar limitação de tentativas e auditoria.
- [ ] Integrar o aplicativo à API.

Critério de aceite: contas e sessões persistem com segurança e o servidor impede
acesso entre tipos diferentes.

### Etapa 3 — Perfil do candidato e currículo

Estado: **planejada**

- [ ] Persistir informações pessoais e profissionais.
- [ ] Implementar consentimentos de compartilhamento.
- [ ] Criar envio privado de PDF e DOCX.
- [ ] Permitir substituir, baixar e excluir currículo.
- [ ] Exibir progresso do perfil.

Critério de aceite: o candidato controla seus dados e uma empresa vê somente o
que foi autorizado.

### Etapa 4 — Questionários instrutivos

Estado: **planejada**

- [ ] Cadastrar módulos e perguntas.
- [ ] Salvar respostas e progresso.
- [ ] Apresentar feedback e resultado.
- [ ] Adicionar conteúdo em texto e áudio quando necessário.

Critério de aceite: o usuário pode interromper e continuar um questionário em
outro momento sem perder o progresso.

### Etapa 5 — Talentos e contato da empresa

Estado: **planejada**

- [ ] Implementar busca e filtros persistentes.
- [ ] Exibir perfis autorizados.
- [ ] Implementar favoritos.
- [ ] Criar solicitação de contato com histórico.

Critério de aceite: a empresa encontra talentos relevantes sem acessar dados
privados ou não autorizados.

### Etapa 6 — Treinamentos e consultorias

Estado: **planejada**

- [ ] Criar períodos livres e bloqueios administrativos.
- [ ] Impedir conflito ou reserva dupla.
- [ ] Implementar agendamento, confirmação, reagendamento e cancelamento.
- [ ] Criar acompanhamento das consultorias e planos empresariais.
- [ ] Enviar lembretes.

Critério de aceite: duas pessoas não conseguem reservar a última vaga ao mesmo
tempo e toda mudança fica registrada.

### Etapa 7 — Palestras, preços e ingressos

Estado: **planejada**

- [ ] Persistir palestras, preço e capacidade.
- [ ] Implementar reserva temporária de vagas.
- [ ] Integrar pagamento.
- [ ] Emitir ingresso digital e comprovante.
- [ ] Implementar cancelamento e estorno conforme as regras.

Critério de aceite: o sistema nunca vende acima da capacidade e o administrador
acompanha participantes e receita.

### Etapa 8 — PWA, aplicativo nativo e notificações

Estado: **planejada**

- [ ] Adicionar manifesto, ícones e instalação da PWA.
- [ ] Definir comportamento offline seguro.
- [ ] Criar aplicativo Expo usando a mesma API.
- [ ] Implementar notificações push.
- [ ] Preparar versões de teste para Android e iOS.

Critério de aceite: a PWA pode ser instalada e o aplicativo nativo executa os
fluxos principais nos dois sistemas.

### Etapa 9 — Qualidade, LGPD e publicação

Estado: **planejada**

- [ ] Testar acessibilidade com usuários reais.
- [ ] Testar segurança, permissões, pagamentos e concorrência.
- [ ] Criar política de privacidade e termos.
- [ ] Implementar exportação e exclusão de conta.
- [ ] Publicar a versão web e preparar Google Play e App Store.

Critério de aceite: os fluxos críticos são aprovados, não há falhas bloqueadoras
e os requisitos legais e de acessibilidade estão documentados.

## 8. Prioridade do MVP

1. Login, cadastro e recuperação de senha.
2. Perfil, consentimento e currículo.
3. Busca de candidatos.
4. Questionários.
5. Agenda de treinamentos.
6. Palestras e ingressos.
7. Planos, consultorias e notificações.
8. Aplicativo nativo e lojas.

## 9. Registro de execução

Este bloco será atualizado ao final de cada etapa.

| Data | Etapa | Resultado |
| --- | --- | --- |
| 16/07/2026 | Planejamento | Plano técnico e funcional criado. |
| 16/07/2026 | Etapa 1 | Login unificado, cadastro, recuperação de senha e redirecionamento por tipo implementados; versão publicada e validada. |
