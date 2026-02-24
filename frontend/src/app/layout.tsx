import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
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
  title: "Cost of Travel | Deterministic Policy Calculators",
  description: "Calculate exact financial outcomes for airline cancellations, delays, baggage fees, and travel insurance based on real published policies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GlobalHeader />
          <main className="flex-grow">
            {children}
          </main>
          <GlobalFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
