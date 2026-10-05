import { NextResponse } from "next/server";
import * as mock from "../../../../lib/services/admin/servicesMock";

export async function GET() {
  const list = await mock.listServices();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = await mock.createService(body);
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  const body = await req.json();
  const updated = await mock.updateService(slug, body);
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  const ok = await mock.deleteService(slug);
  return NextResponse.json({ ok });
}
