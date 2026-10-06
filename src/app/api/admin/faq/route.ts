export const dynamic = "force-dynamic";
export const revalidate = 0;

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";

const faqSchema = z.object({
  question: z.object({
    en: z.string().trim().min(1, "English question is required").optional(),
    ar: z.string().trim().min(1, "Arabic question is required").optional(),
  }),
  answer: z.object({
    en: z.string().trim().min(1, "English answer is required").optional(),
    ar: z.string().trim().min(1, "Arabic answer is required").optional(),
  }),
});

const getLocaleValue = (items: { locale: string; question: string; answer: string }[], locale: string) => {
  const item = items.find((entry) => entry.locale === locale) ?? items[0];
  return item ? { question: item.question, answer: item.answer } : { question: "", answer: "" };
};

const serializeFAQ = (faq: {
  id: string;
  translations: { locale: string; question: string; answer: string }[];
}) => {
  const en = getLocaleValue(faq.translations, "en");
  const ar = getLocaleValue(faq.translations, "ar");

  return {
    id: faq.id,
    question: {
      en: en.question,
      ar: ar.question,
    },
    answer: {
      en: en.answer,
      ar: ar.answer,
    },
  };
};

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const faqs = await prisma.fAQ.findMany({
    include: { translations: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(faqs.map(serializeFAQ));
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const payload = faqSchema.parse(body);

    const faq = await prisma.fAQ.create({
      data: {
        translations: {
          create: [
            { locale: "en", question: payload.question.en || "", answer: payload.answer.en || "" },
            { locale: "ar", question: payload.question.ar || payload.question.en || "", answer: payload.answer.ar || payload.answer.en || "" },
          ],
        },
      },
      include: { translations: true },
    });

    revalidatePath("/faq");
    return NextResponse.json(serializeFAQ(faq), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to create FAQ" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  return PUT(req);
}

export async function PUT(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing FAQ id" }, { status: 400 });

    const body = await req.json();
    const payload = faqSchema.parse(body);

    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        translations: {
          upsert: [
            {
              where: { faqId_locale: { faqId: id, locale: "en" } },
              update: {
                question: payload.question.en || "",
                answer: payload.answer.en || "",
              },
              create: {
                locale: "en",
                question: payload.question.en || "",
                answer: payload.answer.en || "",
              },
            },
            {
              where: { faqId_locale: { faqId: id, locale: "ar" } },
              update: {
                question: payload.question.ar || payload.question.en || "",
                answer: payload.answer.ar || payload.answer.en || "",
              },
              create: {
                locale: "ar",
                question: payload.question.ar || payload.question.en || "",
                answer: payload.answer.ar || payload.answer.en || "",
              },
            },
          ],
        },
      },
      include: { translations: true },
    });

    revalidatePath("/faq");
    return NextResponse.json(serializeFAQ(faq));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing FAQ id" }, { status: 400 });

  await prisma.fAQ.delete({ where: { id } }).catch(() => null);
  revalidatePath("/faq");
  return NextResponse.json({ ok: true });
}
