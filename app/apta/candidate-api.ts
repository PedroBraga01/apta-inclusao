export type CandidateProfileData = {
  userId: string;
  fullName: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  education: string | null;
  area: string | null;
  experience: string | null;
  workMode: string | null;
  disability: string | null;
  skills: string[] | null;
  accessibilityResources: string[] | null;
  profileProgress: number;
  sharingEnabled: boolean;
};

export type CandidateConsentData = {
  id: string;
  type: "PROFILE_SHARING" | "RESUME_SHARING" | "COMMUNICATIONS";
  granted: boolean;
  recordedAt: string;
};

export type ResumeData = {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  const body = (await response.json().catch(() => ({}))) as T & {
    error?: { message?: string };
  };
  if (!response.ok) {
    throw new Error(body.error?.message ?? "Não foi possível concluir a solicitação.");
  }
  return body;
}

export function loadCandidateProfile() {
  return request<{ profile: CandidateProfileData; email: string }>(
    "/api/candidate/profile",
  );
}

export function saveCandidateProfile(values: Record<string, unknown>) {
  return request<{ profile: CandidateProfileData }>("/api/candidate/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

export function loadCandidateConsents() {
  return request<{ consents: CandidateConsentData[] }>("/api/candidate/consents");
}

export function saveCandidateConsent(
  type: CandidateConsentData["type"],
  granted: boolean,
) {
  return request<{ consents: CandidateConsentData[] }>("/api/candidate/consents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, granted }),
  });
}

export function loadResume() {
  return request<{ resume: ResumeData | null }>("/api/candidate/resume");
}

export function sendResume(file: File) {
  const formData = new FormData();
  formData.set("file", file);
  return request<{ resume: ResumeData }>("/api/candidate/resume", {
    method: "POST",
    body: formData,
  });
}

export async function removeResume(): Promise<void> {
  const response = await fetch("/api/candidate/resume", { method: "DELETE" });
  if (!response.ok) throw new Error("Não foi possível excluir o currículo.");
}
