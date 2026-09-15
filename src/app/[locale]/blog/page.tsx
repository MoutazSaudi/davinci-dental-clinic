import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";
import { PageHeader } from "@/components/website/PageHeader";
import { blogCatalog, clinicContactData } from "@/data/mock/services";
import { getMessages, locales, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  const isArabic = safeLocale === "ar";

  return {
    title: isArabic ? "المدونة | عيادة دمشق" : "Blog | Damascus Dental Clinic",
    description: isArabic ? "مقالات حول العناية بالأسنان، الابتسامة، والقرارات العلاجية اليومية." : "Articles on dental care, smile planning, and everyday oral-health decisions.",
    alternates: {
      languages: {
        en: "/en/blog",
        ar: "/ar/blog",
      },
    },
    openGraph: {
      title: isArabic ? "المدونة" : "Blog",
      description: isArabic ? "أفكار حول عناية الأسنان." : "Insights on dental care and oral wellbeing.",
      url: `/${safeLocale}/blog`,
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function BlogPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ page?: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";

  if (!locales.includes(safeLocale as Locale)) {
    notFound();
  }

  const page = Number((await searchParams).page ?? "1");
  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(blogCatalog.length / pageSize));
  const safePage = Number.isNaN(page) ? 1 : Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const visiblePosts = blogCatalog.slice(startIndex, startIndex + pageSize);

  const messages = getMessages(safeLocale as Locale);
  const isArabic = safeLocale === "ar";

  return (
    <main className="min-h-screen bg-[#f6f9f8] text-[#172b36]" dir={isArabic ? "rtl" : "ltr"}>
      <Header locale={safeLocale as Locale} nav={messages.nav} />

      <div className="pt-28">
        <Breadcrumbs locale={safeLocale as Locale} items={[{ label: isArabic ? "المدونة" : "Blog" }]} />
        <PageHeader
          locale={safeLocale as Locale}
          eyebrow={isArabic ? "المدونة" : "Blog"}
          title={isArabic ? "أفكار وعناية يومية لصحة أسنان أكثر استقرارًا." : "Insights and everyday care for a healthier smile."}
          description={
            isArabic
              ? "نشارك نصائح عملية ومعلومات سهلة الفهم لتساعدك على فهم روتين العناية، وتوجيه قراراتك في رعاية الأسنان بوضوح أكبر."
              : "We share practical advice and easy-to-understand information to help patients learn more about daily care and make informed dental decisions."
          }
        />

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {visiblePosts.map((post) => {
              const title = isArabic ? post.title.ar : post.title.en;
              const excerpt = isArabic ? post.excerpt.ar : post.excerpt.en;
              const readTime = isArabic ? post.readTime.ar : post.readTime.en;

              return (
                <article key={post.slug} className="overflow-hidden rounded-[28px] border border-[#e5eeeb] bg-white shadow-[0_14px_32px_rgba(11,59,90,0.04)]">
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image src={post.image} alt={title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-[#2b7a78]">
                      <span>{post.date}</span>
                      <span>{readTime}</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-black text-[#0b3b5a]">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{excerpt}</p>
                    <Link href={`/${safeLocale}/blog/${post.slug}`} className="mt-5 inline-flex rounded-full bg-[#0b3b5a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#194a69]">
                      {isArabic ? "اقرأ المقال" : "Read article"}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <nav aria-label="Pagination" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const isCurrent = pageNumber === safePage;

              return (
                <Link
                  key={pageNumber}
                  href={{ pathname: `/${safeLocale}/blog`, query: pageNumber === 1 ? undefined : { page: String(pageNumber) } }}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                    isCurrent ? "bg-[#0b3b5a] text-white" : "border border-[#dfe9e6] bg-white text-[#0b3b5a] hover:bg-[#edf6f5]"
                  }`}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {pageNumber}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      <Footer locale={safeLocale as Locale} footer={{ phone: clinicContactData.phone, email: clinicContactData.email, address: clinicContactData.address[safeLocale as "en" | "ar"] }} nav={messages.nav} />
    </main>
  );
}
