import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { clinicContactData } from "@/data/mock/services";
import { getMessages, locales, type Locale } from "@/lib/i18n";

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
  title: "Davinci Dental Clinic",
  description:
    "Modern dental clinic focused on preventive, family, and cosmetic care — Damascus & Abu Dhabi.",
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
  const safeLocale: Locale = locale === "ar" ? "ar" : "en";
  const isArabic = safeLocale === "ar";
  const messages = getMessages(safeLocale);

  return (
    <html lang={isArabic ? "ar" : "en"} dir={isArabic ? "rtl" : "ltr"}>
      <body
        className={`${inter.variable} ${cairo.variable}`}
        suppressHydrationWarning
      >
        <Header locale={safeLocale} nav={messages.nav} />
        {children}
        <Footer
          locale={safeLocale}
          footer={{
            phone: clinicContactData.phone,
            email: clinicContactData.email,
            address: clinicContactData.address[safeLocale],
          }}
          nav={messages.nav}
        />
      </body>
    </html>
  );
}