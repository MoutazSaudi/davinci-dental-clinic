import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { PageHeader } from "@/components/website/PageHeader";
import { blogCatalog, clinicContactData, getBlogPostBySlug } from "@/data/mock/services";
import { getMessages, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((locale) => blogCatalog.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  const post = getBlogPostBySlug(safeLocale as Locale, slug);

  if (!post) {
    return { title: safeLocale === "ar" ? "المقال غير موجود" : "Article not found" };
  }

  return {
    title: `${post.title} | Damascus Dental Clinic`,
    description: post.excerpt,
    alternates: {
      languages: {
        en: `/en/blog/${slug}`,
        ar: `/ar/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/${safeLocale}/blog/${slug}`,
      type: "article",
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";

  if (!locales.includes(safeLocale as Locale)) {
    notFound();
  }

  const post = getBlogPostBySlug(safeLocale as Locale, slug);
  if (!post) notFound();

  const messages = getMessages(safeLocale as Locale);
  const isArabic = safeLocale === "ar";

  return (
    <main className="min-h-screen bg-[#f6f9f8] text-[#172b36]" dir={isArabic ? "rtl" : "ltr"}>
      <Header locale={safeLocale as Locale} nav={messages.nav} />

      <div className="pt-28">
        <Breadcrumbs
          locale={safeLocale as Locale}
          items={[{ href: `/${safeLocale}/blog`, label: isArabic ? "المدونة" : "Blog" }, { label: post.title }]}
        />
        <PageHeader
          locale={safeLocale as Locale}
          eyebrow={post.readTime}
          title={post.title}
          description={`${post.date} • ${post.readTime}`}
        />

        <article className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[30px] border border-[#e5eeeb] bg-white shadow-[0_16px_36px_rgba(11,59,90,0.04)]">
            <div className="relative h-[420px] w-full">
              <Image src={post.image} alt={post.title} fill sizes="100vw" className="object-cover" />
            </div>
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-sm font-medium text-[#2b7a78]">{post.date}</p>
              <p className="mt-6 text-base leading-8 text-slate-600">{post.content}</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link href={`/${safeLocale}/blog`} className="inline-flex rounded-full bg-[#0b3b5a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#194a69]">
              {isArabic ? "العودة إلى المدونة" : "Back to blog"}
            </Link>
          </div>
        </article>
      </div>

      <Footer locale={safeLocale as Locale} footer={{ phone: clinicContactData.phone, email: clinicContactData.email, address: clinicContactData.address[safeLocale as "en" | "ar"] }} nav={messages.nav} />
    </main>
  );
}
