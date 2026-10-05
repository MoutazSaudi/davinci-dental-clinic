// TEMPORARY: still backed by the in-memory mock. Replaced with the database in the next stage.
// It is guarded now so the admin API is never reachable without a session.
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import * as mock from "@/lib/services/admin/servicesMock";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  return NextResponse.json(await mock.listServices());
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  try {
    const created = await mock.createService(body);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 409 });
  }
}

export async function PUT(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });

  const updated = await mock.updateService(slug, await req.json());
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });

  return NextResponse.json({ ok: await mock.deleteService(slug) });
}
