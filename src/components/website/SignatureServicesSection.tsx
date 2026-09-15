"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";

type Service = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
};

type SignatureServicesSectionProps = {
  locale: "en" | "ar";
  services?: Service[];
};

// أيقونات SVG نظيفة واحترافية لخدمات الأسنان
const TeethCleaningIcon = () => (
  <svg className="h-5 w-5 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const CheckupIcon = () => (
  <svg className="h-5 w-5 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const VeneersIcon = () => (
  <svg className="h-5 w-5 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.5 2 4 6.5 4 12c0 4 2.5 8 5 10 1.5-2 2-5 3-5s1.5 3 3 5c2.5-2 5-6 5-10 0-5.5-2.5-10-8-10z" />
  </svg>
);

const RetainersIcon = () => (
  <svg className="h-5 w-5 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const GumIcon = () => (
  <svg className="h-5 w-5 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
  </svg>
);

const OrthoIcon = () => (
  <svg className="h-5 w-5 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="8" rx="2" />
    <path d="M7 8v8M12 8v8M17 8v8" />
  </svg>
);

// صور خلفيات افتراضية عالية الجودة لكل خدمة
const DEFAULT_SERVICES: (Service & { image: string })[] = [
  {
    title: "Teeth Cleaning",
    icon: <TeethCleaningIcon />,
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Dental Checkups",
    icon: <CheckupIcon />,
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Dental Veneers",
    icon: <VeneersIcon />,
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Retainers",
    icon: <RetainersIcon />,
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Gum Treatment",
    icon: <GumIcon />,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Orthodontics",
    icon: <OrthoIcon />,
    image: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?q=80&w=800&auto=format&fit=crop",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export function SignatureServicesSection({ locale, services }: SignatureServicesSectionProps) {
  const isRtl = locale === "ar";
  
  const displayServices = (services && services.length > 0 ? services : DEFAULT_SERVICES).map((service, index) => ({
    ...service,
    image: service.image || DEFAULT_SERVICES[index % DEFAULT_SERVICES.length].image,
    icon: service.icon || DEFAULT_SERVICES[index % DEFAULT_SERVICES.length].icon,
  }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500"
        >
          {isRtl ? "خدماتنا المميزة للأسنان" : "OUR SIGNATURE DENTAL SERVICES"}
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
        >
          {isRtl ? "مجموعة شاملة من العلاجات" : "A Comprehensive Range of Treatments"}
        </motion.h2>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {displayServices.map((service, index) => (
          <motion.div
            key={service.title + index}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="group relative flex h-60 w-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-slate-100 p-5 shadow-sm transition-all hover:shadow-xl"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
            </div>

            <div className="relative z-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 shadow-md backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
                {service.icon}
              </div>
            </div>

            <div className="relative z-10 flex items-end justify-between">
              <h3 className="max-w-[80%] text-xl font-bold leading-tight text-white drop-shadow-sm" style={{ color: "white" }}>
                {service.title}
              </h3>
              
              <span className="flex h-7 w-7 items-center justify-center text-sm text-white/70 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white rtl:group-hover:-translate-x-1">
                {isRtl ? "‹" : "›"}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}