import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { clinicContactData, siteConfig } from "@/data/site";
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

/* ═══════════════════════════════════════════════════
   Metadata — locale-aware fallback
   (كل صفحة لها generateMetadata، هذا احتياط لصفحات 404)
   ═══════════════════════════════════════════════════ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";

  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: {
      default: siteConfig.defaultTitle[safeLocale],
      template: `%s | ${siteConfig.siteName[safeLocale]}`,
    },
    description: siteConfig.defaultDescription[safeLocale],
    alternates: {
      languages: {
        [siteConfig.hreflang.ar]: `${siteConfig.baseUrl}/ar`,
        [siteConfig.hreflang.en]: `${siteConfig.baseUrl}/en`,
        "x-default": `${siteConfig.baseUrl}/en`,
      },
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/* ═══════════════════════════════════════════════════
   Layout
   ═══════════════════════════════════════════════════ */

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
    <div
      lang={isArabic ? "ar" : "en"}
      dir={isArabic ? "rtl" : "ltr"}
      className={`${inter.variable} ${cairo.variable} min-h-screen bg-[#f6f9f8] text-[#172b36]`}
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
    </div>
  );
}