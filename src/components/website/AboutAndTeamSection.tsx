// import { Card } from "@/components/ui/Card";

// type Doctor = {
//   name: string;
//   specialty: string;
//   initials: string;
// };

// type AboutAndTeamSectionProps = {
//   locale: "en" | "ar";
//   about: {
//     eyebrow: string;
//     title: string;
//     description: string;
//     stats: Array<{ value: string; label: string }>;
//   };
//   doctors: Doctor[];
// };

// export function AboutAndTeamSection({ locale, about, doctors }: AboutAndTeamSectionProps) {
//   return (
//     <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
//       <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
//         <div>
//           <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2b7a78]">{about.eyebrow}</p>
//           <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[#0b3b5a] sm:text-4xl">
//             {about.title}
//           </h2>
//           <p className="mt-5 max-w-xl text-base leading-8 text-[#5d6f78]">{about.description}</p>

//           <div className="mt-8 grid gap-4 sm:grid-cols-3">
//             {about.stats.map((stat) => (
//               <div key={stat.label} className="rounded-2xl border border-[#e4efed] bg-[#f8faf9] p-4">
//                 <p className="text-2xl font-bold tracking-[-0.05em] text-[#0b3b5a]">{stat.value}</p>
//                 <p className="mt-2 text-xs text-[#5d6f78]">{stat.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-3">
//           {doctors.map((doctor) => (
//             <Card key={doctor.name} className="rounded-[28px] border border-[#e5eeeb] bg-white p-4 shadow-sm">
//               <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#dff0ea_0%,#c9dfe6_100%)] text-xl font-bold text-[#0b3b5a]">
//                 {doctor.initials}
//               </div>
//               <h3 className="mt-5 text-lg font-bold text-[#0b3b5a]">{doctor.name}</h3>
//               <p className="mt-2 text-sm text-[#2b7a78]">{doctor.specialty}</p>
//               <a href={`/${locale}/doctors`} className="mt-5 inline-flex text-sm font-semibold text-[#0b3b5a]">
//                 {locale === "ar" ? "احجز معه" : "Book with…"}
//               </a>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import { Card } from "@/components/ui/Card";

type Doctor = {
  name: string;
  specialty: string;
  initials: string;
};

type AboutAndTeamSectionProps = {
  locale: "en" | "ar";
  about?: {
    eyebrow: string;
    title: string;
    description: string;
    stats?: Array<{ value: string; label: string }>;
  };
  doctors?: Doctor[];
};

export function AboutAndTeamSection({ locale, about, doctors = [] }: AboutAndTeamSectionProps) {
  // قيم افتراضية احتياطية لتجنب الانهيار إذا لم يتم تمرير about
  const safeAbout = about || {
    eyebrow: locale === "ar" ? "من نحن" : "About Us",
    title: locale === "ar" ? "نقدم رعاية استثنائية" : "Providing Exceptional Care",
    description: locale === "ar" ? "نحن هنا لخدمتك بأفضل المعايير." : "We are here to serve you with high standards.",
    stats: [],
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2b7a78]">{safeAbout.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[#0b3b5a] sm:text-4xl">
            {safeAbout.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#5d6f78]">{safeAbout.description}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {safeAbout.stats?.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[#e4efed] bg-[#f8faf9] p-4">
                <p className="text-2xl font-bold tracking-[-0.05em] text-[#0b3b5a]">{stat.value}</p>
                <p className="mt-2 text-xs text-[#5d6f78]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-3">
          {doctors?.map((doctor) => (
            <Card key={doctor.name} className="rounded-[28px] border border-[#e5eeeb] bg-white p-4 shadow-sm">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#dff0ea_0%,#c9dfe6_100%)] text-xl font-bold text-[#0b3b5a]">
                {doctor.initials}
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#0b3b5a]">{doctor.name}</h3>
              <p className="mt-2 text-sm text-[#2b7a78]">{doctor.specialty}</p>
              <a href={`/${locale}/doctors`} className="mt-5 inline-flex text-sm font-semibold text-[#0b3b5a]">
                {locale === "ar" ? "احجز معه" : "Book with…"}
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}