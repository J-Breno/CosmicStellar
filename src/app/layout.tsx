import type { Metadata } from "next";
import { Poppins, Orbitron } from "next/font/google";
import "./globals.css";
import GalacticLoading from "@/components/ui/GalacticLoading";
import { PlanetCarouselProvider } from "@/context/PlanetCarouselContext";

const poppins = Poppins({
  variable: "--font-body", 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], 
});

const orbitron = Orbitron({
  variable: "--font-heading", 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"], 
});

export const metadata: Metadata = {
  title: "Cosmic Explorer",
  description: "Explore o universo com nossa plataforma espacial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} ${orbitron.variable} font-body antialiased`}>
        <GalacticLoading />
        <PlanetCarouselProvider>
        {children}
      </PlanetCarouselProvider>
      </body>
    </html>
  );
}