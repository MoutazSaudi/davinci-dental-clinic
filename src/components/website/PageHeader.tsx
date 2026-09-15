import type { Locale } from "@/lib/i18n";

type PageHeaderProps = {
  locale: Locale;
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ locale, eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-[#e5eeeb] bg-white p-6 shadow-[0_12px_30px_rgba(11,59,90,0.04)] sm:p-8 lg:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2b7a78]">
          {eyebrow}
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-black tracking-tight text-[#0b3b5a] sm:text-4xl lg:text-5xl">
              {title}
            </h1>
          </div>
          {description ? (
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base" dir={locale === "ar" ? "rtl" : "ltr"}>
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
