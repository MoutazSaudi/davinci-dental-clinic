
import { NextRequest, NextResponse } from "next/server";
import { requireAdminServer } from "@/lib/auth";
import { getWebsiteAnalytics } from "@/lib/analytics";

export const dynamic = "force-dynamic";

const ALLOWED_DATE_FORMAT =
  /^(today|yesterday|\d+daysAgo|\d{4}-\d{2}-\d{2})$/;

export async function GET(request: NextRequest) {
  await requireAdminServer();

  try {
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get("startDate") ?? "30daysAgo";
    const endDate = searchParams.get("endDate") ?? "today";

    if (
      !ALLOWED_DATE_FORMAT.test(startDate) ||
      !ALLOWED_DATE_FORMAT.test(endDate)
    ) {
      return NextResponse.json(
        { error: "Invalid date range." },
        { status: 400 }
      );
    }

    const analytics = await getWebsiteAnalytics(startDate, endDate);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Admin analytics API error:", error);

    return NextResponse.json(
      { error: "Unable to load website analytics." },
      { status: 500 }
    );
  }
}
