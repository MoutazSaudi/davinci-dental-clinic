import Link from "next/link";
import type { Locale } from "@/lib/i18n";

type BreadcrumbItem = {
  href?: string;
  label: string;
};

type BreadcrumbsProps = {
  locale: Locale;
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ locale, items }: BreadcrumbsProps) {
  const homeLabel = locale === "ar" ? "الرئيسية" : "Home";

  const normalizedItems = [{ href: `/${locale}`, label: homeLabel }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        {normalizedItems.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center">
            {index < normalizedItems.length - 1 ? (
              <>
                <Link href={item.href ?? "#"} className="transition-colors hover:text-[#0b3b5a]">
                  {item.label}
                </Link>
                <span className="mx-2 text-slate-400" aria-hidden="true">
                  /
                </span>
              </>
            ) : (
              <span className="font-semibold text-[#0b3b5a]" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
