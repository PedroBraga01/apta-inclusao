import type {
  AdminView,
  Candidate,
  CandidateView,
  CompanyView,
  DemoAccount,
  Talk,
  TrainingBooking,
} from "./types";

export const candidates: Candidate[] = [
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

export const initialTalks: Talk[] = [
  {
    id: 1,
    title: "Carreira sem barreiras",
    description:
      "Estratégias práticas para fortalecer sua trajetória profissional e se preparar para processos seletivos.",
    date: "24/07/2026",
    time: "19:00",
    format: "Online",
    location: "Transmissão ao vivo",
    capacity: 120,
    issued: 86,
    status: "Publicada",
  },
  {
    id: 2,
    title: "Acessibilidade que transforma equipes",
    description:
      "Uma conversa aberta para profissionais e empresas sobre tecnologia, autonomia e colaboração.",
    date: "06/08/2026",
    time: "15:00",
    format: "Presencial",
    location: "SENAI São Paulo",
    capacity: 80,
    issued: 63,
    status: "Publicada",
  },
  {
    id: 3,
    title: "Comunicação inclusiva na prática",
    description:
      "Como criar encontros, conteúdos e relações de trabalho mais acessíveis desde o primeiro contato.",
    date: "19/08/2026",
    time: "10:00",
    format: "Online",
    location: "Transmissão ao vivo",
    capacity: 150,
    issued: 41,
    status: "Publicada",
  },
];

export const initialTrainingBookings: TrainingBooking[] = [
  {
    id: 1,
    company: "NorteSul Tecnologia",
    topic: "Liderança inclusiva na prática",
    date: "30/07/2026",
    time: "14:00",
    format: "Online",
    participants: 24,
    contact: "renata@nortesul.com.br",
    status: "Confirmado",
  },
];

export const candidateNavigation: Array<{
  id: CandidateView;
  label: string;
  marker: string;
}> = [
  { id: "inicio", label: "Início", marker: "01" },
  { id: "perfil", label: "Meu perfil", marker: "02" },
  { id: "questionario", label: "Questionário", marker: "03" },
  { id: "curriculo", label: "Currículo", marker: "04" },
  { id: "eventos", label: "Palestras e ingressos", marker: "05" },
];

export const companyNavigation: Array<{
  id: CompanyView;
  label: string;
  marker: string;
}> = [
  { id: "visao", label: "Visão geral", marker: "01" },
  { id: "talentos", label: "Buscar talentos", marker: "02" },
  { id: "consultoria", label: "Consultoria", marker: "03" },
  { id: "conteudos", label: "Treinamentos", marker: "04" },
  { id: "empresa", label: "Minha empresa", marker: "05" },
];

export const adminNavigation: Array<{
  id: AdminView;
  label: string;
  marker: string;
}> = [
  { id: "visao", label: "Visão geral", marker: "01" },
  { id: "palestras", label: "Palestras", marker: "02" },
  { id: "treinamentos", label: "Treinamentos", marker: "03" },
  { id: "participantes", label: "Ingressos", marker: "04" },
];

export const demoAccounts: DemoAccount[] = [
  {
    email: "candidato@apta.org.br",
    password: "apta123",
    portal: "candidate",
    label: "Candidato",
  },
  {
    email: "empresa@apta.org.br",
    password: "apta123",
    portal: "company",
    label: "Empresa",
  },
  {
    email: "admin@apta.org.br",
    password: "apta360",
    portal: "admin",
    label: "Administração",
  },
];
