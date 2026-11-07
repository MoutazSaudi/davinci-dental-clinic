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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = locale === "ar" ? "ar" : "en";

  return {
    metadataBase: new URL(siteConfig.baseUrl),

    title: {
      default: siteConfig.defaultTitle[safeLocale],
      template: `%s | ${siteConfig.siteName[safeLocale]}`,
    },

    description: siteConfig.defaultDescription[safeLocale],

    applicationName: siteConfig.siteName[safeLocale],

    alternates: {
      languages: {
        [siteConfig.hreflang.ar]: `${siteConfig.baseUrl}/ar`,
        [siteConfig.hreflang.en]: `${siteConfig.baseUrl}/en`,
        "x-default": `${siteConfig.baseUrl}/en`,
      },
    },

    openGraph: {
      type: "website",
      siteName: siteConfig.siteName[safeLocale],
      title: siteConfig.defaultTitle[safeLocale],
      description: siteConfig.defaultDescription[safeLocale],
      locale: siteConfig.ogLocale[safeLocale],
      images: [
        {
          url: "/images/doctors/DrMuhanad.jpeg",
          width: 1200,
          height: 630,
          alt: siteConfig.siteName[safeLocale],
        },
      ],
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
}

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
    <div
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