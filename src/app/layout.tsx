import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trabalhe Livre | Seu trabalho. Sua liberdade. Suas oportunidades.",
  description: "A maior plataforma nacional de serviços autônomos. Encontre pintores, eletricistas, diaristas, profissionais de TI e beleza perto de você.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Trabalhe Livre",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Trabalhe Livre",
    title: "Trabalhe Livre | Encontre Profissionais Autônomos",
    description: "Conecte-se com profissionais qualificados em todo o Brasil. Desbloqueie dados de contato e negocie diretamente.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0947a5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

