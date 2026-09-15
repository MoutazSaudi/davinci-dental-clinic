import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Damascus Dental Clinic",
  description: "Modern dental clinic focused on preventive, family, and cosmetic care.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f6f9f8]">{children}</body>
    </html>
  );
}
