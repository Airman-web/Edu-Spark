import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduSpark — Ignite Young Minds",
  description:
    "EduSpark is an interactive e-learning platform for primary school students in Rwanda. Curriculum-aligned video lessons, gamification, and real-time guardian progress tracking.",
  keywords: [
    "EduSpark",
    "e-learning",
    "Rwanda",
    "primary school",
    "education",
    "gamification",
  ],
  authors: [{ name: "Team EduSpark" }],
  openGraph: {
    title: "EduSpark — Ignite Young Minds",
    description: "Interactive learning for primary school students in Rwanda.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={poppins.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
