import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import { locales } from "@/lib/i18n";

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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return (
    <html lang={isArabic ? "ar" : "en"} dir={isArabic ? "rtl" : "ltr"}>
      <body className={`${inter.variable} ${cairo.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
