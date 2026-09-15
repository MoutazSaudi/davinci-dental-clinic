import { Card } from "@/components/ui/Card";

type Testimonial = {
  name: string;
  text: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type TestimonialsAndFAQProps = {
  locale: "en" | "ar";
  testimonials: Testimonial[];
  faq: FAQItem[];
};

export function TestimonialsAndFAQ({ locale, testimonials, faq }: TestimonialsAndFAQProps) {
  return (
    <section className="bg-[#f5faf8] py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2b7a78]">
            {locale === "ar" ? "آراء المرضى" : "Patient stories"}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[#0b3b5a] sm:text-4xl">
            {locale === "ar" ? "ضمان لراحةك ونتائجك" : "A reassuring experience from the very first visit"}
          </h2>

          <div className="mt-8 space-y-5">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="rounded-[28px] border border-[#e3eeeb] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-1 text-[#c6a664]" aria-label="Rating 5 out of 5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={`${testimonial.name}-${index}`}>★</span>
                  ))}
                </div>
                <p className="mt-4 text-base leading-8 text-[#4f6670]">“{testimonial.text}”</p>
                <p className="mt-5 text-sm font-semibold text-[#0b3b5a]">{testimonial.name}</p>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2b7a78]">
            {locale === "ar" ? "الأسئلة الشائعة" : "Frequently asked"}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[#0b3b5a] sm:text-4xl">
            {locale === "ar" ? "الإجابات التي تحتاج إليها" : "Helpful answers before your visit"}
          </h2>

          <div className="mt-8 space-y-3">
            {faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-[24px] border border-[#e3eeeb] bg-white p-4 shadow-sm open:border-[#bfd7d2]"
                open={item.question === faq[0]?.question}
              >
                <summary className="cursor-pointer list-none text-base font-semibold text-[#0b3b5a]">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-7 text-[#5d6f78]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
