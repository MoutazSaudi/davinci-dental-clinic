import { Card } from "@/components/ui/Card";

type BlogItem = {
  title: string;
  meta: string;
};

type BlogAndNewsSectionProps = {
  locale: "en" | "ar";
  blog: BlogItem[];
};

export function BlogAndNewsSection({ locale, blog }: BlogAndNewsSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
            {locale === "ar" ? "المدونة والأخبار" : "Clinic updates"}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-primary sm:text-4xl">
            {locale === "ar" ? "رؤى صحية وعناية مستمرة" : "Helpful insights for a healthier smile"}
          </h2>
        </div>
        <a href={`/${locale}/blog`} className="text-sm font-semibold text-primary">
          {locale === "ar" ? "قراءة المزيد" : "Read more"}
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-5 md:grid-cols-3">
          {blog.map((post) => (
            <Card key={post.title} className="rounded-[28px] border border-border bg-surface p-5 shadow-sm">
              <div className="rounded-[22px] bg-mint-light p-4">
                <div className="h-28 rounded-[18px] bg-mint" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-foreground-light">{post.meta}</p>
              <h3 className="mt-3 text-lg font-bold text-primary">{post.title}</h3>
            </Card>
          ))}
        </div>

        <div className="rounded-[30px] border border-border bg-background-soft p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
            {locale === "ar" ? "روابط سريعة" : "Quick links"}
          </p>
          <ul className="mt-6 space-y-4">
            <li className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground-muted">
              {locale === "ar" ? "الجدولة والتواصل" : "Appointments and contact"}
            </li>
            <li className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground-muted">
              {locale === "ar" ? "مركز رعاية الأطفال" : "Children’s dental care"}
            </li>
            <li className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground-muted">
              {locale === "ar" ? "خطط العلاج الوقائي" : "Preventive care plans"}
            </li>
            <li className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground-muted">
              {locale === "ar" ? "الأسئلة الشائعة" : "Common questions"}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}