import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Development/demo seed data only. Replace with real data in production.
  await prisma.service.upsert({
    where: { slug: "dental-implant" },
    update: {},
    create: {
      slug: "dental-implant",
      status: "PUBLISHED",
      translations: {
        create: [
          { locale: "en", title: "Dental Implant", shortDescription: "Replace missing teeth." },
          { locale: "ar", title: "زراعة الأسنان", shortDescription: "استبدال الأسنان المفقودة." },
        ],
      },
    },
  });

  await prisma.doctor.upsert({
    where: { slug: "dr-ahmad" },
    update: {},
    create: {
      slug: "dr-ahmad",
      status: "PUBLISHED",
      translations: {
        create: [
          { locale: "en", name: "Dr. Ahmad", bio: "General Dentist" },
          { locale: "ar", name: "د. أحمد", bio: "طبيب أسنان عام" },
        ],
      },
    },
  });

  console.log("Seed finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
