export const defaultAccounts = [
  {
    email: "candidato@apta.org.br",
    password: "apta1234",
    portal: "candidate",
    role: "CANDIDATE",
    label: "Pessoa com deficiência visual",
    name: "Candidato APTA",
  },
  {
    email: "empresa@apta.org.br",
    password: "apta1234",
    portal: "company",
    role: "COMPANY",
    label: "Empresa",
    name: "Empresa APTA",
  },
  {
    email: "admin@apta.org.br",
    password: "apta3600",
    portal: "admin",
    role: "ADMIN",
    label: "Administração",
    name: "Administração APTA",
  },
] as const;
