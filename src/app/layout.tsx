import type { Metadata } from "next";
import { Inter, Playfair_Display, Satisfy, Manrope, Plus_Jakarta_Sans, Dancing_Script } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTopOnLoad } from "@/components/scroll-to-top-on-load";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const satisfy = Satisfy({
  variable: "--font-satisfy",
  subsets: ["latin"],
  weight: ["400"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Sambhunath Sahoo — Full Stack Developer",
  description:
    "Senior Full Stack Developer with 3+ years of experience building scalable, high-performance applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${satisfy.variable} ${manrope.variable} ${plusJakarta.variable} ${dancingScript.variable} antialiased`}>
        <ThemeProvider>
          <ScrollToTopOnLoad />
          <div className="relative min-h-screen overflow-x-clip bg-[#fafbfc] dark:bg-[#0b0f1a]">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
