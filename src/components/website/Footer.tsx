import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Locale } from "@/lib/i18n";

type FooterProps = {
  locale: Locale;
  footer: {
    phone: string;
    email: string;
    address: string;
  };
  nav: Record<string, string>;
};

export function Footer({ locale, footer, nav }: FooterProps) {
  return (
    <footer className="border-t border-[#e5eeeb] bg-[#0b3b5a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold text-white">
                DD
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-[#d7e4eb]">Damascus</p>
                <p className="text-lg font-bold">Dental Clinic</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-7 text-[#d7e4eb]">
              {locale === "ar"
                ? "عيادة موجهة نحو الراحة والوضوح والصحة الطويلة المدى لكل عضو في الأسرة."
                : "A calm, modern clinic focused on preventive care, confidence, and long-term oral health for every family member."}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d7e4eb]">
              {locale === "ar" ? "روابط سريعة" : "Quick links"}
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-[#e8f1f4]">
              <li><a href={`/${locale}`}>{nav.home}</a></li>
              <li><a href={`/${locale}/services`}>{nav.services}</a></li>
              <li><a href={`/${locale}/doctors`}>{nav.doctors}</a></li>
              <li><a href={`/${locale}/blog`}>{nav.blog}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d7e4eb]">
              {locale === "ar" ? "تواصل" : "Contact"}
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-[#e8f1f4]">
              <li>{footer.phone}</li>
              <li>{footer.email}</li>
              <li>{footer.address}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d7e4eb]">
              {locale === "ar" ? "النشرة البريدية" : "Newsletter"}
            </h3>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder={locale === "ar" ? "بريدك الإلكتروني" : "Your email"}
                aria-label="Email address"
                className="h-12 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-[#d7e4eb]"
              />
              <Button
                type="button"
                className="h-12 rounded-full bg-[#c6a664] px-5 text-sm font-semibold text-[#0b3b5a] transition hover:bg-[#d8bd86]"
              >
                {locale === "ar" ? "إرسال" : "Join"}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-[#d7e4eb]">
          © 2026 Damascus Dental Clinic
        </div>
      </div>
    </footer>
  );
}
