import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { AnimationManager } from "@/components/animation-manager";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Ryan Li",
  description:
    "Mechatronics Engineering @ UWaterloo — building things that move, sense, and think.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={newsreader.variable} suppressHydrationWarning>
      <body>
        {/* Runs synchronously before any content renders — prevents animation flash */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem('visited')||window.location.pathname!=='/')document.documentElement.classList.add('no-animations')}catch(e){}` }} />
        <AnimationManager />
        {children}
      </body>
    </html>
  );
}
