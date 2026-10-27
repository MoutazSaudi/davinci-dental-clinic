export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";

const patchSchema = z.object({
  status: z.enum(["NEW", "READ", "REPLIED", "ARCHIVED"]).optional(),
  adminNotes: z.string().nullable().optional(),
});

type MessageRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  source: string;
  serviceSlug: string | null;
  locale: string;
  status: string;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function serialize(m: MessageRow) {
  return {
    id: m.id,
    name: m.name,
    phone: m.phone,
    email: m.email,
    message: m.message,
    source: m.source,
    serviceSlug: m.serviceSlug,
    locale: m.locale,
    status: m.status,
    adminNotes: m.adminNotes,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  };
}

export async function GET() {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const items = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items.map(serialize));
}

export async function PATCH(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const body = await req.json();
    const payload = patchSchema.parse(body);

    const data: Record<string, unknown> = {};
    if (payload.status !== undefined) data.status = payload.status;
    if (payload.adminNotes !== undefined)
      data.adminNotes = payload.adminNotes || null;

    const updated = await prisma.contactMessage.update({
      where: { id },
      data,
    });

    return NextResponse.json(serialize(updated));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Unable to update message" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.contactMessage.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}