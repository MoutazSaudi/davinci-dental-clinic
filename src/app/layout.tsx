import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import { siteConfig } from "@/data/site";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.baseUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.siteName.en} | Dental Clinic in Damascus, Syria`,
    template: `%s | ${siteConfig.siteName.en}`,
  },
  description:
    "Da Vinci Dental Clinic in Damascus offers orthodontic treatment, TMJ care, cosmetic dentistry, and family dental services in Syria.",
  applicationName: siteConfig.siteName.en,
  keywords: [
    "dental clinic in Damascus",
    "dentist in Damascus",
    "dentist Damascus Syria",
    "orthodontist in Damascus",
    "TMJ treatment Damascus",
    "Da Vinci Dental Clinic",
    "Damascus dental clinic",
  ],
  alternates: {
    canonical: siteConfig.baseUrl,
    languages: {
      "en": siteConfig.baseUrl,
      "ar": `${siteConfig.baseUrl}/ar`,
      "x-default": siteConfig.baseUrl,
    },
  },
  openGraph: {
    type: "website",
    title: `${siteConfig.siteName.en} | Dental Clinic in Damascus, Syria`,
    description:
      "Da Vinci Dental Clinic in Damascus offers orthodontic treatment, TMJ care, cosmetic dentistry, and family dental services in Syria.",
    url: siteConfig.baseUrl,
    siteName: siteConfig.siteName.en,
    locale: "en_US",
    images: [
      {
        url: `${siteConfig.baseUrl}/images/doctors/DrMuhanad.jpeg`,
        width: 1200,
        height: 630,
        alt: "Da Vinci Dental Clinic in Damascus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.siteName.en} | Dental Clinic in Damascus, Syria`,
    description:
      "Da Vinci Dental Clinic in Damascus offers orthodontic treatment, TMJ care, cosmetic dentistry, and family dental services in Syria.",
    images: [`${siteConfig.baseUrl}/images/doctors/DrMuhanad.jpeg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f6f9f8]">{children}</body>
    </html>
  );
}
