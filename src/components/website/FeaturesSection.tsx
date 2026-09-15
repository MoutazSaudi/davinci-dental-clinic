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
  icon?: LucideIcon; // خيار تمرير أيقونة مخصصة من البيانات
};

type FeaturesSectionProps = {
  locale: "en" | "ar";
  features: Feature[];
};

// قائمة أيقونات افتراضية بالترتيب عند عدم تمرير أيقونة في البيانات
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
    <section className="bg-[#f4f9f8] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2b7a78]">
            {locale === "ar" ? "لماذا نحن" : "Why choose us"}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[#0b3b5a] sm:text-4xl">
            {locale === "ar"
              ? "رعاية تركّز على راحة المريض"
              : "Care designed around comfort and confidence"}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            // اختيار الأيقونة الممررة أو واحدة من الأيقونات الافتراضية
            const IconComponent =
              feature.icon || defaultIcons[index % defaultIcons.length];

            return (
              <Card
                key={feature.title}
                className="group relative overflow-hidden rounded-[28px] border border-[#e2ece9] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* خلفية الأيقونة الكبيرة مع تأثير عند التمرير (Hover) */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf3f2] text-[#2b7a78] transition-colors duration-300 group-hover:bg-[#2b7a78] group-hover:text-white">
                  <IconComponent className="h-9 w-9 stroke-[1.75]" />
                </div>

                <h3 className="text-xl font-bold text-[#0b3b5a]">
                  {feature.title}
                </h3>
                
                <p className="mt-3 text-sm leading-7 text-[#5d6f78]">
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