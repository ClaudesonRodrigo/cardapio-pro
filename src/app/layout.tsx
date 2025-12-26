// src/app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // --- CONFIGURAÇÃO DO DOMÍNIO OFICIAL ---
  metadataBase: new URL('https://www.cardapiocerto.com.br'), //

  title: "Cardápio Certo - Seu Pedido Digital",
  description: "Crie seu Cardápio personalizado e compartilhe com seus Clientes.",
  manifest: "/manifest.json",
  icons: {
    icon: '/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cardápio Certo",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}