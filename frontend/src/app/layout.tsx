import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Abhinandan Naik — Backend Java Developer & Systems Architect",
  description: "Senior-level Backend Java Developer portfolio. Scalable Spring Boot microservices, high-performance PostgreSQL, AWS cloud engineering, and interactive 3D visualizations.",
  keywords: ["Java 21", "Spring Boot 3.5", "PostgreSQL", "Next.js 15", "System Design", "Digit Insurance", "Abhinandan Naik", "Backend Engineer"],
  authors: [{ name: "Abhinandan Naik" }],
  openGraph: {
    title: "Abhinandan Naik — Backend Java Developer",
    description: "Enterprise backend architecture powered by Java, Spring Boot, PostgreSQL, Docker, and AWS.",
    type: "website",
    locale: "en_US",
    siteName: "Abhinandan Naik Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhinandan Naik — Backend Java Developer",
    description: "Enterprise backend architecture powered by Java, Spring Boot, PostgreSQL, Docker, and AWS.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☕</text></svg>" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-bg text-text antialiased min-h-screen flex flex-col`}>
        <div className="scan-line"></div>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
