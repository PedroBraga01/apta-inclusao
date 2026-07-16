"use client";

import { FormEvent, useMemo, useRef, useState } from "react";

type Portal = "home" | "candidate" | "company";
type CandidateView = "inicio" | "perfil" | "questionario" | "curriculo";
type CompanyView = "visao" | "talentos" | "consultoria" | "conteudos" | "empresa";

type Candidate = {
  id: number;
  initials: string;
  name: string;
  city: string;
  state: string;
  area: string;
  mode: string;
  disability: string;
  education: string;
  experience: string;
  skills: string[];
  match: number;
};

const candidates: Candidate[] = [
  {
    id: 1,
    initials: "AC",
    name: "Ana Carvalho",
    city: "Campinas",
    state: "SP",
    area: "Design",
    mode: "Remoto",
    disability: "Baixa visão",
    education: "Superior completo",
    experience: "4 anos em UX e pesquisa com usuários",
    skills: ["UX/UI", "Figma", "Pesquisa"],
    match: 94,
  },
  {
    id: 2,
    initials: "GL",
    name: "Gabriel Lima",
    city: "São Paulo",
    state: "SP",
    area: "Administrativo",
    mode: "Híbrido",
    disability: "Cegueira total",
    education: "Superior em andamento",
    experience: "3 anos em rotinas administrativas",
    skills: ["Excel", "Atendimento", "Organização"],
    match: 91,
  },
  {
    id: 3,
    initials: "JS",
    name: "Juliana Santos",
    city: "Sorocaba",
    state: "SP",
    area: "Atendimento",
    mode: "Presencial",
    disability: "Cegueira parcial",
    education: "Ensino médio completo",
    experience: "5 anos em relacionamento com clientes",
    skills: ["CRM", "Comunicação", "Vendas"],
    match: 87,
  },
  {
    id: 4,
    initials: "RC",
    name: "Rafael Costa",
    city: "Belo Horizonte",
    state: "MG",
    area: "Tecnologia",
    mode: "Remoto",
    disability: "Baixa visão",
    education: "Superior completo",
    experience: "2 anos em análise de dados",
    skills: ["Python", "Power BI", "SQL"],
    match: 84,
  },
];

const candidateNavigation: Array<{ id: CandidateView; label: string; marker: string }> = [
  { id: "inicio", label: "Início", marker: "01" },
  { id: "perfil", label: "Meu perfil", marker: "02" },
  { id: "questionario", label: "Questionário", marker: "03" },
  { id: "curriculo", label: "Currículo", marker: "04" },
];

const companyNavigation: Array<{ id: CompanyView; label: string; marker: string }> = [
  { id: "visao", label: "Visão geral", marker: "01" },
  { id: "talentos", label: "Buscar talentos", marker: "02" },
  { id: "consultoria", label: "Consultoria", marker: "03" },
  { id: "conteudos", label: "Treinamentos", marker: "04" },
  { id: "empresa", label: "Minha empresa", marker: "05" },
];

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`brand ${inverse ? "brand--inverse" : ""}`} aria-label="APTA">
      <span>A</span><span>P</span><span>T</span><span>A</span>
    </span>
  );
}

function Marker({ children }: { children: string }) {
  return <span className="nav-marker" aria-hidden="true">{children}</span>;
}

function Home({ onEnter }: { onEnter: (portal: Portal) => void }) {
  return (
    <div className="home-page">
      <header className="home-header page-width">
        <button className="brand-button" type="button" aria-label="Ir para a página inicial">
          <Brand />
        </button>
        <nav className="home-nav" aria-label="Navegação principal">
          <a href="#como-funciona">Como funciona</a>
          <a href="#solucoes">Soluções</a>
          <button className="text-button" type="button" onClick={() => onEnter("company")}>Área da empresa</button>
        </nav>
      </header>

      <main id="conteudo-principal">
        <section className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span aria-hidden="true">●</span> Tecnologia que inclui</p>
            <h1 id="hero-title">Talento não tem <em>barreiras.</em></h1>
            <p className="hero-lead">
              A APTA conecta profissionais com deficiência visual a empresas que querem transformar inclusão em prática.
            </p>
            <div className="hero-actions" aria-label="Escolha como entrar">
              <button className="button button--primary button--large" type="button" onClick={() => onEnter("candidate")}>Sou candidato <span aria-hidden="true">→</span></button>
              <button className="button button--outline button--large" type="button" onClick={() => onEnter("company")}>Sou empresa</button>
            </div>
            <div className="hero-proof" aria-label="Compromissos da plataforma">
              <span><b>100%</b> acessível</span>
              <span><b>Conexões</b> relevantes</span>
              <span><b>Suporte</b> contínuo</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Resumo da jornada APTA">
            <div className="visual-orbit visual-orbit--one" aria-hidden="true" />
            <div className="visual-orbit visual-orbit--two" aria-hidden="true" />
            <article className="journey-card journey-card--candidate">
              <div className="journey-topline">
                <span className="journey-avatar" aria-hidden="true">MC</span>
                <span className="status-pill">Perfil 68%</span>
              </div>
              <p className="journey-label">Para profissionais</p>
              <h2>Seu potencial em evidência.</h2>
              <div className="progress-track" aria-label="Perfil preenchido em 68%"><span style={{ width: "68%" }} /></div>
              <ul>
                <li><span aria-hidden="true">✓</span> Informações profissionais</li>
                <li><span aria-hidden="true">✓</span> Preferências de trabalho</li>
                <li className="muted"><span aria-hidden="true">○</span> Enviar currículo</li>
              </ul>
            </article>
            <div className="connection-badge" aria-hidden="true"><span>APTA</span><small>conecta</small></div>
            <article className="journey-card journey-card--company">
              <div className="company-symbol" aria-hidden="true"><span /><span /><span /></div>
              <p className="journey-label">Para empresas</p>
              <h2>Inclusão que gera impacto.</h2>
              <div className="mini-stat-row">
                <span><b>24</b><small>talentos</small></span>
                <span><b>8</b><small>conexões</small></span>
              </div>
            </article>
          </div>
        </section>

        <section className="path-section" id="como-funciona">
          <div className="page-width">
            <p className="eyebrow eyebrow--light">Uma plataforma. Dois caminhos.</p>
            <div className="path-heading">
              <h2>Inclusão começa com acesso — e evolui com atitude.</h2>
              <p>Construímos jornadas específicas para quem busca oportunidades e para quem quer oferecê-las com responsabilidade.</p>
            </div>
            <div className="path-grid" id="solucoes">
              <article className="path-card path-card--candidate">
                <span className="path-number">01</span>
                <p>Para profissionais</p>
                <h3>Mostre quem você é. Do seu jeito.</h3>
                <ul>
                  <li>Experiência totalmente acessível</li>
                  <li>Questionário de perfil e preferências</li>
                  <li>Currículo e contatos em um só lugar</li>
                </ul>
                <button type="button" className="inline-action" onClick={() => onEnter("candidate")}>Acessar área do candidato <span aria-hidden="true">↗</span></button>
              </article>
              <article className="path-card path-card--company">
                <span className="path-number">02</span>
                <p>Para empresas</p>
                <h3>Contrate melhor. Inclua de verdade.</h3>
                <ul>
                  <li>Busca inteligente por talentos</li>
                  <li>Consultoria e treinamentos práticos</li>
                  <li>Acompanhamento para evolução contínua</li>
                </ul>
                <button type="button" className="inline-action inline-action--light" onClick={() => onEnter("company")}>Acessar área da empresa <span aria-hidden="true">↗</span></button>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer page-width">
        <Brand />
        <p>Acesso para pessoas. Inclusão para empresas.</p>
        <p>© 2026 APTA</p>
      </footer>
    </div>
  );
}

function AccessibilityBar({
  fontScale,
  setFontScale,
  highContrast,
  setHighContrast,
  onRead,
}: {
  fontScale: number;
  setFontScale: (value: number) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  onRead: () => void;
}) {
  return (
    <div className="accessibility-bar" role="region" aria-label="Ferramentas de acessibilidade">
      <p>Ferramentas de acessibilidade</p>
      <div className="accessibility-actions">
        <button type="button" onClick={() => setFontScale(Math.max(100, fontScale - 10))} aria-label="Diminuir tamanho do texto">A−</button>
        <button type="button" onClick={() => setFontScale(Math.min(130, fontScale + 10))} aria-label="Aumentar tamanho do texto">A+</button>
        <button type="button" aria-pressed={highContrast} onClick={() => setHighContrast(!highContrast)}><span className="contrast-dot" aria-hidden="true" /> Alto contraste</button>
        <button type="button" onClick={onRead}><span aria-hidden="true">◖</span> Ouvir página</button>
      </div>
    </div>
  );
}

function CandidateSidebar({
  view,
  onChange,
  onExit,
}: {
  view: CandidateView;
  onChange: (view: CandidateView) => void;
  onExit: () => void;
}) {
  return (
    <aside className="candidate-sidebar">
      <button className="brand-button" type="button" onClick={onExit} aria-label="Voltar para o início da APTA"><Brand inverse /></button>
      <nav aria-label="Área do candidato">
        {candidateNavigation.map((item) => (
          <button
            type="button"
            key={item.id}
            className={view === item.id ? "active" : ""}
            aria-current={view === item.id ? "page" : undefined}
            onClick={() => onChange(item.id)}
          >
            <Marker>{item.marker}</Marker>{item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-support">
        <p>Precisa de ajuda?</p>
        <button type="button">Falar com o suporte</button>
      </div>
      <button className="sidebar-exit" type="button" onClick={onExit}>Sair da conta</button>
    </aside>
  );
}

function CandidateHome({ onChange }: { onChange: (view: CandidateView) => void }) {
  return (
    <>
      <header className="dashboard-heading">
        <div>
          <p className="eyebrow">Quinta-feira, 16 de julho</p>
          <h1>Olá, Marina.</h1>
          <p>Continue preparando seu perfil para as melhores oportunidades.</p>
        </div>
        <span className="profile-avatar" aria-label="Perfil de Marina Costa">MC</span>
      </header>

      <section className="candidate-progress-card" aria-labelledby="progress-title">
        <div className="progress-copy">
          <span className="status-pill status-pill--light">Seu perfil</span>
          <h2 id="progress-title">Você está quase lá.</h2>
          <p>Perfis completos recebem mais convites de empresas parceiras.</p>
          <button className="button button--light" type="button" onClick={() => onChange("curriculo")}>Completar meu perfil <span aria-hidden="true">→</span></button>
        </div>
        <div className="progress-ring" aria-label="Perfil preenchido em 68 por cento"><strong>68%</strong><span>completo</span></div>
      </section>

      <div className="candidate-dashboard-grid">
        <section className="task-panel" aria-labelledby="next-steps-title">
          <div className="section-title-row">
            <div>
              <p className="section-kicker">Sua jornada</p>
              <h2 id="next-steps-title">Próximos passos</h2>
            </div>
            <span>2 de 4 concluídos</span>
          </div>
          <div className="task-list">
            <button type="button" className="task-row task-row--done" onClick={() => onChange("perfil")}>
              <span className="task-check" aria-hidden="true">✓</span>
              <span><b>Informações pessoais</b><small>Seus dados de contato estão atualizados</small></span>
              <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="task-row task-row--done" onClick={() => onChange("questionario")}>
              <span className="task-check" aria-hidden="true">✓</span>
              <span><b>Perfil profissional</b><small>Experiências e áreas de interesse preenchidas</small></span>
              <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="task-row" onClick={() => onChange("questionario")}>
              <span className="task-index" aria-hidden="true">3</span>
              <span><b>Preferências de trabalho</b><small>Conte como é o ambiente ideal para você</small></span>
              <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="task-row" onClick={() => onChange("curriculo")}>
              <span className="task-index" aria-hidden="true">4</span>
              <span><b>Envie seu currículo</b><small>Adicione um arquivo em PDF, DOC ou DOCX</small></span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>

        <aside className="opportunity-panel" aria-labelledby="opportunity-title">
          <p className="section-kicker">Boa combinação</p>
          <h2 id="opportunity-title">Uma vaga pode combinar com você</h2>
          <div className="opportunity-card">
            <span className="company-avatar" aria-hidden="true">N</span>
            <div><b>Assistente administrativo</b><span>Nova Forma • São Paulo</span></div>
            <span className="match-badge">92%</span>
          </div>
          <ul className="clean-list compact-list">
            <li>Modelo híbrido</li>
            <li>Leitores de tela disponíveis</li>
            <li>Processo seletivo acessível</li>
          </ul>
          <button className="button button--outline button--full" type="button">Ver oportunidade</button>
        </aside>
      </div>
    </>
  );
}

function CandidateProfile({ onSaved }: { onSaved: (message: string) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSaved("Perfil atualizado com sucesso.");
  }

  return (
    <section className="form-page" aria-labelledby="profile-title">
      <header className="inner-heading">
        <p className="section-kicker">Meu perfil</p>
        <h1 id="profile-title">Suas informações</h1>
        <p>Mantenha seus dados atualizados para que as empresas possam entrar em contato.</p>
      </header>
      <form className="accessible-form" onSubmit={submit}>
        <fieldset>
          <legend>Informações de contato</legend>
          <div className="form-grid">
            <label>Nome completo<input type="text" defaultValue="Marina Costa" autoComplete="name" /></label>
            <label>E-mail<input type="email" defaultValue="marina.costa@email.com" autoComplete="email" /></label>
            <label>Telefone<input type="tel" defaultValue="(11) 98765-4321" autoComplete="tel" /></label>
            <label>Localidade<input type="text" defaultValue="São Paulo, SP" autoComplete="address-level2" /></label>
          </div>
        </fieldset>
        <fieldset>
          <legend>Resumo profissional</legend>
          <label>Área de interesse<select defaultValue="Administrativo"><option>Administrativo</option><option>Atendimento</option><option>Design</option><option>Tecnologia</option></select></label>
          <label>Conte um pouco sobre sua experiência<textarea defaultValue="Tenho experiência com atendimento, organização de documentos e rotinas administrativas. Busco uma oportunidade em um ambiente inclusivo e colaborativo." rows={5} /></label>
        </fieldset>
        <div className="form-actions"><button className="button button--primary" type="submit">Salvar alterações</button></div>
      </form>
    </section>
  );
}

function CandidateQuestionnaire({ onSaved }: { onSaved: (message: string) => void }) {
  const [step, setStep] = useState(1);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 3) setStep(step + 1);
    else onSaved("Questionário concluído. Suas preferências foram salvas.");
  }

  return (
    <section className="form-page" aria-labelledby="questionnaire-title">
      <header className="inner-heading">
        <p className="section-kicker">Questionário de perfil</p>
        <h1 id="questionnaire-title">Conte o que funciona para você</h1>
        <p>Essas respostas ajudam a encontrar oportunidades e ambientes mais adequados ao seu perfil.</p>
      </header>
      <div className="question-progress" aria-label={`Etapa ${step} de 3`}>
        {[1, 2, 3].map((number) => <span key={number} className={number <= step ? "complete" : ""}><b>{number}</b><small>{number === 1 ? "Sobre você" : number === 2 ? "Trabalho" : "Acessibilidade"}</small></span>)}
      </div>
      <form className="accessible-form questionnaire-form" onSubmit={submit}>
        {step === 1 && (
          <fieldset>
            <legend>Como você descreve sua deficiência visual?</legend>
            <p className="field-help">Selecione a opção que mais se aproxima da sua experiência.</p>
            <div className="choice-grid">
              {['Cegueira total', 'Baixa visão', 'Cegueira parcial', 'Prefiro descrever'].map((item, index) => <label className="choice-card" key={item}><input type="radio" name="visual" defaultChecked={index === 1} required /><span><b>{item}</b><small>Você poderá complementar essa informação depois</small></span></label>)}
            </div>
          </fieldset>
        )}
        {step === 2 && (
          <fieldset>
            <legend>Qual modelo de trabalho você prefere?</legend>
            <p className="field-help">Você pode selecionar mais de uma opção.</p>
            <div className="choice-grid">
              {['Remoto', 'Híbrido', 'Presencial', 'Sem preferência'].map((item, index) => <label className="choice-card" key={item}><input type="checkbox" name="work" defaultChecked={index < 2} /><span><b>{item}</b><small>Considerar vagas neste formato</small></span></label>)}
            </div>
          </fieldset>
        )}
        {step === 3 && (
          <fieldset>
            <legend>Quais recursos apoiam seu trabalho?</legend>
            <p className="field-help">Essa informação orienta a empresa sem limitar suas oportunidades.</p>
            <div className="choice-grid">
              {['Leitor de tela', 'Ampliação de conteúdo', 'Alto contraste', 'Apoio para mobilidade'].map((item, index) => <label className="choice-card" key={item}><input type="checkbox" name="resource" defaultChecked={index < 2} /><span><b>{item}</b><small>Recurso de acessibilidade desejado</small></span></label>)}
            </div>
          </fieldset>
        )}
        <div className="form-actions form-actions--split">
          <button className="button button--outline" type="button" disabled={step === 1} onClick={() => setStep(step - 1)}>Voltar</button>
          <button className="button button--primary" type="submit">{step === 3 ? "Concluir questionário" : "Continuar"}</button>
        </div>
      </form>
    </section>
  );
}

function CandidateResume({ onSaved }: { onSaved: (message: string) => void }) {
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSaved(fileName ? `Currículo ${fileName} adicionado ao seu perfil.` : "Informações de contato salvas.");
  }

  return (
    <section className="form-page" aria-labelledby="resume-title">
      <header className="inner-heading">
        <p className="section-kicker">Currículo e contato</p>
        <h1 id="resume-title">Apresente sua trajetória</h1>
        <p>Envie seu currículo e confirme como as empresas podem falar com você.</p>
      </header>
      <form className="accessible-form resume-layout" onSubmit={submit}>
        <fieldset>
          <legend>Arquivo do currículo</legend>
          <div className="upload-zone" onClick={() => fileRef.current?.click()}>
            <span className="upload-symbol" aria-hidden="true">↑</span>
            <h2>{fileName || "Selecione seu currículo"}</h2>
            <p>Formatos aceitos: PDF, DOC ou DOCX. Tamanho máximo de 10 MB.</p>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf"
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
              aria-label="Selecionar arquivo de currículo"
            />
            <button className="button button--outline" type="button" onClick={(event) => { event.stopPropagation(); fileRef.current?.click(); }}>Escolher arquivo</button>
          </div>
          {fileName && <p className="file-confirmation"><span aria-hidden="true">✓</span> Arquivo selecionado: <b>{fileName}</b></p>}
        </fieldset>
        <fieldset>
          <legend>Contato preferencial</legend>
          <div className="form-grid">
            <label>E-mail<input type="email" defaultValue="marina.costa@email.com" /></label>
            <label>Telefone<input type="tel" defaultValue="(11) 98765-4321" /></label>
          </div>
          <label className="choice-card choice-card--single"><input type="checkbox" defaultChecked /><span><b>Autorizo o contato de empresas</b><small>Empresas poderão acessar os dados acima após demonstrar interesse.</small></span></label>
        </fieldset>
        <div className="form-actions"><button className="button button--primary" type="submit">Salvar currículo e contato</button></div>
      </form>
    </section>
  );
}

function CandidatePortal({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<CandidateView>("inicio");
  const [fontScale, setFontScale] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [message, setMessage] = useState("");

  function readPage() {
    if (!("speechSynthesis" in window)) {
      setMessage("A leitura em voz alta não está disponível neste navegador.");
      return;
    }
    window.speechSynthesis.cancel();
    const text = document.querySelector("#candidate-main")?.textContent ?? "";
    const speech = new SpeechSynthesisUtterance(text.slice(0, 5000));
    speech.lang = "pt-BR";
    window.speechSynthesis.speak(speech);
    setMessage("Leitura da página iniciada.");
  }

  function saveMessage(value: string) {
    setMessage(value);
    window.setTimeout(() => setMessage(""), 5000);
  }

  return (
    <div className={`candidate-portal ${highContrast ? "candidate-portal--contrast" : ""}`} style={{ fontSize: `${fontScale}%` }}>
      <a className="skip-link" href="#candidate-main">Pular para o conteúdo principal</a>
      <AccessibilityBar fontScale={fontScale} setFontScale={setFontScale} highContrast={highContrast} setHighContrast={setHighContrast} onRead={readPage} />
      <div className="candidate-shell">
        <CandidateSidebar view={view} onChange={setView} onExit={onExit} />
        <main className="candidate-main" id="candidate-main" tabIndex={-1}>
          {view === "inicio" && <CandidateHome onChange={setView} />}
          {view === "perfil" && <CandidateProfile onSaved={saveMessage} />}
          {view === "questionario" && <CandidateQuestionnaire onSaved={saveMessage} />}
          {view === "curriculo" && <CandidateResume onSaved={saveMessage} />}
        </main>
      </div>
      <div className="live-message" role="status" aria-live="polite">{message}</div>
    </div>
  );
}

function CompanySidebar({
  view,
  onChange,
  onExit,
}: {
  view: CompanyView;
  onChange: (view: CompanyView) => void;
  onExit: () => void;
}) {
  return (
    <aside className="company-sidebar">
      <button className="brand-button" type="button" onClick={onExit} aria-label="Voltar para o início da APTA"><Brand inverse /></button>
      <nav aria-label="Área da empresa">
        <p>Plataforma</p>
        {companyNavigation.map((item) => (
          <button
            type="button"
            key={item.id}
            className={view === item.id ? "active" : ""}
            aria-current={view === item.id ? "page" : undefined}
            onClick={() => onChange(item.id)}
          >
            <Marker>{item.marker}</Marker>{item.label}
          </button>
        ))}
      </nav>
      <div className="company-plan-card">
        <span>Seu plano</span>
        <b>APTA Essencial</b>
        <small>3 de 5 etapas concluídas</small>
        <div className="progress-track"><span style={{ width: "60%" }} /></div>
        <button type="button" onClick={() => onChange("consultoria")}>Conhecer o 360</button>
      </div>
      <button className="sidebar-exit" type="button" onClick={onExit}>Sair da conta</button>
    </aside>
  );
}

function CompanyTopbar({ onExit }: { onExit: () => void }) {
  return (
    <header className="company-topbar">
      <div className="breadcrumb"><span>APTA</span><span aria-hidden="true">/</span><b>Empresa</b></div>
      <div className="company-account">
        <button type="button" className="notification-button" aria-label="Notificações, 2 novas"><span aria-hidden="true">2</span></button>
        <span className="company-avatar">NS</span>
        <span><b>NorteSul Tecnologia</b><small>Recursos Humanos</small></span>
        <button className="account-chevron" type="button" aria-label="Abrir menu da conta" onClick={onExit}>⌄</button>
      </div>
    </header>
  );
}

function CompanyOverview({ onChange, onOpen }: { onChange: (view: CompanyView) => void; onOpen: (candidate: Candidate) => void }) {
  return (
    <>
      <header className="company-heading">
        <div><p className="section-kicker">Painel de inclusão</p><h1>Bom dia, Renata.</h1><p>Acompanhe os avanços da sua empresa e encontre novos talentos.</p></div>
        <button className="button button--primary" type="button" onClick={() => onChange("talentos")}>Buscar talentos <span aria-hidden="true">→</span></button>
      </header>

      <section className="metric-grid" aria-label="Indicadores da empresa">
        <article><span className="metric-icon" aria-hidden="true">↗</span><p>Perfis visualizados</p><strong>128</strong><small><b>+18%</b> nos últimos 30 dias</small></article>
        <article><span className="metric-icon metric-icon--coral" aria-hidden="true">◎</span><p>Talentos salvos</p><strong>24</strong><small>6 novos nesta semana</small></article>
        <article><span className="metric-icon metric-icon--lime" aria-hidden="true">✓</span><p>Processos ativos</p><strong>08</strong><small>3 aguardam retorno</small></article>
        <article><span className="metric-icon metric-icon--dark" aria-hidden="true">◇</span><p>Índice de inclusão</p><strong>64<span>/100</span></strong><small><b>+7 pts</b> desde o diagnóstico</small></article>
      </section>

      <section className="inclusion-banner">
        <div className="banner-score"><strong>64</strong><span>de 100</span></div>
        <div><p className="section-kicker">Próximo passo recomendado</p><h2>Prepare lideranças para receber novos talentos.</h2><p>O treinamento “Liderança inclusiva na prática” está disponível no seu plano.</p></div>
        <button className="button button--light" type="button" onClick={() => onChange("conteudos")}>Ver treinamento <span aria-hidden="true">→</span></button>
      </section>

      <div className="company-overview-grid">
        <section className="talent-preview" aria-labelledby="recent-talents-title">
          <div className="section-title-row"><div><p className="section-kicker">Novos perfis</p><h2 id="recent-talents-title">Talentos para conhecer</h2></div><button type="button" onClick={() => onChange("talentos")}>Ver todos</button></div>
          <div className="talent-preview-list">
            {candidates.slice(0, 3).map((candidate) => (
              <button type="button" key={candidate.id} onClick={() => onOpen(candidate)}>
                <span className="talent-avatar">{candidate.initials}</span>
                <span><b>{candidate.name}</b><small>{candidate.area} • {candidate.city}</small></span>
                <span className="match-badge">{candidate.match}%</span>
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </section>
        <aside className="agenda-card" aria-labelledby="agenda-title">
          <div className="section-title-row"><div><p className="section-kicker">Agenda</p><h2 id="agenda-title">Próximos encontros</h2></div></div>
          <div className="agenda-item"><time dateTime="2026-07-21"><b>21</b>JUL</time><span><b>Consultoria de diagnóstico</b><small>10:00 • Com Camila Souza</small></span></div>
          <div className="agenda-item"><time dateTime="2026-07-28"><b>28</b>JUL</time><span><b>Palestra: vieses na seleção</b><small>15:00 • Ao vivo</small></span></div>
          <button className="button button--outline button--full" type="button" onClick={() => onChange("consultoria")}>Ver agenda completa</button>
        </aside>
      </div>
    </>
  );
}

function TalentSearch({ onOpen }: { onOpen: (candidate: Candidate) => void }) {
  const [location, setLocation] = useState("Todas");
  const [area, setArea] = useState("Todas");
  const [mode, setMode] = useState("Todos");

  const filtered = useMemo(() => candidates.filter((candidate) =>
    (location === "Todas" || `${candidate.city}, ${candidate.state}` === location) &&
    (area === "Todas" || candidate.area === area) &&
    (mode === "Todos" || candidate.mode === mode)
  ), [location, area, mode]);

  return (
    <section className="company-section" aria-labelledby="talent-search-title">
      <header className="company-heading">
        <div><p className="section-kicker">Banco de talentos</p><h1 id="talent-search-title">Encontre profissionais</h1><p>Use os filtros para descobrir pessoas alinhadas às suas oportunidades.</p></div>
        <button className="button button--outline" type="button">Ver talentos salvos <span className="saved-count">24</span></button>
      </header>
      <form className="filter-panel" onSubmit={(event) => event.preventDefault()}>
        <label>Localidade<select value={location} onChange={(event) => setLocation(event.target.value)}><option>Todas</option>{[...new Set(candidates.map((candidate) => `${candidate.city}, ${candidate.state}`))].map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Área profissional<select value={area} onChange={(event) => setArea(event.target.value)}><option>Todas</option>{[...new Set(candidates.map((candidate) => candidate.area))].map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Modalidade<select value={mode} onChange={(event) => setMode(event.target.value)}><option>Todos</option>{[...new Set(candidates.map((candidate) => candidate.mode))].map((item) => <option key={item}>{item}</option>)}</select></label>
        <button className="button button--primary" type="submit">Aplicar filtros</button>
      </form>
      <div className="results-heading"><p><b>{filtered.length} talentos</b> encontrados</p><label>Ordenar por<select defaultValue="Compatibilidade"><option>Compatibilidade</option><option>Mais recentes</option><option>Localidade</option></select></label></div>
      <div className="candidate-results">
        {filtered.map((candidate) => (
          <article className="candidate-card" key={candidate.id}>
            <div className="candidate-card-head"><span className="talent-avatar talent-avatar--large">{candidate.initials}</span><span className="match-score"><b>{candidate.match}%</b> compatível</span></div>
            <h2>{candidate.name}</h2>
            <p className="candidate-role">{candidate.area}</p>
            <dl><div><dt>Localidade</dt><dd>{candidate.city}, {candidate.state}</dd></div><div><dt>Modalidade</dt><dd>{candidate.mode}</dd></div><div><dt>Formação</dt><dd>{candidate.education}</dd></div></dl>
            <div className="tag-row">{candidate.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
            <div className="candidate-card-actions"><button type="button" className="button button--primary" onClick={() => onOpen(candidate)}>Ver perfil</button><button type="button" className="save-button" aria-label={`Salvar perfil de ${candidate.name}`}>☆</button></div>
          </article>
        ))}
        {filtered.length === 0 && <div className="empty-state"><b>Nenhum perfil encontrado.</b><p>Tente remover um dos filtros para ampliar a busca.</p><button type="button" className="button button--outline" onClick={() => { setLocation("Todas"); setArea("Todas"); setMode("Todos"); }}>Limpar filtros</button></div>}
      </div>
    </section>
  );
}

function Consulting({ onMessage }: { onMessage: (message: string) => void }) {
  return (
    <section className="company-section consulting-page" aria-labelledby="consulting-title">
      <header className="consulting-hero">
        <div><p className="eyebrow eyebrow--light">APTA para empresas</p><h1 id="consulting-title">Da intenção à inclusão que acontece.</h1><p>Escolha o nível de apoio ideal para sua empresa e conte com especialistas em cada etapa.</p></div>
        <div className="consulting-quote"><span aria-hidden="true">“</span><p>Inclusão não é um projeto pontual. É uma competência que a empresa desenvolve.</p></div>
      </header>
      <div className="plan-intro"><p className="section-kicker">Planos de consultoria</p><h2>Duas formas de começar. Um compromisso em comum.</h2></div>
      <div className="plan-grid">
        <article className="plan-card plan-card--essential">
          <div className="plan-card-head"><span>Para começar</span><b>APTA</b><h3>Essencial</h3><p>Estrutura e segurança para dar os primeiros passos na inclusão.</p></div>
          <ul><li><span>✓</span> Diagnóstico de prontidão</li><li><span>✓</span> Plano de ação de 90 dias</li><li><span>✓</span> Treinamento para RH e lideranças</li><li><span>✓</span> Guia de processo seletivo acessível</li></ul>
          <button className="button button--outline button--full" type="button" onClick={() => onMessage("Interesse no plano APTA Essencial registrado. Nossa equipe entrará em contato.")}>Começar a inclusão</button>
        </article>
        <article className="plan-card plan-card--360">
          <span className="featured-plan">Experiência completa</span>
          <div className="plan-card-head"><span>Para evoluir continuamente</span><b>APTA</b><h3>Inclusão 360</h3><p>Diversificação máxima com estratégia, capacitação e acompanhamento constante.</p></div>
          <ul><li><span>✓</span> Tudo do plano Essencial</li><li><span>✓</span> Consultoria especializada contínua</li><li><span>✓</span> Treinamentos e palestras mensais</li><li><span>✓</span> Apoio a gestores e equipes</li><li><span>✓</span> Indicadores e plano de evolução</li></ul>
          <button className="button button--light button--full" type="button" onClick={() => onMessage("Conversa sobre o plano Inclusão 360 solicitada.")}>Falar com especialista</button>
        </article>
      </div>
      <section className="service-strip" aria-label="Serviços disponíveis"><article><span>01</span><b>Consultorias</b><p>Orientação aplicada à realidade da sua empresa.</p></article><article><span>02</span><b>Treinamentos</b><p>Conhecimento prático para RH, líderes e equipes.</p></article><article><span>03</span><b>Palestras</b><p>Conversas que mobilizam e ampliam repertório.</p></article><article><span>04</span><b>Acompanhamento</b><p>Indicadores e apoio para sustentar a evolução.</p></article></section>
    </section>
  );
}

function Training({ onMessage }: { onMessage: (message: string) => void }) {
  const items = [
    { type: "Treinamento", title: "Liderança inclusiva na prática", detail: "4 módulos • 1h 40min", progress: 35, color: "blue" },
    { type: "Palestra ao vivo", title: "Vieses na seleção e contratação", detail: "28 jul • 15:00", progress: 0, color: "coral" },
    { type: "Trilha", title: "Acessibilidade no dia a dia", detail: "6 conteúdos • 2h 15min", progress: 68, color: "lime" },
    { type: "Guia prático", title: "Processo seletivo acessível", detail: "PDF • 18 páginas", progress: 0, color: "dark" },
  ];
  return (
    <section className="company-section" aria-labelledby="training-title">
      <header className="company-heading"><div><p className="section-kicker">Desenvolvimento</p><h1 id="training-title">Treinamentos e palestras</h1><p>Conteúdos para transformar conhecimento em práticas inclusivas.</p></div><button className="button button--primary" type="button" onClick={() => onMessage("Agenda de treinamentos solicitada.")}>Agendar treinamento</button></header>
      <div className="content-highlight"><div><span>Recomendado para sua empresa</span><h2>Trilha: do recrutamento à permanência</h2><p>Uma jornada completa para estruturar processos, preparar equipes e acompanhar os primeiros 90 dias.</p><button className="button button--light" type="button" onClick={() => onMessage("Trilha adicionada ao plano de desenvolvimento.")}>Começar trilha <span aria-hidden="true">→</span></button></div><strong aria-hidden="true">360°</strong></div>
      <div className="section-title-row content-title"><div><p className="section-kicker">Biblioteca</p><h2>Continue aprendendo</h2></div><div className="category-pills"><button type="button" className="active">Todos</button><button type="button">Treinamentos</button><button type="button">Palestras</button><button type="button">Guias</button></div></div>
      <div className="content-grid">{items.map((item) => <article className="content-card" key={item.title}><div className={`content-cover content-cover--${item.color}`}><span>{item.type}</span><b aria-hidden="true">APTA</b></div><div className="content-body"><small>{item.detail}</small><h3>{item.title}</h3>{item.progress > 0 && <div className="content-progress"><div className="progress-track"><span style={{ width: `${item.progress}%` }} /></div><small>{item.progress}% concluído</small></div>}<button type="button" onClick={() => onMessage(`${item.title} aberto.`)}>{item.progress > 0 ? "Continuar" : "Acessar conteúdo"} <span aria-hidden="true">→</span></button></div></article>)}</div>
    </section>
  );
}

function CompanyProfile({ onMessage }: { onMessage: (message: string) => void }) {
  return (
    <section className="company-section" aria-labelledby="company-profile-title">
      <header className="company-heading"><div><p className="section-kicker">Configurações</p><h1 id="company-profile-title">Minha empresa</h1><p>Informações institucionais e preferências da conta.</p></div></header>
      <form className="company-form" onSubmit={(event) => { event.preventDefault(); onMessage("Informações da empresa atualizadas."); }}>
        <fieldset><legend>Dados da empresa</legend><div className="form-grid"><label>Razão social<input defaultValue="NorteSul Tecnologia Ltda." /></label><label>CNPJ<input defaultValue="12.345.678/0001-90" /></label><label>Cidade<input defaultValue="São Paulo, SP" /></label><label>Quantidade de colaboradores<select defaultValue="201 a 500"><option>Até 50</option><option>51 a 200</option><option>201 a 500</option><option>Mais de 500</option></select></label></div></fieldset>
        <fieldset><legend>Contato responsável</legend><div className="form-grid"><label>Nome<input defaultValue="Renata Souza" /></label><label>E-mail<input type="email" defaultValue="renata@nortesul.com.br" /></label><label>Área<input defaultValue="Recursos Humanos" /></label><label>Telefone<input type="tel" defaultValue="(11) 3333-2020" /></label></div></fieldset>
        <button className="button button--primary" type="submit">Salvar alterações</button>
      </form>
    </section>
  );
}

function CandidateDrawer({ candidate, onClose, onMessage }: { candidate: Candidate; onClose: () => void; onMessage: (message: string) => void }) {
  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="candidate-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <button className="drawer-close" type="button" onClick={onClose} aria-label="Fechar perfil">×</button>
        <div className="drawer-profile-head"><span className="talent-avatar talent-avatar--xl">{candidate.initials}</span><span className="match-score"><b>{candidate.match}%</b> compatível</span><h2 id="drawer-title">{candidate.name}</h2><p>{candidate.area} • {candidate.city}, {candidate.state}</p></div>
        <div className="drawer-section"><p className="section-kicker">Sobre</p><h3>Experiência profissional</h3><p>{candidate.experience}. Busca oportunidade em formato {candidate.mode.toLowerCase()}.</p></div>
        <div className="drawer-section"><p className="section-kicker">Perfil</p><dl><div><dt>Formação</dt><dd>{candidate.education}</dd></div><div><dt>Deficiência visual</dt><dd>{candidate.disability}</dd></div><div><dt>Modalidade</dt><dd>{candidate.mode}</dd></div></dl></div>
        <div className="drawer-section"><p className="section-kicker">Competências</p><div className="tag-row">{candidate.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>
        <div className="drawer-actions"><button className="button button--primary" type="button" onClick={() => { onMessage(`${candidate.name} foi adicionado aos talentos salvos.`); onClose(); }}>Salvar talento</button><button className="button button--outline" type="button" onClick={() => onMessage(`Currículo de ${candidate.name} disponível para análise.`)}>Analisar currículo</button></div>
      </aside>
    </div>
  );
}

function CompanyPortal({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<CompanyView>("visao");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [message, setMessage] = useState("");

  function showMessage(value: string) {
    setMessage(value);
    window.setTimeout(() => setMessage(""), 5000);
  }

  return (
    <div className="company-portal">
      <div className="company-shell">
        <CompanySidebar view={view} onChange={setView} onExit={onExit} />
        <div className="company-workspace">
          <CompanyTopbar onExit={onExit} />
          <main className="company-main" id="company-main">
            {view === "visao" && <CompanyOverview onChange={setView} onOpen={setSelectedCandidate} />}
            {view === "talentos" && <TalentSearch onOpen={setSelectedCandidate} />}
            {view === "consultoria" && <Consulting onMessage={showMessage} />}
            {view === "conteudos" && <Training onMessage={showMessage} />}
            {view === "empresa" && <CompanyProfile onMessage={showMessage} />}
          </main>
        </div>
      </div>
      {selectedCandidate && <CandidateDrawer candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} onMessage={showMessage} />}
      <div className="live-message live-message--company" role="status" aria-live="polite">{message}</div>
    </div>
  );
}

export function AptaApp() {
  const [portal, setPortal] = useState<Portal>("home");

  if (portal === "candidate") return <CandidatePortal onExit={() => setPortal("home")} />;
  if (portal === "company") return <CompanyPortal onExit={() => setPortal("home")} />;
  return <Home onEnter={setPortal} />;
}
