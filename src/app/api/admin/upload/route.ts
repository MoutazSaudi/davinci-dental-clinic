export const dynamic = "force-dynamic";
export const revalidate = 0;

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const originalName = file.name || "upload";
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
    const finalName = `${Date.now()}-${safeName}`;
    const filePath = join(uploadsDir, finalName);
    const bytes = Buffer.from(await file.arrayBuffer());

    await writeFile(filePath, bytes);

    return NextResponse.json({ url: `/uploads/${finalName}` }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}
