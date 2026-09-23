import { Card } from "@/components/ui/Card";
import {
  ShieldCheck,
  Stethoscope,
  Sparkles,
  HeartPulse,
  UserCheck,
  Award,
  LucideIcon,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

type FeaturesSectionProps = {
  locale: "en" | "ar";
  features: Feature[];
};

const defaultIcons: LucideIcon[] = [
  ShieldCheck,
  Stethoscope,
  Sparkles,
  HeartPulse,
  UserCheck,
  Award,
];

export function FeaturesSection({ locale, features }: FeaturesSectionProps) {
  return (
    <section className="bg-background-soft py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
            {locale === "ar" ? "لماذا نحن" : "Why choose us"}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-primary sm:text-4xl">
            {locale === "ar"
              ? "رعاية تركّز على راحة المريض"
              : "Care designed around comfort and confidence"}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent =
              feature.icon || defaultIcons[index % defaultIcons.length];

            return (
              <Card
                key={feature.title}
                className="group relative overflow-hidden rounded-[28px] border border-border bg-surface p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* خلفية الأيقونة الكبيرة مع تأثير عند التمرير */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-mint text-teal transition-colors duration-300 group-hover:bg-teal group-hover:text-white">
                  <IconComponent className="h-9 w-9 stroke-[1.75]" />
                </div>

                <h3 className="text-xl font-bold text-primary">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-foreground-muted">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}