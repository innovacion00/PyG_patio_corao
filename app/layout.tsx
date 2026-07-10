import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Patio Corao | Simulador de Rentabilidad — GEHsuites",
  description:
    "Simula tu inversión en Patio Corao: descubre en segundos cuánto podrías ganar según tu monto, la ocupación y la tarifa proyectada. Operado por GEHsuites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-arena-50 text-deep-900">{children}</body>
    </html>
  );
}
