export type AccountPortal = "candidate" | "company" | "admin";
export type Portal = "auth" | AccountPortal;
export type AuthMode = "login" | "recover" | "register" | "verify" | "reset";
export type CandidateView =
  | "inicio"
  | "perfil"
  | "questionario"
  | "curriculo"
  | "eventos"
  | "videoaulas";
export type CompanyView =
  | "visao"
  | "talentos"
  | "consultoria"
  | "conteudos"
  | "empresa";
export type AdminView =
  | "visao"
  | "palestras"
  | "treinamentos"
  | "participantes";

export type Talk = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  format: "Online" | "Presencial";
  location: string;
  capacity: number;
  issued: number;
  status: "Publicada" | "Rascunho";
};

export type TrainingBooking = {
  id: number;
  company: string;
  topic: string;
  date: string;
  time: string;
  format: "Online" | "Presencial" | "Híbrido";
  participants: number;
  contact: string;
  status: "Solicitado" | "Confirmado";
};

export type Candidate = {
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

export type DemoAccount = {
  email: string;
  password: string;
  portal: AccountPortal;
  label: string;
};

export type VideoLessonCategory = "Excel" | "PowerPoint" | "Inglês";

export type VideoLesson = {
  id: string;
  lessonNumber: number;
  category: VideoLessonCategory;
  title: string;
  provider: string;
  url: string;
  thumbnail?: string;
};
