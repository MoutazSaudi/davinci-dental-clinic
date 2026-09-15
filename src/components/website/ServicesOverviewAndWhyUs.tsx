type ServicesOverviewAndWhyUsProps = {
  locale: "en" | "ar";
  overview: {
    title: string;
    list: string[];
  };
  whyUs: string[];
};

export function ServicesOverviewAndWhyUs({ locale, overview, whyUs }: ServicesOverviewAndWhyUsProps) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2b7a78]">
            {locale === "ar" ? "نظرة عامة" : "Integrated care"}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[#0b3b5a] sm:text-4xl">
            {overview.title}
          </h2>

          <div className="mt-8 space-y-4">
            {overview.list.map((item) => (
              <div key={item} className="flex items-start gap-4 rounded-2xl border border-[#e5eeeb] bg-[#f8faf9] p-4">
                <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#eaf2f7] text-sm font-bold text-[#0b3b5a]">
                  ✓
                </div>
                <p className="text-base text-[#495e68]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-[#e4eeeb] bg-[linear-gradient(180deg,#f8faf9_0%,#edf6f4_100%)] p-7 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2b7a78]">
            {locale === "ar" ? "أسباب إضافية" : "Why patients choose us"}
          </p>

          <div className="mt-6 space-y-3">
            {whyUs.map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-[#dfeae7] bg-white px-4 py-3">
                <span className="font-medium text-[#0b3b5a]">{item}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dff0ea] text-[#2b7a78]">★</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[28px] bg-[#0b3b5a] p-5 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-[#d9e6ea]">
              {locale === "ar" ? "ممارساتنا" : "Our promise"}
            </p>
            <p className="mt-3 text-base leading-7 text-[#ebf5f8]">
              {locale === "ar"
                ? "نعمل على تقديم رعاية واضحة ومريحة ومصممة وفقًا لاحتياجاتك الشخصية."
                : "We focus on clear communication, thoughtful treatment, and a positive experience from first visit to follow-up."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
