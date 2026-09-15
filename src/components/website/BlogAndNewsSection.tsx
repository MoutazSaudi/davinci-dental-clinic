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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2b7a78]">
            {locale === "ar" ? "المدونة والأخبار" : "Clinic updates"}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[#0b3b5a] sm:text-4xl">
            {locale === "ar" ? "رؤى صحية وعناية مستمرة" : "Helpful insights for a healthier smile"}
          </h2>
        </div>
        <a href={`/${locale}/blog`} className="text-sm font-semibold text-[#0b3b5a]">
          {locale === "ar" ? "قراءة المزيد" : "Read more"}
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-5 md:grid-cols-3">
          {blog.map((post) => (
            <Card key={post.title} className="rounded-[28px] border border-[#e5eeeb] bg-white p-5 shadow-sm">
              <div className="rounded-[22px] bg-[linear-gradient(180deg,#edf7f6_0%,#dfeae7_100%)] p-4">
                <div className="h-28 rounded-[18px] bg-[radial-gradient(circle_at_top,_rgba(198,166,100,0.35),_transparent_30%),linear-gradient(160deg,#f9faf8_0%,#cfe1dd_100%)]" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[#6d8590]">{post.meta}</p>
              <h3 className="mt-3 text-lg font-bold text-[#0b3b5a]">{post.title}</h3>
            </Card>
          ))}
        </div>

        <div className="rounded-[30px] border border-[#e5eeeb] bg-[#f8faf9] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2b7a78]">
            {locale === "ar" ? "روابط سريعة" : "Quick links"}
          </p>
          <ul className="mt-6 space-y-4">
            <li className="rounded-2xl border border-[#e4eeeb] bg-white px-4 py-3 text-sm text-[#495e68]">
              {locale === "ar" ? "الجدولة والتواصل" : "Appointments and contact"}
            </li>
            <li className="rounded-2xl border border-[#e4eeeb] bg-white px-4 py-3 text-sm text-[#495e68]">
              {locale === "ar" ? "مركز رعاية الأطفال" : "Children’s dental care"}
            </li>
            <li className="rounded-2xl border border-[#e4eeeb] bg-white px-4 py-3 text-sm text-[#495e68]">
              {locale === "ar" ? "خطط العلاج الوقائي" : "Preventive care plans"}
            </li>
            <li className="rounded-2xl border border-[#e4eeeb] bg-white px-4 py-3 text-sm text-[#495e68]">
              {locale === "ar" ? "الأسئلة الشائعة" : "Common questions"}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
