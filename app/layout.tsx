import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  return {
    title: "APTA | Talento não tem barreiras",
    description:
      "A plataforma que conecta profissionais com deficiência visual a empresas comprometidas com inclusão.",
    icons: {
      icon: "/og.png",
      shortcut: "/og.png",
    },
    openGraph: {
      title: "APTA | Talento não tem barreiras",
      description: "Acesso para pessoas. Inclusão para empresas.",
      type: "website",
      locale: "pt_BR",
      images: [
        {
          url: `${baseUrl}/og.png`,
          width: 1536,
          height: 1024,
          alt: "APTA — Talento não tem barreiras",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "APTA | Talento não tem barreiras",
      description: "Acesso para pessoas. Inclusão para empresas.",
      images: [`${baseUrl}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
