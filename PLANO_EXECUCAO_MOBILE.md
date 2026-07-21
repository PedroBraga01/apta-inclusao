# Plano de execução — APTA web responsiva

## 1. Objetivo

Construir integralmente a plataforma APTA como uma aplicação web mobile-first,
acessível e responsiva. A mesma aplicação atenderá celulares Android e iOS,
tablets e computadores. A instalação como PWA será adicionada posteriormente;
não será criado aplicativo nativo.

O desenvolvimento, os testes, a documentação e a preparação da infraestrutura
serão executados neste repositório. A produção utilizará exclusivamente Render.

## 2. Arquitetura definida

- Next.js, React e TypeScript para interface, renderização e APIs.
- Um Render Web Service para frontend e backend no mesmo domínio.
- Render Postgres para todos os dados e currículos privados.
- Drizzle ORM e migrações PostgreSQL versionadas.
- Rede privada entre aplicação e banco.
- Design responsivo e acessibilidade desde a primeira tela.
- PWA somente após os fluxos centrais estarem concluídos e validados.

## 3. Tipos de usuário

### Candidato

- Completar perfil pessoal e profissional.
- Controlar consentimentos de compartilhamento.
- Enviar, substituir, baixar e excluir currículo.
- Responder questionários e acompanhar progresso.
- Consultar e agendar treinamentos.
- Receber avisos e acompanhar solicitações de empresas.

### Empresa

- Completar o cadastro empresarial.
- Buscar candidatos com compartilhamento autorizado.
- Filtrar, favoritar e solicitar contato com talentos.
- Consultar planos, treinamentos e consultorias.
- Comprar ingressos para palestras e consultar comprovantes.

### Administração

- Gerenciar candidatos, empresas e outros administradores.
- Criar e publicar questionários.
- Administrar treinamentos, horários e consultorias.
- Criar palestras, preços, capacidade e ingressos.
- Acompanhar planos, notificações e auditoria.

Contas administrativas não podem ser criadas pelo cadastro público.

## 4. Requisitos permanentes

- Permissões validadas no servidor em todas as operações.
- Dados pessoais compartilhados somente após consentimento.
- Senhas e tokens nunca armazenados em texto puro.
- Currículos privados e nunca incluídos em respostas públicas.
- Navegação completa por teclado e leitores de tela.
- Áreas de toque adequadas, foco previsível e alto contraste.
- Layout funcional desde 320 px até telas grandes.
- Testes automatizados para regras críticas.
- Migrações e health check obrigatórios antes da publicação.

## 5. Etapas de execução

### Etapa 1 — Base responsiva e acesso unificado

Estado: **concluída**

- [x] Criar login unificado mobile-first.
- [x] Adicionar cadastro e recuperação de senha.
- [x] Direcionar cada tipo de conta ao portal correto.
- [x] Restaurar usuários padrão e acessos rápidos para candidato, empresa e administração.
- [x] Implementar teclado, contraste, ampliação até 200%, espaçamento e regiões de anúncio.
- [x] Revisar o layout mobile para reflow a partir de 320 px e alvos de toque ampliados.

### Etapa 2 — Backend, autenticação e PostgreSQL

Estado: **implementada; aguardando primeira publicação no Render**

- [x] Criar esquema relacional com 23 tabelas.
- [x] Migrar a persistência para PostgreSQL.
- [x] Implementar cadastro, confirmação de e-mail e login.
- [x] Implementar sessões seguras e logout.
- [x] Implementar recuperação e redefinição de senha.
- [x] Limitar tentativas de login.
- [x] Adicionar transações nas operações com múltiplas gravações.
- [x] Preparar Web Service, banco, migrações e health check no Render.
- [ ] Criar os recursos pelo Blueprint e validar o endereço de produção.

### Etapa 3 — Perfil, consentimentos e currículo

Estado: **implementada; aguardando validação integrada no Render**

- [x] Persistir informações pessoais e profissionais.
- [x] Calcular progresso do perfil.
- [x] Registrar consentimentos imutáveis.
- [x] Permitir envio privado de PDF, DOC e DOCX.
- [x] Permitir substituição, download e exclusão.
- [x] Remover o conteúdo de arquivos substituídos ou excluídos.
- [ ] Executar testes de integração contra o PostgreSQL do Render.

### Etapa 4 — Questionários instrutivos

Estado: **planejada**

- [ ] Criar gestão administrativa de módulos e perguntas.
- [ ] Salvar respostas e progresso do candidato.
- [ ] Permitir interrupção e retomada.
- [ ] Apresentar feedback acessível em texto e áudio quando necessário.

### Etapa 5 — Busca de talentos e contato

Estado: **planejada**

- [ ] Implementar filtros persistentes.
- [ ] Exibir somente perfis autorizados.
- [ ] Implementar favoritos.
- [ ] Criar solicitações de contato com histórico e auditoria.
- [ ] Liberar currículo somente com autorização válida.

### Etapa 6 — Treinamentos, planos e consultorias

Estado: **planejada**

- [ ] Criar períodos livres e bloqueios administrativos.
- [ ] Impedir conflitos e reservas acima da capacidade.
- [ ] Implementar agendamento, confirmação, reagendamento e cancelamento.
- [ ] Implementar planos empresariais e acompanhamento de consultorias.
- [ ] Enviar lembretes.

### Etapa 7 — Palestras, pagamentos e ingressos

Estado: **planejada**

- [ ] Persistir palestras, preços e capacidade.
- [ ] Implementar reserva temporária de vagas.
- [ ] Integrar o provedor de pagamento escolhido.
- [ ] Emitir ingresso e comprovante digitais.
- [ ] Implementar cancelamento e estorno.
- [ ] Garantir atomicidade para não vender acima da capacidade.

### Etapa 8 — Notificações e PWA

Estado: **planejada**

- [ ] Implementar notificações internas e por e-mail.
- [ ] Adicionar manifesto, ícones e instalação da PWA.
- [ ] Definir cache e comportamento offline sem armazenar dados sensíveis.
- [ ] Implementar notificações push quando houver valor real para o usuário.
- [ ] Validar instalação pelo navegador no Android e iOS.

### Etapa 9 — LGPD, qualidade e produção

Estado: **planejada**

- [ ] Implementar exportação e exclusão de conta.
- [ ] Criar política de privacidade e termos.
- [ ] Auditar acessos administrativos e currículos.
- [ ] Testar permissões, concorrência e recuperação de falhas.
- [ ] Testar com leitores de tela e usuários reais.
- [ ] Configurar domínio, observabilidade, backups e alertas no Render.

## 6. Ordem de execução imediata

1. Publicar a arquitetura PostgreSQL no Render.
2. Validar autenticação, sessão, perfil e currículo em produção.
3. Implementar questionários.
4. Implementar busca autorizada e solicitações de contato.
5. Implementar agenda, serviços empresariais e palestras.
6. Completar PWA, LGPD e endurecimento operacional.

## 7. Critério de conclusão de cada etapa

Uma etapa só será considerada concluída quando código, migração, interface,
permissões, responsividade, acessibilidade, testes e documentação estiverem
coerentes e a versão publicada estiver saudável no Render.

## 8. Registro de execução

Este bloco será atualizado ao final de cada etapa.

| Data | Etapa | Resultado |
| --- | --- | --- |
| 16/07/2026 | Planejamento | Plano técnico e funcional criado. |
| 20/07/2026 | Revisão mobile | Navegação mobile redesenhada, acessibilidade para baixa visão ampliada e acessos rápidos dos três perfis restaurados. |

## 9. Referências de acessibilidade aplicadas

- [WCAG 2.2 — contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [WCAG 2.2 — redimensionamento de texto](https://www.w3.org/WAI/WCAG22/Understanding/resize-text)
- [WCAG — reflow em 320 CSS pixels](https://www.w3.org/WAI/WCAG21/Understanding/reflow)
- [W3C — necessidades de pessoas com baixa visão](https://www.w3.org/TR/low-vision-needs/)
- [Apple — acessibilidade e ampliação de texto](https://developer.apple.com/design/human-interface-guidelines/accessibility/)
- [Android — alvos de toque de 48 dp](https://developer.android.com/develop/ui/compose/accessibility/api-defaults)
