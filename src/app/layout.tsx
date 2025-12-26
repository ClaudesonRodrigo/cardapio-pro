// src/app/layout.tsx

import type { Metadata, Viewport } from "next";
// 1. Trocamos Geist por Poppins
import { Poppins } from "next/font/google"; 
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

// 2. Configuração da Fonte Poppins (Pesos: 400=Normal, 500=Médio, 700=Negrito)
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cardápio Digital Pro",
  description: "Crie seu Cardápio personalizado e compartilhe com seus Clientes.",
  manifest: "/manifest.json",
  icons: {
    icon: '/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cardápio Pro",
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
        // 3. Aplicamos a variável da Poppins aqui
        className={`${poppins.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}