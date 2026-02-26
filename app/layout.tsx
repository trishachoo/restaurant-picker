import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "kev and trish's restaurant picker",
  description: "Pick a restaurant together",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${spaceMono.variable} min-h-screen bg-background`}>
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
