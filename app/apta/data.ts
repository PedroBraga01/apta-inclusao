import type {
  AdminView,
  Candidate,
  CandidateView,
  CompanyView,
  DemoAccount,
  Talk,
  TrainingBooking,
  VideoLesson,
} from "./types";
import { defaultAccounts } from "../../config/default-accounts";

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
  { id: "videoaulas", label: "Vídeo aulas", marker: "05" },
];

export const videoLessons: VideoLesson[] = [
  {
    id: "excel-1",
    lessonNumber: 1,
    category: "Excel",
    title: "Primeiros passos e interface do Excel",
    provider: "Explorar Excel",
    url: "https://www.youtube.com/watch?v=SFI8OJR6jIU",
    thumbnail: "/videoaulas/excel/aula-1.png",
  },
  {
    id: "excel-2",
    lessonNumber: 2,
    category: "Excel",
    title: "Barra de acesso rápido e filtros",
    provider: "Explorar Excel",
    url: "https://www.youtube.com/watch?v=EOWhiB1Oir8",
    thumbnail: "/videoaulas/excel/aula-2.png",
  },
  {
    id: "excel-3",
    lessonNumber: 3,
    category: "Excel",
    title: "Guias e formatação condicional",
    provider: "Explorar Excel",
    url: "https://www.youtube.com/watch?v=VJRyk19sBLk",
    thumbnail: "/videoaulas/excel/aula-3.png",
  },
  {
    id: "excel-4",
    lessonNumber: 4,
    category: "Excel",
    title: "Copiar, colar especial e barra de rolagem",
    provider: "Explorar Excel",
    url: "https://www.youtube.com/watch?v=x66XAfE6wYo",
    thumbnail: "/videoaulas/excel/aula-4.png",
  },
  {
    id: "excel-5",
    lessonNumber: 5,
    category: "Excel",
    title: "Organizando as abas da planilha",
    provider: "Explorar Excel",
    url: "https://www.youtube.com/watch?v=G7Fm93UQVzg",
    thumbnail: "/videoaulas/excel/aula-5.png",
  },
  {
    id: "powerpoint-1",
    lessonNumber: 1,
    category: "PowerPoint",
    title: "Conhecendo a área de trabalho do PowerPoint",
    provider: "TechTodos",
    url: "https://www.youtube.com/watch?v=78qY_EZGjM4",
  },
  {
    id: "powerpoint-2",
    lessonNumber: 2,
    category: "PowerPoint",
    title: "Criando a primeira apresentação com animações",
    provider: "TechTodos",
    url: "https://www.youtube.com/watch?v=ZRZi2By2SZA",
  },
  {
    id: "powerpoint-3",
    lessonNumber: 3,
    category: "PowerPoint",
    title: "PowerPoint do básico ao avançado",
    provider: "Tudo Sem Firulas | MINIMIZA",
    url: "https://www.youtube.com/watch?v=ndnyYiOBZvk",
  },
  {
    id: "powerpoint-4",
    lessonNumber: 4,
    category: "PowerPoint",
    title: "Como impressionar em uma apresentação de TCC",
    provider: "Hashtag Treinamentos",
    url: "https://www.youtube.com/watch?v=weCRK0lKLWI",
  },
  {
    id: "powerpoint-5",
    lessonNumber: 5,
    category: "PowerPoint",
    title: "Criando apresentações com IA no PowerPoint",
    provider: "Grupo Ninja",
    url: "https://www.youtube.com/watch?v=bVcTOlI6Oaw",
  },
  {
    id: "ingles-1",
    lessonNumber: 1,
    category: "Inglês",
    title: "Informações pessoais em inglês",
    provider: "Inglês Winner",
    url: "https://www.youtube.com/watch?v=XbL9_FDaVYU",
    thumbnail: "/videoaulas/ingles/aula-1.png",
  },
  {
    id: "ingles-2",
    lessonNumber: 2,
    category: "Inglês",
    title: "Contrações com o verbo to be",
    provider: "Inglês Winner",
    url: "https://www.youtube.com/watch?v=9LN9aQWHDJs",
    thumbnail: "/videoaulas/ingles/aula-2.png",
  },
  {
    id: "ingles-3",
    lessonNumber: 3,
    category: "Inglês",
    title: "Como descrever pessoas em inglês",
    provider: "Inglês Winner",
    url: "https://www.youtube.com/watch?v=aRUcZQWkkTk",
    thumbnail: "/videoaulas/ingles/aula-3.png",
  },
  {
    id: "ingles-4",
    lessonNumber: 4,
    category: "Inglês",
    title: "Como falar as horas em inglês",
    provider: "Inglês Winner",
    url: "https://www.youtube.com/watch?v=h-kk3maDZ9k",
    thumbnail: "/videoaulas/ingles/aula-4.png",
  },
  {
    id: "ingles-5",
    lessonNumber: 5,
    category: "Inglês",
    title: "Vocabulário para falar sobre coisas",
    provider: "Inglês Winner",
    url: "https://www.youtube.com/watch?v=-uIld-UQoJ8",
    thumbnail: "/videoaulas/ingles/aula-5.png",
  },
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

export const demoAccounts: DemoAccount[] = defaultAccounts.map(
  ({ email, password, portal, label }) => ({ email, password, portal, label }),
);
